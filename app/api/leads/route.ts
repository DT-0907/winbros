import { NextRequest, NextResponse } from "next/server"
import type { Lead, ApiResponse, PaginatedResponse } from "@/lib/types"

// Mock data - Replace with Supabase queries when integrated
const mockLeads: Lead[] = [
  {
    id: "lead-001",
    name: "Amanda Roberts",
    phone: "(512) 555-0123",
    email: "amanda@email.com",
    source: "phone",
    status: "new",
    service_interest: "Window cleaning - 2 story home",
    estimated_value: 400,
    created_at: "2026-01-27T14:58:00Z",
    updated_at: "2026-01-27T14:58:00Z",
  },
  {
    id: "lead-002",
    name: "Tom Anderson",
    phone: "(512) 555-0456",
    source: "meta",
    status: "contacted",
    service_interest: "Full service package",
    estimated_value: 800,
    created_at: "2026-01-27T14:52:00Z",
    updated_at: "2026-01-27T14:55:00Z",
    contacted_at: "2026-01-27T14:55:00Z",
  },
  {
    id: "lead-003",
    name: "Lisa Chen",
    phone: "(512) 555-0789",
    source: "website",
    status: "booked",
    service_interest: "Window + Gutter cleaning",
    estimated_value: 520,
    hcp_customer_id: "hcp-cust-003",
    created_at: "2026-01-27T14:45:00Z",
    updated_at: "2026-01-27T14:50:00Z",
    booked_at: "2026-01-27T14:50:00Z",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get("source")
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const per_page = parseInt(searchParams.get("per_page") || "20")

  let filteredLeads = [...mockLeads]

  if (source) {
    filteredLeads = filteredLeads.filter((lead) => lead.source === source)
  }
  if (status) {
    filteredLeads = filteredLeads.filter((lead) => lead.status === status)
  }

  const total = filteredLeads.length
  const start = (page - 1) * per_page
  const paginatedLeads = filteredLeads.slice(start, start + per_page)

  const response: PaginatedResponse<Lead> = {
    data: paginatedLeads,
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

    // TODO: Validate body
    // TODO: Create lead in Supabase
    // TODO: Trigger lead engagement automation

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...body,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const response: ApiResponse<Lead> = {
      success: true,
      data: newLead,
      message: "Lead created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create lead",
    }
    return NextResponse.json(response, { status: 400 })
  }
}
