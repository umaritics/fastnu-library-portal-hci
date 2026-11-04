# D4 Part A — Information Architecture

**Team:** G10 MSM Technologies · **Concept:** Free Rooms First · **Core task:** Book one study room on the Insignia portal.

---

## What this document satisfies (D4 Part A)

| Requirement | Status |
| :--- | :---: |
| Card-sort-derived IA | Complete (§ Card sort below) |
| Stated navigation pattern matched to sort | Complete (§ Navigation pattern) |
| Grayscale wireframes | Separate deliverable — [`D4_PARTA_WIREFLOW.md`](D4_PARTA_WIREFLOW.md) |
| Accessibility audit | Separate — [`D4_PARTA_ACCESSIBILITY_AUDIT.md`](D4_PARTA_ACCESSIBILITY_AUDIT.md) |

**Photos:** Attach six participant sort images in § Individual sorts (paths below).

---

## Navigation pattern

Card sort results **validated** the structure below. Six stand-ins always treated **Ask a librarian** as separate from the booking sequence; all six placed **confirm booking** last in the booking chain.

| Layer | Pattern | Rationale from sort |
| :--- | :--- | :--- |
| Portal shell | **Hierarchical** | Header / My Account unchanged; extension reskins Home and header. |
| Home → task | **Hub-and-spoke** | **Start room booking** is a primary spoke from Home Services to `/Library/Room`. |
| Room page | **Sequential wizard** | Majority orders: start → **date** → **availability/time** → **confirm** → we implement **Day → Room & time → Confirm** (date step 1; free slots + time on step 2). |
| Help | **Separate spoke** | **Ask a librarian** not a wizard step (6/6 listed apart from booking flow). |
| After success | **Closure + exit** | Pass screen; Return to Home / Book another time; history via native My Room Bookings. |

---

## Card sort — session record

| Field | Value |
| :--- | :--- |
| Date | _Add session date_ |
| Location | FAST-NUCES Islamabad (campus) |
| Facilitator | _Add name_ |
| Method | **Open card sort** — participants ordered/grouped cards; order recorded as left-to-right flow |
| Participants | **6** stand-in students (room bookers or likely bookers) |
| Cards | Six labels (see table) |

### Card labels (study)

| Sort label | Maps to prototype |
| :--- | :--- |
| Start Room Booking | Home **Book a study room** / wizard entry |
| See which rooms are free | Wizard step 2 timelines (R2) |
| pick date for booking | Wizard step 1 calendar |
| pick time for booking | Wizard step 2 slot + end time |
| confirm booking | Wizard step 3 + portal submit + pass |
| Ask a librarian | Ask Librarian / help (outside wizard) |

---

## Individual sorts

_Paste photos: `docs/deliverables/d4/assets/card-sort/P1.jpg` … `P6.jpg`_

| ID | Participant | Booking card order (after Ask a librarian) | Photo |
| :---: | :--- | :--- | :--- |
| P1 | Hashim Rahim | See which rooms are free → Start Room Booking → pick date → pick time → confirm | _attach_ |
| P2 | Saud ur Rehman | Start Room Booking → pick date → See which rooms are free → pick time → confirm | _attach_ |
| P3 | Zaid Bin Umar | Start Room Booking → pick date → See which rooms are free → pick time → confirm | _attach_ |
| P4 | Muhammad Zain | Start Room Booking → pick date → pick time → See which rooms are free → confirm | _attach_ |
| P5 | Zain ul Arifeen | Start Room Booking → pick date → See which rooms are free → pick time → confirm | _attach_ |
| P6 | Hasan Adil | Start Room Booking → pick date → See which rooms are free → pick time → confirm | _attach_ |

**Ask a librarian:** Listed first in every participant’s sort (before the booking sequence) — treated as **not part of the booking pile**.

---

## Cross-participant synthesis (n = 6)

| Finding | Count | Inference |
| :--- | :---: | :--- |
| Ask a librarian **separate** from booking sequence | 6/6 | Help stays on Home / Ask Librarian — **not** a wizard step |
| confirm booking **last** in booking order | 6/6 | Dedicated **Confirm** step + success pass (R3) |
| pick time before confirm (time not after confirm) | 6/6 | Time selection before confirm — step 2 before step 3 |
| Start Room Booking before pick date | 5/6 | Entry action then date — Home CTA then **Day** step (P1 ordered “see free” before “start”; outlier) |
| pick date before pick time | 6/6 | **Day** step before time selection |
| See which rooms are free before pick time | 5/6 | Availability before end time — timelines on step 2 (P4 placed see free after pick time — outlier) |
| Start → date → see free → time → confirm (modal pattern) | 4/6 | P2, P3, P5, P6 — closest to wizard **Day → Room & time → Confirm** |

### Outliers (documented, not ignored)

- **P1:** “See which rooms are free” before “Start Room Booking” — still one booking chain; prototype keeps **Free Rooms First** on step 2 after date (R2), with clear entry from Home.
- **P4:** “See which rooms are free” after pick time — minority; prototype keeps availability visible **with** time choice on one step to support R2 (read free/taken before committing).

### Merged top-level groups (team IA)

1. **Help** — Ask a librarian  
2. **Book a study room (flow)** — Start Room Booking → pick date → see which rooms are free + pick time → confirm booking  

### Changes from pre-sort plan

No structural change. Sort **validated** hub-and-spoke entry and a **three-step wizard** (date → availability/time → confirm). Step 2 **combines** “see free” and “pick time” because five participants placed availability before time and the prototype must satisfy **R2** (read free rooms/slots on the booking path).

---

## Mapping merged IA → prototype

| Mental group | Prototype |
| :--- | :--- |
| Start room booking | Home Services → `/Library/Room` wizard |
| pick date | Step 1 — calendar (weekdays only) |
| See free + pick time | Step 2 — room timelines, start/end selection |
| confirm booking | Step 3 — recap, Confirm Booking, portal submit |
| Trust / done | Pass — “Your room is held” |
| Ask a librarian | Shell help widget / librarian entry — not in wizard |

---

## Gestalt (for grayscale wireframes)

Document on wireframes in [`D4_PARTA_WIREFLOW.md`](D4_PARTA_WIREFLOW.md):

- **Proximity:** Recap fields grouped; each room’s timeline grouped in one row.  
- **Similarity:** Free vs taken slots same shape, different label/pattern.  
- **Figure/ground:** Wizard card vs native panels hidden behind flow.

---

## IA summary (one paragraph)

We ran an open card sort with six FAST stand-ins (Hashim Rahim, Saud ur Rehman, Zaid Bin Umar, Muhammad Zain, Zain ul Arifeen, Hasan Adil). Every participant separated **Ask a librarian** from booking and placed **confirm booking** last. Five of six ordered **pick date** before **pick time**; four of six ordered **see which rooms are free** before **pick time**, supporting a sequential **Day → Room & time → Confirm** wizard reached from a **hub-and-spoke** Home entry (**Start room booking**). The functional extension implements this IA on the live Insignia room page.
