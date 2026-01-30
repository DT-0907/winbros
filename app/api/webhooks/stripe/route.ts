import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validateStripeWebhook } from '@/lib/stripe-client'
import { getSupabaseClient, updateJob, getJobById, updateGHLLead } from '@/lib/supabase'
import { triggerCleanerAssignment } from '@/lib/cleaner-assignment'
import { logSystemEvent } from '@/lib/system-events'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const payload = await request.text()
    const signature = request.headers.get('stripe-signature')

    // Validate the webhook signature
    const event = validateStripeWebhook(payload, signature)

    if (!event) {
      console.error('[Stripe Webhook] Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`)

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle checkout.session.completed event
 * Processes both DEPOSIT and FINAL payment types
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {}
  const { job_id, lead_id, payment_type } = metadata

  console.log(`[Stripe Webhook] Checkout completed - job_id: ${job_id}, payment_type: ${payment_type}`)

  if (!job_id) {
    console.error('[Stripe Webhook] Missing job_id in session metadata')
    return
  }

  // Get the job to verify it exists
  const job = await getJobById(job_id)
  if (!job) {
    console.error(`[Stripe Webhook] Job not found: ${job_id}`)
    return
  }

  if (payment_type === 'DEPOSIT') {
    await handleDepositPayment(job_id, lead_id, session)
  } else if (payment_type === 'FINAL') {
    await handleFinalPayment(job_id, session)
  } else {
    console.log(`[Stripe Webhook] Unknown payment_type: ${payment_type}`)
  }
}

/**
 * Handle DEPOSIT payment completion
 * - Updates job payment status to 'deposit_paid'
 * - Sets confirmed_at timestamp
 * - Updates lead status to 'booked'
 * - Triggers cleaner assignment
 */
async function handleDepositPayment(
  jobId: string,
  leadId: string | undefined,
  session: Stripe.Checkout.Session
) {
  console.log(`[Stripe Webhook] Processing DEPOSIT payment for job: ${jobId}`)

  // Update job status
  const updatedJob = await updateJob(jobId, {
    payment_status: 'deposit_paid',
    confirmed_at: new Date().toISOString(),
  })

  if (!updatedJob) {
    console.error(`[Stripe Webhook] Failed to update job ${jobId}`)
    return
  }

  // Update lead status if lead_id is provided
  if (leadId) {
    const updatedLead = await updateGHLLead(leadId, {
      status: 'booked',
      converted_to_job_id: jobId,
    })

    if (!updatedLead) {
      console.warn(`[Stripe Webhook] Failed to update lead ${leadId}`)
    }
  }

  // Trigger cleaner assignment
  const assignmentResult = await triggerCleanerAssignment(jobId)

  if (!assignmentResult.success) {
    console.error(`[Stripe Webhook] Cleaner assignment failed: ${assignmentResult.error}`)
  }

  // Log the system event
  await logSystemEvent({
    source: 'stripe',
    event_type: 'DEPOSIT_PAID',
    message: `Deposit payment received for job ${jobId}`,
    job_id: jobId,
    phone_number: updatedJob.phone_number,
    metadata: {
      payment_type: 'DEPOSIT',
      session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      lead_id: leadId,
      cleaner_assignment_triggered: assignmentResult.success,
    },
  })

  console.log(`[Stripe Webhook] DEPOSIT payment processed successfully for job ${jobId}`)
}

/**
 * Handle FINAL payment completion
 * - Updates job payment_status to 'fully_paid'
 * - Sets paid = true
 */
async function handleFinalPayment(jobId: string, session: Stripe.Checkout.Session) {
  console.log(`[Stripe Webhook] Processing FINAL payment for job: ${jobId}`)

  // Update job status
  const updatedJob = await updateJob(jobId, {
    payment_status: 'fully_paid',
    paid: true,
  })

  if (!updatedJob) {
    console.error(`[Stripe Webhook] Failed to update job ${jobId}`)
    return
  }

  // Log the system event
  await logSystemEvent({
    source: 'stripe',
    event_type: 'FINAL_PAID',
    message: `Final payment received for job ${jobId}`,
    job_id: jobId,
    phone_number: updatedJob.phone_number,
    metadata: {
      payment_type: 'FINAL',
      session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
    },
  })

  console.log(`[Stripe Webhook] FINAL payment processed successfully for job ${jobId}`)
}

/**
 * Handle payment_intent.succeeded event
 * Additional payment confirmation logging
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata || {}
  const { job_id, payment_type } = metadata

  console.log(`[Stripe Webhook] Payment intent succeeded - job_id: ${job_id}, payment_type: ${payment_type}`)

  // This event provides additional confirmation
  // Most logic is handled in checkout.session.completed
  // This can be used for additional reconciliation or logging

  if (job_id) {
    const job = await getJobById(job_id)

    if (job) {
      await logSystemEvent({
        source: 'stripe',
        event_type: payment_type === 'DEPOSIT' ? 'DEPOSIT_PAID' : 'FINAL_PAID',
        message: `Payment intent confirmed for job ${job_id}`,
        job_id: job_id,
        phone_number: job.phone_number,
        metadata: {
          payment_intent_id: paymentIntent.id,
          payment_type: payment_type || 'unknown',
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
      })
    }
  }
}
