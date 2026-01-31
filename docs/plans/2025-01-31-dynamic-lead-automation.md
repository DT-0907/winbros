# Dynamic Lead Automation System

## Overview

Two-way sync between HousecallPro and database with AI-powered lead detection and automated follow-up sequences.

## Lead Sources & Flows

### 1. VAPI Inbound Call
- Parse transcript → Extract booking info
- Create lead in DB → Create lead in HCP
- Trigger 5-stage follow-up

### 2. SMS (OpenPhone)
- AI analyzes message for booking intent
- If intent detected → Create lead in DB → Create lead in HCP → Trigger follow-up
- If no intent → Store message only

### 3. HousecallPro Lead
- HCP webhook → Create lead in DB → Trigger 5-stage follow-up (already working)

## Follow-up Sequence

| Stage | Delay | Action |
|-------|-------|--------|
| 1 | 0 min | Send initial SMS |
| 2 | 10 min | VAPI outbound call |
| 3 | 15 min | Double call (30s gap) |
| 4 | 20 min | Send second SMS |
| 5 | 30 min | Final call + payment link |

## Payment → Job Creation

1. Customer clicks Stripe payment link
2. Pays 50% deposit
3. Stripe webhook fires
4. Convert HCP lead → HCP job
5. Create/update job in DB
6. Trigger cleaner assignment (VRP)

## Post-Job Follow-up

- **2 hours after completion**: Review request + recurring offer + tip prompt
- **30 days after completion**: Re-engagement offer (if no new booking)

## Two-Way HCP Sync

### DB → HCP (new)
- VAPI booking → Create HCP lead
- SMS booking intent → Create HCP lead
- Deposit paid → Convert HCP lead to job
- Job completed → Mark complete in HCP

### HCP → DB (existing)
- lead.created → Create DB lead → Follow-up
- job.created → Create DB job
- job.completed → Update DB job
- payment.received → Update payment status

## Files to Create/Modify

| File | Action |
|------|--------|
| `lib/housecall-pro-api.ts` | CREATE - HCP API client |
| `lib/ai-intent.ts` | CREATE - AI booking intent detection |
| `app/api/webhooks/vapi/route.ts` | MODIFY - Parse transcript, create lead |
| `app/api/webhooks/openphone/route.ts` | MODIFY - AI intent, create lead |
| `app/api/webhooks/stripe/route.ts` | MODIFY - Convert HCP lead to job |
| `app/api/cron/post-job-followup/route.ts` | CREATE - 2hr review/recurring/tip |
| `app/api/cron/monthly-reengagement/route.ts` | CREATE - 30-day re-engagement |
| `lib/sms-templates.ts` | MODIFY - Add new templates |
| `vercel.json` | MODIFY - Add cron schedules |

## SMS Templates Needed

- `postJobReview` - Review request with Google link
- `postJobRecurring` - Recurring cleaning offer
- `postJobTip` - Tip prompt with Stripe link
- `monthlyReengagement` - 30-day re-engagement offer
