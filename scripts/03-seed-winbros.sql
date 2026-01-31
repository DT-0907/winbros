-- ============================================================================
-- SEED WINBROS TENANT
-- ============================================================================
-- Run this after 01-schema.sql to add WinBros as the first tenant.
-- Dashboard login: winbros / test
--
-- IMPORTANT: Replace all {{API_KEY}} placeholders with actual values before running!
-- ============================================================================

-- ============================================================================
-- INSERT WINBROS TENANT
-- ============================================================================

INSERT INTO tenants (
  -- Basic Info
  name,
  slug,
  email,
  password_hash,

  -- Business Info
  business_name,
  business_name_short,
  service_area,
  sdr_persona,

  -- OpenPhone
  openphone_api_key,
  openphone_phone_id,
  openphone_phone_number,

  -- VAPI
  vapi_api_key,
  vapi_assistant_id,
  vapi_phone_id,

  -- HousecallPro
  housecall_pro_api_key,
  housecall_pro_company_id,
  housecall_pro_webhook_secret,

  -- Stripe
  stripe_secret_key,
  stripe_webhook_secret,

  -- GoHighLevel
  ghl_location_id,
  ghl_webhook_secret,

  -- Telegram
  telegram_bot_token,
  owner_telegram_chat_id,

  -- Wave
  wave_api_token,
  wave_business_id,
  wave_income_account_id,

  -- Workflow Config
  workflow_config,

  -- Owner Contact
  owner_phone,
  owner_email,
  google_review_link

) VALUES (
  -- Basic Info
  'WinBros Cleaning',
  'winbros',
  'jaspergrenager@gmail.com',
  crypt('test', gen_salt('bf')),

  -- Business Info
  'WinBros Cleaning',
  'WinBros',
  'Los Angeles',
  'Mary',

  -- OpenPhone (get from OpenPhone Dashboard -> Settings -> API)
  '{{OPENPHONE_API_KEY}}',
  '{{OPENPHONE_PHONE_ID}}',
  '{{OPENPHONE_PHONE_NUMBER}}',

  -- VAPI (get from VAPI Dashboard -> API Keys)
  '{{VAPI_API_KEY}}',
  '{{VAPI_ASSISTANT_ID}}',
  '{{VAPI_PHONE_ID}}',

  -- HousecallPro (get from HCP Dashboard -> Integrations -> API)
  '{{HOUSECALL_PRO_API_KEY}}',
  '{{HOUSECALL_PRO_COMPANY_ID}}',
  '{{HOUSECALL_PRO_WEBHOOK_SECRET}}',

  -- Stripe (get from Stripe Dashboard -> Developers -> API Keys)
  '{{STRIPE_SECRET_KEY}}',
  '{{STRIPE_WEBHOOK_SECRET}}',

  -- GoHighLevel
  '{{GHL_LOCATION_ID}}',
  NULL,

  -- Telegram (get from BotFather)
  '{{TELEGRAM_BOT_TOKEN}}',
  '8521488394',  -- Owner chat ID (Delbert)

  -- Wave (get from Wave Dashboard -> Integrations)
  '{{WAVE_API_TOKEN}}',
  '{{WAVE_BUSINESS_ID}}',
  '{{WAVE_INCOME_ACCOUNT_ID}}',

  -- Workflow Config (WinBros uses HousecallPro + full automation)
  '{
    "use_housecall_pro": true,
    "use_vapi_inbound": true,
    "use_vapi_outbound": true,
    "use_ghl": true,
    "use_stripe": true,
    "use_wave": true,

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
  '+14242755847',
  'jaspergrenager@gmail.com',
  NULL
);

-- ============================================================================
-- CREATE DEFAULT USER FOR DASHBOARD LOGIN
-- ============================================================================
-- Login: username = winbros, password = test

INSERT INTO users (tenant_id, username, password_hash, display_name, email)
SELECT
  id,
  'winbros',
  crypt('test', gen_salt('bf')),
  'WinBros Admin',
  'jaspergrenager@gmail.com'
FROM tenants
WHERE slug = 'winbros';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT
  id,
  name,
  slug,
  email,
  business_name,
  service_area,
  owner_telegram_chat_id,
  (workflow_config->>'use_housecall_pro')::boolean as uses_hcp,
  (workflow_config->>'use_vapi_inbound')::boolean as uses_vapi,
  active
FROM tenants
WHERE slug = 'winbros';

-- ============================================================================
-- WEBHOOK URLS (Configure in external services)
-- ============================================================================
--
-- Production Domain: https://spotless-scrubbers-api.vercel.app
--
-- VAPI:
--   https://spotless-scrubbers-api.vercel.app/api/webhooks/vapi/winbros
--
-- HousecallPro:
--   https://spotless-scrubbers-api.vercel.app/api/webhooks/housecall-pro/winbros
--
-- Stripe:
--   https://spotless-scrubbers-api.vercel.app/api/webhooks/stripe/winbros
--
-- GoHighLevel:
--   https://spotless-scrubbers-api.vercel.app/api/webhooks/ghl/winbros
--
-- OpenPhone:
--   https://spotless-scrubbers-api.vercel.app/api/webhooks/openphone/winbros
--
-- Telegram Bot:
--   https://spotless-scrubbers-api.vercel.app/api/webhooks/telegram/winbros
--
-- ============================================================================
