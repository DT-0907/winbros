import { NextRequest, NextResponse } from "next/server"
import type { RainDayReschedule, ApiResponse, Job } from "@/lib/types"

// Mock jobs for the affected date - Replace with Supabase queries
const getAffectedJobs = (date: string): Job[] => {
  // In production, query Supabase for all exterior jobs on the affected date
  return [
    {
      id: "job-1238",
      hcp_job_id: "hcp-1238",
      customer_id: "cust-003",
      customer_name: "Lisa Chen",
      customer_phone: "(512) 555-0789",
      address: "123 Oak St, Austin TX",
      service_type: "window_cleaning",
      scheduled_date: date,
      scheduled_time: "08:00",
      duration_minutes: 120,
      estimated_value: 520,
      status: "scheduled",
      team_id: "team-alpha",
      team_confirmed: true,
      created_at: "2026-01-20T10:00:00Z",
      updated_at: "2026-01-20T10:00:00Z",
    },
    // ... more jobs
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affected_date, target_date, initiated_by } = body

    if (!affected_date || !target_date) {
      return NextResponse.json(
        { success: false, error: "affected_date and target_date are required" },
        { status: 400 }
      )
    }

    // Get all affected jobs
    const affectedJobs = getAffectedJobs(affected_date)
    const successfullyRescheduled: string[] = []
    const failedJobs: string[] = []

    // Process each job
    for (const job of affectedJobs) {
      try {
        // TODO: In production:
        // 1. Update job in Housecall Pro
        // 2. Mirror update to Supabase
        // 3. Send SMS notification to customer via OpenPhone
        // 4. Send Telegram notification to assigned team
        // 5. Re-run team assignment for new date

        successfullyRescheduled.push(job.id)
      } catch (error) {
        failedJobs.push(job.id)
      }
    }

    // Create reschedule record
    const reschedule: RainDayReschedule = {
      id: `reschedule-${Date.now()}`,
      affected_date,
      target_date,
      initiated_by: initiated_by || "system",
      jobs_affected: affectedJobs.length,
      jobs_successfully_rescheduled: successfullyRescheduled.length,
      jobs_failed: failedJobs,
      notifications_sent: successfullyRescheduled.length * 2, // customer + team
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    }

    // TODO: Save reschedule record to Supabase

    const response: ApiResponse<RainDayReschedule> = {
      success: true,
      data: reschedule,
      message: `Successfully rescheduled ${successfullyRescheduled.length} of ${affectedJobs.length} jobs`,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to process rain day reschedule",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json(
      { success: false, error: "date parameter is required" },
      { status: 400 }
    )
  }

  // Get preview of jobs that would be affected
  const affectedJobs = getAffectedJobs(date)
  const totalRevenue = affectedJobs.reduce((sum, job) => sum + job.estimated_value, 0)

  return NextResponse.json({
    success: true,
    data: {
      date,
      jobs_count: affectedJobs.length,
      total_revenue: totalRevenue,
      jobs: affectedJobs.map((job) => ({
        id: job.id,
        customer_name: job.customer_name,
        time: job.scheduled_time,
        value: job.estimated_value,
        team_id: job.team_id,
        address: job.address,
      })),
    },
  })
}
