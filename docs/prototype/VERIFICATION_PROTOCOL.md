# Verification Protocol — Standards and R1–R5

How G10 proves the prototype meets HCI standards. **Findings must come from team walkthroughs** (D4 AI policy). Use this document as the template for audit logs.

---

## 1. When to run

| Gate | Timing | Required artifacts |
| :--- | :--- | :--- |
| G1 — Structure | Before coding overlay UI | IA note, wireframe path + error path |
| G2 — Alpha | First working bridge to grid | Keyboard log draft on overlay |
| G3 — Beta | Feature complete | Full R5 + R1–R4 pilot (n≥3 internal) |
| G4 — Submission | D4 deadline | Completed logs + video demo |

---

## 2. R1–R5 test scripts (moderated)

### R1 — Discoverability

- **Participant:** Never booked on portal (or screened out if has).  
- **Start:** `https://nu.insigniails.com/Library/Home` on own phone, extension on.  
- **Task:** “Book a study room for later today.”  
- **Measure:** Time to `/Library/Room` or overlay equivalent; assistance = fail.  
- **Pass bar:** ≥80% ≤120s among n≥10.

### R2 — Availability reading

- **Setup:** Three views V1–V3 (see `REQUIREMENTS_AND_TRACEABILITY.md`).  
- **Task:** “Tell me every free room and time, and which are taken.”  
- **Measure:** Accuracy per view; time ≤30s; no asking others.  
- **Pass bar:** ≥90% across participants.

### R3 — Confidence

- **After** completed test booking (or wizard-of-oz only if OR3 blocks live submit — disclose).  
- **Question:** “I am sure this booking is held for me” (1–5 Likert).  
- **Pass bar:** Mean ≥4.0, min individual ≥3.

### R4 — First-attempt accuracy

- **Task card:** “Book Room X on [date] from [time] for 2 hours.”  
- **Pass:** Correct room, date, start, 2h duration, no backtracking, no help.  
- **Pass bar:** ≥90%.

### R5 — Accessibility walkthrough

Run on **overlay only** at 320×568 (or 320 CSS px) and at 200% zoom:

| Step | Action | Record |
| :--- | :--- | :--- |
| 1 | Tab through full booking flow | Focus order log |
| 2 | Complete without pinch-zoom | Pass/fail |
| 3 | Measure chip buttons | WxH px |
| 4 | Toggle high-contrast / sim daltonism | Status still readable |
| 5 | Sample text/background pairs | Ratio values |
| 6 | SR: select slot, confirm, result | Transcript or notes |

Log under POUR headings (D4 Part A).

---

## 3. Nielsen heuristic evaluation (D5A prep)

**Evaluators:** ≥2 team members independently, then merge.

| # | Heuristic | Severity 0–4 | Finding | Screen | Fix status |
| :---: | :--- | :---: | :--- | :--- | :--- |
| 1 | Visibility of system status | | | | |
| … | … | | | | |
| 10 | Help and documentation | | | | |

Severity: 0 none, 1 cosmetic, 2 minor, 3 major, 4 catastrophe.

**Acceptance for release:** No open severity 3–4 on core flow; severity 2 has fix or documented deferral.

---

## 4. Shneiderman golden rules review

Design review before G3 (tick ✅ / ⚠️ / ❌):

| Rule | Question | Result |
| :--- | :--- | :--- |
| 1 Consistency | Same words for “Free”, “Book”, room names everywhere? | |
| 2 Universal usability | Works for persona A on phone without training? | |
| 3 Feedback | Every tap has visible/state change within 300ms? | |
| 4 Closure | Clear end state (pass) after confirm? | |
| 5 Error prevention | Book disabled until summary valid? | |
| 6 Reversal | Can user change time before submit? | |
| 7 User control | Can dismiss overlay and use native UI? | |
| 8 Memory load | Free times visible without remembering filter state? | |

---

## 5. Keyboard-only walkthrough log (template)

**Date:**  
**Tester:**  
**Build:** extension version / commit  

| Step | Expected focus | Actual focus | Issue (Y/N) | Notes |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Home CTA | | | |
| 2 | Today tab | | | |
| 3 | First free time chip | | | |
| … | Confirm button | | | |

**Issues fixed before submit:**  
**Issues deferred:**  

---

## 6. Screen reader walkthrough log (template)

**AT:** NVDA / TalkBack  
**Browser:**  

| Step | Expected announcement | Heard | Issue |
| :--- | :--- | :--- | :--- |
| Open panel | “Book a study room” region | | |
| Free slot button | “Free 2 PM, Room …” | | |
| Confirm | Summary text | | |
| Success | “Booking confirmed, ID …” | | |

---

## 7. Automated assists (optional, not substitute)

- **axe DevTools** on overlay root — triage only.  
- **Lighthouse accessibility** — supplemental.  
- Do not claim conformance from automation alone (D4 stance).

---

## 8. Sign-off

| Role | Name | G3 pass? | Date |
| :--- | :--- | :---: | :--- |
| Prototype lead | | | |
| Test lead | | | |
| Define lead | | | |
