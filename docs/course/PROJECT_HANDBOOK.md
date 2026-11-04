# G10 MSM Technologies — Project Handbook

**Course:** CS3014 Applied HCI · **Institution:** FAST-NUCES Islamabad · **System:** Insignia Library Portal (`nu.insigniails.com/Library`)

This handbook is the single place for **why** we are doing this project, **what** each phase produced, **where we are now**, and **who owns what** during prototype build. Course deliverable briefs (D4 wireframes-only guidance) inform grading artifacts; **our implementation priority is HCI compliance and measurable requirements R1–R5**, not matching D3’s Figma-only plan if that conflicts.

---

## 1. Problem (one paragraph)

FAST-NU students must use the captive Insignia portal to book library study rooms. Fieldwork (P01–P10) shows booking is hard to discover, availability is hard to read, date/time controls are ambiguous, and confirmation feels unreliable—so students walk in, message friends, or ask the desk instead. Our job is a **user-centered redesign of the room-booking task** that keeps real portal behaviour working while making the task meet R1–R5.

---

## 2. Phase map and status

| Phase | Deliverable | Stage | Status | Primary output | Lead |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | D0 | Foundations | Done | Charter, problem space, stakeholders | Team |
| 1 | D1A/D1B | Empathize | Done | Protocol, 10 think-aloud sessions, survey S01–S09 | Mirza Yahya Adeel |
| 2 | D2 | Define | Done | Affinity wall, personas, HTA, POVs, **R1–R5** | Muhammad Usman Al Haq |
| 3 | D3 | Ideate | Done | 20 concepts, selected **Free Rooms First** + storyboard | Mirza Yahya Adeel |
| 4 | D4 | Prototype | **In progress** | Browser extension overlay + accessibility evidence | Muhammad Umar |
| 5 | D5 | Test | Planned | Moderated tests vs R1–R5, Nielsen + Shneiderman eval | Shahmeer Atif |

**Current strategic pivot (team decision):** Build a **Manifest V3 browser extension** that runs on the live Insignia site, presents a mobile-first “Free Rooms First” UI, and **drives the existing Kendo/jQuery booking controls** underneath (no fake bookings in production without explicit test mode).

**Fast UI iteration:** Use `demo/` (local HTTP server + refresh) for layout, states, and R2 scenarios; port stable changes to `extension/` and reload the unpacked extension only for live portal tests.

---

## 3. What each phase means for builders

### D0–D1 (done): Evidence we must not forget

- **Leading need (N1):** Know which rooms are free before committing (T1: K1 + K2).
- **Supporting:** Discover booking exists and where it starts (N2); trust date/slot/confirmation (N3).
- **Stop rule in research:** No live booking submission in D1B—so post-submit behaviour is a known gap (D3 OR3).

### D2 (done): Requirements are law

All design and verification trace to **R1–R5** (see `docs/prototype/REQUIREMENTS_AND_TRACEABILITY.md`). Do not add features that do not trace to a POV/HMW unless explicitly scoped as “future”.

### D3 (done): Selected concept — Free Rooms First

Composite of MY-1 (availability-first list), MU-1 (home entry), MY-4 (booking pass), MU-4 (1/2/3 hr buttons, no slider in our UI). Full rationale in D3 PDF; spec in `docs/prototype/PROTOTYPE_SPEC.md`.

### D4 (now): What we are building

| Track | Owner focus | Artifact |
| :--- | :--- | :--- |
| Extension core | Muhammad Umar | `extension/` (content scripts, overlay UI, Kendo bridge) |
| HCI / a11y audit | Shahmeer Atif + all | `docs/prototype/VERIFICATION_PROTOCOL.md` logs |
| IA / wireframes (course Part A) | Team | Grayscale flows derived from extension UX, not vice versa |
| Video / demo | Team | 5 min MP4 per D4 brief |

### D5 (next): How we prove it

Moderated tasks from D2 scenario; metrics per R1–R5; expert pass with **Nielsen heuristics** and **Shneiderman’s golden rules** (see `docs/prototype/HCI_STANDARDS_REFERENCE.md`).

---

## 4. Team RACI (prototype phase)

| Workstream | Responsible | Accountable | Consulted | Informed |
| :--- | :--- | :--- | :--- | :--- |
| Extension architecture & integration | Muhammad Umar | Muhammad Umar | Usman (reqs) | Team |
| Overlay UI / design tokens | Muhammad Umar | Muhammad Umar | Mirza (D3 intent) | Team |
| Accessibility audits (keyboard, SR) | Shahmeer Atif | Shahmeer Atif | All | Team |
| Test protocol & R1–R5 scripts | Shahmeer Atif | Shahmeer Atif | Usman | Team |
| Library rules confirmation (max duration, capacity) | Muhammad Usman Al Haq | Muhammad Usman Al Haq | Library staff | Team |
| Repo / docs hygiene | Muhammad Umar | Muhammad Umar | — | Team |

---

## 5. Key URLs and navigation (live portal)

| Page | URL | Notes |
| :--- | :--- | :--- |
| Home | `https://nu.insigniails.com/Library/Home` | No room-booking entry on home today |
| Book Room | `https://nu.insigniails.com/Library/Room` | Core task; Kendo UI |
| My Room Bookings | (menu under My Account → Booking) | Confirm actual href in devtools when implementing pass |

**Legacy path students use:** My Account → Booking → Book Room (3 levels, no home shortcut).

---

## 6. Open risks (from D3, still valid)

| ID | Risk | Mitigation in prototype |
| :--- | :--- | :--- |
| OR1 | Portal data wrong vs physical rooms | Label overlay as “shown status”; D5 ask “did this match reality?” |
| OR2 | Unknown library rules | Confirm with staff before hard-coding 1/2/3 hr |
| OR3 | Unknown post-submit API | Inspect network on test booking; pass shows only real IDs |
| OR4 | No AT user in sample | Recruit for D5; run NVDA/TalkBack on extension |
| OR7 | Third-party DOM changes | Versioned selectors + feature detection; document in spec |

---

## 7. Document index

| Document | Purpose |
| :--- | :--- |
| `docs/PROJECT_HANDBOOK.md` | This file — phases, status, roles |
| `docs/prototype/HCI_STANDARDS_REFERENCE.md` | Nielsen, Shneiderman, WCAG POUR, Gestalt |
| `docs/prototype/PROTOTYPE_SPEC.md` | Extension architecture, flows, DOM bridge |
| `docs/prototype/REQUIREMENTS_AND_TRACEABILITY.md` | R1–R5 + test criteria |
| `docs/prototype/VERIFICATION_PROTOCOL.md` | How to verify standards (checklists, logs) |
| `docs/prototype/IMPLEMENTATION.md` | Extension status and architecture summary |
| `docs/prototype/CURRENT_PORTAL_AUDIT.md` | Live site technical + UX audit |
| `docs/deliverables/d4/` | D4 LMS submission (Word, Part A/B, assets, video script) |
| `.cursor/skills/*/SKILL.md` | Agent skills for build and verification |

---

## 8. Progress log (update when milestones land)

| Date | Milestone | Notes |
| :--- | :--- | :--- |
| 2026-10-23 | Research + specs package | Handbook, HCI reference, prototype spec, verification protocol, portal audit, Cursor skills |
| 2026-11-03 | Extension v1.0.12 | In-place room wizard; `docs/deliverables/d4/` submission pack |
| | R5 checkpoint walkthrough on prototype | *Pending* |
| | D4 instructor checkpoint | *Pending* |

*Last updated: 2026-11-03*
