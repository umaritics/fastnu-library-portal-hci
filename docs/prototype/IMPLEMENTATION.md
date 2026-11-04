# Implementation Notes — Browser Extension

**Version:** 1.0.12 · **Last updated:** November 2026  
**Location:** `extension/` · **D4 pack:** `docs/deliverables/d4/part-b/D4_PARTB_IMPLEMENTATION.md`

## Current build (v1.0.12)

| Area | Status |
| :--- | :--- |
| MV3 manifest, content scripts on `/Library/*` | Done |
| Portal shell: header, Home layout, login polish | Done |
| Room page: **in-place wizard** (Day → Room & time → Confirm → pass) | Done |
| Kendo bridge via MAIN-world `page-world.js` | Done |
| Real booking (`TEST_MODE: false`) + success toast detection | Done |
| Errors: slot taken, extension reload, weekend closed | Done |
| Booking pass + Return to Home / Book another time | Done |

## Architecture pointers

- Wizard UI: `content/shell/room-booking-shell.js`, `room-booking.css`
- Bootstrap: `content/bootstrap.js`, `content/booking-bootstrap.js`
- Bridge: `content/bridge/page-bridge.js`, `page-world.js`, `submit.js`
- Availability: `content/parsers/availability.js`
- Flow detail: `docs/prototype/NATIVE_ROOM_BOOKING_FLOW.md`

## Local demo (no extension reload)

```bash
python -m http.server 8765
# http://localhost:8765/demo/
```

## Legacy note

Early v0.1 used a shadow-DOM overlay on Room; the **submitted D4 prototype** is the in-place wizard + shell described above.

## Next (D5, not D4 blockers)

- Formal R1–R5 moderated sessions (`docs/prototype/VERIFICATION_PROTOCOL.md`)
- Complete Part A/B accessibility logs in `docs/deliverables/d4/`
- Options page for `TEST_MODE` toggle (optional)
