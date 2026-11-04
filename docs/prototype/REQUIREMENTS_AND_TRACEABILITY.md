# Requirements and Traceability — R1 to R5

Source of truth: **D2 synthesis** (`docs/deliverables/d2/D2_MSM_Technologies_G10.pdf`). This document restates outcomes and links them to the **extension prototype** and verification methods.

---

## Requirements table

| ID | Type | Outcome | Success criterion (D2) | Prototype feature | POV / HMW |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **R1** | Usability | First-time bookers reach booking unassisted | ≥80% reach booking page within 2 min from portal URL on own phone, n≥10, no help | Home CTA tile; FAB on other pages; deep link `/Library/Room` | POV3, HMW4 |
| **R2** | Usability | Tell which rooms are free for chosen day/time from booking page alone | ≥90% correct on 3 prepared views, ≤30s each, no help | Today/Tomorrow tabs; per-room “Free HH:MM” buttons; “Taken all day” text; non-colour patterns | POV1, HMW1–2 |
| **R3** | UX | Feel sure booking is held | Mean ≥4.0 on “I am sure this booking is held for me”; no score &lt;3 | Summary before confirm; booking pass with ID; share | POV2, HMW3 |
| **R4** | Usability | Correct date, slot, length first attempt | ≥90% book specified room/date/2hr first try, no corrections | Tap free time = date+start; 1/2/3 hr chips; summary line | POV2, HMW3 |
| **R5** | Accessibility | Mobile booking without colour-only or pinch-zoom | 100% of 6 WCAG checkpoints at 320px & 200% text | Single column; 44px targets; `aria-live` status; contrast tokens | POV1/3 |

---

## User stories (D2 §3.1)

| ID | Persona | Story (abbrev.) | Req |
| :--- | :--- | :--- | :--- |
| U1 | A — Desk-and-friends | Start booking on phone without desk | R1 |
| U2 | C — Practiced | See free rooms without refresh/friends | R2 |
| U3 | B — Hesitant | Sure of date/slot and that booking held | R3, R4 |

---

## Traceability chain (evidence → requirement)

```
P09-B1, P04-B2, P07-C2 → T1 → I1 → N1 → POV1 → R2
P01-B2, P05-C1 → T2 → I2 → N2 → POV3 → R1
P03-B1, S09-F3 → T3 → I3 → N3 → POV2 → R3, R4
P08-C1, P09-C2 → K7/K2 → R5
```

Full table: D2 §3.3.

---

## Prepared views for R2 testing (D5)

| View ID | Setup | Pass condition |
| :--- | :--- | :--- |
| V1 | All rooms taken for selected day | Participant states “none free” correctly |
| V2 | Exactly one room with one free slot | Names room + time |
| V3 | Several rooms with multiple free slots | Lists all free; identifies all taken |

Use seeded test day on staging or controlled time window with library coordination.

---

## R5 checkpoint detail

| # | Criterion | WCAG | Test tool |
| :---: | :--- | :--- | :--- |
| 1 | No horizontal / two-way scroll | 1.4.10 Reflow | Chrome DevTools 320px |
| 2 | Complete booking without pinch-zoom | Best practice + R5 script | Manual |
| 3 | Targets ≥24×24 CSS px (design 44px) | 2.5.8 | Measure in DevTools |
| 4 | Status identifiable without colour | 1.4.1 Use of Color | Colour blindness sim + text labels |
| 5 | Text contrast ≥4.5:1 | 1.4.3 | axe or Contrast checker |
| 6 | SR announces status and result | 4.1.3 Status Messages | NVDA or TalkBack |

---

## Out of scope requirements

- **T4 / book search (N4):** synthesized in D2 but not in POV/requirements for prototype.  
- **R2 data accuracy:** OR1 — display can be clear but wrong if server data wrong.

---

## Change log

| Version | Date | Change |
| :--- | :--- | :--- |
| 0.1 | 2026-10-23 | Initial traceability for extension approach |
