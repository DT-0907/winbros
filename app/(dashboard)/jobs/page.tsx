"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  List,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  User,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for jobs
const jobsData = {
  "2026-01-26": [
    { id: "1234", time: "8:00 AM", customer: "Sarah J.", value: 350, team: "Alpha", status: "completed" },
    { id: "1235", time: "10:30 AM", customer: "Mike T.", value: 480, team: "Alpha", status: "completed" },
    { id: "1236", time: "1:00 PM", customer: "Jennifer W.", value: 420, team: "Bravo", status: "in-progress" },
  ],
  "2026-01-27": [
    { id: "1238", time: "8:00 AM", customer: "Lisa C.", value: 520, team: "Alpha", status: "scheduled" },
    { id: "1239", time: "9:30 AM", customer: "Brian M.", value: 380, team: "Bravo", status: "scheduled" },
    { id: "1240", time: "11:00 AM", customer: "Amanda R.", value: 450, team: "Alpha", status: "scheduled" },
    { id: "1241", time: "2:00 PM", customer: "Tom A.", value: 800, team: "Charlie", status: "scheduled" },
    { id: "1242", time: "3:30 PM", customer: "Robert D.", value: 550, team: "Bravo", status: "scheduled" },
  ],
  "2026-01-28": [
    { id: "1243", time: "8:00 AM", customer: "Emma S.", value: 400, team: "Alpha", status: "scheduled" },
    { id: "1244", time: "10:00 AM", customer: "David L.", value: 620, team: "Bravo", status: "scheduled" },
  ],
  "2026-01-29": [
    { id: "1245", time: "9:00 AM", customer: "Chris P.", value: 350, team: "Charlie", status: "scheduled" },
  ],
}

const statusColors = {
  completed: "bg-success",
  "in-progress": "bg-primary",
  scheduled: "bg-muted-foreground",
  cancelled: "bg-destructive",
}

export default function JobsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 27))
  const [selectedTeam, setSelectedTeam] = useState("all")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    return `${year}-${month}-${dayStr}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Jobs Calendar</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage all service appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="alpha">Team Alpha</SelectItem>
              <SelectItem value="bravo">Team Bravo</SelectItem>
              <SelectItem value="charlie">Team Charlie</SelectItem>
              <SelectItem value="delta">Team Delta</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="bg-muted px-2 py-3 text-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before the first of the month */}
                {Array.from({ length: startingDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-32 bg-card p-2" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateKey = formatDateKey(day)
                  const dayJobs = jobsData[dateKey as keyof typeof jobsData] || []
                  const totalRevenue = dayJobs.reduce((sum, job) => sum + job.value, 0)

                  return (
                    <div
                      key={day}
                      className={cn(
                        "min-h-32 bg-card p-2 transition-colors hover:bg-muted/50",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-sm",
                            isToday(day) && "bg-primary text-primary-foreground font-medium"
                          )}
                        >
                          {day}
                        </span>
                        {totalRevenue > 0 && (
                          <span className="text-xs font-medium text-success">${totalRevenue}</span>
                        )}
                      </div>

                      <div className="mt-2 space-y-1">
                        {dayJobs.slice(0, 3).map((job) => (
                          <div
                            key={job.id}
                            className="flex items-center gap-1 rounded bg-muted/50 px-1.5 py-1 text-xs"
                          >
                            <div className={cn("h-1.5 w-1.5 rounded-full", statusColors[job.status as keyof typeof statusColors])} />
                            <span className="truncate text-foreground">{job.time}</span>
                            <span className="truncate text-muted-foreground">- {job.customer}</span>
                          </div>
                        ))}
                        {dayJobs.length > 3 && (
                          <div className="text-xs text-muted-foreground">+{dayJobs.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Jobs</CardTitle>
              <CardDescription>All scheduled jobs for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(jobsData).map(([date, jobs]) => (
                  <div key={date}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-2">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                        >
                          <div
                            className={cn(
                              "h-full w-1 self-stretch rounded-full",
                              statusColors[job.status as keyof typeof statusColors]
                            )}
                          />
                          <div className="flex flex-1 items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{job.customer}</span>
                                <Badge variant="outline" className="text-xs">
                                  {job.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {job.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  Team {job.team}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ${job.value}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
