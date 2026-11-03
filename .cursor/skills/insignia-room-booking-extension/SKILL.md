---
name: insignia-room-booking-extension
description: Builds and maintains the G10 FAST-NU Insignia library room-booking browser extension (MV3) that overlays Free Rooms First UX on nu.insigniails.com while bridging Kendo UI widgets. Use when implementing, debugging, or reviewing extension code, content scripts, Kendo bridge, or portal DOM integration for CS3014 prototype.
---

# Insignia Room Booking Extension

## Before coding

1. Read `docs/prototype/PROTOTYPE_SPEC.md` and `docs/prototype/CURRENT_PORTAL_AUDIT.md`.
2. Confirm scope: **room booking vertical slice only**; requirements R1–R5.
3. Never fabricate booking IDs or submit real bookings in dev without `TEST_MODE`.

## Architecture rules

- **MV3** content scripts on `https://nu.insigniails.com/Library/*`.
- UI in **shadow DOM** or isolated root to avoid Kendo CSS collisions.
- **Bridge layer only** talks to Kendo/jQuery (`#dtp_DateAvailable_Room`, `#grd_Rooms_Room`, `#sld_TimeFromTo_Room`, Book button).
- Keep native nodes in DOM when hiding visually (`aria-hidden` on legacy panel, not `display:none` on grid until spike proves safe).

## Implementation order

1. `manifest.json` + bootstrap router (Home vs Room).
2. Overlay shell (Today/Tomorrow, room list placeholders).
3. Grid read adapter — wait for `dataBound`.
4. Date/search automation — set date → `#btn_Search_Room`.
5. Slot selection — map chip → grid row + time strip actions.
6. Summary + Confirm → Purpose field + Book.
7. Booking pass from confirmation DOM/network.
8. Home CTA injection.

## Kendo patterns

```javascript
// Date — verify widget exists
const dp = $("#dtp_DateAvailable_Room").data("kendoDatePicker");
if (dp) dp.value(new Date());

// Grid
const grid = $("#grd_Rooms_Room").data("kendoGrid");
// after Search: grid.dataSource.view()
```

Always chain: set value → trigger Search/Filter → await grid refresh → update overlay.

## Selectors

Centralize in `content/bridge/selectors.js` (version `V1`). Key IDs from audit:

- `dtp_DateAvailable_Room`, `btn_Search_Room`, `btn_FilterF_Room`
- `grd_Rooms_Room`, `sld_TimeFromTo_Room`
- Book button near Purpose field (`Purpose` label in a11y tree)

## HCI checks while building

- Time chips ≥44px; text labels on free/taken (R5-4).
- `aria-live="polite"` on summary and errors (R5-6).
- Loading skeleton while grid fetches (Nielsen #1).

## Verification

Run procedures in `docs/prototype/VERIFICATION_PROTOCOL.md` after each milestone.

## Additional resources

- Portal audit: `docs/prototype/CURRENT_PORTAL_AUDIT.md`
- Requirements: `docs/prototype/REQUIREMENTS_AND_TRACEABILITY.md`
