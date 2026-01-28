"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CalendarCheck, Users, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    name: "Today's Revenue",
    value: "$4,850",
    target: "$6,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    progress: 81,
  },
  {
    name: "Jobs Completed",
    value: "8",
    target: "12",
    change: "+2",
    trend: "up",
    icon: CalendarCheck,
    progress: 67,
  },
  {
    name: "Active Crews",
    value: "4/5",
    target: "5",
    change: "1 off",
    trend: "neutral",
    icon: Users,
    progress: 80,
  },
  {
    name: "Calls Handled",
    value: "23",
    target: "30",
    change: "+18%",
    trend: "up",
    icon: Phone,
    progress: 77,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                  <span className="text-sm text-muted-foreground">/ {stat.target}</span>
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-success" />
                  )}
                  {stat.trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stat.trend === "up" && "text-success",
                      stat.trend === "down" && "text-destructive",
                      stat.trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
