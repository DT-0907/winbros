import { NextRequest, NextResponse } from "next/server"
import type { HousecallProWebhookPayload, ApiResponse } from "@/lib/types"

/**
 * Webhook handler for Housecall Pro events
 * 
 * HCP is the source of truth for:
 * - Customer records
 * - Job records
 * - Scheduling
 * - Payment status
 * 
 * This webhook mirrors relevant changes to Supabase for automation tracking
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (implement based on HCP's signature method)
    const signature = request.headers.get("x-hcp-signature")
    // TODO: Verify signature

    const payload: HousecallProWebhookPayload = await request.json()
    const { event, data, timestamp } = payload

    console.log(`[OSIRIS] HCP Webhook received: ${event}`, { timestamp })

    switch (event) {
      case "job.created":
        // Mirror new job to Supabase
        // TODO: Create job record in Supabase
        console.log("[OSIRIS] New job created in HCP, mirroring to Supabase")
        break

      case "job.updated":
        // Update job in Supabase
        // Check for status changes that trigger automations
        console.log("[OSIRIS] Job updated in HCP, syncing to Supabase")
        break

      case "job.completed":
        // Mark job as completed
        // Trigger post-job automations (review request, retargeting enrollment)
        console.log("[OSIRIS] Job completed, triggering post-job automations")
        break

      case "job.cancelled":
        // Update job status
        // Notify assigned team via Telegram
        // Notify customer via SMS
        console.log("[OSIRIS] Job cancelled, sending notifications")
        break

      case "customer.created":
        // Mirror customer to Supabase
        console.log("[OSIRIS] New customer created in HCP")
        break

      case "customer.updated":
        // Update customer in Supabase
        console.log("[OSIRIS] Customer updated in HCP")
        break

      case "payment.received":
        // Update job payment status
        // Log revenue
        console.log("[OSIRIS] Payment received for job")
        break

      default:
        console.log(`[OSIRIS] Unhandled HCP event: ${event}`)
    }

    const response: ApiResponse<{ received: boolean }> = {
      success: true,
      data: { received: true },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[OSIRIS] HCP Webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
