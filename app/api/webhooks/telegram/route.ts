import { NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Tip, Upsell } from "@/lib/types"

/**
 * Webhook handler for Telegram bot messages
 * 
 * Handles:
 * - Team job confirmations
 * - Tip reports
 * - Upsell reports
 * - Team availability updates
 */

interface TelegramMessage {
  message_id: number
  from: {
    id: number
    username?: string
    first_name: string
  }
  chat: {
    id: number
    type: string
  }
  text?: string
  date: number
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

// Regex patterns for parsing team messages
const TIP_PATTERN = /tip\s+(?:accepted\s+)?job\s+(\d+)\s*[-–]\s*\$?(\d+(?:\.\d{2})?)/i
const UPSELL_PATTERN = /upsold?\s+job\s+(\d+)\s*[-–]\s*(.+)/i
const CONFIRM_PATTERN = /confirm\s+job\s+(\d+)/i

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    if (!update.message?.text) {
      return NextResponse.json({ success: true })
    }

    const { text, from, chat } = update.message
    const telegramUserId = from.id.toString()

    console.log(`[OSIRIS] Telegram message from ${from.username || from.first_name}: ${text}`)

    // Parse tip report
    const tipMatch = text.match(TIP_PATTERN)
    if (tipMatch) {
      const [, jobId, amount] = tipMatch
      
      // TODO: Lookup team by telegram user ID
      // TODO: Create tip record in Supabase
      
      const tip: Partial<Tip> = {
        job_id: `job-${jobId}`,
        amount: parseFloat(amount),
        reported_via: "telegram",
        created_at: new Date().toISOString(),
      }

      console.log(`[OSIRIS] Tip recorded: Job ${jobId}, Amount $${amount}`)
      
      // Send confirmation back to chat
      // TODO: Call Telegram API to send confirmation message
      
      return NextResponse.json({ success: true, action: "tip_recorded", data: tip })
    }

    // Parse upsell report
    const upsellMatch = text.match(UPSELL_PATTERN)
    if (upsellMatch) {
      const [, jobId, upsellType] = upsellMatch

      // TODO: Lookup upsell price from Supabase upsell price table
      // TODO: Create upsell record in Supabase

      const upsell: Partial<Upsell> = {
        job_id: `job-${jobId}`,
        upsell_type: upsellType.trim(),
        reported_via: "telegram",
        created_at: new Date().toISOString(),
      }

      console.log(`[OSIRIS] Upsell recorded: Job ${jobId}, Type: ${upsellType}`)

      return NextResponse.json({ success: true, action: "upsell_recorded", data: upsell })
    }

    // Parse job confirmation
    const confirmMatch = text.match(CONFIRM_PATTERN)
    if (confirmMatch) {
      const [, jobId] = confirmMatch

      // TODO: Update job in Supabase with team confirmation
      // TODO: Cancel pending confirmation requests to other teams

      console.log(`[OSIRIS] Job ${jobId} confirmed by team`)

      return NextResponse.json({ success: true, action: "job_confirmed", job_id: jobId })
    }

    // Unknown message format
    console.log(`[OSIRIS] Unrecognized message format: ${text}`)
    return NextResponse.json({ success: true, action: "no_action" })

  } catch (error) {
    console.error("[OSIRIS] Telegram webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
