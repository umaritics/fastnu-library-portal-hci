# D4 Part A — Accessibility audit log

**Policy:** Findings must come from **your team’s** keyboard-only and screen-reader walkthroughs (D4 brief). AI may suggest checks; **do not** paste AI-generated findings as your log.

**Build for Part A wireframes:** grayscale wireframes W0–W5 (see [`D4_PARTA_WIREFLOW.md`](D4_PARTA_WIREFLOW.md)).  
**Build for Part B re-check:** extension on `/Library/Room` — see [`D4_PARTB_ACCESSIBILITY_RECHECK.md`](D4_PARTB_ACCESSIBILITY_RECHECK.md).

Templates: [`../prototype/VERIFICATION_PROTOCOL.md`](../prototype/VERIFICATION_PROTOCOL.md) §5–6.

---

## Keyboard-only walkthrough

| Field | Value |
| :--- | :--- |
| Date | _TBD_ |
| Tester | _Name_ |
| Target | Wireframes / extension v1.0.12 |

| Step | Expected focus | Actual focus | Issue? | Notes |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Home → Book CTA | | | |
| 2 | Calendar day | | | |
| 3 | Timeline free slot | | | |
| 4 | End time / Review | | | |
| 5 | Confirm Booking | | | |
| 6 | Pass screen | | | |

---

## Screen reader walkthrough

| Field | Value |
| :--- | :--- |
| Date | _TBD_ |
| AT | NVDA / Narrator / TalkBack |
| Browser | Chrome + extension |

| Step | Expected announcement | Heard | Issue? |
| :--- | :--- | :--- | :---: |
| Open wizard | “Book a study room” / stepper | | |
| Select slot | Room + time label | | |
| Confirm | Recap or submitting | | |
| Success | Pass heading + details | | |

---

## Findings by WCAG 2.2 (POUR)

### Perceivable

| ID | Screen | Finding | Severity | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| P-1 | _Example_ | _Free/taken not by colour alone on timeline_ | — | Fixed in extension (labels) |

### Operable

| ID | Screen | Finding | Severity | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| O-1 | | | | |

### Understandable

| ID | Screen | Finding | Severity | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| U-1 | | | | |

### Robust

| ID | Screen | Finding | Severity | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| R-1 | | | | |

---

## Summary

**Fixed before D4 submit:** _List IDs_  
**Deferred (with reason):** _List IDs_  
**Studio / critique changes from a11y:** _Bullets_

## Critique record (wireframes)

| Date | Session | Attendees | Notes / changes |
| :--- | :--- | :--- | :--- |
| _TBD_ | Studio rapid critique on wireframes | | |

_D3 concept charrette is documented in D3 PDF; this table is for **D4 wireframe** critique per brief._
