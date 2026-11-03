---
name: hci-verification-g10
description: Runs G10 CS3014 HCI verification for the library room-booking prototype against R1–R5, Nielsen heuristics, Shneiderman golden rules, and WCAG 2.2 POUR checkpoints. Use when planning or executing usability tests, accessibility audits, heuristic evaluations, or D4/D5 evidence logs.
---

# HCI Verification — G10

## Quick reference

| Standard | Document section | Output artifact |
| :--- | :--- | :--- |
| R1–R5 | `docs/prototype/VERIFICATION_PROTOCOL.md` §2 | Moderated test spreadsheet |
| WCAG / POUR | `docs/prototype/VERIFICATION_PROTOCOL.md` §5–6 | Keyboard + SR logs |
| Nielsen | `docs/prototype/VERIFICATION_PROTOCOL.md` §3 | Heuristic table |
| Shneiderman | `docs/prototype/VERIFICATION_PROTOCOL.md` §4 | Design review ticks |
| Principles | `docs/prototype/HCI_STANDARDS_REFERENCE.md` | — |

## Rules (course compliance)

- Audit **findings must be from human walkthroughs** — AI may suggest what to check, not replace logs.
- Disclose AI use in D4 reflection.
- Do not claim WCAG site-wide conformance from overlay only.

## R5 six checkpoints (must all pass)

1. No two-way scroll at 320px  
2. No pinch-zoom to complete task  
3. Targets ≥24×24 CSS px  
4. Status without colour alone  
5. Contrast ≥4.5:1  
6. Screen reader announces status + result  

Log each as PASS/FAIL with evidence link (screenshot, recording timestamp).

## Pilot before full D5

- Internal n=3 across persona A/B/C proxies before scheduling n≥10.

## Severity for heuristic issues

Use 0–4 scale in §3 template; block release on 3–4 in core booking flow.

## Traceability

Map every finding to requirement ID (R1–R5) or heuristic number when possible.

See `docs/prototype/REQUIREMENTS_AND_TRACEABILITY.md` for POV chain.
