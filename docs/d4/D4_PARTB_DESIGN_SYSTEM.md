# D4 Part B — Minimal design system

Applied in `extension/content/shell/portal-redesign.css` and `room-booking.css`. Font: **Plus Jakarta Sans** (see portal-redesign `:root`).

## Colour palette

| Token | Hex | Use |
| :--- | :--- | :--- |
| Primary / brand | `#0d4a7a` (`--g10-blue`) | Headings, primary buttons, step active |
| Primary soft | `#e8f2fa` (`--g10-blue-soft`) | Stepper track, subtle fills |
| Text | `#1a2b3c` (`--g10-text`) | Body |
| Muted | `#5c6b7a` (`--g10-muted`) | Labels, hints |
| Border | `#d4e0ed` (`--g10-card-border`) | Cards, inputs |
| **Success** | `#0d7a3e` | Live region success tone, free emphasis |
| **Error** | `#b42318` | Alerts, validation, live error tone |
| **Error surface** | `#fef3f2` / border `#fecdca` | `.g10-rb-submit-error`, extension banner |

## Type scale (3 levels)

| Level | Size | Use |
| :--- | :--- | :--- |
| Title | ~1.35–1.5rem | “Book a study room”, confirm recap title, pass h2 |
| Section / body | 14–16px | Steps, recap values, form labels |
| Caption | 12–13px | dt labels, pass note, live region |

## Spacing

- **8px grid:** padding 8 / 12 / 16 / 20 on card, panel, footer.
- **Touch targets:** buttons `min-height: 44px` (exceeds R5 24px minimum).

## Radius

- Cards: `--g10-radius` 12px  
- Buttons: pill `9999px` (primary/secondary)

## Recurring components (one styled instance each)

| Component | Class / location |
| :--- | :--- |
| Primary button | `.g10-rb-btn-primary` — Confirm Booking, Next |
| Secondary button | `.g10-rb-btn-secondary` — Back, Book another time |
| Stepper | `.g10-rb-steps` / `.g10-rb-step` |
| Calendar day | `.g10-rb-cal-day` |
| Timeline slot | `.g10-rb-tl-seg` (free / taken / selected) |
| Recap list | `.g10-rb-confirm-recap-list` |
| Error alert | `.g10-rb-submit-error` |
| Pass card | `.g10-rb-pass` |
| Loading | `.g10-rb-skeleton` |
| Live status | `#g10-rb-live` |

**Screenshots for LMS:** Capture from live extension at Home, steps 1–3, error alert, pass screen.
