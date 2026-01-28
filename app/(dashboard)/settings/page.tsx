"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Database,
  Phone,
  MessageSquare,
  Mic,
  CreditCard,
  Clock,
  Bot,
  CheckCircle2,
  XCircle,
  Settings,
  Bell,
  Shield,
  Zap,
} from "lucide-react"
import { useState } from "react"

interface IntegrationCardProps {
  name: string
  description: string
  icon: React.ReactNode
  configured: boolean
  envVars: string[]
}

function IntegrationCard({ name, description, icon, configured, envVars }: IntegrationCardProps) {
  return (
    <Card className={configured ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${configured ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {configured ? (
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <XCircle className="w-3 h-3 mr-1" />
              Not Configured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Required vars:</span>{" "}
          {envVars.map((v, i) => (
            <code key={v} className="bg-muted px-1 py-0.5 rounded text-[10px]">
              {v}
              {i < envVars.length - 1 ? ", " : ""}
            </code>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Mock integration status - in production this would come from the server
const integrationStatus = {
  supabase: true,
  housecallPro: true,
  openPhone: true,
  telegram: true,
  vapi: true,
  stripe: true,
  qstash: true,
  ai: true,
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newLeads: true,
    jobClaimed: true,
    exceptions: true,
    dailyReport: true,
    sms: true,
    email: false,
  })

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage OSIRIS integrations, notifications, and system configuration
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="integrations" className="gap-2">
            <Zap className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Settings className="w-4 h-4" />
            Business Rules
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>
                All integrations must be configured for OSIRIS to function properly.
                Add environment variables in the Vercel dashboard or .env file.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <IntegrationCard
                name="Supabase"
                description="Database & automation logs"
                icon={<Database className="w-4 h-4" />}
                configured={integrationStatus.supabase}
                envVars={["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]}
              />
              <IntegrationCard
                name="Housecall Pro"
                description="Job management (source of truth)"
                icon={<Settings className="w-4 h-4" />}
                configured={integrationStatus.housecallPro}
                envVars={["HOUSECALL_PRO_API_KEY", "HOUSECALL_PRO_COMPANY_ID"]}
              />
              <IntegrationCard
                name="OpenPhone"
                description="SMS customer communications"
                icon={<Phone className="w-4 h-4" />}
                configured={integrationStatus.openPhone}
                envVars={["OPENPHONE_API_KEY", "OPENPHONE_PHONE_ID_WINBROS"]}
              />
              <IntegrationCard
                name="Telegram"
                description="Team notifications & job claiming"
                icon={<MessageSquare className="w-4 h-4" />}
                configured={integrationStatus.telegram}
                envVars={["TELEGRAM_BOT_TOKEN", "TELEGRAM_CONTROL_BOT_TOKEN"]}
              />
              <IntegrationCard
                name="VAPI"
                description="AI voice for calls & after-hours"
                icon={<Mic className="w-4 h-4" />}
                configured={integrationStatus.vapi}
                envVars={["VAPI_API_KEY", "VAPI_ASSISTANT_ID_WINBROS", "VAPI_PHONE_ID_WINBROS"]}
              />
              <IntegrationCard
                name="Stripe"
                description="Payment processing"
                icon={<CreditCard className="w-4 h-4" />}
                configured={integrationStatus.stripe}
                envVars={["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]}
              />
              <IntegrationCard
                name="QStash"
                description="Background jobs & scheduling"
                icon={<Clock className="w-4 h-4" />}
                configured={integrationStatus.qstash}
                envVars={["QSTASH_TOKEN", "QSTASH_CURRENT_SIGNING_KEY"]}
              />
              <IntegrationCard
                name="AI Models"
                description="OpenAI & Anthropic for AI features"
                icon={<Bot className="w-4 h-4" />}
                configured={integrationStatus.ai}
                envVars={["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook URLs</CardTitle>
              <CardDescription>
                Configure these URLs in your external services to receive events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Housecall Pro Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://your-domain.vercel.app/api/webhooks/housecall-pro"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telegram Bot Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://your-domain.vercel.app/api/webhooks/telegram"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>VAPI Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://your-domain.vercel.app/api/webhooks/vapi"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stripe Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://your-domain.vercel.app/api/webhooks/stripe"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control what notifications you receive and how
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Event Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Lead Alerts</Label>
                      <p className="text-xs text-muted-foreground">Get notified when a new lead comes in</p>
                    </div>
                    <Switch
                      checked={notifications.newLeads}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newLeads: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Job Claimed</Label>
                      <p className="text-xs text-muted-foreground">When a team lead claims a job</p>
                    </div>
                    <Switch
                      checked={notifications.jobClaimed}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, jobClaimed: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Exceptions</Label>
                      <p className="text-xs text-muted-foreground">Rain days, complaints, escalations</p>
                    </div>
                    <Switch
                      checked={notifications.exceptions}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, exceptions: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Report</Label>
                      <p className="text-xs text-muted-foreground">End of day performance summary</p>
                    </div>
                    <Switch
                      checked={notifications.dailyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, dailyReport: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="text-sm font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive alerts via text message</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Rules</CardTitle>
              <CardDescription>
                Configure pricing, scheduling, and operational parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rate per Labor Hour ($)</Label>
                <Input type="number" defaultValue={150} />
              </div>
              <div className="space-y-2">
                <Label>Production Hours per Day</Label>
                <Input type="number" defaultValue={8} />
              </div>
              <div className="space-y-2">
                <Label>Daily Target per Crew ($)</Label>
                <Input type="number" defaultValue={1200} />
              </div>
              <div className="space-y-2">
                <Label>Minimum Job Value ($)</Label>
                <Input type="number" defaultValue={100} />
              </div>
              <div className="space-y-2">
                <Label>Max Distance (minutes)</Label>
                <Input type="number" defaultValue={50} />
              </div>
              <div className="space-y-2">
                <Label>High Value Threshold ($)</Label>
                <Input type="number" defaultValue={1000} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Assignment Timing</CardTitle>
              <CardDescription>
                Configure broadcast windows and escalation timeouts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Initial Window (minutes)</Label>
                <Input type="number" defaultValue={10} />
              </div>
              <div className="space-y-2">
                <Label>Urgent Window (minutes)</Label>
                <Input type="number" defaultValue={3} />
              </div>
              <div className="space-y-2">
                <Label>Escalation Timeout (minutes)</Label>
                <Input type="number" defaultValue={10} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Follow-up Timing</CardTitle>
              <CardDescription>
                Configure the automated lead nurture sequence
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label>Initial Text (min)</Label>
                <Input type="number" defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label>First Call (min)</Label>
                <Input type="number" defaultValue={10} />
              </div>
              <div className="space-y-2">
                <Label>Double Call (min)</Label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="space-y-2">
                <Label>Second Text (min)</Label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="space-y-2">
                <Label>Final Call (min)</Label>
                <Input type="number" defaultValue={10} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Define when automated calls can be made
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" defaultValue="17:00" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input defaultValue="America/Chicago" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Contacts</CardTitle>
              <CardDescription>
                Configure who receives escalations and critical alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Owner Phone Number</Label>
                <Input placeholder="+1 (555) 123-4567" />
                <p className="text-xs text-muted-foreground">
                  Receives escalations and critical system alerts
                </p>
              </div>
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input type="email" placeholder="admin@winbros.com" />
                <p className="text-xs text-muted-foreground">
                  Receives daily reports and system notifications
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys and webhook security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  API keys are managed through environment variables in your Vercel dashboard.
                  Never expose API keys in client-side code.
                </p>
              </div>
              <Button variant="outline">View Environment Variables</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
