# Executive decision

## Business: **TadaDing**

**Target domain:** `tadading.com`
**Tagline:** **Your daily tiny win.**
**One-line pitch:** **Swap eight cheerful tiles until every neighbor fits. Close the ring, hear the ding, keep the streak.**

**TadaDing** is a language-light daily visual puzzle that takes roughly one to three minutes. The player taps two tiles to swap them. Every neighboring pair in the completed ring must share exactly one characteristic—such as shape, color, fill, or symbol count. Correct connections glow as the player works. Completing the ring produces a satisfying animation, subtle vibration, and signature “ta-da-ding” sound.

It has:

* No retailer, banking, inbox, calendar, social-media, AI-model, content-provider, or marketplace integrations.
* No user-generated content or moderation.
* No manual daily content creation.
* Almost no data entry.
* No signup before playing.
* Procedurally generated, solver-verified puzzles.
* A simple recurring subscription.
* A product that can be demonstrated and understood in seconds.

## Domain-status qualification

As of **August 4, 2026**, exact-match web searches for `tadading.com` and “TadaDing” did not surface an active product website or obvious software/game business. The most notable exact-name collision found was a personal Instagram handle, so the social identity may need to be `playtadading` rather than `tadading`. ([Instagram][1])

I could not complete a registrar checkout from this environment, so I will not misrepresent the domain as guaranteed available. It **appears to be an immediately registrable candidate**, but availability must be confirmed and purchased before development begins. ICANN provides the authoritative registration-data lookup, and live domain tools query registry data because availability can change between search and checkout. ([ICANN Lookup][2])

Use environment-driven branding so a last-minute domain change does not require code changes:

```env
BRAND_NAME=TadaDing
PUBLIC_DOMAIN=tadading.com
SOCIAL_HANDLE=playtadading
```

A domain search is also not trademark clearance. Before spending materially on promotion, run a proper USPTO and common-law trademark search for games, downloadable software, entertainment services, and subscription services.

---

# 1. The online business

## The product

**TadaDing is a three-minute visual puzzle ritual.**

Each puzzle contains eight distinctive tiles arranged around a ring. A tile has four attributes:

1. Shape: circle, triangle, square, star.
2. Color: represented visually and redundantly with an icon or pattern.
3. Fill: solid or striped.
4. Count: one or two interior marks.

Two neighboring tiles are compatible only when they share **exactly one** attribute.

The player rearranges the tiles until:

* All eight neighboring relationships are valid.
* The last tile also fits the first tile, closing the ring.
* The final configuration is accepted under rotation or reflection.
* The server confirms the submitted configuration without exposing the solution.

### Why this interaction is satisfying

Every move gives immediate feedback:

* A correct edge snaps together and glows.
* The ring progressively becomes more complete.
* The final connection closes the visual loop.
* A short custom sound plays.
* A small celebratory animation runs.
* The player gets a streak and spoiler-free share card.

The emotional promise is not “become smarter.” It is:

> **Give yourself one small, complete win today.**

That is safer, more understandable, and easier to market than making cognitive or medical claims.

---

# 2. Why this fits the constraints

| Requirement                | TadaDing response                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Broad audience             | Visual and language-light; no specialized knowledge required                                  |
| Daily use                  | One globally shared puzzle every day                                                          |
| Fun                        | Tactile swaps, visible progress, satisfying ring closure                                      |
| Minimal data entry         | Tap, swap, solve; no journaling, forms, imports, or onboarding questionnaire                  |
| Distinguishable            | Exactly-one-attribute ring mechanic and recognizable completion ritual                        |
| Simple implementation      | Small pure TypeScript generator and solver, one gameplay screen                               |
| Self-sufficient            | Puzzles generated and validated internally                                                    |
| Low support                | No UGC, marketplace, external content, account passwords, or complex configurations           |
| One-person operation       | Procedural content, automated publishing, Stripe self-service billing                         |
| Scalable                   | The same daily puzzle can be cached and served to every player                                |
| Easy to sell to customers  | The product can be understood after watching one swap                                         |
| Easy to sell as a business | One domain, one repository, recurring revenue, low content costs, transferable infrastructure |
| Online only                | Responsive PWA; no inventory, shipping, appointments, or offline fulfillment                  |

## What makes it different

It should not be positioned as “another puzzle website.”

The category distinction is:

> **A visual daily completion ritual, not a collection of traditional word and number games.**

Its differentiation comes from five decisions:

1. **One visual rule.** No dictionary, trivia, arithmetic, or cultural knowledge.
2. **One short ritual.** No endless feed on the main screen.
3. **One satisfying finish.** The ring visibly closes and produces the branded ding.
4. **One shared daily challenge.** Everyone receives the same standard puzzle.
5. **One self-contained engine.** No licensed puzzle feeds or editorial team.

The launch mechanic does resemble the general family of attribute-matching games such as Qwirkle and Set, but the ring arrangement, exact-one-attribute adjacency rule, daily generated format, interaction design, and scoring presentation form the product’s own implementation. This is a preliminary product distinction, not a patent or intellectual-property opinion.

---

# 3. Market and spending validation

The latest completed Census estimate puts the U.S. population at **341,784,857** on July 1, 2025. Census age tables estimate **72,021,348** people under 18, leaving approximately **269.8 million adults**. Pew reports that **91% of U.S. adults owned a smartphone in 2025**, suggesting roughly **245.5 million U.S. adult smartphone owners** as the broad device-accessible audience. That is an access ceiling, not a claim that all of them are prospective buyers. ([Census.gov][3])

The proposed price is supported by the current consumer-subscription market:

* Puzzmo currently lists its U.S. subscription at **$3.99 monthly** and **$39.99 annually**. ([App Store][4])
* RevenueCat’s 2026 benchmark places gaming’s median at approximately **$4.99 monthly and $24.99 annually**. It reports **$9.99 monthly and $39.99 annually** as North American cross-category anchors. ([RevenueCat][5])

## Recommended launch pricing

### Free

* Today’s standard puzzle.
* Anonymous play.
* Local streak.
* One hint.
* Spoiler-free sharing.
* No advertising.

### TadaDing Member

**$5.99/month or $29.99/year**

Includes:

* Full puzzle archive.
* Unlimited generated practice puzzles.
* Easy, standard, and tricky difficulty.
* Alternate visual themes.
* Synced streaks and statistics.
* Additional hints.
* Member completion effects.
* Access across devices through passkeys.

The free daily puzzle acts as the trial. Do not add a billing trial at launch. Let people experience the core value before showing a payment decision.

## Scale illustrations

These are arithmetic scenarios, not forecasts, and exclude payment fees, refunds, taxes, hosting, and acquisition costs.

| Paid members | Approximate share of U.S. adult smartphone base | Gross annualized revenue at $5.99/month |
| -----------: | ----------------------------------------------: | --------------------------------------: |
|        1,000 |                                         0.0004% |                                 $71,880 |
|       10,000 |                                         0.0041% |                                $718,800 |
|       50,000 |                                         0.0204% |                              $3,594,000 |

This demonstrates that the business does not need mass-market penetration to become meaningful. It still needs distribution and retention; a large reachable population does not make acquisition easy.

---

# 4. Lessons from recent unicorns

These examples show useful patterns. They do **not** imply that a small puzzle business is likely to reach a billion-dollar valuation.

## Flo Health: repeated utility can support subscriptions

When Flo announced its unicorn investment in July 2024, it reported nearly **70 million monthly active users and close to five million paid subscribers**. The applicable lesson is that a recurring consumer behavior, a valuable free experience, and premium continuity can support a large subscription base. TadaDing applies the behavioral structure—not Flo’s healthcare complexity or data model. ([Flo][6])

## Speak: active participation beats passive consumption

Speak raised its Series C at a **$1 billion valuation** in December 2024. It reported that users had spoken over one billion sentences that year and received more than 25 million personalized lessons. Its relevant pattern is a focused action-feedback loop: perform one action, receive immediate feedback, and return to improve. TadaDing should similarly make the player act immediately rather than read instructions or configure an account. ([Speak][7])

## Lovable: shorten the time between intent and value

Lovable announced a **$200 million Series A at a $1.8 billion valuation**, eight months after launch, in July 2025. Its applicable lesson is clarity and speed: a user understands the promise and reaches an outcome quickly. For TadaDing, the first playable tile must appear within seconds, before signup, payment, email collection, or feature explanation. ([Lovable][8])

The combined principle is:

> **One recognizable job, one fast action loop, and a reason to return.**

---

# 5. Product and UX specification

## Main user journey

### Page 1: Landing

Primary message:

> **Your daily tiny win is ready.**

Primary CTA:

> **Play today’s TadaDing**

Do not put pricing, login, feature comparisons, testimonials, navigation menus, or newsletter fields above this CTA.

### Page 2: Interactive tutorial

Show three tiles and demonstrate:

> Neighbors must share exactly one thing.

The tutorial asks the user to make one correct swap.

Primary CTA:

> **Start today’s ring**

The tutorial is saved locally and never shown automatically again.

### Page 3: Puzzle

The puzzle fills most of the viewport.

Visible elements:

* Eight ring positions.
* Tile tray or shuffled ring.
* Correct-edge indicators.
* Move count.
* Quiet timer, hidden by default.
* Hint affordance.
* Undo.
* Small rules/help button.

The primary action is the puzzle itself; there should not be a competing button.

### Page 4: Completion

Show:

* Completion animation.
* “Ta-da-ding!”
* Time and moves.
* Current streak.
* A spoiler-free result pattern.

For a guest, the primary CTA is:

> **Save my streak**

For a registered free user:

> **Unlock the archive**

For a member:

> **Share the ding**

### Page 5: Passkey registration

Use a passkey after the user has already received value.

Primary CTA:

> **Save with a passkey**

Do not ask for an email first.

### Page 6: Recovery email

After the passkey has been created:

> **Add an email so you can recover your account and receive tomorrow’s reminder.**

Primary CTA:

> **Add recovery email**

Provide a secondary textual “Not now,” but only one styled CTA.

### Page 7: Membership

Show free versus member value in a compact comparison.

Primary CTA:

> **Unlock every TadaDing**

Show monthly and annual prices with equal clarity. Do not use fake countdowns, preselected hidden upsells, or confusing cancellation language.

---

## Visual and interaction principles

* Mobile-first and usable with one thumb.
* Minimum 44×44 pixel interaction targets.
* No horizontal scrolling.
* No essential information communicated only through color.
* Shape, pattern, count, and outline reinforce compatibility.
* Full keyboard play on desktop.
* Screen-reader labels such as “striped blue triangle with two dots.”
* Reduced-motion support.
* Sound disabled until the user explicitly enables it or completes an interaction.
* Custom completion tone generated with the Web Audio API, avoiding licensed media.
* Light and dark themes.
* No ad slots.
* No infinite-scroll feed.
* No more than one prominent CTA per page.

---

## Puzzle-generation rules

The pure puzzle engine must:

1. Define a finite universe of tile attribute combinations.
2. Use a deterministic seeded PRNG.
3. Construct a compatibility graph where an edge exists only when two tiles share exactly one attribute.
4. Select eight distinct tiles capable of forming a Hamiltonian cycle.
5. Use backtracking to enumerate valid circular arrangements.
6. Canonicalize rotations and reflections.
7. Reject puzzles that have zero or more than one canonical solution.
8. Calculate difficulty from branching factor, false-positive edges, and solver backtracking.
9. Shuffle the initial arrangement.
10. Store only the player-facing tile data and a server-side solution hash.
11. accept any valid rotation or reflection of the canonical solution.
12. Record a generator version so previously published puzzles remain reproducible.

The launch should always have at least 30 future puzzles pre-generated. Publishing must never depend on generating a valid puzzle at midnight.

---

# 6. Technical architecture

## Architectural decision

Use a **modular monolith with three application deployables**:

1. `web` — Next.js responsive PWA, including the customer UI and admin UI.
2. `api` — NestJS HTTP API.
3. `worker` — NestJS standalone worker hosting BullMQ processors and Temporal workers.

Do not create a microservice per domain. Event-driven architecture does not require network boundaries between every module.

### Why this is the right compromise

* The puzzle request path stays simple and fast.
* The game engine remains a pure package.
* Long-running or retryable work is asynchronous.
* The application can scale web, API, and worker processes independently.
* One person can still understand, test, and deploy it.
* A future buyer receives a clean system rather than a distributed-system demonstration project.

Render supports Docker-based services, monorepo root directories, Blueprint configuration, and build filters, which fits this deployment arrangement. ([Render][9])

## Self-hosting boundary

“All self-hosted” should mean:

* Puzzle generation, content, user data, authentication, authorization, queues, workflows, analytics, and observability are first-party.
* Every core service has an open-source Docker Compose equivalent.
* No proprietary authentication, analytics, CMS, feature-flag, content, or puzzle-generation service is required.

The unavoidable external utilities are:

* Domain registrar and DNS.
* Render compute and storage.
* Stripe for card processing.
* A transactional SMTP relay for reliable email delivery.

Running a public mail server yourself would conflict with the goal of low maintenance. Stripe is necessary to avoid storing card information.

Provide two infrastructure profiles:

### Strict self-hosted profile

Containerized PostgreSQL, Redis, Temporal, OpenTelemetry Collector, Prometheus, and Grafana, each deployed as a Render private service with persistent storage where applicable.

### Recommended one-person production profile

Render-managed PostgreSQL and Key Value, with application code, Temporal workers, OTEL, Prometheus, and Grafana remaining first-party. The local Docker Compose environment remains completely portable.

The strict profile meets the stated requirement but is single-operator infrastructure and must be documented as non-HA until backup, restore, replication, and failover are tested. Temporal’s own documentation distinguishes its local development server from a sustained production deployment and provides separate self-hosting guidance. ([Temporal Docs][10])

## Event responsibilities

### Synchronous operations

Keep these synchronous:

* Fetch today’s puzzle.
* Start attempt.
* Save current arrangement.
* Validate completion.
* Read streak and entitlement.
* Generate Checkout or Customer Portal redirect.

### Transactional outbox

Every state-changing command writes:

1. Its business-state changes.
2. A versioned domain event in `outbox_events`.

Both happen in one PostgreSQL transaction.

A dispatcher reads unprocessed outbox rows, publishes the appropriate job or Temporal signal, and marks the event dispatched. Consumers use an inbox/idempotency table.

### BullMQ

Use Redis and BullMQ for short, retryable work:

* Send email.
* Aggregate daily metrics.
* Generate share metadata.
* Dispatch outbox events.
* Process non-durable notifications.

### Temporal

Use Temporal only where durable time and state matter:

* Generate and schedule future daily puzzles.
* Publish the next puzzle at the configured release time.
* Preserve a fallback puzzle when generation fails.
* Manage subscription payment-grace periods.
* Orchestrate account deletion and anonymization.
* Schedule optional daily reminder notifications.

Do not put puzzle completion or ordinary API requests behind a Temporal workflow.

---

# 7. Passkey and account design

Passkeys are well suited to this product because they are phishing-resistant and unique per relying party. Use a maintained TypeScript WebAuthn implementation such as SimpleWebAuthn. ([SimpleWebAuthn][11])

## Registration flow

1. A guest completes a puzzle.
2. The user chooses “Save my streak.”
3. The API generates registration options and a short-lived challenge.
4. The browser creates a discoverable credential.
5. The API verifies the response and stores the public credential.
6. Guest attempts and streak are claimed into the new account.
7. The user is prompted to add an email.
8. The email is verified with a hashed, single-use token.

## Authentication flow

* Use discoverable credentials.
* Do not ask for an email before invoking passkey authentication.
* Create a short-lived, rotating, HttpOnly session cookie after verification.
* Track credential counters and backup state where supplied.
* Allow a user to register multiple passkeys.

## Recovery semantics

A passkey cannot literally be reset because its private key is not stored by the server.

“Reset passkey” in customer-facing language should perform this flow:

1. Verify access to the confirmed recovery email.
2. Create a restricted recovery session.
3. Require the user to register a new passkey.
4. Let the user inspect and revoke old credentials.
5. Invalidate existing sessions when requested.
6. Record the recovery in the audit log.

Do not allow email recovery to become a reusable passwordless email-login system. The recovery session should only authorize passkey management.

---

# 8. Stripe design

Use Stripe-hosted Checkout and Stripe’s hosted Customer Portal. Stripe supports fixed-price subscriptions through Checkout, while its portal allows customers to update payment details, see invoices, and cancel without contacting support. ([Stripe Docs][12])

Important rules:

* Never grant membership from the success redirect alone.
* Verify the `Stripe-Signature` against the raw request body.
* Store every Stripe event ID and process it idempotently.
* Derive entitlements from webhook-confirmed subscription state.
* Provide a short grace period for temporary payment failures.
* Limit one active subscription per user.
* Redirect existing subscribers to the Customer Portal.
* Keep Stripe price IDs in environment variables.
* Keep business entitlement logic in the application, not scattered through controllers.

Stripe requires the unmodified raw body for webhook signature verification. ([Stripe Docs][13])

Process at least:

* `checkout.session.completed`
* `customer.subscription.created`
* `customer.subscription.updated`
* `customer.subscription.deleted`
* `invoice.paid`
* `invoice.payment_failed`
* `charge.refunded`
* Relevant dispute events

---

# 9. Implementation phases

A single day can produce a **public, paid beta**, not a fully hardened high-availability business. The requested stack should be implemented thinly and deliberately rather than pretending every component is production-mature.

## One-day founder sprint

| Phase                     |   Timebox | Merge outcome                                  | Deployment gate                                 |
| ------------------------- | --------: | ---------------------------------------------- | ----------------------------------------------- |
| 0. Foundation             | 60–90 min | Monorepo, CI, Docker, Render hello world       | Health endpoints live                           |
| 1. Playable product       |  2.5–3 hr | Generator, solver, guest puzzle UI             | Today’s puzzle playable publicly                |
| 2. Persistence and streak |    1.5 hr | Attempts, completion, outbox, local streak     | Complete/reload behavior verified               |
| 3. Passkeys and email     |      2 hr | Registration, login, recovery email            | Passkey E2E passes on production origin         |
| 4. Subscription           |  1.5–2 hr | Checkout, webhooks, entitlements, archive      | Stripe test purchase unlocks archive            |
| 5. Operations             |      2 hr | Admin, worker, Temporal, metrics, dashboards   | Future puzzle publication and fallback verified |
| 6. Launch hardening       |  1–1.5 hr | Accessibility, security, smoke tests, runbooks | Production checklist completed                  |

## Phase 0 — Foundation

Deliver:

* pnpm/Turborepo monorepo.
* Next.js web app.
* NestJS API and worker.
* Shared configuration validation with Zod.
* PostgreSQL and Redis connectivity.
* Docker Compose.
* Render Blueprint.
* GitHub Actions.
* `/health/live` and `/health/ready`.
* First production deployment.
* Domain-independent branding configuration.

Acceptance gate:

* Fresh clone works from documented commands.
* CI passes.
* Production health endpoint returns ready.
* No puzzle code has been written before domain ownership is confirmed.

## Phase 1 — Playable guest experience

Deliver:

* Pure puzzle engine.
* Deterministic PRNG.
* Solver and canonicalization.
* Property-based tests.
* Today-puzzle endpoint.
* Responsive ring interface.
* Tutorial.
* Completion animation and sound.
* Guest ID stored locally and hashed server-side.
* Static fallback puzzle.

Acceptance gate:

* At least 1,000 generated test seeds have exactly one canonical solution.
* No solution is sent to the browser.
* A guest can finish the public puzzle without creating an account.
* Mobile, tablet, and desktop Playwright flows pass.

## Phase 2 — Attempts, streaks, and events

Deliver:

* Attempt start, save, and completion APIs.
* Server-side completion validation.
* Move and duration metrics.
* Streak calculation.
* Transactional outbox.
* BullMQ dispatcher.
* Spoiler-free share result.
* Offline-safe local board state.

Acceptance gate:

* Duplicate completion requests are idempotent.
* Refreshing does not lose the board.
* Guest can complete once and retain the local streak.
* Event records and trace IDs are visible.

## Phase 3 — Passkeys and recovery email

Deliver:

* Passkey registration and authentication.
* Discoverable credentials.
* Secure session cookies.
* Guest-to-user claim transaction.
* Email collection after registration.
* Verification and passkey-recovery flow.
* Credential list and revocation.
* Mailpit locally and SMTP abstraction in production.

Acceptance gate:

* Playwright Chromium virtual authenticator test passes.
* A guest’s completion is preserved after registering.
* Email is never required before first play.
* A recovered account must register a new passkey.
* Revoked credentials cannot authenticate.

## Phase 4 — Subscription

Deliver:

* Free/member entitlements.
* Monthly and annual Stripe Checkout.
* Raw-body webhook endpoint.
* Idempotent Stripe event processing.
* Customer Portal.
* Archive and practice-mode access.
* Payment-failure grace policy.
* Billing section in account settings.

Acceptance gate:

* Test-mode Checkout activates membership only through webhook processing.
* Duplicate events create no duplicate entitlement.
* Canceling through the portal updates access correctly.
* A free user cannot access a member archive response by calling the API directly.

## Phase 5 — Automated operations

Deliver:

* Temporal daily puzzle workflow.
* Thirty-day puzzle inventory.
* Publish/fallback logic.
* Admin dashboard.
* Puzzle preview and retirement.
* Daily metric aggregates.
* OTEL traces.
* Prometheus metrics.
* Grafana dashboards.
* Queue and workflow monitoring.
* Audit log.

Acceptance gate:

* Admin can preview tomorrow’s puzzle.
* Forced generation failure publishes a verified fallback.
* No administrative action is unaudited.
* A stuck outbox, failed queue job, or workflow error is visible.

## Phase 6 — Launch hardening

Deliver:

* Accessibility review.
* Keyboard play.
* Reduced motion.
* Rate limits.
* CSP and security headers.
* CSRF protection where applicable.
* Backup and restore documentation.
* OpenAPI contract snapshot.
* Production smoke suite.
* Privacy, terms, billing, and support pages.
* Incident runbooks.

Acceptance gate:

* Unit, integration, E2E, accessibility, and smoke tests pass.
* OpenAPI JSON is generated in CI.
* A rollback procedure has been performed at least once.
* No placeholder copy, test secret, fake testimonial, or unfinished CTA remains.

---

# 10. Detailed Cursor master prompt

Paste the following into Cursor after confirming and purchasing the domain.

```text
# ROLE

You are the founding principal engineer, product designer, security engineer,
SRE, and technical product manager for a bootstrapped consumer subscription
business.

Build a small, complete, maintainable production application called TadaDing.

You are not creating a prototype with fake buttons, pseudocode, TODO-only
modules, or disconnected infrastructure. Produce working code, migrations,
tests, local infrastructure, CI, deployment configuration, documentation, and
operational runbooks.

Do not ask broad architectural questions. Make the conservative assumption that
keeps the product small and explain important assumptions in ADRs.

Work one phase at a time. Begin with Phase 0 only. At the end of every phase,
stop and provide:

1. Summary of the increment.
2. Files created or changed.
3. Important architectural decisions.
4. Database migrations.
5. Commands executed.
6. Unit, integration, and E2E test results.
7. Security and privacy considerations.
8. Remaining risks and explicitly deferred work.
9. Suggested PR title.
10. Complete PR body.
11. Render deployment checklist.
12. Post-deployment smoke-test checklist.
13. Rollback instructions.

Do not begin the next phase until told to continue.

# BUSINESS

Brand name: TadaDing
Target domain: supplied through PUBLIC_DOMAIN; expected value is tadading.com
Tagline: Your daily tiny win.
Product promise:
"Swap eight cheerful tiles until every neighbor fits. Close the ring, hear the
ding, keep the streak."

TadaDing is a language-light daily visual puzzle. It should be understandable
within seconds, playable anonymously, and completable in roughly one to three
minutes.

The business is web-only and subscription-supported.

Free:
- Today's standard puzzle.
- Anonymous play.
- Local streak.
- One hint.
- Spoiler-free sharing.
- No advertising.

Member:
- $5.99 monthly or $29.99 annually, represented by Stripe price IDs.
- Full archive.
- Unlimited generated practice puzzles.
- Easy, standard, and tricky difficulty.
- Themes.
- Synced streak and statistics.
- Additional hints.

Do not implement advertising, data brokerage, user-generated content, chat,
comments, leaderboards, direct messages, AI APIs, content feeds, retailer APIs,
bank connections, inbox access, calendar access, social-network APIs, or
marketplace integrations.

The only external utilities are:
- Render infrastructure.
- Stripe Checkout and Customer Portal.
- A transactional SMTP relay.
- Domain registrar and DNS.

All product logic, puzzle content, auth, authorization, data, jobs, workflows,
analytics, and observability must be first-party and locally reproducible.

# PRODUCT PRINCIPLES

1. A visitor must be able to play before registering.
2. First meaningful interaction in under five seconds on a normal connection.
3. One prominent CTA per page.
4. Do not ask for email before the first completed puzzle.
5. Passkey registration is offered only after value has been demonstrated.
6. Collect a recovery/notification email after passkey registration.
7. Never use dark patterns.
8. Never put the free daily puzzle behind a paywall.
9. No ads.
10. No medical, intelligence, memory-improvement, or cognitive-health claims.
11. Target age 13+ at launch and do not collect date of birth.
12. Minimize PII: email and WebAuthn public credential data only.
13. Accessibility is part of the definition of done, not a future feature.
14. The UI must work on mobile, tablet, and desktop.
15. The game must not depend on color alone.

# CORE PUZZLE

A launch puzzle contains eight distinct tiles arranged into a circular ring.

Each tile has:
- shape: circle | triangle | square | star
- color token: one of four semantic palette tokens
- fill: solid | striped
- count: one | two

A pair of neighboring tiles is compatible only when they share exactly one
attribute.

Examples:
- Same shape, different color/fill/count: compatible.
- Same shape and same fill: incompatible because they share two attributes.
- No shared attributes: incompatible.

The completed ring must satisfy every adjacent pair, including the final tile
against the first tile.

Player actions:
- Tap one tile and then another to swap them.
- Drag-and-drop may be supported as progressive enhancement.
- Undo the last move.
- Request a hint.
- Reset the board.
- Use keyboard controls on desktop.

Feedback:
- Correct adjacency gets a visible non-color-only indicator.
- Incorrect adjacency remains neutral; do not aggressively flash errors.
- Closing the full ring produces the branded "ta-da-ding" animation.
- Use Web Audio API to synthesize a short original completion sound.
- Use vibration only as progressive enhancement.
- Respect reduced motion and sound preference.

# PUZZLE ENGINE

Create a framework-independent, side-effect-free TypeScript package.

Required functions include logically equivalent operations to:

- sharedAttributeCount(a, b)
- areCompatible(a, b)
- canonicalizeRing(tileIds)
- solveRing(tiles)
- countCanonicalSolutions(tiles, limit)
- generatePuzzle(seed, constraints)
- scoreDifficulty(puzzle)
- validateSubmittedRing(puzzle, submittedTileIds)
- serializePublicPuzzle(puzzle)

Generator requirements:

1. Use a deterministic seeded PRNG. Do not use Math.random in domain code.
2. Build or reason over a compatibility graph.
3. Select eight distinct tiles that admit a circular solution.
4. Enumerate solutions with bounded backtracking.
5. Treat rotations and reflections as equivalent.
6. Reject a puzzle unless it has exactly one canonical solution.
7. Reject trivially solved initial layouts.
8. Reject an initial layout with too many already-correct adjacencies.
9. Assign difficulty from measurable properties such as graph density,
   misleading candidate edges, branching factor, and solver backtracking.
10. Record generatorVersion.
11. Return deterministic output for the same seed and generator version.
12. Never serialize the solution to the client.
13. Store a server-side canonical solution hash.
14. Accept valid rotations and reflections on completion.
15. Pre-generate at least 30 future daily puzzles.
16. Maintain one hard-coded, test-verified emergency fallback puzzle.

Daily seed:
HMAC-SHA256(PUZZLE_SEED_SECRET,
  `${publicationDay}:${difficulty}:${generatorVersion}`)

Do not expose PUZZLE_SEED_SECRET.

Use fast-check property tests. At minimum verify:
- Generated puzzles contain eight distinct valid tiles.
- Every generated puzzle has exactly one canonical solution.
- Generator output is deterministic.
- Canonicalization is invariant under rotation and reflection.
- Invalid tile duplication is rejected.
- Submitted permutations cannot bypass validation.
- Public serialization contains no solution data.
- Difficulty scoring remains within documented ranges.

# UX

Pages and primary CTA:

1. Landing:
   headline: "Your daily tiny win is ready."
   CTA: "Play today's TadaDing"

2. Tutorial:
   one interactive three-tile example
   CTA: "Start today's ring"

3. Puzzle:
   the puzzle itself is the primary interaction
   avoid competing CTA buttons

4. Guest completion:
   CTA: "Save my streak"

5. Passkey created:
   CTA: "Add recovery email"

6. Free registered completion:
   CTA: "Unlock the archive"

7. Member completion:
   CTA: "Share the ding"

8. Paywall:
   CTA: "Unlock every TadaDing"

Keep secondary actions as quiet text links.

Accessibility:
- WCAG-oriented semantic HTML.
- Minimum 44x44 targets.
- Visible focus indicators.
- Full keyboard gameplay.
- Screen-reader descriptions for every tile.
- Do not communicate status only through color.
- Contrast-safe tokens.
- Reduced-motion mode.
- Sound toggle.
- High-contrast theme.
- Automated axe checks in E2E tests.

Responsive viewports to test:
- 375x667
- 390x844
- 768x1024
- 1280x800
- 1440x900

Make this an installable PWA with:
- manifest
- icons generated from project-owned SVG
- theme metadata
- service worker
- cached application shell
- cached current puzzle payload
- local restoration of an unfinished attempt

Offline completion may remain pending and sync when the API becomes reachable.
Handle synchronization idempotently.

# AUTHENTICATION

Use passkeys with a maintained TypeScript WebAuthn implementation compatible
with the chosen NestJS and Next.js versions.

Guest flow:
- Generate a cryptographically random guest ID in the browser.
- Store it locally.
- Send it through an application-specific header.
- Store only an HMAC hash of the guest ID on the server.
- Do not use it as an authentication credential for sensitive operations.

Registration:
1. Guest completes a puzzle.
2. Guest chooses "Save my streak."
3. API creates WebAuthn registration options and a short-lived challenge.
4. Browser creates a discoverable credential.
5. API verifies and stores credential data.
6. In one transaction, create user and claim guest attempts/streak.
7. Establish secure session.
8. Prompt for recovery email.

Authentication:
- Usernameless/discoverable credential flow.
- Short-lived challenge stored server-side.
- Verify expected origin and RP ID exactly.
- Secure, HttpOnly, SameSite cookies.
- Rotate session IDs after authentication and recovery.
- Support logout of current and all sessions.
- Allow multiple passkeys.
- Track credential counter, transports, device type, and backed-up state where
  available.

Email:
- Email is nullable until voluntarily added.
- Normalize safely but preserve the original display form.
- Enforce uniqueness after verification.
- Verification tokens must be random, hashed at rest, single use, and expiring.
- Separate transactional and promotional consent.
- Daily reminder is off by default.
- Users can unsubscribe without logging in.

Recovery:
- "Reset passkey" means verify recovery email and add a new passkey.
- A recovery token creates a restricted session that can only manage passkeys.
- Do not turn recovery links into ordinary reusable magic login.
- Show all credentials and allow revocation.
- Record recovery and credential revocation in audit logs.
- Offer session invalidation after recovery.
- Rate-limit registration, authentication, email, and recovery endpoints.

# ARCHITECTURE

Use a modular monolith with three deployables:

apps/web
- Next.js App Router
- public PWA
- account screens
- billing screens
- admin UI
- typed API client
- no direct database access

apps/api
- NestJS HTTP API
- modular domain/application/infrastructure/http layers
- authentication
- puzzle commands and queries
- billing webhook
- OpenAPI
- health and metrics

apps/worker
- NestJS standalone application
- BullMQ workers
- transactional outbox dispatcher
- Temporal workers
- scheduled aggregates
- email processor

Use pnpm workspaces and Turborepo.

Required packages:

packages/domain
- shared domain primitives only
- IDs, result/error types, time abstraction
- no framework imports

packages/puzzle-engine
- pure generator, solver, canonicalizer, validator

packages/contracts
- Zod API schemas
- versioned event schemas
- shared public types derived from Zod
- no database or framework imports

packages/db
- Drizzle schema
- migrations
- transaction helpers
- connection creation
- test fixtures

packages/events
- outbox/inbox abstractions
- event envelope
- event dispatcher contracts

packages/auth
- shared WebAuthn and session domain logic where appropriate

packages/billing
- entitlement rules
- no Stripe SDK leakage into domain logic

packages/observability
- OTEL initialization
- metric names
- tracing helpers
- structured logging conventions

packages/ui
- small accessible visual primitives
- tile and ring components
- avoid a giant generic design system

packages/config
- Zod-validated environment configuration
- brand configuration
- public and server-only config separation

packages/testkit
- factories
- deterministic clocks
- database reset helpers
- Stripe webhook fixture signing
- WebAuthn test helpers

Avoid a generic "utils" package.

Suggested API module layout:

modules/<module>/
  domain/
  application/
  infrastructure/
  http/

Use domain/application separation where it clarifies business rules. Do not
create generic repository interfaces or abstract base classes merely to satisfy
a pattern. Add an interface at a volatile boundary: clock, mail, payment
provider, queue, workflow client, and persistence transaction boundary.

# CODE QUALITY

Use current stable, mutually compatible releases at execution time and pin the
lockfile.

TypeScript:
- strict: true
- noImplicitAny
- noUncheckedIndexedAccess
- exactOptionalPropertyTypes
- no unsafe any
- no ts-ignore without a documented reason
- exhaustive discriminated-union handling

Code rules:
- Prefer files below 250 lines.
- Generated files, schemas, fixtures, and configuration may exceed that.
- Prefer pure functions in domain code.
- Use dependency injection only at boundaries.
- No circular package imports.
- Enforce package dependency direction in ESLint.
- No business logic in controllers, React components, queue processors, or
  Temporal activities.
- No database calls from domain code.
- No Stripe types outside Stripe infrastructure adapters.
- No Temporal SDK types outside workflow/activity boundaries.
- No global singleton state beyond framework-managed infrastructure clients.
- Do not invent abstractions for a hypothetical second implementation.
- Every non-obvious architectural decision gets a concise ADR.

Create:
- AGENTS.md
- CONTRIBUTING.md
- README.md
- docs/architecture.md
- docs/product.md
- docs/security.md
- docs/privacy-data-map.md
- docs/operations.md
- docs/adr/
- docs/runbooks/
- docs/api/

# DATA MODEL

Use PostgreSQL and Drizzle migrations.

Use UUIDv7 or an equivalent sortable application-generated identifier.

Core tables:

users
- id
- status
- email nullable
- email_normalized nullable
- email_verified_at nullable
- created_at
- updated_at
- deleted_at nullable

webauthn_credentials
- id
- user_id
- credential_id unique binary/base64url-safe representation
- public_key
- counter
- transports
- device_type
- backed_up
- friendly_name nullable
- last_used_at nullable
- created_at
- revoked_at nullable

auth_challenges
- id
- purpose
- challenge_hash
- user_id nullable
- guest_id_hash nullable
- expires_at
- consumed_at nullable
- created_at

sessions
- id
- user_id
- token_hash
- expires_at
- last_seen_at
- ip_hash nullable
- user_agent_summary nullable
- revoked_at nullable
- created_at

email_tokens
- id
- user_id
- purpose
- token_hash
- expires_at
- consumed_at nullable
- created_at

daily_puzzles
- id
- publication_day unique
- generator_version
- difficulty
- seed_hash
- public_tiles jsonb
- canonical_solution_hash
- initial_order jsonb
- difficulty_score
- status draft|scheduled|published|retired|fallback
- published_at nullable
- created_at
- updated_at

puzzle_attempts
- id
- puzzle_id
- user_id nullable
- guest_id_hash nullable
- client_attempt_id unique
- initial_order_hash
- current_order jsonb nullable
- started_at
- last_saved_at nullable
- completed_at nullable
- moves
- hint_count
- duration_ms nullable
- completion_order_hash nullable
- client_version
- created_at
- updated_at

streaks
- user_id primary key
- current_count
- longest_count
- last_completed_day
- updated_at

subscriptions
- id
- user_id
- stripe_customer_id
- stripe_subscription_id unique nullable
- stripe_price_id nullable
- status
- current_period_end nullable
- cancel_at_period_end
- created_at
- updated_at

entitlements
- id
- user_id
- kind
- source
- effective_at
- expires_at nullable
- revoked_at nullable
- metadata jsonb
- created_at

stripe_events
- stripe_event_id primary key
- type
- payload_hash
- received_at
- processed_at nullable
- processing_error nullable

outbox_events
- id
- aggregate_type
- aggregate_id
- event_type
- event_version
- payload jsonb
- trace_id nullable
- occurred_at
- available_at
- attempts
- dispatched_at nullable
- last_error nullable

inbox_events
- consumer
- event_id
- processed_at
- primary key consumer,event_id

notification_preferences
- user_id
- daily_reminder_enabled
- marketing_enabled
- reminder_time nullable
- updated_at

audit_log
- id
- actor_user_id nullable
- actor_type
- action
- target_type
- target_id nullable
- metadata jsonb
- trace_id nullable
- created_at

feature_flags
- key primary key
- enabled
- payload jsonb
- updated_by
- updated_at

daily_metrics
- day
- metric
- dimension
- value
- primary key day,metric,dimension

Add indexes based on actual query paths.
Do not store raw IP addresses.
Use application-level HMAC for guest and optional IP abuse hashes.
Do not log credentials, challenges, tokens, cookies, email links, Stripe secrets,
or complete webhook payloads.

# API

Prefix versioned APIs with /v1.

Public:
GET  /v1/puzzles/today
POST /v1/puzzles/:id/attempts
PUT  /v1/attempts/:id/state
POST /v1/attempts/:id/complete
POST /v1/attempts/:id/hint

Auth:
POST /v1/auth/passkeys/register/options
POST /v1/auth/passkeys/register/verify
POST /v1/auth/passkeys/authenticate/options
POST /v1/auth/passkeys/authenticate/verify
POST /v1/auth/logout
POST /v1/auth/logout-all
GET  /v1/auth/session

Email and recovery:
POST /v1/account/email
POST /v1/account/email/verify
POST /v1/account/recovery/request
POST /v1/account/recovery/verify
GET  /v1/account/passkeys
POST /v1/account/passkeys
DELETE /v1/account/passkeys/:id

Account:
GET    /v1/me
GET    /v1/me/streak
GET    /v1/me/stats
GET    /v1/me/preferences
PATCH  /v1/me/preferences
POST   /v1/me/export
DELETE /v1/me

Member:
GET /v1/archive
GET /v1/archive/:day
POST /v1/practice
GET /v1/themes

Billing:
POST /v1/billing/checkout
POST /v1/billing/portal
POST /v1/billing/webhook
GET  /v1/billing/subscription
GET  /v1/billing/entitlements

Admin:
GET  /v1/admin/dashboard
GET  /v1/admin/puzzles
POST /v1/admin/puzzles/generate
GET  /v1/admin/puzzles/:id/preview
POST /v1/admin/puzzles/:id/schedule
POST /v1/admin/puzzles/:id/publish
POST /v1/admin/puzzles/:id/retire
GET  /v1/admin/users
GET  /v1/admin/users/:id
POST /v1/admin/users/:id/entitlements
DELETE /v1/admin/users/:id/entitlements/:entitlementId
POST /v1/admin/users/:id/revoke-sessions
GET  /v1/admin/audit
GET  /v1/admin/operations
GET  /v1/admin/feature-flags
PATCH /v1/admin/feature-flags/:key

Operations:
GET /health/live
GET /health/ready
GET /metrics
GET /openapi.json
GET /docs

Use Zod as the source of truth for request, response, and event contracts.
Use a maintained NestJS-Zod integration compatible with current NestJS, or
implement a small explicit validation pipe and schema registry. Avoid separate
handwritten validation and documentation models.

Generate OpenAPI and make the generated JSON serializable and testable.
Commit an OpenAPI snapshot and fail CI on undocumented drift.

NestJS supports generating a serializable OpenAPI document with
SwaggerModule.createDocument; implement /openapi.json and /docs from the same
document.

# DOMAIN EVENTS

Use an envelope:

{
  id: string,
  type: string,
  version: number,
  occurredAt: ISO timestamp,
  aggregate: {
    type: string,
    id: string
  },
  traceId?: string,
  payload: unknown
}

Initial versioned events:

puzzle.generated.v1
puzzle.scheduled.v1
puzzle.published.v1
puzzle.retired.v1
attempt.started.v1
attempt.state-saved.v1
puzzle.completed.v1
streak.updated.v1
user.registered.v1
email.added.v1
email.verified.v1
passkey.added.v1
passkey.revoked.v1
checkout.started.v1
subscription.changed.v1
entitlement.changed.v1
notification.requested.v1
account.deletion-requested.v1
account.deleted.v1

Validate every event with Zod before writing and before consuming.
Consumers must be idempotent.
Never publish an event before its database transaction commits.

# QUEUES AND TEMPORAL

BullMQ queues:
- outbox
- email
- metrics
- maintenance

Use BullMQ for short tasks only.
Configure bounded retry, exponential backoff, dead-letter handling, and
deduplication/job IDs.

Temporal workflows:

DailyPuzzleInventoryWorkflow
- Ensure the next 30 publication days have verified puzzles.
- Generate candidates through activities.
- Retry bounded infrastructure failures.
- Never retry an impossible deterministic input forever.
- Alert and use emergency fallback after bounded failure.
- Record generator version.

DailyPuzzlePublicationWorkflow
- Sleep durably until release.
- Publish exactly one puzzle for the publication day.
- Be idempotent.
- Verify puzzle status before changing it.
- Update cache.
- Emit puzzle.published.v1.

SubscriptionGraceWorkflow
- Begin from verified invoice.payment_failed event.
- Grant a configurable grace entitlement.
- Send one notification.
- Cancel when invoice.paid arrives.
- Remove grace after deadline if still unpaid.
- Do not revoke permanent/manual entitlements.

AccountDeletionWorkflow
- Verify a deletion request.
- Revoke sessions.
- Allow a documented cancellation window.
- Export requested data first if applicable.
- Delete or anonymize personal data.
- Preserve non-identifying aggregate metrics.
- Record completion without retaining deleted PII.

DailyReminderWorkflow
- Only for explicitly opted-in, verified-email users.
- Skip already-completed days.
- Respect unsubscribe and account status.
- Keep reminder logic optional and feature-flagged.

Temporal workflows must be deterministic.
No network, database, random, current-time, or environment access from workflow
code; use activities and Temporal time APIs.

# BILLING

Use Stripe-hosted Checkout and Customer Portal.

Environment:
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_MONTHLY_PRICE_ID
STRIPE_ANNUAL_PRICE_ID

Rules:
- One subscription per user.
- Existing subscribers are redirected to Customer Portal.
- Checkout session contains internal user ID in metadata.
- Do not trust redirect query parameters.
- Verify raw webhook body and Stripe-Signature.
- Insert stripe_events before processing.
- Duplicate event IDs return success without duplicate effects.
- Membership comes from entitlement state.
- Entitlement projection is updated from verified webhook state.
- Keep a short configurable payment-failure grace period.
- Handle out-of-order webhook events using Stripe object timestamps and current
  subscription retrieval when required.
- Never place Stripe calls inside a database transaction.
- Use idempotency keys for Stripe mutation calls.
- Test duplicate and out-of-order events.

# ADMIN

The admin UI is part of apps/web under /admin.
It uses the same public API and has no direct database access.

Admin authorization:
- Explicit admin role.
- Passkey authentication.
- Optional email allowlist bootstrap from environment.
- No public admin registration.
- Every mutation creates an audit-log entry.
- No user impersonation in the MVP.

Dashboard:
- DAU and WAU.
- Players completing first puzzle.
- Completion rate.
- Median completion duration.
- Median moves.
- Hint rate.
- D1, D7, and D30 return cohorts.
- Share rate.
- Paywall view to Checkout conversion.
- Checkout to paid conversion.
- Active subscriptions.
- MRR estimate.
- Churn and payment failures.
- Queue failures.
- Workflow failures.
- Outbox age.
- Future puzzle inventory.

Puzzle operations:
- Generate candidate.
- Show tiles, rule edges, solution, uniqueness proof, and difficulty data.
- Schedule.
- Publish.
- Retire.
- Select fallback.
- Hide solution by default behind an explicit reveal action.

User operations:
- Exact verified-email lookup only.
- View account state and entitlement, not gameplay secrets.
- Revoke sessions.
- Revoke a compromised passkey.
- Grant or revoke a documented support entitlement.
- Resend verification.
- Never edit streak silently; an adjustment must be audited with a reason.

# OBSERVABILITY

Use OpenTelemetry in web server code, API, and worker.
Use W3C trace context across HTTP, outbox, queues, and activities.

Local stack:
- OpenTelemetry Collector
- Prometheus
- Grafana

Metrics should include:

HTTP:
- http_server_requests_total
- http_server_request_duration_seconds
- http_server_errors_total

Puzzle:
- puzzle_attempts_started_total
- puzzle_completions_total
- puzzle_completion_duration_seconds
- puzzle_completion_moves
- puzzle_hints_total
- puzzle_generation_attempts_total
- puzzle_generation_failures_total
- puzzle_future_inventory_days

Auth:
- passkey_registration_attempts_total
- passkey_registration_failures_total
- passkey_auth_attempts_total
- passkey_auth_failures_total
- recovery_requests_total
- recovery_completions_total

Billing:
- checkout_sessions_created_total
- stripe_webhooks_received_total
- stripe_webhook_failures_total
- active_entitlements
- payment_grace_workflows

Async:
- outbox_pending_count
- outbox_oldest_age_seconds
- queue_jobs_failed_total
- queue_job_duration_seconds
- temporal_activity_failures_total

Use structured JSON logs:
- timestamp
- level
- service
- environment
- message
- traceId
- spanId
- requestId
- eventId where relevant
- safe identifiers only

Never log:
- cookies
- session tokens
- passkey responses
- WebAuthn challenges
- recovery tokens
- verification links
- Stripe secrets
- raw payment payloads
- full email addresses
- puzzle solutions in normal logs

Provide Grafana dashboards:
1. Product health.
2. API and infrastructure.
3. Authentication and abuse.
4. Billing.
5. Jobs and workflows.

Initial internal objectives:
- Published daily puzzle availability: 99.9%.
- API p95 under 300 ms, excluding Stripe and SMTP calls.
- Zero published puzzles without unique-solution verification.
- No outbox event pending longer than five minutes.
- At least 14 future verified puzzles available at all times.

# SECURITY

Implement:
- HTTPS-only production assumptions.
- Exact WebAuthn RP ID and expected origins.
- Secure, HttpOnly, SameSite cookies.
- CSRF protection for cookie-authenticated mutations.
- Session rotation.
- Redis-backed rate limits.
- Strict CORS allowlist.
- Content Security Policy.
- HSTS in production.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.
- Input and output validation.
- Parameterized database access through Drizzle.
- Secrets only from environment.
- Secret scanning in CI.
- Dependency audit in CI.
- Least-privilege database roles where practical.
- Separate application and Temporal databases or schemas and credentials.
- Admin authorization at API and UI.
- Audit logs for privileged operations.
- Idempotency for completion, billing, events, and workflows.
- Graceful account lock and credential revocation.
- Data export and deletion.
- No third-party analytics scripts.
- No third-party fonts.
- No externally hosted runtime assets except Stripe redirect.

Retention defaults:
- Raw puzzle attempts: 90 days.
- Aggregated anonymous product metrics: retained.
- Auth challenges and expired tokens: delete automatically.
- Audit data: document retention policy.
- Deleted-account gameplay may be anonymized only when it cannot be linked back
  to the user.

Create a threat model covering:
- credential theft
- recovery-email compromise
- guest-identity abuse
- streak and completion forgery
- puzzle solution extraction
- replayed Stripe webhooks
- duplicate and out-of-order events
- admin access
- queue poisoning
- Temporal activity replay
- dependency compromise
- denial of service
- PII leakage through logs and traces

# TESTING

Use:
- Vitest or the current compatible fast unit runner.
- fast-check.
- Testcontainers for PostgreSQL and Redis integration tests.
- Temporal TypeScript test environment.
- Playwright for E2E.
- Chromium virtual authenticator/CDP for passkey E2E.
- Mailpit for email E2E.
- Stripe test fixtures and locally signed webhook payloads.
- axe accessibility checks.

Unit tests:
- generator
- solver
- canonicalization
- difficulty
- completion validation
- streak transitions
- entitlement projection
- event validation
- outbox retry decisions
- recovery restrictions

Integration tests:
- Drizzle migrations from empty database
- database constraints
- attempt idempotency
- completion transaction and outbox insert
- outbox dispatch and inbox deduplication
- WebAuthn challenge lifecycle
- guest claim transaction
- Stripe webhook signature and idempotency
- subscription projection
- BullMQ retry and failure handling
- Temporal workflow time skipping

E2E:
1. New visitor completes tutorial and guest puzzle.
2. Reload restores unfinished board.
3. Guest completes and sees result.
4. Guest registers a passkey.
5. Guest history and streak are claimed.
6. User adds and verifies recovery email.
7. User logs out and returns with passkey.
8. User starts Stripe test Checkout.
9. Signed webhook grants member entitlement.
10. Member opens archive and practice puzzle.
11. Cancellation changes entitlement according to period end.
12. Recovery flow adds a new passkey.
13. Old passkey can be revoked.
14. Admin generates and schedules a puzzle.
15. Fallback is used after a simulated generation failure.
16. Account deletion workflow completes.
17. Responsive and accessibility checks pass.

Do not treat mocked controller tests as integration tests.
Mock only genuine external boundaries such as Stripe network and production SMTP.

# OPENAPI

Generate OpenAPI from application contracts.
Expose:
- /openapi.json
- /docs

CI must:
- validate the document
- compare it against a committed snapshot
- detect endpoints missing documentation
- ensure responses use declared Zod schemas
- fail on unintentional breaking changes

# LOCAL DEVELOPMENT

Provide Docker Compose services:
- postgres
- redis
- temporal
- temporal-ui
- mailpit
- otel-collector
- prometheus
- grafana

Provide health checks and named volumes.

Developer commands should include logically equivalent scripts to:
- pnpm install
- pnpm dev
- pnpm build
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm test:unit
- pnpm test:integration
- pnpm test:e2e
- pnpm db:generate
- pnpm db:migrate
- pnpm db:seed
- pnpm openapi:generate
- pnpm compose:up
- pnpm compose:down
- pnpm smoke
- pnpm verify

A new developer must be able to run the system from a fresh clone using the
README without tribal knowledge.

# GITHUB CI/CD

Create workflows:

ci.yml
- install from frozen lockfile
- lint
- dependency-boundary check
- typecheck
- unit tests
- build
- OpenAPI validation
- upload useful artifacts

integration.yml
- PostgreSQL and Redis/Testcontainers tests
- migration from empty database
- outbox and Stripe integration tests
- Temporal tests

e2e.yml
- start production-like stack
- run Playwright
- passkey virtual-authenticator tests
- accessibility checks
- upload trace/screenshots/video on failure

security.yml
- dependency audit
- secret scan
- container image scan
- scheduled weekly run

deploy.yml
- run only after required checks on main
- trigger Render deployment
- wait for health
- execute smoke tests
- report deployed commit SHA
- fail clearly without pretending to roll back
- document manual and automated rollback path

Do not deploy before CI succeeds.
Use GitHub environments for production approval/secrets where appropriate.
Do not store Render or Stripe secrets in the repository.

# RENDER

Generate render.yaml and validate it in CI.

Use:
- Docker-based services
- monorepo build filters
- explicit Dockerfile paths or a documented multi-target Dockerfile
- health checks
- pre-deploy database migration
- internal service URLs
- environment groups
- persistent storage where required
- separate web, API, and worker services

Application services:
- tadading-web
- tadading-api
- tadading-worker

Strict self-hosted infrastructure profile:
- tadading-postgres
- tadading-redis
- tadading-temporal
- tadading-otel
- tadading-prometheus
- tadading-grafana

Recommended managed-data profile:
- Render PostgreSQL
- Render Key Value
- self-hosted application, worker, Temporal/observability as documented

The application code must work with either profile through environment
configuration. Do not fork product code by profile.

Document that the strict single-node profile is not high availability.
Document:
- database backup
- restore
- disk replacement
- Redis data-loss behavior
- Temporal persistence recovery
- secret rotation
- service rollback
- domain cutover

Use PUBLIC_DOMAIN and API_ORIGIN configuration rather than hardcoded production
URLs.

# PHASES

PHASE 0 — Foundation and first deployment
- Verify brand configuration is not hardcoded.
- Create monorepo and package boundaries.
- Add web/API/worker hello world.
- Add config validation.
- Add local PostgreSQL/Redis/Temporal/observability Compose stack.
- Add health endpoints.
- Add Dockerfiles.
- Add render.yaml.
- Add CI.
- Add README and first ADR.
- Deploy and smoke-test.
Stop and report.

PHASE 1 — Puzzle engine and anonymous daily game
- Implement pure puzzle engine.
- Implement property tests.
- Add puzzle schema and migration.
- Seed fallback and today's puzzle.
- Add today endpoint.
- Build responsive tutorial and game.
- Add local guest identity and board persistence.
- Add completion feedback.
- Add Playwright guest tests.
- Deploy and smoke-test.
Stop and report.

PHASE 2 — Persistence, completion, streak, and events
- Add attempts and streaks.
- Add server-side validation.
- Add transactional outbox.
- Add BullMQ dispatcher.
- Add metrics events and sharing.
- Add idempotency and integration tests.
- Deploy and smoke-test.
Stop and report.

PHASE 3 — Passkeys, session, email, and recovery
- Implement registration/authentication.
- Claim guest data.
- Add session security.
- Add recovery email and verification.
- Add restricted recovery and passkey management.
- Add Mailpit and Playwright virtual-authenticator tests.
- Deploy and smoke-test on the production RP origin.
Stop and report.

PHASE 4 — Billing and member content
- Implement Stripe Checkout.
- Implement raw webhook route and idempotency.
- Implement subscription and entitlement projection.
- Implement Customer Portal.
- Add archive, practice generation, difficulty, and themes.
- Add billing tests.
- Deploy and execute test-mode purchase.
Stop and report.

PHASE 5 — Admin, Temporal, and observability
- Implement puzzle inventory and publication workflows.
- Add fallback behavior.
- Add admin dashboard and audited operations.
- Add OTEL, Prometheus, and Grafana.
- Add operational metrics and runbooks.
- Deploy and test time-skipped workflows.
Stop and report.

PHASE 6 — Launch hardening
- Accessibility audit.
- Security hardening.
- Rate limits.
- CSP.
- data export/deletion.
- backup/restore documentation.
- OpenAPI snapshot and drift check.
- full E2E suite.
- production smoke and rollback exercise.
- privacy, terms, support, and billing pages.
- launch checklist.
Deploy and report final readiness honestly.

# DEFINITION OF DONE

The beta is launchable only when:

- A visitor can play today's puzzle without an account.
- Every published puzzle is solver-verified with exactly one canonical solution.
- No solution data reaches the browser.
- A guest can save a streak through a passkey.
- Email is collected only after passkey registration.
- Recovery adds a new passkey rather than creating a permanent email-login
  bypass.
- Stripe webhook state controls entitlement.
- A paying user can access archive and practice modes.
- An unpaid user cannot bypass the entitlement through API calls.
- An administrator can preview and control puzzle publication.
- The next 14 days have verified puzzles.
- A verified fallback exists.
- Unit, property, integration, E2E, accessibility, and smoke tests pass.
- OpenAPI is generated and validated.
- Every service has health checks and structured logs.
- Trace context crosses HTTP, queues, and Temporal activities.
- No secret or PII appears in logs.
- README setup works from a clean clone.
- Deployment and rollback instructions are tested.
- Known limitations are documented without falsely claiming production HA.
```

NestJS can generate and serialize the OpenAPI document from its Swagger module, making the requested `/openapi.json`, documentation UI, and contract snapshot practical. ([NestJS Documentation][14])

---

# 11. Business operations manual

## Owner responsibilities

This is deliberately a one-person operation. The founder owns:

* Product and puzzle quality.
* Infrastructure and security.
* Customer support.
* Billing oversight.
* Weekly metric review.
* Marketing experiments.
* Financial reconciliation.
* Vendor and domain accounts.

Do not create work that requires a content editor, moderator, sales representative, customer-success team, or integration engineer.

## Daily operating routine

Target: approximately 10–20 minutes on a healthy day.

### Product health

Check:

* Today’s puzzle is published.
* Tomorrow’s puzzle is scheduled.
* At least 14 future verified puzzles remain.
* Completion rate is not abnormally low.
* Hint usage and median completion time are within normal ranges.
* The fallback puzzle has not been activated.

### Technical health

Check:

* Web, API, and worker readiness.
* Error rate and p95 latency.
* Oldest pending outbox event.
* Failed BullMQ jobs.
* Failed or stuck Temporal workflows.
* PostgreSQL disk and connection use.
* Redis memory.
* Recent deployment status.
* Certificate and domain status.

### Business health

Check:

* New paid subscriptions.
* Cancellations.
* Payment failures.
* Refunds or disputes.
* Support inbox.
* Abnormal recovery requests or authentication failures.

Do not spend the day staring at dashboards. Alerts should identify actionable conditions.

---

## Weekly operating routine

### Monday: retention and puzzle quality

Review:

* Weekly active players.
* Players completing at least three puzzles.
* D1 and D7 return rates.
* Completion rate by puzzle.
* Median time and moves.
* Hint rate.
* Puzzles with unusually high abandonment.
* Generator difficulty distribution.

Manually play the next seven standard puzzles.

### Tuesday: acquisition

Review:

* Landing-to-play rate.
* First-puzzle completion rate.
* Share action rate.
* Traffic source.
* Share-link return visits.
* Organic search visits.
* Install-prompt acceptance.

Run only one meaningful acquisition experiment at a time.

### Wednesday: monetization

Review:

* Completion-to-paywall rate.
* Paywall-to-Checkout rate.
* Checkout completion.
* Monthly versus annual selection.
* Active-to-paid conversion.
* Voluntary and payment-failure churn.
* Refund requests.
* Archive and practice usage by members.

Do not respond to weak conversion by hiding more of the free experience. First improve member value.

### Thursday: reliability and security

* Apply dependency updates.
* Review vulnerability results.
* Review administrative actions.
* Inspect unusual authentication failures.
* Test one incident runbook.
* Verify backups completed.
* Review storage growth and retention jobs.

### Friday: product decision

Review customer messages and choose one of:

* Fix the most common confusion.
* Tune puzzle difficulty.
* Improve the completion moment.
* Improve the membership explanation.
* Improve sharing.
* Make no change and collect another week of data.

Avoid adding a second puzzle type until the first puzzle demonstrates return behavior.

---

## Monthly routine

1. Reconcile Stripe payouts, refunds, disputes, and subscription counts against internal records.
2. Export accounting records.
3. Perform a database restore test, not merely a backup check.
4. Audit production access and rotate unnecessary credentials.
5. Verify account-deletion and retention jobs.
6. Review hosting cost per active and paid user.
7. Review cancellation reasons.
8. Review generator quality by difficulty bucket.
9. Reassess monthly and annual pricing.
10. Archive completed experiments and their outcomes.
11. Update runbooks after every incident.
12. Confirm domain auto-renewal and recovery controls.

---

# 12. Support model

## Channels

Use:

* One support email address.
* A searchable help center.
* A small status page.
* Self-service Stripe Customer Portal.
* Self-service passkey management.
* Automated email verification and recovery.

Do not launch live chat, phone support, Discord support, or social-message support.

## Support categories

### “I do not understand the rule”

Answer with a visual example:

> Each pair of neighbors must share exactly one feature—not zero and not two.

Link directly to the interactive tutorial.

### “My streak is wrong”

Check:

* Completion event.
* Publication day.
* Guest-to-account claim.
* Duplicate attempt.
* Offline synchronization.

Any manual correction requires an audit reason.

### “I lost my passkey”

Guide the user through:

1. Recovery email verification.
2. Adding a new passkey.
3. Reviewing and revoking old passkeys.
4. Logging out other sessions.

Never ask for authenticator secrets or device PINs.

### “I was charged”

Direct verified users to the Customer Portal. For an eligible refund, process it through Stripe and allow webhook-driven entitlement reconciliation.

### “Today’s puzzle is impossible”

Do not assume user error. Run the solver and inspect the published puzzle. When invalid:

1. Retire it immediately.
2. Publish the fallback.
3. Preserve everyone’s streak.
4. Display a brief status message.
5. Audit why prepublication validation failed.
6. Add a regression test.

## Support objective

A healthy product should generate fewer than **one support case per 100 paid members per month**. This is an internal target, not an industry benchmark.

---

# 13. Incident runbooks

## Invalid or poorly calibrated puzzle

1. Enable the fallback feature flag.
2. Retire the affected puzzle.
3. Preserve or automatically grant that day’s streak.
4. Clear puzzle caches.
5. Verify the fallback through the API and browser.
6. Identify whether the issue was generator, solver, serialization, or publication.
7. Create a seed-specific regression test.
8. Document the incident.

## API outage

1. Keep the cached current puzzle playable.
2. Save board state locally.
3. Queue completion synchronization.
4. Restore API readiness.
5. Replay completion requests idempotently.
6. Verify streaks and completion counts.
7. Communicate only when customer impact is material.

## Redis failure

1. Keep direct PostgreSQL-backed gameplay working where possible.
2. Pause optional emails and aggregates.
3. Restore Redis.
4. Restart failed workers.
5. Replay pending outbox events.
6. Verify inbox deduplication.
7. Do not regenerate already-completed business operations blindly.

## Temporal failure

1. Gameplay stays available because Temporal is not in the hot path.
2. Confirm future puzzles already exist.
3. Pause workflow-dependent reminders and deletion processing.
4. Restore the service and persistence.
5. Reconcile open workflows by deterministic workflow ID.
6. Verify no duplicate publication occurred.

## Stripe webhook delay

1. Do not revoke access immediately.
2. Preserve a short grace entitlement.
3. Reprocess unhandled Stripe events.
4. Query current subscription state where events arrived out of order.
5. Reconcile internal entitlement with Stripe.
6. Notify users only when payment action is required.

## Compromised passkey

1. Verify the recovery email.
2. Establish restricted recovery.
3. Add a new passkey.
4. Revoke the compromised credential.
5. Invalidate all sessions.
6. Review recent account and billing activity.
7. Record the action in the audit log.

## Suspected account takeover

1. Lock sensitive account changes.
2. Revoke sessions and credentials as appropriate.
3. Verify ownership using the recovery channel.
4. Review email, passkey, billing, and administrative changes.
5. Do not expose internal security details to an unverified requester.

## Database loss or corruption

1. Place writes in maintenance mode.
2. Preserve current evidence and logs.
3. Restore the most recent verified backup.
4. Apply migrations in order.
5. Reconcile Stripe subscription state.
6. Reconcile outbox and inbox records.
7. Verify today’s and future puzzles.
8. Run production smoke tests before reopening writes.
9. Document recovery-point and recovery-time impact.

---

# 14. Growth without external integrations

## Primary growth loop

After completion, generate a spoiler-free share result such as:

```text
TadaDing #42
🔗🔗🔗🔗
🔗🔗🔗🔗
6 swaps · 1:18 · 🔥 9
Your daily tiny win.
```

Use:

* Native Web Share API where available.
* Copy-to-clipboard fallback.
* First-party share landing pages.
* Open Graph images generated by the web application.
* Referral codes stored internally.

No social-network API is needed.

## Acquisition channels

Prioritize:

1. Completion shares.
2. Search pages explaining the rule and daily puzzle.
3. Installable PWA prompts after the second completion.
4. A simple referral: invite three players and unlock one theme.
5. Puzzle communities and newsletters.
6. Small creator sponsorship tests only after retention is credible.

Do not buy large amounts of traffic before validating D7 return behavior.

## Product growth order

Build in this order:

1. Improve the standard puzzle.
2. Improve completion satisfaction.
3. Improve sharing.
4. Improve archive and practice.
5. Add visual themes.
6. Add weekly collections.
7. Consider a second mechanic only after retention is stable.

Do not turn TadaDing into an unfocused game portal.

---

# 15. Metrics and decision rules

## North-star metric

> **Weekly players who complete at least three TadaDings.**

This captures repeated behavior rather than one-time curiosity.

## Supporting metrics

### Acquisition

* Unique landing visitors.
* Landing-to-play rate.
* Share-link visits.
* Organic versus paid traffic.

### Activation

* Tutorial completion.
* First-puzzle start.
* First-puzzle completion.
* Time to first interaction.
* Time to first completion.

### Retention

* D1, D7, and D30 return.
* Weekly three-completion rate.
* Current and longest streak.
* Archive and practice use.

### Puzzle quality

* Completion rate.
* Median completion time.
* Median moves.
* Hint rate.
* Reset rate.
* Abandonment point.
* Invalid-puzzle count: must remain zero.

### Revenue

* Paywall view.
* Checkout start.
* Checkout completion.
* Active paid members.
* Monthly recurring revenue.
* Monthly versus annual mix.
* Voluntary churn.
* Payment-failure churn.
* Refund rate.

### Operations

* Support cases per 100 paid members.
* Cost per active player.
* Cost per paid member.
* API and job reliability.
* Future puzzle inventory.

## Initial founder hypotheses

These are decision thresholds to test, not external benchmarks:

| Metric                                 |  Healthy early signal | Corrective action                             |
| -------------------------------------- | --------------------: | --------------------------------------------- |
| Landing visitor completes first puzzle |                  40%+ | Simplify tutorial and load time               |
| Started puzzle completes               |                  65%+ | Tune difficulty and feedback                  |
| D1 return                              |                  25%+ | Improve daily ritual and reminder positioning |
| D7 return                              |               15–20%+ | Improve mechanic before adding features       |
| Active free to paid within 30 days     |                 1–3%+ | Improve member value and paywall timing       |
| Support cases                          | <1 per 100 paid/month | Improve self-service and copy                 |
| Invalid published puzzles              |                     0 | Stop publication and fix validation           |

### Kill or pivot rule

After at least several hundred genuine first-time players:

* If fewer than 30% complete their first puzzle, simplify the mechanic.
* If completion is healthy but D7 return remains below approximately 10% after two tuning iterations, test a different daily mechanic.
* If retention is healthy but payment remains below 1%, improve the premium package before changing the free product.
* If paid users rarely use archive or practice, a subscription may be the wrong model; test a one-time lifetime package or theme collections.

Do not preserve the original idea out of attachment when the behavioral evidence disagrees.

---

# 16. Making the business transferable

The business is designed to be easy to acquire, though no business is automatically easy to sell.

Maintain a buyer-ready asset package:

* Domain and social accounts.
* Trademark records.
* Single GitHub organization and monorepo.
* Complete IP-assignment records for every contributor.
* Render, Stripe, SMTP, and registrar inventory.
* Architecture diagrams.
* Data map and retention policy.
* Deployment and rollback procedures.
* Backup and restore evidence.
* Security and incident history.
* Subscription cohorts.
* MRR, churn, refund, and retention reports.
* Customer-support history.
* Generator and solver documentation.
* Puzzle-quality metrics.
* Vendor and monthly-cost inventory.
* Business operating manual.
* No unlicensed artwork, music, fonts, or puzzle content.

The most valuable future assets would be:

1. A recognizable daily brand.
2. Retained consumer audience.
3. Subscription revenue.
4. Puzzle generator and tuning corpus.
5. Organic sharing loop.
6. Low support and infrastructure cost.
7. Clean, portable ownership of code and data.

The defensibility is initially **brand and execution**, not a deep technical moat. Over time, it becomes the accumulated puzzle-quality data, retention cohorts, recognizable completion ritual, and distribution network.

---

# 17. Principal risks

## The puzzle is enjoyable once but not daily

Mitigation:

* Measure D1/D7 before building more infrastructure.
* Tune difficulty from behavior.
* Keep completion under three minutes.
* Test multiple visual themes without changing the rule.

## A single puzzle does not justify a subscription

Mitigation:

* Keep today free.
* Make archive, practice, difficulty, themes, and statistics genuinely useful.
* Observe member usage.
* Test annual pricing.
* Do not artificially cripple the daily puzzle.

## Passkeys confuse some users

Mitigation:

* Introduce them after completion.
* Explain them as “Save securely with your device.”
* Support multiple credentials.
* Collect a recovery email afterward.
* Keep guest play fully functional.

## The requested stack becomes larger than the product

Mitigation:

* One modular monolith.
* Only three application deployables.
* Keep Temporal out of gameplay.
* Keep Prometheus/Grafana operational, not product dependencies.
* Do not create services merely to demonstrate architecture.

## Strict self-hosting creates operational risk

Mitigation:

* Containerize everything for portability.
* Document the strict profile.
* Prefer managed PostgreSQL and Redis once real users depend on the product.
* Perform restore tests.
* Keep application code independent of the hosting profile.

## The brand or domain cannot be legally used

Mitigation:

* Purchase the domain before coding branded assets.
* Centralize all branding.
* Perform trademark clearance before major marketing.
* Use `playtadading` for social identities if the exact handle is unavailable.

---

# Final founder recommendation

Proceed with **TadaDing** because it has the best alignment with the complete requirement set:

* Daily and enjoyable.
* Little or no data entry.
* Easy to understand.
* Self-contained.
* Broadly accessible.
* Cheap to serve.
* Automatable.
* Monetizable at $5.99.
* Buildable as a public beta in one concentrated implementation day.
* Maintainable through a modular monolith.
* Transferable without content licenses or partner integrations.

The correct first action is to confirm and purchase `tadading.com`. After that, paste the master prompt into Cursor and execute **Phase 0 only**, merge it after CI, and verify the first Render deployment before writing the puzzle engine.

[1]: https://www.instagram.com/tadading/ "https://www.instagram.com/tadading/"
[2]: https://lookup.icann.org/ "https://lookup.icann.org/"
[3]: https://www.census.gov/quickfacts/fact/table/US/PST045225 "https://www.census.gov/quickfacts/fact/table/US/PST045225"
[4]: https://apps.apple.com/us/app/puzzmo-solve-smile-share/id6714482734 "https://apps.apple.com/us/app/puzzmo-solve-smile-share/id6714482734"
[5]: https://www.revenuecat.com/state-of-subscription-apps-2026-gaming/ "https://www.revenuecat.com/state-of-subscription-apps-2026-gaming/"
[6]: https://flo.health/newsroom/flo-health-raises-over-200m "https://flo.health/newsroom/flo-health-raises-over-200m"
[7]: https://www.speak.com/blog/series-c "https://www.speak.com/blog/series-c"
[8]: https://lovable.dev/blog/200m-series-a-fundraise "https://lovable.dev/blog/200m-series-a-fundraise"
[9]: https://render.com/docs/monorepo-support "https://render.com/docs/monorepo-support"
[10]: https://docs.temporal.io/self-hosted-guide "https://docs.temporal.io/self-hosted-guide"
[11]: https://simplewebauthn.dev/docs/advanced/passkeys "https://simplewebauthn.dev/docs/advanced/passkeys"
[12]: https://docs.stripe.com/billing/subscriptions/build-subscriptions "https://docs.stripe.com/billing/subscriptions/build-subscriptions"
[13]: https://docs.stripe.com/webhooks "https://docs.stripe.com/webhooks"
[14]: https://docs.nestjs.com/openapi/introduction "https://docs.nestjs.com/openapi/introduction"
