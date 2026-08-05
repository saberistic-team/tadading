# Security

## Phase 0 posture

- Secrets only from environment / platform secret stores
- No puzzle, auth, or billing surfaces yet
- Dependency audit + gitleaks in CI (`security.yml`)
- Health endpoints expose dependency up/down status without credentials

## Upcoming controls (later phases)

- Passkeys (WebAuthn) with exact RP ID / origin checks
- Secure HttpOnly session cookies, CSRF for cookie mutations
- Redis-backed rate limits
- CSP, HSTS, strict CORS
- Stripe webhook signature verification
- Audit log for admin mutations
- Threat model covering credential theft, streak forgery, solution extraction, webhook replay

## Reporting

Security issues: open a private advisory or contact the repository maintainers. Do not file public issues for exploitable vulnerabilities.
