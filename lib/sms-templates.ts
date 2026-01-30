/**
 * SMS Message Templates for Lead Automation System
 *
 * All templates are designed to be concise (under 160 chars when possible)
 * and maintain a professional yet friendly tone.
 */

/**
 * Initial follow-up after a new lead comes in
 */
export function leadFollowupInitial(name: string, businessName: string): string {
  return `Hi ${name}! Thanks for reaching out to ${businessName}. We'd love to help with your cleaning needs. When works best for a quick call?`
}

/**
 * Second follow-up text for leads who haven't responded
 */
export function leadFollowupSecond(name: string): string {
  return `Hey ${name}, just checking in! Still interested in getting a cleaning quote? Reply YES and we'll get you scheduled right away.`
}

/**
 * Payment link message with amount and secure link
 */
export function paymentLink(name: string, amount: number, link: string): string {
  const formattedAmount = amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return `Hi ${name}, your invoice of ${formattedAmount} is ready. Pay securely here: ${link}`
}

/**
 * Notify customer that a cleaner has been assigned to their job
 */
export function cleanerAssigned(
  customerName: string,
  cleanerName: string,
  cleanerPhone: string,
  date: string,
  time: string
): string {
  return `Hi ${customerName}! ${cleanerName} will be your cleaner on ${date} at ${time}. Contact them at ${cleanerPhone} if needed. See you soon!`
}

/**
 * Apology message when no cleaners are available for the requested date
 */
export function noCleanersAvailable(name: string, date: string): string {
  return `Hi ${name}, we're sorry but we don't have availability for ${date}. Can we find you another date that works? Reply with your preferred times.`
}

/**
 * Post-cleaning review request
 */
export function postCleaningReview(name: string, reviewLink: string): string {
  return `Hi ${name}! We hope you loved your clean. Would you mind leaving us a quick review? It really helps! ${reviewLink}`
}

/**
 * Monthly re-engagement offer with discount
 */
export function monthlyFollowup(name: string, discount: string): string {
  return `Hey ${name}! It's been a while. Ready for another sparkle? Book this month and get ${discount} off. Reply BOOK to schedule!`
}

/**
 * All SMS templates exported as a single object
 */
export const SMS_TEMPLATES = {
  leadFollowupInitial,
  leadFollowupSecond,
  paymentLink,
  cleanerAssigned,
  noCleanersAvailable,
  postCleaningReview,
  monthlyFollowup,
} as const
