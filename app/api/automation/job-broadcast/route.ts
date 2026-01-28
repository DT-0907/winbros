import { NextRequest, NextResponse } from "next/server"
import { createClient, logAutomation, getAvailableTeamMembers } from "@/lib/supabase"
import {
  sendJobAssignment,
  sendUrgentEscalation,
} from "@/lib/telegram"
import { verifySignature } from "@/lib/qstash"

interface JobBroadcastPayload {
  jobId: string
  teamLeadIds?: string[]
  phase: "initial" | "urgent" | "escalate"
}

export async function POST(request: NextRequest) {
  try {
    // Verify QStash signature
    const signature = request.headers.get("upstash-signature")
    const body = await request.text()

    if (signature && !(await verifySignature(signature, body))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload: JobBroadcastPayload = JSON.parse(body)
    const { jobId, phase } = payload

    const supabase = createClient()

    // Get job details
    const { data: job } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single()

    if (!job) {
      await logAutomation("job_broadcast", "qstash", payload, "failed", "Job not found")
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if job is already assigned
    if (job.assigned_team_lead) {
      return NextResponse.json({
        skipped: true,
        reason: "Job already assigned",
        assignedTo: job.assigned_team_lead,
      })
    }

    if (phase === "initial") {
      // Get all available team leads
      const availableMembers = await getAvailableTeamMembers()
      const teamLeads = availableMembers.filter((m) => m.role === "team_lead")

      if (teamLeads.length === 0) {
        // No available team leads, skip to escalation
        await sendUrgentEscalation(process.env.OWNER_PHONE || "", {
          id: job.id,
          customerName: job.customer_name,
          address: job.address,
          scheduledDate: job.scheduled_date,
          reason: "No team leads currently available",
        })
        return NextResponse.json({ escalated: true, reason: "No available team leads" })
      }

      // Send to all available team leads
      const telegramIds = teamLeads.map((t) => t.telegram_id)
      await sendJobAssignment(telegramIds, {
        id: job.id,
        customerName: job.customer_name,
        address: job.address,
        city: job.city,
        scheduledDate: job.scheduled_date,
        scheduledTime: job.scheduled_time,
        estimatedHours: job.estimated_duration_hours,
        totalAmount: job.total_amount,
        jobType: job.job_type,
      })

      await logAutomation(
        "job_broadcast",
        "qstash",
        { ...payload, sentTo: telegramIds.length },
        "success"
      )

      return NextResponse.json({
        success: true,
        phase: "initial",
        sentTo: telegramIds.length,
      })
    } else if (phase === "urgent") {
      // Send urgent ping to team leads who haven't responded
      const availableMembers = await getAvailableTeamMembers()
      const teamLeads = availableMembers.filter((m) => m.role === "team_lead")

      for (const lead of teamLeads) {
        await sendJobAssignment([lead.telegram_id], {
          id: job.id,
          customerName: job.customer_name,
          address: job.address,
          city: job.city,
          scheduledDate: job.scheduled_date,
          scheduledTime: job.scheduled_time,
          estimatedHours: job.estimated_duration_hours,
          totalAmount: job.total_amount,
          jobType: `URGENT - ${job.job_type}`,
        })
      }

      await logAutomation("job_broadcast", "qstash", { ...payload }, "success")

      return NextResponse.json({ success: true, phase: "urgent" })
    } else if (phase === "escalate") {
      // Escalate to operations
      const controlChatId = process.env.OWNER_PHONE

      if (controlChatId) {
        await sendUrgentEscalation(controlChatId, {
          id: job.id,
          customerName: job.customer_name,
          address: job.address,
          scheduledDate: job.scheduled_date,
          reason: "Not claimed after urgent broadcast window",
        })
      }

      // Update job status to indicate escalation needed
      await supabase
        .from("jobs")
        .update({ notes: (job.notes || "") + "\n[ESCALATED] Not claimed in time" })
        .eq("id", jobId)

      // Create exception record
      await supabase.from("exceptions").insert({
        type: "callback",
        related_job_id: jobId,
        description: "Job not claimed within broadcast window",
        status: "pending",
        created_by: "automation",
      })

      await logAutomation("job_broadcast", "qstash", payload, "success")

      return NextResponse.json({ success: true, phase: "escalate" })
    }

    return NextResponse.json({ error: "Invalid phase" }, { status: 400 })
  } catch (error) {
    console.error("Job broadcast error:", error)
    await logAutomation(
      "job_broadcast",
      "qstash",
      { error: String(error) },
      "failed",
      String(error)
    )
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
