import { NextRequest, NextResponse } from "next/server"
import type { Team, TeamDailyMetrics, ApiResponse } from "@/lib/types"

// Mock data - Replace with Supabase queries
const mockTeams: Team[] = [
  {
    id: "team-alpha",
    name: "Team Alpha",
    lead_id: "member-1",
    members: [
      { id: "member-1", name: "Marcus Johnson", phone: "(512) 555-1001", telegram_id: "marcus_j", role: "lead", team_id: "team-alpha", is_active: true },
      { id: "member-2", name: "Derek Williams", phone: "(512) 555-1002", role: "technician", team_id: "team-alpha", is_active: true },
      { id: "member-3", name: "Ryan Smith", phone: "(512) 555-1003", role: "technician", team_id: "team-alpha", is_active: true },
    ],
    status: "on-job",
    current_job_id: "job-1235",
    daily_target: 1200,
    is_active: true,
  },
  {
    id: "team-bravo",
    name: "Team Bravo",
    lead_id: "member-4",
    members: [
      { id: "member-4", name: "David Martinez", phone: "(512) 555-2001", telegram_id: "david_m", role: "lead", team_id: "team-bravo", is_active: true },
      { id: "member-5", name: "Chris Parker", phone: "(512) 555-2002", role: "technician", team_id: "team-bravo", is_active: true },
      { id: "member-6", name: "James Kim", phone: "(512) 555-2003", role: "technician", team_id: "team-bravo", is_active: true },
    ],
    status: "traveling",
    current_job_id: "job-1236",
    daily_target: 1200,
    is_active: true,
  },
  {
    id: "team-charlie",
    name: "Team Charlie",
    lead_id: "member-7",
    members: [
      { id: "member-7", name: "Chris Wilson", phone: "(512) 555-3001", telegram_id: "chris_w", role: "lead", team_id: "team-charlie", is_active: true },
      { id: "member-8", name: "Mike Brown", phone: "(512) 555-3002", role: "technician", team_id: "team-charlie", is_active: true },
    ],
    status: "on-job",
    current_job_id: "job-1240",
    daily_target: 1200,
    is_active: true,
  },
  {
    id: "team-delta",
    name: "Team Delta",
    lead_id: "member-9",
    members: [
      { id: "member-9", name: "James Lee", phone: "(512) 555-4001", telegram_id: "james_l", role: "lead", team_id: "team-delta", is_active: true },
      { id: "member-10", name: "Kevin Robinson", phone: "(512) 555-4002", role: "technician", team_id: "team-delta", is_active: true },
      { id: "member-11", name: "Tom Stevens", phone: "(512) 555-4003", role: "technician", team_id: "team-delta", is_active: true },
    ],
    status: "off",
    daily_target: 1200,
    is_active: true,
  },
]

const mockDailyMetrics: Record<string, TeamDailyMetrics> = {
  "team-alpha": {
    team_id: "team-alpha",
    date: "2026-01-27",
    revenue: 2450,
    target: 3600,
    jobs_completed: 5,
    jobs_scheduled: 8,
    tips: 320,
    upsells: 580,
    avg_rating: 4.9,
  },
  "team-bravo": {
    team_id: "team-bravo",
    date: "2026-01-27",
    revenue: 1850,
    target: 3600,
    jobs_completed: 4,
    jobs_scheduled: 7,
    tips: 185,
    upsells: 320,
    avg_rating: 4.8,
  },
  "team-charlie": {
    team_id: "team-charlie",
    date: "2026-01-27",
    revenue: 3100,
    target: 3600,
    jobs_completed: 6,
    jobs_scheduled: 7,
    tips: 290,
    upsells: 450,
    avg_rating: 5.0,
  },
  "team-delta": {
    team_id: "team-delta",
    date: "2026-01-27",
    revenue: 0,
    target: 0,
    jobs_completed: 0,
    jobs_scheduled: 0,
    tips: 0,
    upsells: 0,
  },
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const include_metrics = searchParams.get("include_metrics") === "true"

  const teamsWithMetrics = mockTeams.map((team) => ({
    ...team,
    ...(include_metrics && { daily_metrics: mockDailyMetrics[team.id] }),
  }))

  const response: ApiResponse<typeof teamsWithMetrics> = {
    success: true,
    data: teamsWithMetrics,
  }

  return NextResponse.json(response)
}
