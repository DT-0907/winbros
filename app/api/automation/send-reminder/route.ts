import { NextRequest, NextResponse } from "next/server"
import { createClient, logAutomation } from "@/lib/supabase"
import { sendDayBeforeReminder, sendOnMyWayNotification } from "@/lib/openphone"
import { verifySignature } from "@/lib/qstash"

interface ReminderPayload {
  jobId: string
  customerPhone: string
  customerName: string
  type: "day_before" | "on_my_way"
  eta?: string
  teamLeadName?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify QStash signature
    const signature = request.headers.get("upstash-signature")
    const body = await request.text()

    if (signature && !(await verifySignature(signature, body))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload: ReminderPayload = JSON.parse(body)
    const { jobId, customerPhone, customerName, type, eta, teamLeadName } = payload

    const supabase = createClient()

    // Get job details
    const { data: job } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single()

    if (!job) {
      await logAutomation("send_reminder", "qstash", payload, "failed", "Job not found")
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if job is still scheduled
    if (job.status === "cancelled" || job.status === "rescheduled") {
      return NextResponse.json({
        skipped: true,
        reason: `Job status: ${job.status}`,
      })
    }

    let result

    if (type === "day_before") {
      result = await sendDayBeforeReminder(
        customerPhone,
        customerName,
        job.scheduled_date,
        job.scheduled_time
      )
    } else if (type === "on_my_way" && eta && teamLeadName) {
      result = await sendOnMyWayNotification(customerPhone, customerName, eta, teamLeadName)
    } else {
      return NextResponse.json({ error: "Invalid reminder type" }, { status: 400 })
    }

    await logAutomation("send_reminder", "qstash", { ...payload, result }, "success")

    return NextResponse.json({ success: true, type })
  } catch (error) {
    console.error("Send reminder error:", error)
    await logAutomation(
      "send_reminder",
      "qstash",
      { error: String(error) },
      "failed",
      String(error)
    )
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
