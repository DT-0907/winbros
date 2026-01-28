"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const revenueData = [
  { date: "Mon", revenue: 4200, target: 4800 },
  { date: "Tue", revenue: 5100, target: 4800 },
  { date: "Wed", revenue: 3800, target: 4800 },
  { date: "Thu", revenue: 5600, target: 4800 },
  { date: "Fri", revenue: 6200, target: 4800 },
  { date: "Sat", revenue: 4850, target: 4800 },
  { date: "Sun", revenue: 0, target: 0 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#5b8def",
  },
  target: {
    label: "Target",
    color: "#6b7280",
  },
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Daily revenue vs target ($4,800/crew/day)</CardDescription>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b8def" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5b8def" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />} 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#5b8def"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
