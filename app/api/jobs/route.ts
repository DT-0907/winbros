import { NextRequest, NextResponse } from "next/server"
import type { Job, ApiResponse, PaginatedResponse } from "@/lib/types"

// Mock data - Replace with Supabase queries when integrated
const mockJobs: Job[] = [
  {
    id: "job-1234",
    hcp_job_id: "hcp-1234",
    customer_id: "cust-001",
    customer_name: "Sarah Johnson",
    customer_phone: "(512) 555-0123",
    address: "123 Oak Street, Austin TX",
    service_type: "window_cleaning",
    scheduled_date: "2026-01-27",
    scheduled_time: "08:00",
    duration_minutes: 120,
    estimated_value: 350,
    status: "completed",
    team_id: "team-alpha",
    team_confirmed: true,
    team_confirmed_at: "2026-01-26T15:00:00Z",
    notes: "2-story home, access from backyard",
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-27T10:30:00Z",
  },
  {
    id: "job-1235",
    hcp_job_id: "hcp-1235",
    customer_id: "cust-002",
    customer_name: "Mike Thompson",
    customer_phone: "(512) 555-0456",
    address: "456 Maple Ave, Austin TX",
    service_type: "full_service",
    scheduled_date: "2026-01-27",
    scheduled_time: "10:30",
    duration_minutes: 180,
    estimated_value: 480,
    status: "in-progress",
    team_id: "team-alpha",
    team_confirmed: true,
    team_confirmed_at: "2026-01-26T15:30:00Z",
    created_at: "2026-01-21T14:00:00Z",
    updated_at: "2026-01-27T10:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")
  const team_id = searchParams.get("team_id")
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const per_page = parseInt(searchParams.get("per_page") || "20")

  // Filter jobs based on query params
  let filteredJobs = [...mockJobs]

  if (date) {
    filteredJobs = filteredJobs.filter((job) => job.scheduled_date === date)
  }
  if (team_id) {
    filteredJobs = filteredJobs.filter((job) => job.team_id === team_id)
  }
  if (status) {
    filteredJobs = filteredJobs.filter((job) => job.status === status)
  }

  // Pagination
  const total = filteredJobs.length
  const start = (page - 1) * per_page
  const paginatedJobs = filteredJobs.slice(start, start + per_page)

  const response: PaginatedResponse<Job> = {
    data: paginatedJobs,
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  }

  return NextResponse.json(response)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Validate body against Job type
    // TODO: Create job in Supabase
    // TODO: Sync with Housecall Pro

    const newJob: Job = {
      id: `job-${Date.now()}`,
      hcp_job_id: `hcp-${Date.now()}`,
      ...body,
      team_confirmed: false,
      status: "scheduled",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const response: ApiResponse<Job> = {
      success: true,
      data: newJob,
      message: "Job created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create job",
    }
    return NextResponse.json(response, { status: 400 })
  }
}
