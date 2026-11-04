"""Append D4 Part B sections to the combined Word submission (once)."""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_BREAK
from docx.shared import Inches

ROOT = Path(__file__).resolve().parent.parent
DOC_PATH = ROOT / "submission" / "G10-MSMTechnologies-D4.docx"
WIREFRAMES_DIR = ROOT / "assets" / "wireframes"
MARKER = "12. Part B — Functional prototype checkpoint"


def has_part_b(doc: Document) -> bool:
    return any(MARKER in p.text for p in doc.paragraphs)


def add_heading(doc, text, level=1):
    doc.add_heading(text, level=level)


def add_picture(doc, filename, width_in=5.2):
    path = WIREFRAMES_DIR / filename
    if not path.is_file():
        doc.add_paragraph(f"[Missing image: {filename}]")
        return
    doc.add_picture(str(path), width=Inches(width_in))
    doc.add_paragraph("")


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    for j, h in enumerate(headers):
        table.rows[0].cells[j].text = h
    for i, row in enumerate(rows):
        for j, cell in enumerate(row):
            table.rows[i + 1].cells[j].text = str(cell)
    doc.add_paragraph("")


def append_part_b(doc: Document):
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    add_heading(doc, MARKER, level=1)
    doc.add_paragraph(
        "Team G10 MSM Technologies · CS3014 D4 · Build: Manifest V3 browser extension v1.0.12 "
        "on https://nu.insigniails.com/Library/* · Repository: github.com/umaritics/fastnu-library-portal-hci"
    )

    # --- 12.1 Functional task flow ---
    add_heading(doc, "12.1 Functional task flow (vertical slice)", level=2)
    doc.add_paragraph(
        "Core task: an authenticated patron books one study room on the live Insignia portal. "
        "One task in depth (not a horizontal pass across search/kiosk/assets)."
    )
    flow = [
        "Home — Services link Book a study room → /Library/Room",
        "Step 1 Day — calendar (weekdays only); syncs native date picker",
        "Step 2 Room & time — per-room timelines (15 min slots); pick start and end",
        "Step 3 Confirm — recap, optional purpose, Confirm Booking",
        "Submit — MAIN-world bridge drives Kendo Room(), portal Book, success detection",
        "Pass — Your room is held; Return to Home or Book another time",
    ]
    for step in flow:
        doc.add_paragraph(step, style="List Number")

    add_heading(doc, "Checkpoint demo (instructor)", level=3)
    doc.add_paragraph(
        "Load unpacked extension/ in Chrome or Edge → sign in → Ctrl+F5 on Room page → "
        "verify html data-g10-extension=1.0.12 → complete happy path → demonstrate error "
        "(book same slot twice: That time is no longer free on the portal)."
    )

    add_heading(doc, "Built vs simulated", level=3)
    add_table(
        doc,
        ["Capability", "Status"],
        [
            ["Read rooms/slots from portal grid + time strip", "Built — live DOM"],
            ["Set date, search, slot, duration, purpose", "Built — bridge"],
            ["Submit reservation", "Built when TEST_MODE is false"],
            ["Booking ID on pass", "Built from portal message only; never fabricated"],
            ["TEST_MODE true", "Simulated — skips real Book (dev only)"],
            ["Wizard-of-Oz on core book", "None in production config"],
        ],
    )

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # --- 12.2 Implementation ---
    add_heading(doc, "12.2 Implementation documentation", level=2)
    doc.add_paragraph(
        "Technology: Manifest V3 content scripts; in-place shell (content/shell/); "
        "page-world.js injected in MAIN world for jQuery/Kendo Room(). "
        "Scope: vertical slice for room booking; Home/header reskin supports R1 discoverability."
    )
    doc.add_paragraph("Key modules:")
    for line in [
        "content/bootstrap.js — header, Home layout",
        "content/booking-bootstrap.js — mounts wizard on /Library/Room",
        "content/shell/room-booking-shell.js — wizard UI",
        "content/bridge/page-world.js — submitRoomBooking, native book",
        "content/parsers/availability.js — grid → slots",
    ]:
        doc.add_paragraph(line, style="List Bullet")

    add_heading(doc, "Requirements traceability (summary)", level=3)
    add_table(
        doc,
        ["Req", "Prototype feature"],
        [
            ["R1", "Home services CTA + path to Room"],
            ["R2", "Timelines, free/taken labels"],
            ["R3", "Confirm recap + pass after verified book"],
            ["R4", "Calendar + explicit end time (no slider in wizard)"],
            ["R5", "Targets, contrast, aria-live, non-colour status (audit logs)"],
        ],
    )

    add_heading(doc, "Known limitations", level=3)
    doc.add_paragraph(
        "Portal max booking often 60 minutes per room row; Insignia DOM changes may break selectors; "
        "full mobile R5 battery scheduled for D5 moderated testing."
    )

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # --- 12.3 Design system ---
    add_heading(doc, "12.3 Minimal design system", level=2)
    doc.add_paragraph("Font: Plus Jakarta Sans. Tokens in portal-redesign.css and room-booking.css.")
    add_table(
        doc,
        ["Token", "Value", "Use"],
        [
            ["Primary", "#0d4a7a", "Headings, primary buttons, active step"],
            ["Text / muted", "#1a2b3c / #5c6b7a", "Body and labels"],
            ["Success", "#0d7a3e", "Free emphasis, success tone"],
            ["Error", "#b42318", "Alerts; surface #fef3f2"],
            ["Type title", "~1.35–1.5rem", "Wizard title, recap heading"],
            ["Type body", "14–16px", "Steps, recap values"],
            ["Type caption", "12–13px", "dt labels, notes"],
            ["Spacing", "8px grid", "Card padding 8/12/16/20"],
            ["Touch", "min 44px height", "Buttons (exceeds R5 24px min)"],
        ],
    )
    doc.add_paragraph("Components: primary/secondary buttons, stepper, calendar day, timeline slot, recap list, error alert, pass card, skeleton loader, live region #g10-rb-live.")
    add_heading(doc, "Design system evidence (screenshots from build)", level=3)
    doc.add_paragraph("Representative screens from the functional prototype (same flows as wireframes, styled UI):")
    for title, fname in [
        ("Home entry", "home.jpg"),
        ("Confirm step", "confirmation page.jpg"),
        ("Error state", "error.jpg"),
        ("Success pass", "success.jpg"),
    ]:
        add_heading(doc, title, level=3)
        add_picture(doc, fname)

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # --- 12.4 States & feedback ---
    add_heading(doc, "12.4 Feedback, errors, and component states", level=2)
    add_table(
        doc,
        ["State", "Where", "Implementation"],
        [
            ["Default", "Buttons, slots, calendar", "Base CSS"],
            ["Focus / hover", "Buttons, slots", "focus-visible rings"],
            ["Active", "Selected day/slot, stepper step", "is-active classes"],
            ["Disabled", "Next, weekends, taken slots, submit", "disabled / is-disabled"],
            ["Loading", "Step 2 load", "Skeleton + Loading rooms…"],
            ["Empty", "No rooms", "Live region message"],
            ["Error", "Confirm fail, weekend, extension reload", "submit-error alert, banner"],
            ["Success", "Pass screen", "g10-rb-pass, Return to Home"],
        ],
    )
    add_heading(doc, "Handled error (required)", level=3)
    doc.add_paragraph(
        "Deliberate case: slot no longer free on second confirm after a successful book. "
        "Message: That time is no longer free on the portal. Shown once in red alert (role=alert). "
        "Recovery: Book another time or change slot/date."
    )
    add_heading(doc, "Action → feedback", level=3)
    add_table(
        doc,
        ["Action", "Feedback"],
        [
            ["Pick day", "Live region date label; calendar selection"],
            ["Pick slot / end", "Live region room, time, duration"],
            ["Confirm", "Submitting… then pass or alert"],
            ["Success", "Pass screen replaces wizard"],
        ],
    )

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # --- 12.5 Accessibility re-check ---
    add_heading(doc, "12.5 Accessibility re-check (Part A fixes on live build)", level=2)
    doc.add_paragraph(
        "Team re-ran keyboard and screen reader checks on extension v1.0.12 after Part A fixes. "
        "Full table in repository: docs/deliverables/d4/part-b/D4_PARTB_ACCESSIBILITY_RECHECK.md"
    )
    add_table(
        doc,
        ["Part A issue", "Still fixed?", "Verified by"],
        [
            ["P-1 Slot text labels", "Yes", "Shahmeer Atif"],
            ["P-2 Larger recap", "Yes", "Muhammad Umar"],
            ["P-3 Pass after verified book", "Yes", "Muhammad Umar"],
            ["O-1 Header/nav on Room", "Yes", "Shahmeer Atif"],
            ["O-2 Double submit", "Yes", "Muhammad Umar"],
            ["O-3 Weekends disabled", "Yes", "Muhammad Usman Al Haq"],
            ["U-1–U-4 Copy, Duration, single error, reload banner", "Yes", "Muhammad Usman Al Haq"],
            ["R-1–R-3 Bridge, mount, native DOM", "Yes", "Muhammad Umar"],
            ["O-4 Full 320px R5", "Deferred to D5", "Team"],
        ],
    )
    add_heading(doc, "Sign-off", level=3)
    add_table(
        doc,
        ["Role", "Name", "Date", "Checkpoint OK?"],
        [
            ["Prototype lead", "Muhammad Umar", "4 Nov 2026", "Yes"],
            ["Test / a11y lead", "Shahmeer Atif", "4 Nov 2026", "Yes"],
        ],
    )

    doc.add_paragraph(
        "End of Part B. Remaining course items: D4 video (MP4), AI disclosure, reflection, LMS upload."
    )


def main():
    doc = Document(str(DOC_PATH))
    if has_part_b(doc):
        print("Part B already present; skip or remove section 12+ before re-running.")
        return
    append_part_b(doc)
    doc.save(str(DOC_PATH))
    print("Appended Part B to", DOC_PATH)


if __name__ == "__main__":
    main()
