# HCI Standards Reference — G10 Room Booking Prototype

Condensed reference for design decisions and D4/D5 verification. Primary sources: [Nielsen’s 10 heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), [Shneiderman’s eight golden rules](https://www.cs.umd.edu/~ben/goldenrules.html), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

---

## 1. Design goals tied to our project

| Goal | Standard basis | Our requirement |
| :--- | :--- | :--- |
| Find booking fast | Nielsen #6 Recognition; Shneiderman #8 memory load | R1 |
| Read availability at a glance | Nielsen #1 Visibility; Gestalt proximity/similarity | R2 |
| Trust outcome | Nielsen #1 Feedback; Shneiderman #3–#4 closure | R3 |
| Correct date/time first try | Nielsen #5 Error prevention; Shneiderman #5 | R4 |
| Mobile + a11y | WCAG 2.2 AA (project uses 6 explicit checkpoints) | R5 |

---

## 2. Nielsen’s 10 usability heuristics (evaluation lens for D5A)

Use in expert review: rate severity 0–4 per finding; map each finding to a heuristic.

1. **Visibility of system status** — Show selected date, room, slot, loading, success/failure immediately.
2. **Match between system and real world** — “Today / Tomorrow”, room names as students know them, 12-hour times with AM/PM.
3. **User control and freedom** — Clear Back, Cancel, undo slot selection; never trap in overlay.
4. **Consistency and standards** — Same labels in list, summary, and pass; same button styles.
5. **Error prevention** — Disable Book until summary valid; confirm destructive actions.
6. **Recognition rather than recall** — Free times visible as buttons; no colour-only status.
7. **Flexibility and efficiency** — Deep link to `/Library/Room`; optional “next free room” shortcut for experts (if scoped).
8. **Aesthetic and minimalist design** — Hide Insignia filter chrome in overlay; one column on phone.
9. **Help users recognize, diagnose, recover from errors** — Actionable messages (“Room taken—try 2:00 PM”).
10. **Help and documentation** — Short inline “How booking works” on first visit.

**Verification:** Heuristic evaluation worksheet in `VERIFICATION_PROTOCOL.md` §3.

---

## 3. Shneiderman’s eight golden rules (design checklist)

1. Strive for consistency  
2. Seek universal usability (novice + expert, phone + desktop)  
3. Offer informative feedback  
4. Design dialogs to yield closure (step progress → confirmation pass)  
5. Prevent errors  
6. Permit easy reversal of actions  
7. Keep users in control (overlay can be dismissed; native page still reachable)  
8. Reduce short-term memory load (show all choices on one screen where possible)

**Verification:** Pre-release design review tick-box in `VERIFICATION_PROTOCOL.md` §4.

---

## 4. WCAG 2.2 — POUR (audit structure)

Organize accessibility logs under four principles (D4 Part A):

| Principle | What we check on booking overlay |
| :--- | :--- |
| **Perceivable** | Text alternatives, colour not sole cue (R5-4), contrast ≥ 4.5:1 (R5-5), reflow at 320px (R5-1) |
| **Operable** | Keyboard path, focus visible, target size ≥ 24×24 CSS px (R5-3), no pinch-zoom required (R5-2) |
| **Understandable** | Clear labels, predictable navigation, error messages in plain language |
| **Robust** | Valid roles/names for custom buttons; status announcements (R5-6) |

**Project-specific R5 checkpoints (from D2):** Document pass/fail per checkpoint in the accessibility audit log with screenshot or recording reference.

---

## 5. Gestalt principles (wireframe / UI notes)

For D4 Part A wireframes, call out explicitly:

- **Proximity** — Group room name + its free-time buttons.
- **Similarity** — “Free” buttons share shape; “Taken” uses different pattern + text.
- **Figure/ground** — Summary bar fixed at bottom on mobile.
- **Continuity** — Step indicator: Find → Choose time → Confirm → Pass.

---

## 6. Booking-flow UX patterns (task-specific, industry practice)

Patterns aligned with accessible reservation flows (cf. WCAG booking guidance):

- **Progressive disclosure** — Date tab → room list → length → summary (not all filters at once).
- **Explicit confirmation** — One sentence before submit: “Room 2, Friday 24 Oct, 2:00–4:00 PM”.
- **Closure artifact** — Booking pass with ID + share (D3 MY-4).
- **Empty state** — “No rooms free today” + Tomorrow CTA (D3 OR6).

---

## 7. What we do *not* treat as “HCI compliance”

- Pixel-perfect match to Insignia branding.
- Matching D4’s “Figma-only” tooling if it blocks testing on real behaviour.
- Claiming WCAG AAA or full site conformance from overlay alone.

---

## 8. References

- Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design.* NN/g.  
- Shneiderman, B. et al. (2016). *Designing the User Interface*, 6th ed.  
- W3C (2024). *Web Content Accessibility Guidelines (WCAG) 2.2.*  
- Team D2 synthesis report — themes T1–T3, requirements R1–R5.
