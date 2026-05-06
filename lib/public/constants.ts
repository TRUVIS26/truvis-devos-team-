/**
 * Fields that must NEVER appear in a public API response or client-side
 * data structure. Every `toPublic<Model>` helper and the QA
 * `assertNoForbiddenFields` check reads from this set.
 *
 * Replace these placeholders with your project's actual internal-only fields
 * (hashed passwords, internal flags, raw PII before sanitisation, etc.).
 */
export const FORBIDDEN_FIELD_SET = new Set<string>([
  // Auth internals
  'password_hash',
  'hashed_password',
  'reset_token',
  'email_verification_token',
  'mfa_secret',

  // Internal flags / metadata
  'internal_notes',
  'risk_score',
  'fraud_flag',
  'admin_override',

  // Raw PII (use sanitised / masked versions in public responses)
  'raw_ssn',
  'raw_tax_id',
  'full_dob',

  // Service keys / secrets
  'stripe_customer_id',    // use masked alias instead
  'supabase_uid',          // expose app-level user_id only

  // Add your project-specific forbidden fields below:
])
