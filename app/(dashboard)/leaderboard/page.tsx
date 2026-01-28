"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, DollarSign, Star, Briefcase, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const leaderboardData = {
  tips: [
    { rank: 1, name: "Marcus Johnson", team: "Alpha", value: 485, change: "+12%" },
    { rank: 2, name: "Chris Wilson", team: "Charlie", value: 420, change: "+8%" },
    { rank: 3, name: "David Martinez", team: "Bravo", value: 365, change: "+5%" },
    { rank: 4, name: "Derek Williams", team: "Alpha", value: 290, change: "-2%" },
    { rank: 5, name: "James Lee", team: "Delta", value: 245, change: "+15%" },
  ],
  upsells: [
    { rank: 1, name: "Chris Wilson", team: "Charlie", value: 780, change: "+22%" },
    { rank: 2, name: "Marcus Johnson", team: "Alpha", value: 650, change: "+18%" },
    { rank: 3, name: "David Martinez", team: "Bravo", value: 520, change: "+10%" },
    { rank: 4, name: "Ryan Smith", team: "Alpha", value: 380, change: "+5%" },
    { rank: 5, name: "Chris Parker", team: "Bravo", value: 320, change: "-3%" },
  ],
  jobs: [
    { rank: 1, name: "Marcus Johnson", team: "Alpha", value: 42, change: "+8" },
    { rank: 2, name: "David Martinez", team: "Bravo", value: 38, change: "+5" },
    { rank: 3, name: "Chris Wilson", team: "Charlie", value: 35, change: "+7" },
    { rank: 4, name: "James Lee", team: "Delta", value: 32, change: "+3" },
    { rank: 5, name: "Derek Williams", team: "Alpha", value: 28, change: "+4" },
  ],
  reviews: [
    { rank: 1, name: "Chris Wilson", team: "Charlie", value: 12, change: "+3" },
    { rank: 2, name: "Marcus Johnson", team: "Alpha", value: 10, change: "+2" },
    { rank: 3, name: "David Martinez", team: "Bravo", value: 8, change: "+1" },
    { rank: 4, name: "Derek Williams", team: "Alpha", value: 6, change: "+2" },
    { rank: 5, name: "Ryan Smith", team: "Alpha", value: 5, change: "+1" },
  ],
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
  return null
}

const getRankClass = (rank: number) => {
  if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30"
  if (rank === 2) return "bg-gray-400/10 border-gray-400/30"
  if (rank === 3) return "bg-amber-600/10 border-amber-600/30"
  return "bg-muted/30 border-border"
}

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold text-foreground">
            <Trophy className="h-7 w-7 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground">Team lead performance rankings</p>
        </div>
        <Select defaultValue="month">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top 3 Highlight */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Second Place */}
        <Card className="order-1 md:order-none md:translate-y-4">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-gray-400">
                <AvatarFallback className="bg-gray-400/20 text-lg">CW</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-bold text-white">
                2
              </div>
            </div>
            <h3 className="mt-3 font-semibold text-foreground">Chris Wilson</h3>
            <p className="text-sm text-muted-foreground">Team Charlie</p>
            <div className="mt-3 flex items-center gap-1 text-xl font-bold text-foreground">
              <DollarSign className="h-5 w-5" />
              1,200
            </div>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>

        {/* First Place */}
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Crown className="mb-2 h-8 w-8 text-yellow-500" />
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-yellow-500">
                <AvatarFallback className="bg-yellow-500/20 text-xl">MJ</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-white">
                1
              </div>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">Marcus Johnson</h3>
            <p className="text-sm text-muted-foreground">Team Alpha</p>
            <div className="mt-3 flex items-center gap-1 text-2xl font-bold text-yellow-500">
              <DollarSign className="h-6 w-6" />
              1,435
            </div>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>

        {/* Third Place */}
        <Card className="order-2 md:order-none md:translate-y-4">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-amber-600">
                <AvatarFallback className="bg-amber-600/20 text-lg">DM</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                3
              </div>
            </div>
            <h3 className="mt-3 font-semibold text-foreground">David Martinez</h3>
            <p className="text-sm text-muted-foreground">Team Bravo</p>
            <div className="mt-3 flex items-center gap-1 text-xl font-bold text-foreground">
              <DollarSign className="h-5 w-5" />
              885
            </div>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Rankings</CardTitle>
          <CardDescription>Performance breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tips">
            <TabsList className="mb-6">
              <TabsTrigger value="tips" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Tips
              </TabsTrigger>
              <TabsTrigger value="upsells" className="gap-2">
                <Star className="h-4 w-4" />
                Upsells
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="h-4 w-4" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {Object.entries(leaderboardData).map(([category, data]) => (
              <TabsContent key={category} value={category} className="space-y-3">
                {data.map((entry) => (
                  <div
                    key={entry.rank}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                      getRankClass(entry.rank)
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center">
                      {getRankIcon(entry.rank) || (
                        <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
                      )}
                    </div>

                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted">
                        {entry.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">Team {entry.team}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        {category === "tips" || category === "upsells" ? `$${entry.value}` : entry.value}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          entry.change.startsWith("+") ? "text-success" : "text-destructive"
                        )}
                      >
                        {entry.change}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Incentive Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Google Review Incentive</p>
            <p className="text-sm text-muted-foreground">
              $10 credited to team lead for each Google review received. Reviews are tied to completed jobs automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
