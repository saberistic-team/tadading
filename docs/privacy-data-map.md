# Privacy data map

## Phase 0

| Data | Stored | Purpose | Retention |
|------|--------|---------|-----------|
| Brand/config env | Process env only | Runtime config | N/A |
| `schema_meta` rows | PostgreSQL | Migration/seed marker | Until deleted |
| Structured logs | stdout | Operations | Platform log retention |

No end-user accounts, emails, passkeys, payment data, or puzzle attempts are collected in Phase 0.

## Planned (later phases)

| Data | Notes |
|------|-------|
| Guest ID HMAC | Server stores hash only |
| WebAuthn credentials | Public key material + metadata |
| Recovery email | Optional, verified |
| Puzzle attempts | 90-day raw retention target |
| Stripe customer/subscription IDs | Billing projection |
| Audit log | Privileged actions |

Target audience 13+. No date-of-birth collection at launch. No third-party analytics scripts.
