from pathlib import Path
import pymupdf as fitz

src = None
for p in Path(r"C:\Users\Windows 11\Desktop").iterdir():
    if p.is_dir() and "szin" in p.name.lower() or (p.is_dir() and "Val" in p.name):
        if "Val" in p.name or "szin" in p.name.lower():
            src = p
            break
if src is None:
    # fallback scan
    for p in Path(r"C:\Users\Windows 11\Desktop").iterdir():
        if p.is_dir():
            pdfs = list(p.glob("Valszam_gyak_*.pdf"))
            if pdfs:
                src = p
                break
print("SRC", src)
if not src:
    raise SystemExit("folder not found")

out = Path(__file__).resolve().parent / "bme_valszam"
out.mkdir(parents=True, exist_ok=True)

pdfs = sorted(src.glob("Valszam_gyak_*.pdf"))
print("count", len(pdfs))
for pdf in pdfs:
    doc = fitz.open(pdf)
    parts = []
    for i, page in enumerate(doc, start=1):
        parts.append(f"\n===== PAGE {i} =====\n")
        parts.append(page.get_text("text"))
    safe = pdf.stem.replace(" ", "_").replace("(", "").replace(")", "")
    dest = out / f"{safe}.txt"
    dest.write_text("".join(parts), encoding="utf-8")
    print(pdf.name, "->", dest.name, "pages", doc.page_count, "chars", dest.stat().st_size)
    doc.close()
