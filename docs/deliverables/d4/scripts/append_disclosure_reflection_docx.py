"""Append AI disclosure and reflection to D4 Word submission (once)."""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_BREAK

ROOT = Path(__file__).resolve().parent.parent
DOC_PATH = ROOT / "submission" / "G10-MSMTechnologies-D4.docx"
MARKER = "13. AI use disclosure"


def has_section(doc: Document) -> bool:
    return any(MARKER in p.text for p in doc.paragraphs)


def main():
    doc = Document(str(DOC_PATH))
    if has_section(doc):
        print("Section 13 already present; skip.")
        return

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    doc.add_heading(MARKER, level=1)
    doc.add_paragraph(
        "Per CS3014 D4 policy: card-sort participants and accessibility audit findings are "
        "from the team only (not AI-generated). Below covers steps where AI use is allowed."
    )

    doc.add_heading("Where AI was used", level=2)
    items = [
        (
            "Part A — wireframe layout",
            "AI (e.g. Claude) helped produce grayscale wireframe images and flow layout. "
            "Team checked navigation, error path (W4), and alignment with card-sort IA.",
        ),
        (
            "Part B — functional extension",
            "Cursor / AI-assisted coding for MV3 extension structure, Kendo bridge, and wizard UI. "
            "Team verified on live portal: real booking with TEST_MODE false, error states, pass screen, extension reload.",
        ),
        (
            "Submission document",
            "This Word document’s final assembly (Part A §9–11, Part B §12, and this section) was "
            "created with AI from team-written records, repo markdown, and assets in docs/deliverables/d4/.",
        ),
    ]
    for title, body in items:
        doc.add_heading(title, level=3)
        doc.add_paragraph(body)

    doc.add_heading("Where AI was not used for content", level=2)
    doc.add_paragraph(
        "Card sort: six stand-in participants (facilitator Muhammad Umar). "
        "Accessibility audit and Part B re-check: team keyboard and screen reader walkthroughs. "
        "Critique record: team review during prototype build."
    )

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    doc.add_heading("14. Reflection (completion)", level=1)
    doc.add_paragraph(
        "Graded for completion only, not content quality."
    )
    doc.add_heading("1. What did you keep as your own thinking versus what came from AI?", level=2)
    doc.add_paragraph(
        "We kept problem framing, card sort, critique decisions, accessibility walkthroughs, and "
        "live-portal verification as our own work. AI mainly helped implement the extension, draft "
        "wireframe layouts, and compile this submission document from our notes and repo docs."
    )
    doc.add_heading("2. How did it feel to flag your AI use here?", level=2)
    doc.add_paragraph(
        "It was straightforward: documenting AI on allowed steps while keeping research and audit "
        "evidence clearly ours matches the brief and avoids overstating what we tested ourselves."
    )

    doc.save(str(DOC_PATH))
    print("Appended sections 13–14 to", DOC_PATH)


if __name__ == "__main__":
    main()
