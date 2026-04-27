from __future__ import annotations
import io
import pdfplumber
import pymupdf  # pip install pymupdf


def _extract_with_pdfplumber(pdf_bytes: bytes) -> str:
    """Primary extraction method — works well for standard PDFs."""
    text_parts: list[str] = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            # extract_text_lines preserves layout better than extract_text
            page_text = page.extract_text(x_tolerance=2, y_tolerance=2)
            if page_text:
                text_parts.append(page_text.strip())
    return "\n\n".join(text_parts)


def _extract_with_pymupdf(pdf_bytes: bytes) -> str:
    """
    Fallback extraction using PyMuPDF — handles PDFs generated from
    HTML/canvas (like browser-based resume builders) much better.
    """
    text_parts: list[str] = []
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    for page in doc:
        page_text = page.get_text("text")
        if page_text:
            text_parts.append(page_text.strip())
    doc.close()
    return "\n\n".join(text_parts)


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract all text from a PDF given as raw bytes.
    Tries pdfplumber first, falls back to PyMuPDF if text is too short.
    Raises ValueError for image-only or too-short PDFs.
    """
    # ── Try pdfplumber first ──────────────────────────────────
    text = _extract_with_pdfplumber(pdf_bytes)

    # ── If pdfplumber got little/no text, try PyMuPDF ────────
    if len(text.strip()) < 100:
        print("[pdf_parser] pdfplumber got little text, trying PyMuPDF fallback...")
        text = _extract_with_pymupdf(pdf_bytes)

    # ── Final validation ──────────────────────────────────────
    if not text.strip():
        raise ValueError(
            "No text could be extracted from this PDF. "
            "If you exported this from a resume builder, try printing it to PDF "
            "from your browser (File → Print → Save as PDF) instead of downloading directly."
        )

    if len(text.strip()) < 100:
        raise ValueError(
            "The extracted text is too short to be a valid resume. "
            "Please upload a proper text-based PDF resume."
        )

    return text