# Usability Study & Interaction Redesign: FAST-NU Insignia Library Portal

> **Applied Human-Computer Interaction (CS3014) — Final Course Project**  
> **National University of Computer & Emerging Sciences (FAST-NUCES), Islamabad**  
> **Team G10 — MSM Technologies (Section G) | Fall 2026**

[![Status](https://img.shields.io/badge/Project%20Status-Define%20Complete%20%7C%20Ideation%20%26%20Prototyping%20Next-blue.svg)](https://github.com/umaritics/fastnu-library-portal-hci)
[![Methodology](https://img.shields.io/badge/Methodology-Stanford%20d.school%20Design%20Thinking-orange.svg)](#project-lifecycle--methodology)
[![Course](https://img.shields.io/badge/Course-CS3014%20Applied%20HCI-green.svg)](https://isb.nu.edu.pk/)
[![Institution](https://img.shields.io/badge/Institution-FAST--NUCES%20Islamabad-red.svg)](https://isb.nu.edu.pk/)

---

## 📑 Table of Contents
- [Executive Summary](#-executive-summary)
- [Team Roster & Responsibility Matrix](#-team-roster--responsibility-matrix)
- [Project Lifecycle & Methodology](#-project-lifecycle--methodology)
- [Phase 0 (D0): Team Charter, Problem-Space Brief & Stakeholders](#-phase-0-d0-team-charter-problem-space-brief--stakeholder-map)
- [Phase 1 (D1A & D1B): Empathize — Fieldwork & User Research](#-phase-1-d1a--d1b-empathize--fieldwork--user-research)
- [Phase 2 (D2): Define — Synthesis, Affinity Wall & Requirements](#-phase-2-d2-define--synthesis-affinity-wall--requirements)
- [Upcoming Phases: D3 (Ideate), D4 (Prototype), D5 (Test)](#-upcoming-phases-the-road-to-completion)
- [Requirements Traceability Matrix (RTM)](#-requirements-traceability-matrix-rtm)
- [Repository File Directory](#-repository-file-directory)
- [Research Ethics & Data Anonymization](#-research-ethics--data-anonymization)

---

## 🎯 Executive Summary

The **Insignia Integrated Library System (ILS)** (`nu.insigniails.com/library`) is the official, captive digital library portal for students, faculty, and researchers at FAST-NUCES Islamabad. It represents the *sole* self-service interface on campus for reserving study rooms, browsing catalog assets, searching textbooks, and managing borrowing records.

Despite its daily importance, the portal exhibits severe usability and interaction barriers:
1. **Critical Room-Booking Friction:** The room-booking feature is hidden deep within non-intuitive nested menus (`My Account → Booking → Book Room`) without direct landing links. On the booking page, students encounter ambiguous date-selection controls, non-responsive time sliders, and real-time availability disconnects (e.g., rooms showing "unavailable" when physically vacant).
2. **Post-Booking Uncertainty:** The lack of clear, affirmative feedback leads users to question whether their reservation was saved, driving students to take manual screen captures or cross-verify in person with library staff.
3. **Fragmented Search Interfaces:** The portal exposes four competing, unexplained search modes (*Simple*, *Advanced*, *Kiosk*, *Assets*) that baffle users and hinder textbook discovery.
4. **Reliance on Human Workarounds:** Due to portal friction, students regularly bypass the system entirely, resorting to WhatsApp group queries, physical walk-ins, and direct front-desk staff interruptions.

This project executes a rigorous, multi-phase **User-Centered Design (UCD)** lifecycle — advancing through **Empathize**, **Define**, **Ideate**, **Prototype**, and **Test** — to systematically diagnose interaction failures and engineer a grounded, accessible, high-performing redesign.

---

## 👥 Team Roster & Responsibility Matrix

**Team Name:** MSM Technologies  
**Group:** G10 (Section G)  
**Academic Institution:** FAST-NUCES Islamabad — CS3014: Applied Human-Computer Interaction

| Team Member | Roll Number | Primary Stage Coordination Lead | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Muhammad Umar** | `23I-0782` | **Prototype (D4 Lead)** | Fieldwork Facilitator (P01–P10), Interactive Prototyping Lead, GitHub Project Custodian |
| **Mirza Yahya Adeel** | `23I-0768` | **Empathize (D1 Lead) & Ideate (D3 Lead)** | Research protocol oversight, D1B lead submitter, ideation workshop coordination |
| **Muhammad Usman Al Haq** | `23I-0585` | **Define (D2 Lead)** | Real-time fieldwork scribe/note-taker, D2 affinity wall builder, requirements engineering |
| **Shahmeer Atif** | `23I-0711` | **Test (D5 Lead)** | Usability evaluation protocol, metric benchmarking (R1–R5), heuristic reviews |

> *Note on Team Governance:* In accordance with the D0 Team Charter, stage leads are responsible for ensuring milestone execution, traceability, and evidence rigor, with all members actively contributing across all phases.

---

## 🔄 Project Lifecycle & Methodology

We follow the iterative **Stanford d.school Design Thinking** framework / **Double Diamond (Discover, Define, Develop, Deliver)**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       HCI PROJECT ROADMAP                                              │
├─────────────────────┬──────────────────────┬──────────────────────┬────────────────────────────────────┤
│ Phase / Milestone   │ Stage                │ Status               │ Key Deliverables                   │
├─────────────────────┼──────────────────────┼──────────────────────┼────────────────────────────────────┤
│ Phase 0 (D0)        │ Foundations          │ ✅ Completed         │ Team Charter, Problem Space, Maps │
│ Phase 1 (D1A & D1B) │ Empathize (Discover) │ ✅ Completed         │ 10 Think-Aloud Sessions + Survey   │
│ Phase 2 (D2)        │ Define (Synthesize)  │ ✅ Completed         │ Affinity Wall, Personas, HTA, Req. │
│ Phase 3 (D3)        │ Ideate (Develop)     │ 🔄 Next Up           │ Sketching, Crazy 8s, Storyboards   │
│ Phase 4 (D4)        │ Prototype (Develop)  │ 🔄 Upcoming (Lead)   │ Low & High-Fi Interactive Figma UI │
│ Phase 5 (D5)        │ Test (Deliver)       │ 🔄 Upcoming (Lead)   │ Moderated Testing vs. Criteria R1-5│
└─────────────────────┴──────────────────────┴──────────────────────┴────────────────────────────────────┘
```

---

## 🔍 Phase 0 (D0): Team Charter, Problem-Space Brief & Stakeholder Map

* **Objective:** Establish governance norms, define initial problem boundaries, formulate testable assumptions, and map institutional actors.
* **Problem-Space Hypothesis:** Students encounter interaction friction at two primary bottlenecks: locating/completing room bookings (navigation nesting and slider controls) and choosing between four unguided search modes.
* **Stakeholder Ecosystem:**
  * **Primary:** FAST-NU Undergraduate & Postgraduate students (direct users seeking study spaces and literature).
  * **Secondary:** Library Front-Desk Staff & System Administrators (absorb the operational burden when students bypass broken digital workflows).
  * **Tertiary:** Faculty Members (rely on students accessing reserved texts) and University IT (maintain licensing and infrastructure constraints).

---

## 🎙️ Phase 1 (D1A & D1B): Empathize — Fieldwork & User Research

* **Protocol:** D1A approved semi-structured interview and think-aloud observation protocol structured across 5 rigorous segments:
  * *Segment A:* Academic background, library frequency, prior portal usage.
  * *Segment B:* Retrospective study room booking experiences.
  * *Segment C:* Moderated think-aloud observed room booking attempt (with an explicit *stop-rule* before completing live transactions).
  * *Segment D:* Observed book search execution (simple vs. advanced vs. filter discovery).
  * *Segment E:* Probing student workarounds, fallback methods, and closing thoughts.
* **Fieldwork Execution (D1B):**
  * **10 Face-to-Face Sessions (P01–P10):** Facilitated by Muhammad Umar; scribed by Muhammad Usman Al Haq across diverse campus venues (Library, Basement Cafeteria, Department Corridors).
  * **Quota Diversity:** 3 Undergraduates (Years 1–2), 3 Undergraduates (Years 3–4), 2 Postgraduates (MS/MBA), 2 Front-Desk Bookers. 50% Computing / 50% Non-Computing.
  * **Supplementary Evidence:** 9 anonymous survey responses (S01–S09) collected to cross-corroborate qualitative observations.
* **Key Empirical Discoveries:**
  * Multiple students had zero awareness that online room booking even existed (*"Nobody told us,"* P01).
  * Task abandonment observed due to hidden navigation (*"Searched for ~4 minutes and gave up,"* P05).
  * Temporal ambiguity: Confusion over current vs. future date selection (*"Is this today or tomorrow?"* P02; *"I couldn't understand the slider,"* S09).
  * The Desk as Default: Students systematically resort to walking in or checking via WhatsApp groups because the portal’s reported availability contradicts physical reality.

---

## 🧠 Phase 2 (D2): Define — Synthesis, Affinity Wall & Requirements

* **Physical Affinity Synthesis:** The team built a physical affinity wall using **17 discrete, handwritten evidence notes** sourced from 9 participants (P01–P07, P09, P10), bottom-up grouped into **6 clusters (K1–K6)** and distilled into **3 overarching thematic chains (T1–T3)**:

```
[17 Physical Evidence Notes]
       │
       ▼
 ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
 │ K1: Work │ K2: Real │ K3: Zero │ K4: Auth │ K5: Time │ K6: Post │
 │ arounds  │ Disconn. │ Awaren.  │ Friction │ Ambiguity│ Uncert.  │
 └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘
      │          │          │          │          │          │
      └────┬─────┘          └────┬─────┘          └────┬─────┘
           ▼                     ▼                     ▼
      Theme T1 (Lead)       Theme T2              Theme T3
   Availability Mismatch   Discoverability      Temporal Controls &
   & Human Workarounds     & Authentication       Feedback Absence
```

### Thematic Insights & Needs
1. **Theme T1 (Leading Opportunity):** Students ask friends, walk in, or rely on the front desk to identify free rooms.
   * *Insight (I1):* They cannot tell from the portal which rooms and slots are actually free.
   * *Need (N1):* **To know which rooms are free before committing to a booking.**
2. **Theme T2 (Supporting):** Infrequent bookers fail to discover the feature and encounter credential confusion.
   * *Insight (I2):* Students learn room booking exists only by word of mouth and cannot locate its entry point.
   * *Need (N2):* **To know that room booking exists and immediately where it starts.**
3. **Theme T3 (Supporting):** Ambiguity around date/slot controls and persistent doubt over whether a reservation was saved.
   * *Insight (I3):* Controls lack clarity and confirmation feedback is absent, compelling students to take screenshots or verify in person.
   * *Need (N3):* **To be sure of chosen booking parameters and receive definitive confirmation that the room is reserved.**

### Persona Spectrum
Rather than a single flat persona, the findings yielded a **Persona Spectrum** based on degree of reliance on the portal:
* **Point A — Desk-and-Friends Booker (P01, P05, P06, P09):** Low portal reliance; relies on walk-ins, front desk, or peer WhatsApp groups; gives up quickly on portal navigation.
* **Point B — Hesitant Portal Booker (P02, P03, P10):** Moderate portal usage; attempts online booking but remains plagued by doubt; screenshots confirmation screens.
* **Point C — Practiced Portal Booker (P04, P07):** High portal reliance; power user who navigates rapidly but struggles with unintuitive availability matrices and confusing slots.

### Point-of-View (POV) & How-Might-We (HMW) Statements
* **POV 1 (Leading):** *Students who book study rooms need to know which rooms are free before they commit to a booking because they cannot tell from the portal which rooms are actually free.*
  * **HMW 1:** *How might we help students who book study rooms know which rooms are free before they commit to a booking?*
  * **HMW 2:** *How might we make it possible for students to tell which rooms are actually free without asking someone who can physically see the rooms?*
* **POV 2 (Supporting):** *Students who book study rooms need to be sure what they have chosen and that the booking is held for them because controls are ambiguous and confirmation is uncertain.*
  * **HMW 3:** *How might we help students be sure of their choices and confident that their booking is held?*
* **POV 3 (Supporting):** *Students who book study rooms need to know that room booking exists and where it starts because discovery currently depends on word of mouth.*
  * **HMW 4:** *How might we help students know that room booking exists and where it starts?*

---

## 📐 Requirements Traceability Matrix (RTM)

All design solutions in subsequent phases must directly satisfy the 5 measurable requirements defined in D2:

| Req ID | Class | Requirement Outcome | Testable Success Criterion | Traced Evidence | Persona |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **R1** | **Usability** | First-time users can reach the room-booking page unassisted. | **$\ge$ 80%** of first-time room bookers reach the booking page unassisted within **2 minutes** in a moderated test of $\ge$ 10 students starting from the portal URL. | T2, I2, N2 (`P01-B2`, `P05-C1`, `P06-C2`, `SV-1`) | U1 / Persona A |
| **R2** | **Usability** | Students can identify free rooms for a chosen day/time from the booking page alone. | **$\ge$ 90%** of participants correctly identify every free and taken room/slot across 3 prepared views (all taken, one free, several free) in **$\le$ 30 seconds** per view with 0 errors. | T1, I1, N1 (`P04-B2`, `P07-C2`, `P09-B1`, `SV-5`) | U2 / Persona C |
| **R3** | **UX** | Students feel confident that their completed booking is reserved and held. | Mean rating of **$\ge$ 4.0 / 5.0** (with 0 individual ratings below 3.0) on *"I am sure this booking is held for me"* immediately following completion. | T3, I3, N3 (`P03-B1`, `P03-C2`, `P10-C2`, `SV-4`) | U3 / Persona B |
| **R4** | **Usability** | Students select and enter the intended date, slot, and duration accurately on the first attempt. | **$\ge$ 90%** of participants successfully book a specified room, date, and 2-hour duration on their **first attempt** with no corrections, errors, or assistance. | T3, I3, N3 (`P02-C2`, `P06-C3`, `P07-B1`, `SV-3`) | U3 / Persona B |
| **R5** | **Accessibility** | Students can read status and complete bookings on small mobile viewports without color reliance or zooming. | **100% pass across 6 WCAG 2.2 checkpoints** at 320 CSS px width & 200% text size: (1) no horizontal scroll, (2) zero pinch-zoom, (3) $\ge 24\times24$ px tap targets, (4) color-blind friendly cues, (5) contrast $\ge$ 4.5:1, (6) screen reader announcements. | T1, T3 (`P08-B1`, `P08-C1`, `P08-C2`, `P09-C2`, `SV-6`) | All Personas |

---

## 🚀 Upcoming Phases: The Road to Completion

This repository tracks the project as it transitions from research and definition into concrete design engineering:

```
[Completed]             [Current / Next]          [Upcoming]             [Final]
   D0 & D1 & D2       ──▶     D3: Ideate        ──▶   D4: Prototype    ──▶   D5: Test
(Research & Define)       (Design Concepts)       (Interactive UI)       (Evaluative Lab)
```

### 1. Phase 3 (D3): Ideation & Concept Exploration
* **Ideation Workshops:** Divergent thinking exercises including Crazy 8s, alternative wireframe sketches, and navigation re-architectures.
* **Component-Level Solutioning:**
  * Real-time Interactive Grid / Room Availability Matrix (solving R2).
  * Direct 1-Click Home Dashboard Navigation widget (solving R1).
  * Clear Time-Block Selector replacing the uncalibrated slider (solving R4).
  * Immediate Confirmation Modal with QR Pass and Calendar (.ics) export (solving R3).

### 2. Phase 4 (D4): Interactive Prototyping *(Lead: Muhammad Umar)*
* **Low-Fidelity Wireframes:** Structural layout testing on mobile and desktop viewports.
* **Mid-to-High-Fidelity Interactive Prototype:**
  * Developed in **Figma** with comprehensive component states (default, hover, active, error, reserved).
  * Mobile-first responsive design strictly conforming to WCAG 2.2 AA standards (320px viewport baseline, touch targets $\ge 24\times24$px).
  * Complete click-through booking flow: Sign-in $\rightarrow$ Instant Room Matrix $\rightarrow$ Slot Selection $\rightarrow$ Review & Affirmative Confirmation.

### 3. Phase 5 (D5): Evaluative Usability Testing *(Lead: Shahmeer Atif)*
* **Moderated Usability Evaluation:** Lab tests with $\ge 10$ representative FAST-NU students spanning Personas A, B, and C.
* **Validation Against Benchmarks:** Strict verification of metrics against **R1, R2, R3, R4, and R5**.
* **Instrumentation & Metrics:**
  * Task Completion Rate (TCR) & Time on Task (ToT).
  * System Usability Scale (SUS) benchmarking (target: SUS score $\ge 80$).
  * Single Ease Question (SEQ) after core booking steps.
  * Final comparative analysis between the legacy Insignia portal and the redesigned solution.

---

## 📁 Repository File Directory

```
.
├── .gitignore                                                               # Clean ignore rules for MS Office & OS artifacts
├── README.md                                                                # Master project documentation & lifecycle overview
├── D0_Team_Charter_Problem_Space_Stakeholder_Map.docx                      # D0: Governance charter, initial scope & stakeholder map
├── G_23I-0782_MSM_Technologies.docx                                       # D0 Submission document (Muhammad Umar - 23I-0782)
├── G_23I-0782_MSM_Technologies.pdf                                        # D0 Official PDF deliverable
├── D1A_Research_Questions_Materials_Protocol (1).pdf                       # D1A: Ethical screener, consent script & think-aloud protocol
├── G10-msmTechnologies_D1B.docx                                            # D1B: Anonymized fieldwork logs (P01-P10) & reflection
├── D2_Synthesis_Report_G10.docx                                            # D2: Define stage synthesis report & requirements baseline
└── D2 Synthesis Report, Problem Statement and Requirements (G10, 17-note wall).docx # D2: Rebuilt version based on 17-note physical affinity wall
```

---

## 🔒 Research Ethics & Data Anonymization

In accordance with institutional research standards:
* **Informed Consent:** Every participant received an explicit verbal consent briefing (D1A Section 3.1) prior to any interview or observation.
* **Transaction Stop-Rule:** All observed booking sessions stopped strictly at the final confirmation screen to avoid creating phantom reservations or disrupting actual campus library operations.
* **Complete Anonymity:** All participant records are strictly anonymized using alphanumeric masks (`P01` to `P10` for interviewees, `S01` to `S09` for survey respondents). No personal student identification or login credentials appear in any public record.

---

## 📜 Academic Integrity & License

This project is conducted as part of the academic curriculum for **CS3014: Applied Human-Computer Interaction** at the **National University of Computer & Emerging Sciences (FAST-NUCES)**, Islamabad Campus. All research data, affinity syntheses, and design artifacts are the intellectual property of **Team G10 (MSM Technologies)**.
