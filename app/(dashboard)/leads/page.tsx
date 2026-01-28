"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Phone,
  MessageSquare,
  Globe,
  Instagram,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Funnel data
const funnelData = [
  { name: "Leads In", value: 156, fill: "#5b8def" },
  { name: "Contacted", value: 124, fill: "#38bdf8" },
  { name: "Qualified", value: 89, fill: "#2dd4bf" },
  { name: "Booked", value: 67, fill: "#4ade80" },
]

// Lead source performance
const sourceData = [
  { source: "Phone", leads: 45, booked: 32, rate: 71 },
  { source: "Meta", leads: 52, booked: 18, rate: 35 },
  { source: "Website", leads: 38, booked: 12, rate: 32 },
  { source: "SMS", leads: 21, booked: 5, rate: 24 },
]

// Recent leads
const leads = [
  {
    id: "LEAD-001",
    name: "Amanda Roberts",
    phone: "(512) 555-0123",
    source: "phone",
    status: "new",
    service: "Window cleaning - 2 story home",
    estimatedValue: 400,
    createdAt: "2 min ago",
  },
  {
    id: "LEAD-002",
    name: "Tom Anderson",
    phone: "(512) 555-0456",
    source: "meta",
    status: "contacted",
    service: "Full service package",
    estimatedValue: 800,
    createdAt: "8 min ago",
  },
  {
    id: "LEAD-003",
    name: "Lisa Chen",
    phone: "(512) 555-0789",
    source: "website",
    status: "qualified",
    service: "Window + Gutter cleaning",
    estimatedValue: 520,
    createdAt: "15 min ago",
  },
  {
    id: "LEAD-004",
    name: "Brian Miller",
    phone: "(512) 555-0321",
    source: "sms",
    status: "booked",
    service: "Pressure washing inquiry",
    estimatedValue: 350,
    createdAt: "25 min ago",
  },
  {
    id: "LEAD-005",
    name: "Sarah Johnson",
    phone: "(512) 555-0654",
    source: "phone",
    status: "nurturing",
    service: "Service plan interest",
    estimatedValue: 1200,
    createdAt: "32 min ago",
  },
]

const sourceIcons = {
  phone: Phone,
  meta: Instagram,
  website: Globe,
  sms: MessageSquare,
}

const statusConfig = {
  new: { label: "New", className: "bg-primary/10 text-primary border-primary/20" },
  contacted: { label: "Contacted", className: "bg-warning/10 text-warning border-warning/20" },
  qualified: { label: "Qualified", className: "bg-accent/10 text-accent border-accent/20" },
  booked: { label: "Booked", className: "bg-success/10 text-success border-success/20" },
  nurturing: { label: "Nurturing", className: "bg-muted text-muted-foreground border-border" },
  lost: { label: "Lost", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

const chartConfig = {
  leads: { label: "Leads", color: "#5b8def" },
  booked: { label: "Booked", color: "#4ade80" },
}

export default function LeadsPage() {
  const closeRate = Math.round((67 / 156) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lead Funnel</h1>
          <p className="text-sm text-muted-foreground">Track leads from intake to booking</p>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-semibold text-foreground">156</p>
              </div>
              <div className="flex items-center text-success">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Booked</p>
                <p className="text-3xl font-semibold text-foreground">67</p>
              </div>
              <div className="flex items-center text-success">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Close Rate</p>
                <p className="text-3xl font-semibold text-foreground">{closeRate}%</p>
              </div>
              <div className="flex items-center text-destructive">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-medium">-2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Lead Value</p>
                <p className="text-3xl font-semibold text-foreground">$485</p>
              </div>
              <div className="flex items-center text-success">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead progression through stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, index) => {
                const percentage = Math.round((stage.value / funnelData[0].value) * 100)
                const dropoff = index > 0 ? funnelData[index - 1].value - stage.value : 0
                
                return (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{stage.value}</span>
                        {index > 0 && (
                          <span className="text-xs text-destructive">(-{dropoff})</span>
                        )}
                      </div>
                    </div>
                    <div className="relative h-8 overflow-hidden rounded-lg bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: stage.fill }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Source Performance</CardTitle>
            <CardDescription>Leads and conversions by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="source" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="leads" fill="#5b8def" radius={[0, 4, 4, 0]} />
                <Bar dataKey="booked" fill="#4ade80" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>

            {/* Conversion rates */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {sourceData.map((source) => (
                <div key={source.source} className="text-center">
                  <p className="text-xs text-muted-foreground">{source.source}</p>
                  <p className="text-sm font-semibold text-foreground">{source.rate}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>Complete lead pipeline</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search leads..." className="w-64 pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.map((lead) => {
              const SourceIcon = sourceIcons[lead.source as keyof typeof sourceIcons]
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      lead.source === "phone" && "bg-primary/10",
                      lead.source === "meta" && "bg-pink-500/10",
                      lead.source === "website" && "bg-success/10",
                      lead.source === "sms" && "bg-accent/10"
                    )}
                  >
                    <SourceIcon
                      className={cn(
                        "h-5 w-5",
                        lead.source === "phone" && "text-primary",
                        lead.source === "meta" && "text-pink-500",
                        lead.source === "website" && "text-success",
                        lead.source === "sms" && "text-accent"
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{lead.name}</span>
                      <Badge
                        variant="outline"
                        className={statusConfig[lead.status as keyof typeof statusConfig].className}
                      >
                        {statusConfig[lead.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.service}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-foreground">${lead.estimatedValue}</p>
                    <p className="text-xs text-muted-foreground">{lead.createdAt}</p>
                  </div>

                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
