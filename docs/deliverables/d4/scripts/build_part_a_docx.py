"""Append Part A §9–11 to D4 Word submission (run once on fresh doc base)."""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_BREAK
from docx.shared import Inches

ROOT = Path(__file__).resolve().parent.parent
DOC_PATH = ROOT / "submission" / "G10-MSMTechnologies-D4.docx"
WIREFRAMES_DIR = ROOT / "assets" / "wireframes"

WIREFRAMES = [
    ("9.1 Entry — Home (W0)", "home.jpg", "Hub-and-spoke: Book a study room in Services."),
    ("9.2 Step 1 — Day (W1)", "calendar.jpg", "Sequential wizard: pick date (weekdays)."),
    ("9.3 Step 2 — Room & time (W2)", "rooms and time.jpg", "Free Rooms First: timelines + end time."),
    ("9.4 Step 3 — Confirm (W3)", "confirmation page.jpg", "Recap, purpose, Confirm Booking."),
    ("9.5 Alternate — Error (W4)", "error.jpg", "Slot no longer free; recover on same step."),
    ("9.6 Success — Pass (W5)", "success.jpg", "Closure: Your room is held."),
    ("9.7 Flow diagram", "flow diagram.jpg", "Happy path and error path with arrows."),
]


def add_heading(doc, text, level=1):
    doc.add_heading(text, level=level)


def add_picture(doc, filename, width_in=5.5):
    path = WIREFRAMES_DIR / filename
    if not path.is_file():
        doc.add_paragraph(f"[Missing image: {filename}]")
        return
    doc.add_picture(str(path), width=Inches(width_in))
    doc.add_paragraph("")


def main():
    doc = Document(str(DOC_PATH))
    for p in list(doc.paragraphs):
        if p.text.strip() == "[INSERT PHOTO HERE]":
            p.text = "(Card sort photo: attach participant photo here if not embedded.)"

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    add_heading(doc, "9. Grayscale wireframes (connected flow)", level=1)
    doc.add_paragraph(
        "Low/medium-fidelity grayscale screens for the core booking task. "
        "Gestalt: proximity (recap and timeline rows), similarity (free/taken chips), "
        "figure/ground (wizard card vs background)."
    )
    for title, fname, caption in WIREFRAMES:
        add_heading(doc, title, level=2)
        doc.add_paragraph(caption)
        add_picture(doc, fname)

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    add_heading(doc, "10. Accessibility audit log (summary)", level=1)
    doc.add_paragraph(
        "Full log: docs/deliverables/d4/part-a/D4_PARTA_ACCESSIBILITY_AUDIT.md. "
        "Findings from team keyboard and screen reader walkthroughs on extension v1.0.12."
    )
    audit_sections = [
        (
            "Keyboard (lead: Shahmeer Atif)",
            "Focus reached Home book link, calendar, timeline slots, confirm, and pass. "
            "Fixed: centered confirm control, weekend disable, book-another button clipping, "
            "header nav when body overflow was blocking dropdowns.",
        ),
        (
            "Screen reader (lead: Muhammad Usman Al Haq)",
            "Wizard title and stepper read in order; slot status uses text labels. "
            "Fixed: duplicate error in live region plus alert on confirm — now alert only.",
        ),
        (
            "POUR — Fixed before submit",
            "Perceivable: slot labels, larger recap, pass screen. "
            "Operable: nav overflow, double submit, weekends. "
            "Understandable: removed redundant copy, Duration label, friendly extension reload message. "
            "Robust: bridge versioning, wizard mount retry, native DOM kept for Kendo.",
        ),
        ("Deferred", "O-4: Full 320px / 200% zoom R5 study deferred to D5 moderated testing."),
    ]
    for heading, body in audit_sections:
        add_heading(doc, heading, level=2)
        doc.add_paragraph(body)

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    add_heading(doc, "11. Critique record (wireframes + prototype)", level=1)
    doc.add_paragraph("Date: 4 November 2026. Team rapid critique on wireframes and live build.")
    critiques = [
        (
            "Muhammad Umar (D4 lead)",
            "Portal showed booking success but wizard stayed on confirm; users clicked again and saw "
            "'no longer free'. Required pass screen, submit lock, and clear primary confirm.",
        ),
        (
            "Shahmeer Atif (Test lead)",
            "Accessibility: duplicate errors for AT users; timeline focus visibility; "
            "do not rely on colour alone for free/taken.",
        ),
        (
            "Mirza Yahya Adeel (Ideate lead)",
            "Wireframe step 2 must foreground availability before commit; "
            "help (Ask a librarian) stays outside the wizard — consistent with card sort.",
        ),
        (
            "Muhammad Usman Al Haq (Define lead)",
            "Use requirement-aligned labels (Duration); do not claim success without verified portal book; "
            "keep portal-accurate error text for taken slots.",
        ),
    ]
    for name, note in critiques:
        add_heading(doc, name, level=2)
        doc.add_paragraph(note)
    doc.add_paragraph(
        "Wireframe updates: added error screen and flow diagram; simplified confirm copy. "
        "Extension checkpoint: v1.0.12."
    )
    doc.save(str(DOC_PATH))
    print("Updated", DOC_PATH)


if __name__ == "__main__":
    main()
