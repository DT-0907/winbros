"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

const jobs = [
  {
    id: "JOB-1234",
    customer: "Sarah Johnson",
    address: "123 Oak Street, Austin TX",
    time: "8:00 AM - 10:00 AM",
    value: 350,
    status: "completed",
    team: "Alpha",
    service: "Window Cleaning",
    upsell: "Gutter cleaning added",
  },
  {
    id: "JOB-1235",
    customer: "Mike Thompson",
    address: "456 Maple Ave, Austin TX",
    time: "10:30 AM - 12:30 PM",
    value: 480,
    status: "in-progress",
    team: "Alpha",
    service: "Window + Pressure Wash",
    upsell: null,
  },
  {
    id: "JOB-1236",
    customer: "Jennifer Williams",
    address: "789 Pine Dr, Austin TX",
    time: "1:00 PM - 3:00 PM",
    value: 420,
    status: "scheduled",
    team: "Bravo",
    service: "Window Cleaning",
    upsell: null,
  },
  {
    id: "JOB-1237",
    customer: "Robert Davis",
    address: "321 Cedar Ln, Austin TX",
    time: "3:30 PM - 5:30 PM",
    value: 550,
    status: "scheduled",
    team: "Bravo",
    service: "Full Service Package",
    upsell: null,
  },
]

const statusConfig = {
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  "in-progress": { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
  scheduled: { label: "Scheduled", className: "bg-muted text-muted-foreground border-border" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

export function TodaysJobs() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Jobs</CardTitle>
          <CardDescription>12 jobs scheduled • $5,800 projected revenue</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              {/* Status indicator */}
              <div
                className={cn(
                  "h-full w-1 self-stretch rounded-full",
                  job.status === "completed" && "bg-success",
                  job.status === "in-progress" && "bg-primary",
                  job.status === "scheduled" && "bg-muted-foreground"
                )}
              />

              {/* Main content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{job.customer}</span>
                    <Badge variant="outline" className={statusConfig[job.status as keyof typeof statusConfig].className}>
                      {statusConfig[job.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{job.id}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${job.value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Team {job.team}</span>
                  </div>
                </div>

                {job.upsell && (
                  <div className="text-xs text-success">
                    + {job.upsell}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
