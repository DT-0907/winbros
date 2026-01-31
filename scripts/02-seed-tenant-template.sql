-- ============================================================================
-- TENANT SEED TEMPLATE
-- ============================================================================
-- This is a TEMPLATE file - do not run directly!
-- Copy this file and replace all {{PLACEHOLDER}} values with actual data.
--
-- Example: cp 02-seed-tenant-template.sql 03-seed-newclient.sql
-- Then edit the new file with the client's information.
-- ============================================================================

-- ============================================================================
-- REQUIRED: Replace these placeholders before running
-- ============================================================================
-- {{TENANT_NAME}}         - Full business name (e.g., "ABC Cleaning Co")
-- {{TENANT_SLUG}}         - URL-safe slug (e.g., "abc-cleaning")
-- {{TENANT_EMAIL}}        - Login email for dashboard
-- {{TENANT_PASSWORD}}     - Plain text password (will be hashed)
-- {{BUSINESS_NAME}}       - Customer-facing business name
-- {{BUSINESS_SHORT}}      - Short name for SMS (e.g., "ABC")
-- {{SERVICE_AREA}}        - Service area (e.g., "San Diego")
-- {{SDR_PERSONA}}         - AI persona name (e.g., "Mary")
-- {{OWNER_PHONE}}         - Owner's phone number
-- {{OWNER_EMAIL}}         - Owner's email
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

  -- OpenPhone (optional - set to NULL if not used)
  openphone_api_key,
  openphone_phone_id,
  openphone_phone_number,

  -- VAPI (optional - set to NULL if not used)
  vapi_api_key,
  vapi_assistant_id,
  vapi_phone_id,

  -- HousecallPro (optional - set to NULL if not used)
  housecall_pro_api_key,
  housecall_pro_company_id,
  housecall_pro_webhook_secret,

  -- Stripe (optional - set to NULL if not used)
  stripe_secret_key,
  stripe_webhook_secret,

  -- GoHighLevel (optional - set to NULL if not used)
  ghl_location_id,
  ghl_webhook_secret,

  -- Telegram
  telegram_bot_token,
  owner_telegram_chat_id,

  -- Wave (optional - set to NULL if not used)
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
  '{{TENANT_NAME}}',
  '{{TENANT_SLUG}}',
  '{{TENANT_EMAIL}}',
  crypt('{{TENANT_PASSWORD}}', gen_salt('bf')),

  -- Business Info
  '{{BUSINESS_NAME}}',
  '{{BUSINESS_SHORT}}',
  '{{SERVICE_AREA}}',
  '{{SDR_PERSONA}}',

  -- OpenPhone
  NULL,  -- openphone_api_key
  NULL,  -- openphone_phone_id
  NULL,  -- openphone_phone_number

  -- VAPI
  NULL,  -- vapi_api_key
  NULL,  -- vapi_assistant_id
  NULL,  -- vapi_phone_id

  -- HousecallPro
  NULL,  -- housecall_pro_api_key
  NULL,  -- housecall_pro_company_id
  NULL,  -- housecall_pro_webhook_secret

  -- Stripe
  NULL,  -- stripe_secret_key
  NULL,  -- stripe_webhook_secret

  -- GoHighLevel
  NULL,  -- ghl_location_id
  NULL,  -- ghl_webhook_secret

  -- Telegram (use shared bot or tenant-specific)
  NULL,  -- telegram_bot_token - set from env or tenant-specific
  NULL,  -- owner_telegram_chat_id - set via /myid command

  -- Wave
  NULL,  -- wave_api_token
  NULL,  -- wave_business_id
  NULL,  -- wave_income_account_id

  -- Workflow Config (customize per tenant needs)
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
  '{{OWNER_PHONE}}',
  '{{OWNER_EMAIL}}',
  NULL  -- google_review_link - set when available
);

-- ============================================================================
-- CREATE DEFAULT USER FOR DASHBOARD LOGIN
-- ============================================================================

INSERT INTO users (tenant_id, username, password_hash, display_name, email)
SELECT
  id,
  '{{TENANT_SLUG}}',
  crypt('{{TENANT_PASSWORD}}', gen_salt('bf')),
  '{{TENANT_NAME}} Admin',
  '{{TENANT_EMAIL}}'
FROM tenants
WHERE slug = '{{TENANT_SLUG}}';

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
  active
FROM tenants
WHERE slug = '{{TENANT_SLUG}}';

-- ============================================================================
-- WEBHOOK URLS (Configure in external services)
-- ============================================================================
--
-- Base URL: https://your-domain.vercel.app
--
-- VAPI:
--   https://your-domain.vercel.app/api/webhooks/vapi/{{TENANT_SLUG}}
--
-- HousecallPro:
--   https://your-domain.vercel.app/api/webhooks/housecall-pro/{{TENANT_SLUG}}
--
-- Stripe:
--   https://your-domain.vercel.app/api/webhooks/stripe/{{TENANT_SLUG}}
--
-- GoHighLevel:
--   https://your-domain.vercel.app/api/webhooks/ghl/{{TENANT_SLUG}}
--
-- OpenPhone:
--   https://your-domain.vercel.app/api/webhooks/openphone/{{TENANT_SLUG}}
--
-- Telegram Bot:
--   https://your-domain.vercel.app/api/webhooks/telegram/{{TENANT_SLUG}}
--
-- ============================================================================
