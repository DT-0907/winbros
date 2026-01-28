"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DollarSign, TrendingUp, Gift, Sparkles, ArrowUpRight } from "lucide-react"

// Tips data
const tipsData = [
  { date: "Mon", tips: 145, upsells: 280 },
  { date: "Tue", tips: 210, upsells: 350 },
  { date: "Wed", tips: 95, upsells: 180 },
  { date: "Thu", tips: 185, upsells: 420 },
  { date: "Fri", tips: 250, upsells: 380 },
  { date: "Sat", tips: 180, upsells: 300 },
]

// Recent tips
const recentTips = [
  { id: 1, jobId: "JOB-1234", team: "Alpha", lead: "Marcus J.", amount: 45, time: "10 min ago" },
  { id: 2, jobId: "JOB-1235", team: "Charlie", lead: "Chris W.", amount: 30, time: "25 min ago" },
  { id: 3, jobId: "JOB-1236", team: "Bravo", lead: "David M.", amount: 20, time: "1 hour ago" },
  { id: 4, jobId: "JOB-1237", team: "Alpha", lead: "Marcus J.", amount: 50, time: "2 hours ago" },
]

// Recent upsells
const recentUpsells = [
  { id: 1, jobId: "JOB-1234", team: "Alpha", lead: "Marcus J.", type: "Gutter Cleaning", value: 150, time: "15 min ago" },
  { id: 2, jobId: "JOB-1235", team: "Charlie", lead: "Chris W.", type: "Screen Cleaning", value: 80, time: "45 min ago" },
  { id: 3, jobId: "JOB-1236", team: "Bravo", lead: "David M.", type: "Pressure Wash Add", value: 120, time: "1 hour ago" },
  { id: 4, jobId: "JOB-1237", team: "Alpha", lead: "Marcus J.", type: "Solar Panel Clean", value: 200, time: "3 hours ago" },
]

// Team breakdown
const teamBreakdown = [
  { team: "Alpha", tips: 320, upsells: 580, jobs: 8 },
  { team: "Bravo", tips: 185, upsells: 320, jobs: 6 },
  { team: "Charlie", tips: 290, upsells: 450, jobs: 7 },
]

const chartConfig = {
  tips: { label: "Tips", color: "#4ade80" },
  upsells: { label: "Upsells", color: "#5b8def" },
}

export default function EarningsPage() {
  const totalTips = tipsData.reduce((sum, d) => sum + d.tips, 0)
  const totalUpsells = tipsData.reduce((sum, d) => sum + d.upsells, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tips & Upsells</h1>
          <p className="text-sm text-muted-foreground">Track additional revenue from field operations</p>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Gift className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tips</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-foreground">${totalTips}</p>
                  <span className="flex items-center text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    +15%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Upsells</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-foreground">${totalUpsells}</p>
                  <span className="flex items-center text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    +22%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Tip/Job</p>
                <p className="text-2xl font-semibold text-foreground">$28</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upsell Rate</p>
                <p className="text-2xl font-semibold text-foreground">34%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Breakdown</CardTitle>
          <CardDescription>Tips and upsells over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tipsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tips" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="upsells" fill="#5b8def" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Team Breakdown & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Team Breakdown</CardTitle>
            <CardDescription>Performance by team this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamBreakdown.map((team) => (
                <div
                  key={team.team}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">Team {team.team}</p>
                    <p className="text-sm text-muted-foreground">{team.jobs} jobs completed</p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <p className="text-lg font-semibold text-success">${team.tips}</p>
                      <p className="text-xs text-muted-foreground">Tips</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-primary">${team.upsells}</p>
                      <p className="text-xs text-muted-foreground">Upsells</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest tips and upsells</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tips">
              <TabsList className="mb-4">
                <TabsTrigger value="tips">Tips</TabsTrigger>
                <TabsTrigger value="upsells">Upsells</TabsTrigger>
              </TabsList>

              <TabsContent value="tips" className="space-y-3">
                {recentTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{tip.lead}</span>
                        <Badge variant="outline" className="text-xs">
                          Team {tip.team}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tip.jobId} - {tip.time}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-success">+${tip.amount}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="upsells" className="space-y-3">
                {recentUpsells.map((upsell) => (
                  <div
                    key={upsell.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{upsell.type}</span>
                        <Badge variant="outline" className="text-xs">
                          Team {upsell.team}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {upsell.lead} - {upsell.time}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-primary">+${upsell.value}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
