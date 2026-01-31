import { NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth, unauthorizedResponse } from '@/lib/cron-auth'

/**
 * Unified daily cron endpoint that consolidates daily cron jobs
 * into a single execution (Vercel Hobby plan limitation)
 *
 * This endpoint calls:
 * - send-reminders: Customer and cleaner reminder notifications
 * - monthly-followup: Re-engagement for past customers
 *
 * Note: Frequent crons (ghl-followups, check-timeouts, post-cleaning-followup)
 * are handled by process-scheduled-tasks which runs every minute.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json(unauthorizedResponse(), { status: 401 })
  }

  try {
    const results = {
      send_reminders: { success: false, error: null as string | null },
      monthly_followup: { success: false, error: null as string | null },
      timestamp: new Date().toISOString(),
    }

    const domain = process.env.NEXT_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`
    const cronSecret = process.env.CRON_SECRET || ''

    // 1. Execute send reminders
    try {
      console.log('[unified-daily] Executing send-reminders...')
      const remindersResponse = await fetch(`${domain}/api/cron/send-reminders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        },
      })

      if (remindersResponse.ok) {
        results.send_reminders.success = true
        console.log('[unified-daily] ✓ send-reminders completed successfully')
      } else {
        results.send_reminders.error = `Status ${remindersResponse.status}`
        console.error('[unified-daily] ✗ send-reminders failed:', remindersResponse.status)
      }
    } catch (error) {
      results.send_reminders.error = String(error)
      console.error('[unified-daily] ✗ send-reminders error:', error)
    }

    // 2. Execute monthly followup
    try {
      console.log('[unified-daily] Executing monthly-followup...')
      const monthlyResponse = await fetch(`${domain}/api/cron/monthly-followup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        },
      })

      if (monthlyResponse.ok) {
        results.monthly_followup.success = true
        console.log('[unified-daily] ✓ monthly-followup completed successfully')
      } else {
        results.monthly_followup.error = `Status ${monthlyResponse.status}`
        console.error('[unified-daily] ✗ monthly-followup failed:', monthlyResponse.status)
      }
    } catch (error) {
      results.monthly_followup.error = String(error)
      console.error('[unified-daily] ✗ monthly-followup error:', error)
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('[unified-daily] Unified daily cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
