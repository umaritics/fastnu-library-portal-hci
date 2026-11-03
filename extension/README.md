# G10 — Insignia Room Booking Extension (Prototype)

Manifest V3 **in-place HCI redesign** on the live FAST-NU library portal: reskinned header/Home plus a **Free Rooms First** booking wizard on `/Library/Room`. Submissions write-up: [`../docs/d4/D4_PARTB_IMPLEMENTATION.md`](../docs/d4/D4_PARTB_IMPLEMENTATION.md).

**Version:** 1.0.12 (see `content/config.js`)

## Install (Chrome / Edge)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. **Load unpacked** → select this `extension/` folder.
4. Sign in at [https://nu.insigniails.com/Library/Home](https://nu.insigniails.com/Library/Home).
5. Hard-refresh tabs (**Ctrl+F5**). On Home you should see the redesigned layout; open **Book Room** for the wizard.

**Verify:** DevTools → Elements → `<html data-g10-extension="1.0.12" class="g10-redesign …">`.

## Booking flow

1. **Day** — calendar (weekdays only).  
2. **Room & time** — per-room timelines, pick start + end.  
3. **Confirm** — recap, purpose, **Confirm Booking** (real portal submit).  
4. **Pass** — confirmation screen; **Return to Home** or **Book another time**.

## TEST_MODE

| `content/config.js` | Behaviour |
| :--- | :--- |
| `TEST_MODE: false` | **Production** — native Book creates a real reservation |
| `TEST_MODE: true` | Skips real Book (dev only) |

Optional override: extension storage key `g10_test_mode` (boolean) on load.

## Develop UI without reloading the extension

```bash
python -m http.server 8765
```

Open [http://localhost:8765/demo/](http://localhost:8765/demo/) — see [`../demo/README.md`](../demo/README.md).

## Scripts (load order)

Listed in `manifest.json`. Global: `window.G10RoomBooking`.

- `G10RoomBooking.availability.fetchForDate(date)`
- `G10RoomBooking.pageBridge.submitRoomBooking(payload)` (via `submitBridge.confirmBooking`)

## Troubleshooting

- **Extension UI missing on Room** — Reload extension, Ctrl+F5; wait for portal DOM; check console for `[G10 Library] Room booking wizard mounted`.
- **`G10RoomBooking` undefined in page console** — Normal (isolated world); use extension console logs or `data-g10-extension`.
- **Empty rooms** — Run native Search once; confirm Islamabad campus if required.
- **Bridge mismatch** — Hard-refresh after extension update so `page-world.js` version matches `config.js`.

## Library rule

Grid metadata often shows **max 60 minutes** per booking; confirm with library staff for policy demos.
