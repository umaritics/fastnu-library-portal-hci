# D4 Part B — Implementation documentation

**Version:** extension **1.0.12** · **Last updated:** November 2026  
**Location:** [`extension/`](../../extension/)

## 1. Tooling

| Item | Choice |
| :--- | :--- |
| Platform | **Manifest V3** browser extension (Chrome / Edge) |
| Host | Live portal `https://nu.insigniails.com/Library/*` |
| UI | In-place DOM shell (`content/shell/`) + room wizard on `/Library/Room` |
| Portal integration | **MAIN-world** bridge (`page-world.js`) driving Insignia `Room()` + Kendo widgets |
| Local UI iteration | [`demo/`](../../demo/) (mock data, no portal login) |

## 2. Scope (vertical slice)

**In scope:** Authenticated patron · Islamabad library · **one task:** book one study room (date, room, start, duration up to portal max, purpose, confirm) · real submission when `TEST_MODE: false`.

**Out of scope (v1):** Book search, kiosk, assets; changing server-side availability accuracy; Firefox/Safari builds.

**Why vertical:** D4 brief prefers one task fully functional (including errors) over many shallow screens. Home/header redesign supports **R1** discoverability but evaluation focus is the booking wizard.

## 3. User flow (as built)

1. **Home** — Services pane link to `/Library/Room` (header/nav reskin).
2. **Step 1 — Day** — Calendar; weekends disabled; syncs native date picker via bridge.
3. **Step 2 — Room & time** — Per-room timelines (15‑min slots); end-time selection sets duration.
4. **Step 3 — Confirm** — Recap, optional purpose, **Confirm Booking**.
5. **Submit** — Bridge selects native range, sets purpose, invokes portal **Book**, detects success toast/dialog, verifies when needed.
6. **Pass** — “Your room is held” + details; **Return to Home** / **Book another time**.

Detail: [`../prototype/NATIVE_ROOM_BOOKING_FLOW.md`](../prototype/NATIVE_ROOM_BOOKING_FLOW.md).

## 4. Genuinely built vs simulated

| Capability | Status |
| :--- | :--- |
| Read rooms/slots from Kendo grid + time strip | **Built** — live DOM |
| Set date, search, select slot, duration | **Built** — bridge |
| Submit booking | **Built** — `TEST_MODE: false` calls native `btnBook_click` / fee flow |
| Booking ID on pass | **Built** when portal message includes ID; otherwise hint text only (no fabricated IDs) |
| `TEST_MODE: true` | **Simulated** — skips real Book; for dev/demo only |
| Availability vs physical room | **Not simulated** — shows portal data (OR1 risk in D3) |

**Wizard-of-Oz:** None for the core book path in production configuration.

## 5. Architecture (summary)

```
content/bootstrap.js          → header, home layout (all Library pages)
content/booking-bootstrap.js  → mounts RoomBookingWizard on /Library/Room
content/shell/room-booking-shell.js → wizard UI + state
content/bridge/page-bridge.js → postMessage to MAIN world
content/bridge/page-world.js  → jQuery/Kendo Room(), submitRoomBooking
content/parsers/availability.js → grid → room list + slots
```

## 6. Feedback and errors (handled)

| Trigger | User-visible feedback |
| :--- | :--- |
| Loading rooms | Live region + skeleton |
| Weekend day | Error message; cannot proceed |
| Slot no longer free | Red alert on confirm (single) |
| Extension context lost | Banner + friendly refresh message |
| Successful book | Pass screen; live region cleared |
| Submit in progress | “Submitting booking to the library…” |

## 7. Install and verify (checkpoint)

See [`../../extension/README.md`](../../extension/README.md) and [README § D4 prototype](../../README.md#-d4-prototype-browser-extension).

Verify: `<html data-g10-extension="1.0.12" class="g10-redesign g10-room-booking-page">` on Room page after reload.

## 8. Requirements traceability

| Req | Prototype feature |
| :--- | :--- |
| R1 | Home services CTA + clearer path to Room |
| R2 | Timelines, free/taken labels, session overlay for confirmed bookings |
| R3 | Confirm recap + pass screen after verified submit |
| R4 | Calendar + explicit end time (no native slider in wizard UI) |
| R5 | Targets, contrast tokens, `aria-live`, non-colour status — audit in Part A/B logs |

Full table: [`../prototype/REQUIREMENTS_AND_TRACEABILITY.md`](../prototype/REQUIREMENTS_AND_TRACEABILITY.md).

## 9. Known limitations

- Portal max booking length per room (often **60 minutes** from grid metadata).
- Insignia DOM/CSS changes may break selectors (`SELECTORS` in `config.js`).
- Mobile 320px R5 pass/fail must be recorded in team audit, not assumed from code.
