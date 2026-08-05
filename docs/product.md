# Product

**Brand:** TadaDing (configurable)  
**Tagline:** Your daily tiny win.  
**Promise:** Swap eight cheerful tiles until every neighbor fits. Close the ring, hear the ding, keep the streak.

## Phase 2 surface

- Landing → tutorial → daily ring play
- Anonymous guest play (local guest ID, server HMAC acknowledgment)
- Attempt start/save/complete/hint APIs with server validation
- Guest streak (server + localStorage) and spoiler-free share card
- Transactional outbox + BullMQ dispatcher; trace IDs on attempt reads

## Upcoming (later phases)

- Passkey save-streak flow after first completion
- Member archive/practice/themes at $5.99 / $29.99
- No ads, no UGC, no third-party content feeds

Full rationale lives in [`business.md`](../business.md).
