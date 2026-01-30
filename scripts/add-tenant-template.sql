-- ============================================================================
-- ADD NEW TENANT TEMPLATE
-- ============================================================================
-- Copy this file and fill in the values for each new client.
--
-- Instructions:
-- 1. Copy this file: cp add-tenant-template.sql add-tenant-clientname.sql
-- 2. Replace all [PLACEHOLDER] values with actual values
-- 3. Run in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: INSERT TENANT
-- ============================================================================

INSERT INTO tenants (
  -- REQUIRED: Basic identification
  name,                           -- [CHANGE] Full display name, e.g., "Sparkle Clean Services"
  slug,                           -- [CHANGE] URL-safe identifier, e.g., "sparkle-clean"
                                  --          Used in webhook URLs: /api/webhooks/vapi/sparkle-clean

  -- REQUIRED: Authentication (for dashboard login)
  email,                          -- [CHANGE] Login email for this tenant
  password_hash,                  -- [CHANGE] Generate with: SELECT crypt('password123', gen_salt('bf'));

  -- REQUIRED: Business info (used in customer messages)
  business_name,                  -- [CHANGE] Full name for formal messages
  business_name_short,            -- [CHANGE] Short name for SMS (character limits)
  service_area,                   -- [CHANGE] City/region they serve
  sdr_persona,                    -- [CHANGE] Name used in automated messages (default: "Mary")

  -- ========== API KEYS ==========
  -- Only fill in the ones this client uses. Leave others NULL.

  -- OpenPhone (REQUIRED for SMS)
  openphone_api_key,              -- [CHANGE] Get from: OpenPhone Dashboard > Settings > API
  openphone_phone_id,             -- [CHANGE] Phone ID, e.g., "PNxxxxxx"
  openphone_phone_number,         -- [CHANGE] Actual number for display, e.g., "+12135551234"

  -- VAPI (for AI voice calls)
  vapi_api_key,                   -- [CHANGE] Get from: VAPI Dashboard > API Keys
  vapi_assistant_id,              -- [CHANGE] Get from: VAPI Dashboard > Assistants
  vapi_phone_id,                  -- [CHANGE] Get from: VAPI Dashboard > Phone Numbers

  -- HousecallPro (if client uses it - otherwise leave NULL)
  housecall_pro_api_key,          -- [CHANGE OR NULL] Get from: HCP Dashboard > Settings > API
  housecall_pro_company_id,       -- [CHANGE OR NULL] Company ID from HCP
  housecall_pro_webhook_secret,   -- [CHANGE OR NULL] Generate or get from HCP webhook setup

  -- Stripe (for payments)
  stripe_secret_key,              -- [CHANGE] Get from: Stripe Dashboard > Developers > API Keys
  stripe_webhook_secret,          -- [CHANGE] Get from: Stripe Dashboard > Webhooks > Signing secret

  -- GoHighLevel (if client uses it - otherwise leave NULL)
  ghl_location_id,                -- [CHANGE OR NULL] Location ID from GHL
  ghl_webhook_secret,             -- [CHANGE OR NULL] Webhook secret from GHL

  -- Telegram (for cleaner notifications)
  -- Can use shared bot or client's own bot
  telegram_bot_token,             -- [CHANGE OR NULL] Bot token from @BotFather
  owner_telegram_chat_id,         -- [CHANGE OR NULL] Owner's chat ID (message bot with /myid)

  -- Wave Invoicing (if client uses it)
  wave_api_token,                 -- [CHANGE OR NULL] Get from Wave
  wave_business_id,               -- [CHANGE OR NULL] Business ID from Wave
  wave_income_account_id,         -- [CHANGE OR NULL] Account ID from Wave

  -- ========== WORKFLOW CONFIGURATION ==========
  workflow_config,

  -- ========== OWNER CONTACT ==========
  owner_phone,                    -- [CHANGE] Owner's phone for SMS escalations
  owner_email,                    -- [CHANGE] Owner's email
  google_review_link              -- [CHANGE] Google review URL for post-cleaning messages

) VALUES (
  -- Basic Info
  '[CLIENT_NAME]',                -- name: e.g., "Sparkle Clean Services"
  '[client-slug]',                -- slug: e.g., "sparkle-clean" (lowercase, hyphens only)

  -- Authentication
  '[client@email.com]',           -- email: login email
  crypt('[password]', gen_salt('bf')),  -- password_hash: change [password]

  -- Business Info
  '[Client Business Name]',       -- business_name
  '[ClientShort]',                -- business_name_short
  '[City Name]',                  -- service_area
  'Mary',                         -- sdr_persona (or change to client preference)

  -- OpenPhone
  '[openphone_api_key_here]',
  '[PNxxxxxx]',
  '[+1xxxxxxxxxx]',

  -- VAPI
  '[vapi_api_key_here]',
  '[vapi_assistant_id_here]',
  '[vapi_phone_id_here]',

  -- HousecallPro (NULL if not used)
  NULL,                           -- housecall_pro_api_key
  NULL,                           -- housecall_pro_company_id
  NULL,                           -- housecall_pro_webhook_secret

  -- Stripe
  '[sk_live_xxxxxx]',
  '[whsec_xxxxxx]',

  -- GoHighLevel (NULL if not used)
  NULL,                           -- ghl_location_id
  NULL,                           -- ghl_webhook_secret

  -- Telegram
  '[telegram_bot_token]',         -- Can be same as other tenants if using shared bot
  '[chat_id]',

  -- Wave (NULL if not used)
  NULL,
  NULL,
  NULL,

  -- Workflow Config - CUSTOMIZE THIS FOR THE CLIENT
  '{
    "use_housecall_pro": false,
    "use_vapi_inbound": true,
    "use_vapi_outbound": true,
    "use_ghl": false,
    "use_stripe": true,
    "use_wave": false,

    "lead_followup_enabled": true,
    "lead_followup_stages": 5,
    "skip_calls_for_sms_leads": true,
    "followup_delays_minutes": [0, 10, 15, 20, 30],

    "post_cleaning_followup_enabled": true,
    "post_cleaning_delay_hours": 2,

    "monthly_followup_enabled": true,
    "monthly_followup_days": 30,
    "monthly_followup_discount": "15%",

    "cleaner_assignment_auto": true,
    "require_deposit": true,
    "deposit_percentage": 50
  }'::jsonb,

  -- Owner Contact
  '[+1xxxxxxxxxx]',               -- owner_phone
  '[owner@email.com]',            -- owner_email
  '[https://g.page/r/xxxxx/review]'  -- google_review_link
);

-- ============================================================================
-- STEP 2: ADD CLEANERS (repeat for each cleaner)
-- ============================================================================

-- Get the tenant ID we just created
DO $$
DECLARE
  v_tenant_id UUID;
BEGIN
  SELECT id INTO v_tenant_id FROM tenants WHERE slug = '[client-slug]';

  -- Add first cleaner
  INSERT INTO cleaners (tenant_id, name, phone, email, telegram_id, home_address, home_lat, home_lng, max_jobs_per_day)
  VALUES (
    v_tenant_id,
    '[Cleaner Name]',             -- [CHANGE] Cleaner's full name
    '[+1xxxxxxxxxx]',             -- [CHANGE] Cleaner's phone
    '[cleaner@email.com]',        -- [CHANGE] Cleaner's email (optional)
    '[telegram_user_id]',         -- [CHANGE] Cleaner's Telegram ID (for notifications)
    '[123 Main St, City, ST]',    -- [CHANGE] Home address for VRP routing
    34.0522,                      -- [CHANGE] Home latitude
    -118.2437,                    -- [CHANGE] Home longitude
    3                             -- [CHANGE] Max jobs per day
  );

  -- Add more cleaners as needed...
  -- INSERT INTO cleaners (tenant_id, name, phone, ...) VALUES (v_tenant_id, ...);

END $$;

-- ============================================================================
-- STEP 3: SET UP WEBHOOKS
-- ============================================================================
-- After creating the tenant, configure these webhook URLs in external services:
--
-- VAPI Webhook:
--   https://your-domain.vercel.app/api/webhooks/vapi/[client-slug]
--
-- HousecallPro Webhook (if used):
--   https://your-domain.vercel.app/api/webhooks/housecall-pro/[client-slug]
--
-- Stripe Webhook:
--   https://your-domain.vercel.app/api/webhooks/stripe/[client-slug]
--
-- GoHighLevel Webhook (if used):
--   https://your-domain.vercel.app/api/webhooks/ghl/[client-slug]
--
-- OpenPhone Webhook:
--   https://your-domain.vercel.app/api/webhooks/openphone/[client-slug]
--
-- ============================================================================

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Run this to verify the tenant was created:
SELECT id, name, slug, email, active FROM tenants WHERE slug = '[client-slug]';

-- Run this to verify cleaners were added:
SELECT c.name, c.phone, c.home_address
FROM cleaners c
JOIN tenants t ON c.tenant_id = t.id
WHERE t.slug = '[client-slug]';
