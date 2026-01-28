import { NextRequest, NextResponse } from "next/server"
import { createClient, logAutomation, updateLeadStatus } from "@/lib/supabase"
import { sendLeadFollowUp } from "@/lib/openphone"
import { callLead } from "@/lib/vapi"
import { verifySignature } from "@/lib/qstash"
import { isBusinessHours } from "@/lib/config"

interface LeadFollowUpPayload {
  leadId: string
  leadPhone: string
  leadName: string
  stage: number
  action: "text" | "call" | "double_call"
}

export async function POST(request: NextRequest) {
  try {
    // Verify QStash signature
    const signature = request.headers.get("upstash-signature")
    const body = await request.text()

    if (signature && !(await verifySignature(signature, body))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload: LeadFollowUpPayload = JSON.parse(body)
    const { leadId, leadPhone, leadName, stage, action } = payload

    // Check if lead has already been contacted/converted
    const supabase = createClient()
    const { data: lead } = await supabase
      .from("leads")
      .select("status, followup_stage")
      .eq("id", leadId)
      .single()

    if (!lead) {
      await logAutomation("lead_followup", "qstash", payload, "failed", "Lead not found")
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Skip if lead is already scheduled or lost
    if (["scheduled", "completed", "lost"].includes(lead.status)) {
      await logAutomation(
        "lead_followup",
        "qstash",
        payload,
        "success",
        `Skipped - lead status: ${lead.status}`
      )
      return NextResponse.json({ skipped: true, reason: "Lead already processed" })
    }

    // Skip if lead has already passed this stage (e.g., they replied)
    if (lead.followup_stage >= stage) {
      return NextResponse.json({ skipped: true, reason: "Stage already completed" })
    }

    // Execute the action
    let result: unknown

    if (action === "text") {
      result = await sendLeadFollowUp(leadPhone, leadName, "website")
      await updateLeadStatus(leadId, "contacted", {
        followup_stage: stage,
        last_contact_at: new Date().toISOString(),
      })
    } else if (action === "call" || action === "double_call") {
      // Only call during business hours
      if (!isBusinessHours()) {
        await logAutomation(
          "lead_followup",
          "qstash",
          payload,
          "success",
          "Skipped call - outside business hours"
        )
        return NextResponse.json({ skipped: true, reason: "Outside business hours" })
      }

      result = await callLead(leadPhone, leadName, {
        previousContact: action === "double_call" ? "call_no_answer" : "text",
      })

      // For double call, make two calls
      if (action === "double_call") {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await callLead(leadPhone, leadName, {
          previousContact: "call_no_answer",
          notes: "Second attempt in double-call sequence",
        })
      }

      await updateLeadStatus(leadId, "contacted", {
        followup_stage: stage,
        last_contact_at: new Date().toISOString(),
      })
    }

    await logAutomation("lead_followup", "qstash", { ...payload, result }, "success")

    return NextResponse.json({ success: true, stage, action })
  } catch (error) {
    console.error("Lead followup error:", error)
    await logAutomation(
      "lead_followup",
      "qstash",
      { error: String(error) },
      "failed",
      String(error)
    )
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
