"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const teams = [
  {
    name: "Team Alpha",
    lead: "Marcus Johnson",
    status: "on-job",
    currentJob: "456 Maple Ave",
    revenue: 830,
    target: 1200,
    jobsCompleted: 2,
    jobsTotal: 4,
  },
  {
    name: "Team Bravo",
    lead: "David Martinez",
    status: "traveling",
    currentJob: "En route to 789 Pine Dr",
    revenue: 650,
    target: 1200,
    jobsCompleted: 1,
    jobsTotal: 3,
  },
  {
    name: "Team Charlie",
    lead: "Chris Wilson",
    status: "on-job",
    currentJob: "222 Birch St",
    revenue: 1100,
    target: 1200,
    jobsCompleted: 3,
    jobsTotal: 4,
  },
  {
    name: "Team Delta",
    lead: "James Lee",
    status: "off",
    currentJob: null,
    revenue: 0,
    target: 0,
    jobsCompleted: 0,
    jobsTotal: 0,
  },
]

const statusConfig = {
  "on-job": { label: "On Job", className: "bg-success/10 text-success border-success/20" },
  traveling: { label: "Traveling", className: "bg-primary/10 text-primary border-primary/20" },
  available: { label: "Available", className: "bg-warning/10 text-warning border-warning/20" },
  off: { label: "Off Today", className: "bg-muted text-muted-foreground border-border" },
}

export function TeamStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Status</CardTitle>
        <CardDescription>Real-time crew tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teams.map((team) => (
          <div
            key={team.name}
            className={cn(
              "rounded-lg border border-border p-4 transition-colors",
              team.status === "off" ? "opacity-50" : "bg-muted/30 hover:bg-muted/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{team.name}</span>
                  <Badge
                    variant="outline"
                    className={statusConfig[team.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[team.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{team.lead}</p>
              </div>
            </div>

            {team.status !== "off" && (
              <>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{team.currentJob}</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>
                        ${team.revenue} / ${team.target}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {team.jobsCompleted}/{team.jobsTotal} jobs
                    </span>
                  </div>
                  <Progress value={(team.revenue / team.target) * 100} className="h-1.5" />
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
