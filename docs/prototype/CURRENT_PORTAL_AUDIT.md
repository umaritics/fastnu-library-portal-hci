# Current Portal Audit — Book Room (Live)

**Audited:** 2026-10-23 (logged-in session, Islamabad)  
**URL:** `https://nu.insigniails.com/Library/Room`  
**Method:** Browser walkthrough + DOM inspection (Kendo/jQuery stack)

---

## 1. Task flow (as-is)

```
Sign in → (optional) Home
  → My Account → Booking → Book Room   [3 clicks, no home shortcut]
  → /Library/Room
  → Select date (dtp_DateAvailable_Room) → Search
  → Adjust filters (room type, time sliders, capacity) → Filter
  → Select room in grid (grd_Rooms_Room) + calendar/time strip
  → Purpose field → Book
  → (confirmation not observed in this audit — stop before submit in tests)
```

**Direct deep link:** `/Library/Room` works when authenticated (supports R1 via extension shortcut).

**Native controller (2026-11):** Insignia attaches a `Room()` instance to `#divRoomContent` (`jQuery(...).data("room")`). Search and time-strip refresh must go through `btnSearch_click()` and `gridRooms_Changed()` — see `NATIVE_ROOM_BOOKING_FLOW.md`.

---

## 2. Technology stack (integration implications)

| Layer | Detail |
| :--- | :--- |
| UI framework | **Kendo UI 2016.3.1118** (widgets: DatePicker, Slider, Grid, ComboBox) |
| JS | jQuery, `kendo.aspnetmvc.min.js`, Insignia `Scripts/opac/*.js` |
| Host | ASP.NET MVC (`/Library/...` routes) |
| i18n | Urdu culture packs loaded (`kendo.culture.ur-PK`) |

Extension must treat widgets as **Kendo APIs**, not raw `<input>` only:

- Date: `#dtp_DateAvailable_Room` (combobox role in a11y tree)
- Time range: `#sld_TimeFromTo_Room`, `#sld_TimeFromTo2_Room` (sliders — high friction, R4)
- Room grid: `#grd_Rooms_Room`
- Actions: `#btn_Search_Room`, `#btn_FilterF_Room`, `#btn_ClearF_Room`, Book button

---

## 3. UX pain points (mapped to evidence)

| Observation | Heuristic / WCAG | D2 evidence |
| :--- | :--- | :--- |
| Booking only under My Account → Booking | Discoverability | P01-C2, P05-C1, SV-1 |
| Breadcrumb “My Account / Booking / Room” — not “Book a study room” | Match real world | N2 |
| Filter column + empty centre until interaction | Visibility of status | P04-B2 |
| Dual time sliders “Drag” without clear legend | Error prevention, a11y | S02-F2, S09-F1–F4 |
| Colour calendar in grid (month view) without text legend in UI | Perceivable (1.4.1) | P09-C2 |
| Desktop layout scaled on phone; horizontal pan for controls | Reflow (1.4.10) | P08-C1, D3 Fig A6 |
| Purpose field required before Book — easy to miss | Error prevention | — |
| Zoom +/- chrome on page | Cognitive load | — |

---

## 4. Accessibility snapshot (quick)

| Check | Finding |
| :--- | :--- |
| Keyboard | Sliders and grid reachable but sequence is long; focus order not optimized |
| Screen reader | Many controls exposed; sliders named “Drag” — poor name (WCAG 4.1.2) |
| Colour | Status relies on calendar/grid colouring — needs text labels in overlay |
| Touch | Small handles on Kendo sliders — fails practical 44px target guideline |

Full R5 walkthrough belongs on **extension UI**, documented in `VERIFICATION_PROTOCOL.md`.

---

## 5. Extension strategy fit

**Feasible:**

- `content_scripts` on `https://nu.insigniails.com/Library/*`
- Inject shadow-DOM or top-layer overlay; hide `.roomBooking-content` visually while keeping nodes in DOM for Kendo
- Bridge: read grid data via Kendo `$("#grd_Rooms_Room").data("kendoGrid")` when available; set date via DatePicker API
- Home page (`/Library/Home`) inject “Book a study room” tile → navigate to `/Library/Room` with extension panel open

**Risky:**

- Submitting bookings without testing Insignia validation messages
- Parsing availability if data is only in rendered HTML/images
- Breaking when Insignia upgrades Kendo bundle

**Mitigation:** Adapter module with selector version constant; feature flag `TEST_MODE` that stops before POST.

---

## 6. Screenshots

D3 Appendix A (2026-10-22) remains the baseline desktop/mobile evidence. Live audit confirms same structure on 2026-10-23.

---

## 7. Spike results (2026-10-23)

| Item | Finding |
| :--- | :--- |
| Grid schema | `t102Title`, `t102Identifier`, `t102Capacity`, `t102RoomMaxiBookingTime` (60 min) |
| Free slot CSS | `.roomBookingTimeCell` without `.disabledTimeCell_Room` or `.appendingApproved_Room` (after `checkBookedRoomDayByDay`) |
| Hour headers | `#roomTime_Room_7` … 15-minute quarters per hour |
| Purpose input | `#txt_Purpose_Room` |
| Book button | `#btn_Book_Room` |

## 8. Next technical spikes

1. Trace XHR on Book (network response / booking ID for pass screen).  
2. Confirm My Room Bookings URL and post-booking DOM.  
3. Mobile emulation 320px — R5 walkthrough on extension overlay.
