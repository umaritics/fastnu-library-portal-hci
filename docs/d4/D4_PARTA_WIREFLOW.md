# D4 Part A — Wireflow (structural reference)

Low/medium fidelity for submission: export **grayscale** Figma/PDF screens from this flow (boxes + labels). This document is the **connected flow** with an error path.

## Happy path

```mermaid
flowchart TD
  A[Home — Services: Book a study room] --> B["/Library/Room — Step 1: Day"]
  B --> C[Step 2: Room and time — timelines]
  C --> D[Step 3: Confirm — recap + purpose]
  D --> E[Submit — native portal Book]
  E --> F[Pass — Your room is held]
  F --> G[Return to Home]
  F --> H[Book another time → Step 2]
```

## Alternate / error paths

```mermaid
flowchart TD
  B[Step 1 Day] --> W[Weekend selected — error message, no advance]
  C[Step 2] --> Z[No rooms / loading empty — empty or skeleton state]
  D[Step 3 Confirm] --> E1[Slot taken on second submit — alert: no longer free]
  D --> E2[Extension reloaded — banner: refresh page]
  D --> E3[Portal rejects — submit error with portal text]
  E1 --> D
  E2 --> R[User Ctrl+F5 then restart]
```

## Screen inventory (for grayscale wireframes)

| ID | Screen | Key elements |
| :---: | :--- | :--- |
| W0 | Home (partial) | Header, Services tile “Book a study room” |
| W1 | Wizard step 1 | Stepper, month calendar, weekday disable |
| W2 | Wizard step 2 | Room rows, horizontal timelines, end-time select |
| W3 | Wizard step 3 | Large recap, purpose field, Confirm Booking |
| W4 | Error on W3 | Red alert (single), example: slot no longer free |
| W5 | Pass | Heading, booking details, Book another time |

## Visual hierarchy (Part A note)

1. **Primary:** Current step in stepper; primary CTA (Next / Confirm Booking).
2. **Secondary:** Recap on confirm; room name on timeline row.
3. **Tertiary:** Purpose optional; helper live region during submit.

**Action:** Export W0–W5 as grayscale PNG/PDF for LMS Part A pack.
