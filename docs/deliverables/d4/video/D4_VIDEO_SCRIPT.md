# D4 prototype video script (~5:00)

**File name for submit:** `G10-MSMTechnologies-D4-Prototype.mp4`  
**Team:** G10 MSM Technologies · **Build:** extension v1.0.12 on `nu.insigniails.com`  
**Capture:** Screen record Chrome with extension loaded; one narrator; add captions in editor.

---

## 0:00–0:30 — User task and problem

**[Screen: Insignia Home or brief slide with persona note]**

**Narrator:**  
“We’re Team G10, MSM Technologies. Our user is a FAST student who needs a study room between classes. On the official Insignia portal, booking is hard to find, availability is hard to read, and after you book, many students aren’t sure the reservation actually saved. Our D4 prototype is a Chrome extension on the live library site—it keeps real Insignia booking in the background but redesigns the task around *free rooms first*.”

---

## 0:30–1:00 — Requirement and design response

**[Screen: Card-sort photo or wireframe flow diagram; optional R1–R3 one-liner on slide]**

**Narrator:**  
“From D2 we trace to requirements like reaching booking without help, seeing what’s free, and trusting confirmation. Card sorting with six stand-ins grouped *start booking, date, see free, time,* and *confirm* into one flow, with *ask a librarian* separate. We respond with a hub-and-spoke entry from Home and a three-step wizard on the room page: Day, Room and time, then Confirm—implemented in our extension, not a mock server.”

---

## 1:00–3:00 — Complete core workflow

**[Screen: Live demo — full happy path]**

**Narrator (voice over actions):**  
“I’m signed in at nu.insigniails.com. On Home, Services includes **Book a study room**—that’s our R1 entry.  
[Click through to `/Library/Room`.]  
Step one: I pick a weekday on the calendar.  
Step two: each room shows a timeline—free and taken slots with labels, not colour alone. I choose a start slot and an end time.  
[Select room and range.]  
Step three: the recap shows date, room, time, and duration. I add an optional purpose and press **Confirm Booking**.  
[Submit.]  
The portal processes the real Insignia book call. When it succeeds, we show a **pass** screen—*Your room is held*—with details and **Return to Home**. That’s our answer to post-booking uncertainty—requirement R3.”

*Target ~2 minutes of demo + narration; pause on pass screen.*

---

## 3:00–4:00 — Alternate / error path and recovery

**[Screen: Same flow OR stay on confirm after a completed book]**

**Narrator:**  
“If the slot was just booked, confirming again must not pretend success. Here the portal correctly reports that the time is no longer free—we show one clear error in the confirm step, not duplicate messages. Recovery: go **Back**, pick another slot, or **Book another time** from the pass screen after a successful booking. We also handle weekends as non-bookable and show a friendly message if the extension was reloaded and the page needs a refresh.”

**[Show error wireframe or live error alert briefly; show Back or new slot.]**

---

## 4:00–4:40 — Accessibility evidence and limitations

**[Screen: Tab through wizard OR short clip; optional 320px width if recorded]**

**Narrator:**  
“For Part A we logged keyboard and screen reader walks on the wizard—focus on calendar, timeline chips, and confirm; errors use a single alert for assistive tech. Free and taken slots include text labels. We fixed issues from critique—like duplicate error announcements and staying stuck on confirm after a successful portal book. We deferred a full mobile R5 study with ten participants to D5; this checkpoint is our vertical slice on desktop Chrome with spot checks at narrow width.”

---

## 4:40–5:00 — One focused feedback question

**[Screen: Pass screen or team slide with question text]**

**Narrator:**  
“For the class: **After you book, is our pass screen enough to trust the room is held—or would you still check My Room Bookings or the portal toast alone?** We’re deciding how much confirmation UI we need on top of Insignia’s own message. Thank you.”

---

## Production checklist

- [ ] Extension v1.0.12 loaded; `TEST_MODE` false for real book demo (or disclose if using test slot).
- [ ] Captions burned in or `.srt` uploaded per LMS rules.
- [ ] No passwords or student IDs on screen.
- [ ] Match the version in your submitted Word/PDF document.
