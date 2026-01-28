"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const leadSourceData = [
  { name: "phone", label: "Phone Calls", value: 35, fill: "#5b8def" },
  { name: "meta", label: "Meta Ads", value: 28, fill: "#4ade80" },
  { name: "website", label: "Website", value: 22, fill: "#facc15" },
  { name: "sms", label: "SMS", value: 15, fill: "#f472b6" },
]

const chartConfig = {
  value: { label: "Leads" },
  phone: { label: "Phone Calls", color: "#5b8def" },
  meta: { label: "Meta Ads", color: "#4ade80" },
  website: { label: "Website", color: "#facc15" },
  sms: { label: "SMS", color: "#f472b6" },
}

export function LeadSourceChart() {
  const total = leadSourceData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>This week's lead distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie
              data={leadSourceData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            />
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {leadSourceData.map((source) => (
            <div key={source.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: source.fill }}
              />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-xs text-muted-foreground">{source.label}</span>
                <span className="text-xs font-medium text-foreground">
                  {Math.round((source.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
