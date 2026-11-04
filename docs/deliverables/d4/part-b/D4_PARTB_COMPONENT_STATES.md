# D4 Part B — Component states

Maps D4 “eight states” to the room-booking wizard (as implemented).

| State | Where it appears | Implementation |
| :--- | :--- | :--- |
| **Default** | Buttons, calendar days, timeline segments | Base CSS; unselected slots |
| **Focus / hover** | `:focus-visible` on buttons, calendar nav, slots | `room-booking.css` focus rings |
| **Active** | Selected calendar day, selected timeline range, active step | `.is-active`, selected segment classes |
| **Disabled** | Next until valid; weekends; taken slots; during submit | `disabled` attr, `.is-disabled`, grey taken |
| **Loading** | Step 2 room load | `.g10-rb-skeleton`, `loading` flag, live “Loading rooms…” |
| **Empty** | No rooms for date | Message via live region / empty schedule copy |
| **Error** | Confirm submit fail, weekend, extension invalidated | `.g10-rb-submit-error`, banner, live cleared on confirm errors |
| **Success** | Pass screen after verified book | `.g10-rb-pass`, stepper `is-done`, footer “Return to Home” |

## Action → feedback (timely)

| User action | Feedback within ~300ms |
| :--- | :--- |
| Pick day | Live: date label; calendar selection |
| Pick start slot | Live: room + start; end-time control appears |
| Pick end | Live: duration sentence |
| Confirm | Live: submitting…; then pass or alert |
| Book another | Wizard reset to step 2; timelines refresh |

## Deliberate error demo (checkpoint / video)

**Scenario:** Complete a real booking → pass screen → **Book another time** or stay on confirm and click again → **“That time is no longer free on the portal.”** (expected recovery: pick another slot or date).
