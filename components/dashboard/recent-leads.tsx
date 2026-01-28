"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Globe, Instagram, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const leads = [
  {
    id: "LEAD-001",
    name: "Amanda Roberts",
    source: "phone",
    time: "2 min ago",
    status: "new",
    service: "Window cleaning estimate",
    value: "~$400",
  },
  {
    id: "LEAD-002",
    name: "Tom Anderson",
    source: "meta",
    time: "8 min ago",
    status: "contacted",
    service: "Full service package",
    value: "~$800",
  },
  {
    id: "LEAD-003",
    name: "Lisa Chen",
    source: "website",
    time: "15 min ago",
    status: "booked",
    service: "Window + Gutter cleaning",
    value: "$520",
  },
  {
    id: "LEAD-004",
    name: "Brian Miller",
    source: "sms",
    time: "25 min ago",
    status: "nurturing",
    service: "Pressure washing inquiry",
    value: "TBD",
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
  booked: { label: "Booked", className: "bg-success/10 text-success border-success/20" },
  nurturing: { label: "Nurturing", className: "bg-accent/10 text-accent border-accent/20" },
  lost: { label: "Lost", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

export function RecentLeads() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest incoming inquiries</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leads.map((lead) => {
            const SourceIcon = sourceIcons[lead.source as keyof typeof sourceIcons]
            return (
              <div
                key={lead.id}
                className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
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

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{lead.name}</span>
                    <Badge
                      variant="outline"
                      className={statusConfig[lead.status as keyof typeof statusConfig].className}
                    >
                      {statusConfig[lead.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{lead.service}</span>
                    <span className="font-medium text-foreground">{lead.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{lead.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
