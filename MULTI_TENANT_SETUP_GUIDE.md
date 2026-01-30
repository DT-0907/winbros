# Multi-Tenant Lead Automation Platform - Setup Guide

This guide walks you through setting up the multi-tenant cleaning business automation platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Database Migration](#step-1-database-migration)
4. [Step 2: Seed WinBros Tenant](#step-2-seed-winbros-tenant)
5. [Step 3: Environment Variables](#step-3-environment-variables)
6. [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
7. [Step 5: Configure Webhooks](#step-5-configure-webhooks)
8. [Step 6: Set Up QStash Schedules](#step-6-set-up-qstash-schedules)
9. [Step 7: Testing](#step-7-testing)
10. [Adding New Tenants](#adding-new-tenants)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Platform                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│   │   WinBros   │    │  Client B   │    │  Client C   │       │
│   │   /winbros  │    │  /clientb   │    │  /clientc   │       │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘       │
│          │                  │                  │               │
│          └──────────────────┼──────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                         │
│                    │  tenants table  │                         │
│                    │  (API keys,     │                         │
│                    │   workflow      │                         │
│                    │   config)       │                         │
│                    └─────────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Webhook URL Pattern

Each tenant gets their own webhook URLs:

```
https://your-domain.vercel.app/api/webhooks/{type}/{tenant-slug}

Examples for WinBros (slug: "winbros"):
- VAPI:          /api/webhooks/vapi/winbros
- HousecallPro:  /api/webhooks/housecall-pro/winbros
- Stripe:        /api/webhooks/stripe/winbros
- GHL:           /api/webhooks/ghl/winbros
- OpenPhone:     /api/webhooks/openphone/winbros
- Telegram:      /api/webhooks/telegram/winbros
```

---

## Prerequisites

Before starting, ensure you have:

- [ ] Supabase project set up
- [ ] Vercel account for deployment
- [ ] Access to all API dashboards (OpenPhone, VAPI, Stripe, etc.)
- [ ] QStash/Upstash account

---

## Step 1: Database Migration

**WARNING:** This will drop all existing tables and data!

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `scripts/multi-tenant-schema.sql`
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**

This creates:
- `tenants` table (core multi-tenancy)
- `cleaners` table (with tenant_id)
- `customers` table (with tenant_id)
- `jobs` table (with tenant_id)
- `leads` table (with tenant_id)
- `messages` table (with tenant_id)
- `teams` and `team_members` tables
- `tips` and `upsells` tables
- `cleaner_assignments` table
- `system_events` table
- All necessary indexes and triggers

---

## Step 2: Seed WinBros Tenant

1. In Supabase SQL Editor, open `scripts/seed-winbros.sql`
2. Review the values (they're pre-filled from your .env.local)
3. Run the script

This creates WinBros as your first tenant with:
- Email: `jaspergrenager@gmail.com`
- Password: `test`
- All API keys from your current setup
- Full workflow enabled (HCP, VAPI, GHL, Stripe, Wave)

**Verify it worked:**
```sql
SELECT id, name, slug, email, active FROM tenants WHERE slug = 'winbros';
```

---

## Step 3: Environment Variables

After migration, your `.env.local` should only contain **universal** keys (shared across all tenants):

```bash
# ============================================================================
# UNIVERSAL ENVIRONMENT VARIABLES (keep these)
# ============================================================================

# Admin
ADMIN_EMAIL="jaspergrenager@gmail.com"

# AI APIs (shared across all tenants)
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-proj-..."

# Supabase (shared - one database for all tenants)
NEXT_PUBLIC_SUPABASE_URL="https://kcmbwstjmdrjkhxhkkjt.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."

# QStash (shared - one queue for all tenants)
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="eyJVc2Vy..."
QSTASH_CURRENT_SIGNING_KEY="sig_..."
QSTASH_NEXT_SIGNING_KEY="sig_..."

# Gmail (shared for system emails)
GMAIL_USER="jackdeanmail@gmail.com"
GMAIL_APP_PASSWORD="fhat cifw rgha gity"

# App URL
NEXT_PUBLIC_DOMAIN="https://spotless-scrubbers-api.vercel.app"

# ============================================================================
# TENANT-SPECIFIC KEYS (NOW IN DATABASE - can remove from .env.local)
# ============================================================================
# These are now stored in the `tenants` table:
# - OPENPHONE_API_KEY → tenants.openphone_api_key
# - VAPI_API_KEY → tenants.vapi_api_key
# - HOUSECALL_PRO_API_KEY → tenants.housecall_pro_api_key
# - STRIPE_SECRET_KEY → tenants.stripe_secret_key
# - etc.
```

**Update Vercel Environment Variables:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Keep only the universal variables listed above
3. Remove tenant-specific variables (they're now in Supabase)

---

## Step 4: Deploy to Vercel

```bash
git add -A
git commit -m "Add multi-tenant support"
git push
```

Vercel will auto-deploy. Wait for deployment to complete.

---

## Step 5: Configure Webhooks

Update webhook URLs in each external service to use the tenant slug pattern:

### VAPI Dashboard
1. Go to VAPI Dashboard → Assistants → Your Assistant → Webhook
2. Set URL to: `https://spotless-scrubbers-api.vercel.app/api/webhooks/vapi/winbros`

### HousecallPro
1. Go to HCP Dashboard → Settings → Integrations → Webhooks
2. Set URL to: `https://spotless-scrubbers-api.vercel.app/api/webhooks/housecall-pro/winbros`
3. Enable events: customer.created, job.created, job.updated, job.completed, job.cancelled, lead.created, lead.updated, invoice.paid

### Stripe Dashboard
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://spotless-scrubbers-api.vercel.app/api/webhooks/stripe/winbros`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`

### GoHighLevel
1. Go to GHL → Settings → Webhooks
2. Set URL to: `https://spotless-scrubbers-api.vercel.app/api/webhooks/ghl/winbros`

### OpenPhone
1. Go to OpenPhone → Settings → Integrations → Webhooks
2. Set URL to: `https://spotless-scrubbers-api.vercel.app/api/webhooks/openphone/winbros`

### Telegram Bot
1. Set webhook via API call:
```bash
curl "https://api.telegram.org/bot8586633109:AAFrM9VqeRH00hUwymOkxp93_Ql-CVxX2M4/setWebhook?url=https://spotless-scrubbers-api.vercel.app/api/webhooks/telegram/winbros"
```

---

## Step 6: Set Up QStash Schedules

After deployment, create the cron schedules:

```bash
curl -X POST "https://spotless-scrubbers-api.vercel.app/api/setup/qstash-schedules" \
  -H "Authorization: Bearer YOUR_QSTASH_TOKEN"
```

This creates:
- Post-cleaning follow-up: Every 15 minutes
- Monthly follow-up: Daily at 10am PST
- GHL follow-ups: Every 2 minutes
- Send reminders: Daily at 8am PST
- Unified daily: Daily at 7am PST
- Check timeouts: Every 5 minutes

---

## Step 7: Testing

### 7.1 Test Tenant Lookup

In Supabase SQL Editor:
```sql
SELECT * FROM get_tenant_by_slug('winbros');
```

### 7.2 Test Webhook (HousecallPro Lead)

1. Create a test lead in HousecallPro
2. Check Vercel logs for: `[OSIRIS] HCP Webhook received: lead.created`
3. Verify in Supabase: `SELECT * FROM leads WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'winbros');`

### 7.3 Test Lead Follow-up

After a lead is created:
1. Check QStash dashboard for scheduled follow-up messages
2. Verify SMS sent via OpenPhone logs
3. Check `system_events` table for log entries

### 7.4 Test Stripe Payment Flow

1. Create a test checkout session
2. Complete payment in Stripe test mode
3. Verify job created in `jobs` table
4. Verify cleaner assignment triggered

### 7.5 Test Telegram Cleaner Notifications

1. Create a job and trigger cleaner assignment
2. Check Telegram for notification with Accept/Decline buttons
3. Click Accept and verify customer SMS sent

---

## Adding New Tenants

### Quick Method (SQL)

1. Copy `scripts/add-tenant-template.sql`
2. Rename to `add-tenant-{clientname}.sql`
3. Fill in all `[PLACEHOLDER]` values
4. Run in Supabase SQL Editor

### Required Information for New Tenant

| Field | Where to Get It |
|-------|-----------------|
| slug | Choose a URL-safe name (lowercase, hyphens) |
| email | Client's login email |
| password | Choose initial password |
| openphone_api_key | OpenPhone Dashboard → Settings → API |
| openphone_phone_id | OpenPhone Dashboard → Phone numbers |
| vapi_api_key | VAPI Dashboard → API Keys |
| vapi_assistant_id | VAPI Dashboard → Assistants |
| stripe_secret_key | Stripe Dashboard → Developers → API Keys |
| stripe_webhook_secret | Stripe Dashboard → Webhooks → Signing secret |

### Configure Webhooks for New Tenant

After adding the tenant, configure webhooks in external services:
- Replace `{slug}` with the new tenant's slug in all webhook URLs

---

## Troubleshooting

### "Tenant not found" errors

1. Check the tenant exists and is active:
   ```sql
   SELECT * FROM tenants WHERE slug = 'winbros' AND active = TRUE;
   ```

2. Check webhook URL includes the correct slug

### Webhooks not triggering

1. Check Vercel logs for incoming requests
2. Verify webhook URL in external service dashboard
3. Check signature validation (temporarily disable in code to test)

### Lead follow-up not running

1. Check QStash dashboard for scheduled messages
2. Verify tenant has `lead_followup_enabled: true` in workflow_config
3. Check `leads` table has correct `followup_stage` and `next_followup_at`

### Cleaner not receiving Telegram notifications

1. Verify cleaner has `telegram_id` set in database
2. Verify tenant has `telegram_bot_token` set
3. Test bot manually: message it and check for /myid response

---

## Code Changes Summary

The multi-tenant refactor touches these files:

### New Files Created
- `scripts/multi-tenant-schema.sql` - Database schema
- `scripts/add-tenant-template.sql` - Template for new tenants
- `scripts/seed-winbros.sql` - WinBros initial data
- `lib/tenant.ts` - Tenant configuration module

### Files Needing Updates (TODO)
These files need to be updated to use tenant context instead of environment variables:

| File | Change Required |
|------|-----------------|
| `lib/openphone.ts` | Accept tenant param, use `tenant.openphone_api_key` |
| `lib/vapi.ts` | Accept tenant param, use `tenant.vapi_api_key` |
| `lib/housecall-pro.ts` | Accept tenant param, use `tenant.housecall_pro_api_key` |
| `lib/stripe.ts` | Accept tenant param, use `tenant.stripe_secret_key` |
| `lib/telegram.ts` | Accept tenant param, use `tenant.telegram_bot_token` |
| `app/api/webhooks/*/route.ts` | Extract tenant slug from URL, fetch tenant |
| `app/api/cron/*/route.ts` | Loop through all active tenants |

### Webhook Handler Pattern

Each webhook handler should follow this pattern:

```typescript
// app/api/webhooks/vapi/[tenantSlug]/route.ts

import { getTenantBySlug } from "@/lib/tenant"

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantSlug: string } }
) {
  // 1. Get tenant
  const tenant = await getTenantBySlug(params.tenantSlug)
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
  }

  // 2. Verify signature using tenant's secret
  // 3. Process webhook using tenant's API keys
  // 4. Store data with tenant_id
}
```

---

## Next Steps

1. **Run the migration** - This is the critical first step
2. **Seed WinBros** - Get your first tenant working
3. **Update webhooks** - Point external services to new URLs
4. **Test everything** - Go through the testing checklist
5. **Complete code updates** - Finish refactoring remaining files

Once WinBros is working, you can add new clients by:
1. Running their tenant seed script
2. Configuring their webhook URLs
3. Done!

---

## Support

If you encounter issues:
1. Check Vercel logs for errors
2. Check Supabase logs for database errors
3. Verify all API keys are correct in tenant record
4. Test webhooks manually with curl

---

*Last updated: January 2026*
