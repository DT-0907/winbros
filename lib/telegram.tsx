"use server"

/**
 * Telegram Bot API Client
 * Handles team notifications and job acceptance via Telegram
 */

const TELEGRAM_API_BASE = "https://api.telegram.org"

interface TelegramRequestOptions {
  method?: string
  body?: Record<string, unknown>
}

async function telegramRequest<T>(
  botToken: string,
  method: string,
  body?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`)
  }

  return data.result
}

// Get the appropriate bot token
function getBotToken(botType: "team" | "control" = "team"): string {
  const token =
    botType === "control"
      ? process.env.TELEGRAM_CONTROL_BOT_TOKEN
      : process.env.TELEGRAM_BOT_TOKEN

  if (!token) {
    throw new Error(`Telegram ${botType} bot token not configured`)
  }

  return token
}

export interface TelegramMessage {
  message_id: number
  from: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  reply_markup?: InlineKeyboardMarkup
}

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
}

export interface TelegramChat {
  id: number
  type: "private" | "group" | "supergroup" | "channel"
  title?: string
  username?: string
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

export interface InlineKeyboardButton {
  text: string
  callback_data?: string
  url?: string
}

export interface CallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  chat_instance: string
  data?: string
}

/**
 * Send a message to a Telegram chat
 */
export async function sendMessage(
  chatId: string | number,
  text: string,
  options?: {
    parseMode?: "HTML" | "Markdown" | "MarkdownV2"
    replyMarkup?: InlineKeyboardMarkup
    botType?: "team" | "control"
  }
): Promise<TelegramMessage> {
  const botToken = getBotToken(options?.botType)

  return telegramRequest<TelegramMessage>(botToken, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: options?.parseMode || "HTML",
    reply_markup: options?.replyMarkup,
  })
}

/**
 * Edit an existing message
 */
export async function editMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  options?: {
    parseMode?: "HTML" | "Markdown" | "MarkdownV2"
    replyMarkup?: InlineKeyboardMarkup
    botType?: "team" | "control"
  }
): Promise<TelegramMessage> {
  const botToken = getBotToken(options?.botType)

  return telegramRequest<TelegramMessage>(botToken, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: options?.parseMode || "HTML",
    reply_markup: options?.replyMarkup,
  })
}

/**
 * Answer a callback query (acknowledge button press)
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert = false,
  botType: "team" | "control" = "team"
): Promise<boolean> {
  const botToken = getBotToken(botType)

  return telegramRequest<boolean>(botToken, "answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  })
}

/**
 * Send job assignment notification to team leads
 */
export async function sendJobAssignment(
  telegramChatIds: (string | number)[],
  job: {
    id: string
    customerName: string
    address: string
    city: string
    scheduledDate: string
    scheduledTime: string
    estimatedHours: number
    totalAmount: number
    jobType: string
  }
): Promise<TelegramMessage[]> {
  const message = `🔔 <b>NEW JOB AVAILABLE</b>

📋 <b>Job #${job.id.slice(0, 8)}</b>
👤 ${job.customerName}
📍 ${job.address}, ${job.city}
📅 ${job.scheduledDate} at ${job.scheduledTime}
⏱ Est. ${job.estimatedHours} hours
💰 $${job.totalAmount.toFixed(2)}
🏷 ${job.jobType}

Tap below to claim this job:`

  const replyMarkup: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        { text: "✅ Accept Job", callback_data: `accept_job:${job.id}` },
        { text: "❌ Pass", callback_data: `pass_job:${job.id}` },
      ],
    ],
  }

  const messages = await Promise.all(
    telegramChatIds.map((chatId) =>
      sendMessage(chatId, message, { replyMarkup, botType: "team" })
    )
  )

  return messages
}

/**
 * Send job claimed confirmation
 */
export async function sendJobClaimedConfirmation(
  chatId: string | number,
  teamLeadName: string,
  job: {
    id: string
    customerName: string
    address: string
    scheduledDate: string
    scheduledTime: string
  }
): Promise<TelegramMessage> {
  const message = `✅ <b>JOB CLAIMED</b>

${teamLeadName}, you've claimed job #${job.id.slice(0, 8)}!

📋 <b>Details:</b>
👤 ${job.customerName}
📍 ${job.address}
📅 ${job.scheduledDate} at ${job.scheduledTime}

Remember to:
1. Check your route the night before
2. Text customer when on the way
3. Report tips & upsells after completion`

  return sendMessage(chatId, message, { botType: "team" })
}

/**
 * Send urgent escalation notice
 */
export async function sendUrgentEscalation(
  chatId: string | number,
  job: {
    id: string
    customerName: string
    address: string
    scheduledDate: string
    reason: string
  }
): Promise<TelegramMessage> {
  const message = `🚨 <b>URGENT - ESCALATION</b>

Job #${job.id.slice(0, 8)} requires immediate attention!

👤 ${job.customerName}
📍 ${job.address}
📅 ${job.scheduledDate}

⚠️ Reason: ${job.reason}

This job was not claimed within the window and needs manual assignment.`

  return sendMessage(chatId, message, { botType: "control" })
}

/**
 * Send start-of-day briefing
 */
export async function sendDailyBriefing(
  chatId: string | number,
  teamLeadName: string,
  jobs: Array<{
    customerName: string
    address: string
    scheduledTime: string
    totalAmount: number
  }>
): Promise<TelegramMessage> {
  const totalRevenue = jobs.reduce((sum, job) => sum + job.totalAmount, 0)

  let message = `☀️ <b>Good Morning, ${teamLeadName}!</b>

📅 <b>Today's Schedule (${jobs.length} jobs)</b>
💰 Target Revenue: $${totalRevenue.toFixed(2)}

`

  jobs.forEach((job, index) => {
    message += `${index + 1}. ${job.scheduledTime} - ${job.customerName}
   📍 ${job.address}
   💵 $${job.totalAmount.toFixed(2)}

`
  })

  message += `Have a great day! 💪`

  return sendMessage(chatId, message, { botType: "team" })
}

/**
 * Send tip/upsell confirmation
 */
export async function sendEarningsConfirmation(
  chatId: string | number,
  type: "tip" | "upsell",
  amount: number,
  jobId: string
): Promise<TelegramMessage> {
  const emoji = type === "tip" ? "💵" : "📈"
  const label = type === "tip" ? "Tip" : "Upsell"

  const message = `${emoji} <b>${label} Recorded!</b>

Amount: $${amount.toFixed(2)}
Job: #${jobId.slice(0, 8)}

Great work! Keep it up! 🎉`

  return sendMessage(chatId, message, { botType: "team" })
}
