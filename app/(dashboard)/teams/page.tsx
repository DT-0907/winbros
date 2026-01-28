"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  Truck,
  Users,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const teams = [
  {
    id: "alpha",
    name: "Team Alpha",
    lead: "Marcus Johnson",
    members: ["Marcus J.", "Derek W.", "Ryan S."],
    status: "on-job",
    currentJob: {
      address: "456 Maple Ave, Austin TX",
      customer: "Mike Thompson",
      service: "Window + Pressure Wash",
      eta: "1h 20m remaining",
    },
    stats: {
      revenue: 2450,
      target: 3600,
      jobsCompleted: 5,
      jobsTotal: 8,
      avgRating: 4.9,
      tipsToday: 85,
      upsellsToday: 120,
    },
  },
  {
    id: "bravo",
    name: "Team Bravo",
    lead: "David Martinez",
    members: ["David M.", "Chris P.", "James K."],
    status: "traveling",
    currentJob: {
      address: "789 Pine Dr, Austin TX",
      customer: "Jennifer Williams",
      service: "Window Cleaning",
      eta: "15 min to arrival",
    },
    stats: {
      revenue: 1850,
      target: 3600,
      jobsCompleted: 4,
      jobsTotal: 7,
      avgRating: 4.8,
      tipsToday: 45,
      upsellsToday: 80,
    },
  },
  {
    id: "charlie",
    name: "Team Charlie",
    lead: "Chris Wilson",
    members: ["Chris W.", "Mike B."],
    status: "on-job",
    currentJob: {
      address: "222 Birch St, Austin TX",
      customer: "Emma Stevens",
      service: "Full Service Package",
      eta: "45 min remaining",
    },
    stats: {
      revenue: 3100,
      target: 3600,
      jobsCompleted: 6,
      jobsTotal: 7,
      avgRating: 5.0,
      tipsToday: 120,
      upsellsToday: 200,
    },
  },
  {
    id: "delta",
    name: "Team Delta",
    lead: "James Lee",
    members: ["James L.", "Kevin R.", "Tom S."],
    status: "off",
    currentJob: null,
    stats: {
      revenue: 0,
      target: 0,
      jobsCompleted: 0,
      jobsTotal: 0,
      avgRating: 4.7,
      tipsToday: 0,
      upsellsToday: 0,
    },
  },
]

const statusConfig = {
  "on-job": { label: "On Job", className: "bg-success/10 text-success border-success/20", icon: Truck },
  traveling: { label: "Traveling", className: "bg-primary/10 text-primary border-primary/20", icon: MapPin },
  available: { label: "Available", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  off: { label: "Off Today", className: "bg-muted text-muted-foreground border-border", icon: Users },
}

export default function TeamsPage() {
  const activeTeams = teams.filter((t) => t.status !== "off")
  const totalRevenue = activeTeams.reduce((sum, t) => sum + t.stats.revenue, 0)
  const totalTarget = activeTeams.reduce((sum, t) => sum + t.stats.target, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Teams</h1>
          <p className="text-sm text-muted-foreground">Real-time crew tracking and performance</p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Manage Teams
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Teams</p>
                <p className="text-2xl font-semibold text-foreground">{activeTeams.length}/4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold text-foreground">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Target</p>
                <p className="text-2xl font-semibold text-foreground">${totalTarget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-semibold text-foreground">4.85</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {teams.map((team) => {
          const StatusIcon = statusConfig[team.status as keyof typeof statusConfig].icon
          const revenuePercent = team.stats.target > 0 ? (team.stats.revenue / team.stats.target) * 100 : 0

          return (
            <Card
              key={team.id}
              className={cn(team.status === "off" && "opacity-60")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>Lead: {team.lead}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusConfig[team.status as keyof typeof statusConfig].className}
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig[team.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Members */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.members.map((member, i) => (
                      <Avatar key={member} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs bg-muted">
                          {member.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{team.members.length} members</span>
                </div>

                {/* Current Job */}
                {team.currentJob && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{team.currentJob.customer}</p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {team.currentJob.address}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{team.currentJob.service}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        {team.currentJob.eta}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Stats */}
                {team.status !== "off" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Daily Revenue</span>
                        <span className="font-medium text-foreground">
                          ${team.stats.revenue.toLocaleString()} / ${team.stats.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={revenuePercent} className="h-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-semibold text-foreground">
                          {team.stats.jobsCompleted}/{team.stats.jobsTotal}
                        </p>
                        <p className="text-xs text-muted-foreground">Jobs</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-semibold text-foreground">{team.stats.avgRating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="rounded-lg bg-success/10 p-2">
                        <p className="text-lg font-semibold text-success">${team.stats.tipsToday}</p>
                        <p className="text-xs text-muted-foreground">Tips</p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2">
                        <p className="text-lg font-semibold text-primary">${team.stats.upsellsToday}</p>
                        <p className="text-xs text-muted-foreground">Upsells</p>
                      </div>
                    </div>
                  </>
                )}

                <Button variant="ghost" className="w-full justify-between" disabled={team.status === "off"}>
                  View Full Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
