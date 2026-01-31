import { NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/cron-auth'
import { getSupabaseClient } from '@/lib/supabase'
import { sendSMS } from '@/lib/openphone'
import { monthlyReengagement } from '@/lib/sms-templates'
import { logSystemEvent } from '@/lib/system-events'
import { getDefaultTenant } from '@/lib/tenant'

/**
 * Monthly Re-engagement Cron
 *
 * Runs daily at 10am to check for customers who had a job completed 30+ days ago
 * and haven't booked again. Sends a re-engagement offer with discount.
 */
export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Monthly Reengagement] Starting cron job...')

  const client = getSupabaseClient()
  const tenant = await getDefaultTenant()

  if (!tenant) {
    console.error('[Monthly Reengagement] No tenant configured')
    return NextResponse.json({ error: 'No tenant configured' }, { status: 500 })
  }

  const reengagementDays = tenant.workflow_config?.monthly_followup_days || 30
  const discount = tenant.workflow_config?.monthly_followup_discount || '15%'

  // Calculate the date range: completed between 30-31 days ago
  // This ensures we only message once (daily cron catches the 30-day mark)
  const thirtyDaysAgo = new Date(Date.now() - reengagementDays * 24 * 60 * 60 * 1000)
  const thirtyOneDaysAgo = new Date(Date.now() - (reengagementDays + 1) * 24 * 60 * 60 * 1000)

  // Find customers with completed jobs in the target window
  // who haven't already received monthly follow-up
  // and don't have any jobs scheduled after that
  const { data: candidates, error } = await client
    .from('jobs')
    .select(`
      id,
      customer_id,
      phone_number,
      completed_at,
      monthly_followup_sent_at,
      customers (
        id,
        first_name,
        last_name,
        phone_number
      )
    `)
    .eq('tenant_id', tenant.id)
    .eq('status', 'completed')
    .is('monthly_followup_sent_at', null)
    .not('completed_at', 'is', null)
    .gte('completed_at', thirtyOneDaysAgo.toISOString())
    .lte('completed_at', thirtyDaysAgo.toISOString())
    .limit(30) // Process in batches

  if (error) {
    console.error('[Monthly Reengagement] Failed to fetch jobs:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!candidates || candidates.length === 0) {
    console.log('[Monthly Reengagement] No customers need re-engagement today')
    return NextResponse.json({ success: true, processed: 0 })
  }

  console.log(`[Monthly Reengagement] Found ${candidates.length} potential customers`)

  let processed = 0
  let skipped = 0
  let errors = 0

  for (const job of candidates) {
    try {
      const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers
      const customerId = customer?.id || job.customer_id
      const phone = customer?.phone_number || job.phone_number
      const customerName = customer?.first_name || 'there'

      if (!phone) {
        console.warn(`[Monthly Reengagement] No phone for job ${job.id}, skipping`)
        skipped++
        continue
      }

      // Check if customer has any upcoming/recent jobs (skip if they've booked again)
      const { data: recentJobs } = await client
        .from('jobs')
        .select('id')
        .eq('customer_id', customerId)
        .gt('created_at', job.completed_at) // Jobs created after the completed one
        .limit(1)

      if (recentJobs && recentJobs.length > 0) {
        console.log(`[Monthly Reengagement] Customer ${customerId} has recent booking, skipping`)
        // Mark as sent so we don't check again
        await client
          .from('jobs')
          .update({ monthly_followup_sent_at: new Date().toISOString() })
          .eq('id', job.id)
        skipped++
        continue
      }

      // Calculate days since last cleaning
      const daysSince = Math.floor(
        (Date.now() - new Date(job.completed_at!).getTime()) / (24 * 60 * 60 * 1000)
      )

      // Send re-engagement message
      const message = monthlyReengagement(customerName, discount, daysSince)
      const smsResult = await sendSMS(phone, message)

      if (smsResult.success) {
        // Mark follow-up as sent
        await client
          .from('jobs')
          .update({ monthly_followup_sent_at: new Date().toISOString() })
          .eq('id', job.id)

        await logSystemEvent({
          source: 'cron',
          event_type: 'MONTHLY_REENGAGEMENT_SENT',
          message: `Monthly re-engagement sent to ${customerName} (${phone})`,
          phone_number: phone,
          metadata: {
            job_id: job.id,
            customer_id: customerId,
            days_since_last_clean: daysSince,
            discount,
          },
        })

        processed++
        console.log(`[Monthly Reengagement] Sent re-engagement to ${phone} (${daysSince} days since last clean)`)
      } else {
        console.error(`[Monthly Reengagement] Failed to send SMS to ${phone}:`, smsResult.error)
        errors++
      }
    } catch (err) {
      console.error(`[Monthly Reengagement] Error processing job ${job.id}:`, err)
      errors++
    }
  }

  console.log(`[Monthly Reengagement] Completed. Processed: ${processed}, Skipped: ${skipped}, Errors: ${errors}`)

  return NextResponse.json({
    success: true,
    processed,
    skipped,
    errors,
    total: candidates.length,
  })
}
