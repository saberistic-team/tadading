# Product

**Brand:** TadaDing (configurable)  
**Tagline:** Your daily tiny win.  
**Promise:** Swap eight cheerful tiles until every neighbor fits. Close the ring, hear the ding, keep the streak.

## Phase 1 surface

- Landing → tutorial → daily ring play
- Anonymous guest play (local guest ID, server HMAC acknowledgment)
- `GET /v1/puzzles/today` (no solution in payload)
- Local board persistence + completion sound/animation

## Upcoming (later phases)

- Passkey save-streak flow after first completion
- Attempt/streak persistence and outbox events
- Member archive/practice/themes at $5.99 / $29.99
- No ads, no UGC, no third-party content feeds

Full rationale lives in [`business.md`](../business.md).
