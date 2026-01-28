import { NextRequest, NextResponse } from "next/server"
import type { DailyMetrics, ApiResponse } from "@/lib/types"

// Mock metrics - Replace with Supabase aggregations
const mockDailyMetrics: DailyMetrics = {
  date: "2026-01-27",
  total_revenue: 7400,
  target_revenue: 10800, // 3 active crews × $3,600
  jobs_completed: 15,
  jobs_scheduled: 22,
  leads_in: 28,
  leads_booked: 12,
  close_rate: 43,
  tips_collected: 795,
  upsells_value: 1350,
  calls_handled: 34,
  after_hours_calls: 8,
}

const mockWeeklyMetrics: DailyMetrics[] = [
  {
    date: "2026-01-21",
    total_revenue: 8200,
    target_revenue: 10800,
    jobs_completed: 18,
    jobs_scheduled: 20,
    leads_in: 32,
    leads_booked: 15,
    close_rate: 47,
    tips_collected: 680,
    upsells_value: 1200,
    calls_handled: 28,
    after_hours_calls: 6,
  },
  {
    date: "2026-01-22",
    total_revenue: 9100,
    target_revenue: 10800,
    jobs_completed: 20,
    jobs_scheduled: 22,
    leads_in: 35,
    leads_booked: 18,
    close_rate: 51,
    tips_collected: 720,
    upsells_value: 1450,
    calls_handled: 31,
    after_hours_calls: 7,
  },
  {
    date: "2026-01-23",
    total_revenue: 6800,
    target_revenue: 10800,
    jobs_completed: 14,
    jobs_scheduled: 18,
    leads_in: 25,
    leads_booked: 10,
    close_rate: 40,
    tips_collected: 540,
    upsells_value: 980,
    calls_handled: 22,
    after_hours_calls: 4,
  },
  {
    date: "2026-01-24",
    total_revenue: 9800,
    target_revenue: 10800,
    jobs_completed: 22,
    jobs_scheduled: 24,
    leads_in: 38,
    leads_booked: 20,
    close_rate: 53,
    tips_collected: 890,
    upsells_value: 1680,
    calls_handled: 36,
    after_hours_calls: 9,
  },
  {
    date: "2026-01-25",
    total_revenue: 10200,
    target_revenue: 10800,
    jobs_completed: 24,
    jobs_scheduled: 25,
    leads_in: 42,
    leads_booked: 22,
    close_rate: 52,
    tips_collected: 950,
    upsells_value: 1820,
    calls_handled: 40,
    after_hours_calls: 11,
  },
  {
    date: "2026-01-26",
    total_revenue: 7800,
    target_revenue: 10800,
    jobs_completed: 17,
    jobs_scheduled: 20,
    leads_in: 30,
    leads_booked: 14,
    close_rate: 47,
    tips_collected: 680,
    upsells_value: 1150,
    calls_handled: 28,
    after_hours_calls: 5,
  },
  {
    date: "2026-01-27",
    total_revenue: 7400,
    target_revenue: 10800,
    jobs_completed: 15,
    jobs_scheduled: 22,
    leads_in: 28,
    leads_booked: 12,
    close_rate: 43,
    tips_collected: 795,
    upsells_value: 1350,
    calls_handled: 34,
    after_hours_calls: 8,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = searchParams.get("range") || "today"
  const date = searchParams.get("date")

  let responseData: DailyMetrics | DailyMetrics[]

  switch (range) {
    case "today":
      responseData = mockDailyMetrics
      break
    case "week":
      responseData = mockWeeklyMetrics
      break
    case "specific":
      if (date) {
        const found = mockWeeklyMetrics.find((m) => m.date === date)
        responseData = found || mockDailyMetrics
      } else {
        responseData = mockDailyMetrics
      }
      break
    default:
      responseData = mockDailyMetrics
  }

  const response: ApiResponse<typeof responseData> = {
    success: true,
    data: responseData,
  }

  return NextResponse.json(response)
}
