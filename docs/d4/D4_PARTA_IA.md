# D4 Part A — Information Architecture

**Concept:** Free Rooms First (D3) · **Core task:** Book one study room on the live Insignia portal.

## Navigation pattern

| Layer | Pattern | Description |
| :--- | :--- | :--- |
| Portal shell | **Hierarchical** | Global header (Home, My Account, …) unchanged; extension reskins header and Home layout. |
| Home → booking | **Hub-and-spoke** | Home **Services** pane exposes “Book a study room” as a primary spoke to `/Library/Room`. |
| Room page | **Flat / sequential wizard** | Three steps with back/next: **Day → Room & time → Confirm**; success **pass** screen closes the task. |
| Post-booking | **Exit to native** | “Return to Home” footer; “Book another time” resets wizard to step 2; native **My Room Bookings** remains available under My Account. |

## Card-sort alignment (validation record)

**Requirement (D4):** IA must be derived from a **card sort with users or stand-ins** — not AI-simulated participants.

### Cards used (library booking task)

| Card label | Typical grouping (expected) |
| :--- | :--- |
| Book a study room | Primary task |
| See which rooms are free | Primary / paired with book |
| Pick date and time | Booking flow |
| Confirm my booking | Booking flow |
| My room bookings | Account / history |
| Cancel or change a booking | Account |
| Ask a librarian | Help |
| Library hours / closed days | Reference |

### Session record — **team to complete before LMS submit**

| Field | Value |
| :--- | :--- |
| Date | _TBD_ |
| Facilitator | _TBD_ |
| Participants (stand-ins OK) | _Names/roles, n=__ |
| Method | Open / closed card sort |
| Resulting top-level groups | _Paste or attach photo_ |
| Changes made to this IA | _Bullets_ |

### Mapping sorted groups → prototype

| User mental group | Prototype location |
| :--- | :--- |
| Book + see free rooms | Home CTA + Room wizard step 2 (timelines, free/taken labels) |
| Date/time | Step 1 calendar (weekdays only) + step 2 range selection |
| Confirm / trust | Step 3 recap + portal Book + **pass** screen (R3) |
| My bookings | Native menu (not replaced in v1) |

## Gestalt (wireframe / structure notes)

- **Proximity:** Step recap groups DATE / ROOM / TIME / DURATION; timeline segments group by room row.
- **Similarity:** Free vs taken slots use shared chip shape; status differs by label + colour + pattern (R5).
- **Figure/ground:** Wizard card (`g10-rb-card`) vs hidden native panels (`aria-hidden`).
