# D4 Part A — Accessibility audit log

**Team G10 · MSM Technologies · Build:** extension v1.0.12 on `/Library/Room`  
**Method:** Keyboard-only and screen-reader-informed walkthroughs on the **functional wizard** (wireframes used for structure only).  
**Dates:** November 2026 (iterative during prototype build and pre-submit review)

| Role | Member | Contribution |
| :--- | :--- | :--- |
| Keyboard walkthrough lead | Shahmeer Atif | Steps 1–6, focus order log |
| Screen reader walkthrough | Muhammad Usman Al Haq | NVDA/Narrator steps + announcements |
| Retest after fixes | Muhammad Umar | Confirm + pass flow after v1.0.10+ |
| POUR synthesis | Mirza Yahya Adeel | Grouped findings, wireframe alignment |

---

## Keyboard-only walkthrough

| Step | Expected focus | Actual focus | Issue? | Notes |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Home Services → Book link | Link in services pane | N | Header nav reachable; Room link in left pane |
| 2 | Calendar day button | Day cell in grid | N | Weekend cells disabled — not in tab order as actionable |
| 3 | First free timeline segment | Slot button in row | Y → fixed | Early build: scroll area trapped focus inside long horizontal strip — added visible focus ring; scroll container does not steal Tab |
| 4 | End-time select / Review | `#g10-rb-end-select` or Next | N | Back returns to step 1 with focus on stepper |
| 5 | Confirm Booking | Primary button | Y → fixed | Confirm was easy to miss vs footer Next; confirm step hides footer Next, dedicated **Confirm Booking** centered |
| 6 | Pass → Return to Home | Footer primary | N | **Book another time** had clipped label — fixed min-width / nowrap (v1.0.12) |

**Tester (final pass):** Shahmeer Atif · **Date:** 4 Nov 2026

---

## Screen reader walkthrough

**AT:** Windows Narrator + spot-check NVDA · **Browser:** Chrome, extension loaded

| Step | Expected announcement | Heard | Issue? |
| :--- | :--- | :--- | :---: |
| Open wizard | Region / heading “Book a study room” | Title announced | N |
| Step change | Step 1–3 labels | Stepper text in reading order | N |
| Free vs taken slot | Status not colour-only | “Free” / taken state via visible text in chip | N (labels on segments) |
| Submitting | Single status update | **Duplicate:** live region + error box same text | Y → fixed |
| Confirm error | One alert | `role="alert"` on `.g10-rb-submit-error` only; live region cleared on confirm errors | Fixed v1.0.10 |
| Success pass | Success heading + details | “Your room is held” and detail list | N after success path fix |

**Tester:** Muhammad Usman Al Haq · **Date:** 4 Nov 2026

---

## Findings by WCAG 2.2 (POUR)

### Perceivable

| ID | Screen | Finding | Sev. | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| P-1 | Step 2 timelines | Free/taken relied on green/red only in early mock | 2 | **Fixed** — text labels on segments (R5-4) |
| P-2 | Confirm recap | Recap text too small vs body | 1 | **Fixed** — larger “Your choices so far” typography |
| P-3 | Pass screen | Portal toast success not visible in wizard | 2 | **Fixed** — dedicated pass screen after verified book |

### Operable

| ID | Screen | Finding | Sev. | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| O-1 | Room page shell | Header dropdown unusable when `overflow:hidden` on body | 3 | **Fixed** — nav z-index / overflow adjusted |
| O-2 | Confirm | Double submit after success; focus on same form | 3 | **Fixed** — submit lock + pass step; ignore repeat confirm |
| O-3 | Step 1 | Weekend days selectable | 2 | **Fixed** — `isBookableDay` disables Sat/Sun |
| O-4 | 320px width | Full portal chrome + wizard horizontal stress | 2 | **Deferred** — D5 formal R5 measure; wizard column scroll acceptable at 320 in spot check |

### Understandable

| ID | Screen | Finding | Sev. | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| U-1 | Confirm | Redundant instructions (“Check and confirm…”) | 1 | **Fixed** — removed duplicate copy |
| U-2 | Confirm | Label “Length” unclear | 1 | **Fixed** — renamed **Duration** |
| U-3 | Error | Same error twice (live + alert) | 2 | **Fixed** — errors on confirm only in alert box |
| U-4 | Extension reload | Cryptic “extension context invalidated” | 2 | **Fixed** — friendly banner + refresh instruction |

### Robust

| ID | Screen | Finding | Sev. | Fixed / deferred |
| :--- | :--- | :--- | :---: | :--- |
| R-1 | Bridge | Stale MAIN-world script after extension update | 3 | **Fixed** — bridge version channel + hard-refresh message |
| R-2 | Wizard mount | Native host late load — wizard never appeared | 3 | **Fixed** — mount retry + MutationObserver (v1.0.12) |
| R-3 | Hidden native UI | Kendo nodes removed from DOM | 3 | **Avoided** — `aria-hidden` + clip, not `display:none` on grid |

---

## Summary

**Fixed before D4 submit:** P-1–P-3, O-1–O-3, U-1–U-4, R-1–R-3 (keyboard/SR items in walkthrough tables).

**Deferred:** O-4 — full mobile R5 battery in **D5** with n≥10 participants; prototype team spot-checked 320px width.

**Linked to critique:** See critique record — confirm UX, error duplication, success closure, and nav fixes trace to team review during build.

---

## Critique record (wireframes + prototype alignment)

**Session type:** Team rapid critique on grayscale wireframes and live extension (not D3 concept charrette).  
**Date:** 4 November 2026 · **Location:** Team sync / studio follow-up

| Member | Focus in critique | Issues raised | Outcome |
| :--- | :--- | :--- | :--- |
| **Muhammad Umar** (D4 lead) | End-to-end flow, confirm → pass | Success toast on portal but wizard stuck on confirm; second click showed “no longer free”; confirm button alignment | Pass screen after portal success; submit lock; centered **Confirm Booking**; no rollback after success |
| **Shahmeer Atif** (Test lead) | Accessibility, R5 | Duplicate error announcement; keyboard focus on long timelines; colour-only slot states | Single alert on confirm; focus-visible on chips; free/taken text labels |
| **Mirza Yahya Adeel** (Ideate lead) | IA vs D3 “Free Rooms First” | Wireframe step 2 must show availability before commit; help separate from wizard | Wireframes W2 + card sort synthesis; Ask Librarian off wizard path |
| **Muhammad Usman Al Haq** (Define lead) | Requirements language, errors | “Length” vs duration; error messages must match portal truth; no false success | **Duration** label; strict pre-check messaging; verified book before pass |
| **All** | Wireframe pack | Flow diagram must show error return to confirm | Added W4 + `flow diagram.jpg` |

**Changes applied to wireframes:** W3 simplified copy; W4 error path; W5 pass; flow diagram documents happy + error path.

**Changes applied to extension:** Documented in POUR table above; version **1.0.12** checkpoint.
