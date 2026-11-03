**CS3014 · APPLIED HCI · PROJECT DELIVERABLE**

**D4: Prototype — Structure, Function and Accessibility**

*One submission in two parts · Prototype stage*

| Weight | 9% of final grade |
| :---- | :---- |
| **Design Thinking Stage** | Prototype |
| **CLO(s)** | CLO 2 |
| **Format** | Part A: Wireframe flow \+ IA validation record \+ accessibility audit log.  Part B: Working build (checkpointed live) \+ design-system notes \+ implementation documentation. |
| **Graded On** | Part A: Structural soundness and accessibility built in from this stage, not visual polish.  Part B: Whether the core task actually works, with real feedback and error handling, not visual finish alone. |
| **Video** | MP4 up to 5 minutes, submitted with the rest of D4; live presentation/demo date to be announced. |

# **What This Deliverable Is**

**One submission, two parts.** D4 is submitted once. Part A validates structure and accessibility while changes are cheap; Part B makes the core task actually work.

**Part A.** Turns D3’s storyboard into a navigable, structural prototype, and audits it for accessibility while it is still cheap to fix. This is deliberately low fidelity: the goal is validating structure and flow, not appearance.

**Part B.** Your prototype has to actually behave, not just look navigable. It is checkpointed live by an instructor: can the core task be completed, does feedback appear, does an error state behave as designed, and are Part A’s accessibility fixes still present.

# **Part A — Low-/Medium-Fidelity Interactive Prototype and Critique Record**

**1\. Information Architecture**

* A card-sort-derived information architecture for your concept’s content and functions.

* A stated navigation pattern (hierarchical, hub-and-spoke, or flat/sequential) matched to that structure.

**2\. Low-/Medium-Fidelity Interactive Prototype**

* A connected set of grayscale wireframe screens for your core task, with arrows showing navigation between them, including at least one alternate or error path.

* Visual hierarchy and at least one applied Gestalt principle, explicitly noted.

**3\. Accessibility Audit Log**

* A keyboard-only walkthrough log: every point where focus was lost, illogical, or a control was unreachable.

* A screen-reader-informed walkthrough log: any meaningless announcements or illogical reading order.

* Findings organized under WCAG’s POUR principles (Perceivable, Operable, Understandable, Robust).

* A note on which issues were fixed before submission versus deferred.

**4\. Critique Record**

* Notes from any rapid critique sessions run on the wireframes during studio time.

# **Part B — Functional Prototype Checkpoint, Design System and Implementation Documentation**

**1\. Functional Task Flow**

* A working implementation of your core task. A vertical slice (one task, fully functional) is strongly preferred over a horizontal pass that works nowhere in depth.

* If any part relies on complex or uncertain backend logic, state clearly whether it is genuinely built or simulated via Wizard-of-Oz, and why.

**2\. Minimal Design System**

* A small, consistent color palette (including semantic colors, e.g., error/success), a 2–3 level type scale, consistent spacing, and one styled version of each recurring component.

**3\. Feedback, Errors and Complete Component States**

* Visible, timely feedback for every user action.

* At least one deliberately handled error state, with a specific, actionable message.

* As many of the eight component states as your task involves: default, focus/hover, active, disabled, loading, empty, error, success.

**4\. Implementation Documentation**

* The tool or technology used to build the prototype.

* Scope decisions made (vertical vs. horizontal, and why).

* Any Wizard-of-Oz components and what they simulate.

**5\. Accessibility Re-Check**

* Confirmation that Part A’s keyboard and focus fixes are still present after any later changes.

# **D4 Video Submission**

Alongside the rest of D4, submit a five-minute prototype video for class feedback. The video supports, but does not replace, the required Part A and Part B artifacts or the instructor checkpoint. It adds no new course weight.

**Requirements**

* Format: MP4, up to 5 minutes.

* Original narration by your team, with captions.

* A readable interface, and a version that matches the prototype you submit.

* One focused feedback question at the end.

* File name: TeamNo-TeamName-D4-Prototype.mp4.

* Check sharing permissions and keep a locally playable backup.

* Submit with the rest of D4 by the existing LMS cutoff.

**Structure**

| Segment | Time | What to show |
| :---- | :---- | :---- |
| User task and problem | 0:00–0:30 | Who the user is, the task, and the problem. |
| Requirement and design response | 0:30–1:00 | The requirement, and how the design responds to it. |
| Complete core workflow | 1:00–3:00 | The core task working end to end. |
| Alternate or error path, and recovery | 3:00–4:00 | What happens when something goes wrong, and how a person recovers. |
| Accessibility evidence and limitation | 4:00–4:40 | What you actually checked, and what you could not. |
| One focused feedback question | 4:40–5:00 | One question that directs the class to a consequential design decision. |

**Rules**

* Show actual behaviour. Identify what is implemented and what is simulated, and report what cannot be tested.

* All team members attend the live presentation/demo and are prepared to explain the work.

* Do not infer usability or conformance from a demonstration alone.

**Choose a useful feedback question**

Ask “Can you distinguish request received from ready to collect?” rather than “Do you like our app?” Direct attention to a consequential design decision. (Example only; use your own prototype’s decision.)

# **Stance on AI Use**

AI tools are part of professional practice, so D4 does not ban them outright. Building is cheaper with AI; verifying what was built is the skill assessed.

| Component | AI stance | What you must show |
| :---- | :---- | :---- |
| Part A: IA and card sort | Not allowed to replace users | The IA comes from a real card sort with users or stand-ins. Synthetic or AI-simulated participants do not count. |
| Part A: wireframes | Allowed, with disclosure | AI may help lay out screens. You must still show navigation, an alternate or error path, and your own hierarchy and Gestalt notes. |
| Part A: accessibility audit | Findings must be your own | Logged issues come from your own keyboard-only and screen-reader walkthroughs of your own screens. AI may suggest what to check. |
| Part B: functional build | Allowed, with disclosure | You can explain every part, state what is genuinely built versus simulated, and the instructor checkpoints it live. |
| Part B: accessibility re-check | Findings must be your own | Re-run manually; do not accept generated code as accessible without checking it. |

**Disclosure.** Add a short AI-use note: which tool, for which step, and what you changed or verified. Use of AI in a step marked “Not allowed” is an academic-integrity matter. You are assessed on provenance and verification, not on who or what typed the artifact.

**Reflection (graded for completion only, not content).** In a sentence or two each: (1) What did you keep as your own thinking versus what came from AI? (2) How did it feel to flag your AI use here? Any genuine attempt earns full credit — responses are not evaluated on what they say, including a critical, uncertain, or negative one. (Grading note: mark present/absent only; do not score tone, stance, or substance.)

# **How This Connects**

* **D3 → D4.** Your selected concept and storyboard are the starting point for the wireframe flow.

* **Part A → Part B.** Part A’s validated structure and accessibility fixes carry forward unchanged into Part B’s functional build; do not treat Part B as a fresh start. Any accessibility issue deferred in Part A must be revisited before the instructor checkpoint.

* **D4 → D5A.** D4 is the actual subject of D5A’s expert evaluation in Week 12\. Whatever is checkpointed here is what gets inspected against Nielsen’s heuristics and Shneiderman’s rules. A prototype that only looks finished but doesn’t function will produce a thin, unconvincing expert evaluation.

# **What Strong Submissions Do (and Weak Ones Don’t)**

| Part | Component | Strong Submission | Common Weakness |
| :---- | :---- | :---- | :---- |
| Part A | Fidelity | Grayscale, boxes and labels only; structure is the point | Color and polished typography added prematurely |
| Part A | IA | Derived from an actual card sort with users or stand-ins | Decided internally by the team without validation |
| Part A | Accessibility audit | Specific, logged issues tied to exact screens, with fixes noted | A generic statement that “accessibility was considered” |
| Part B | Scope | One task, fully functional, including edge cases | Many screens, none of them actually working underneath |
| Part B | States | Loading, empty and error states designed and implemented | Only the “happy path” designed; nothing else considered |
| Part B | Checkpoint outcome | Instructor can interact with a working build live | A styled but non-functional set of static screens |

# **Submission Checklist**

☐  Card-sort-derived IA and stated navigation pattern.

☐  Connected low-/medium-fidelity wireframe flow with at least one alternate/error path.

☐  Keyboard-only and screen-reader-informed audit logs, organized under POUR.

☐  Note on which accessibility issues were fixed vs. deferred.

☐  Critique record from studio rapid-critique sessions.

☐  AI-use note completed; audit findings are from your own walkthroughs, and you can explain every part of the build.

☐  Reflection prompt answered (graded for completion only, not content).  
☐  Vertical-slice functional task flow, working live.

☐  Minimal design system applied consistently.

☐  Visible feedback and at least one handled error state.

☐  Relevant component states implemented (loading/empty/error/success as applicable).

☐  Implementation documentation, including any Wizard-of-Oz components.

☐  Part A’s accessibility fixes reconfirmed present.

☐  MP4 up to 5 minutes, with original narration and captions.

☐  Follows the six-segment structure and ends with one focused feedback question.

☐  Interface readable, and the version shown matches the submitted prototype.

☐  Shows actual behaviour; simulated parts and untestable items are identified.

☐  Named TeamNo-TeamName-D4-Prototype.mp4, permissions checked, local backup kept.

☐  All team members ready to explain the work at the live presentation/demo.