from pathlib import Path
import pymupdf as fitz
import re

src = None
for p in Path(r"C:\Users\Windows 11\Desktop").iterdir():
    if p.is_dir():
        emelt = p / "Emelt szint"
        if not emelt.is_dir():
            # nested
            cand = list(p.glob("**/Emelt szint"))
            if cand:
                emelt = cand[0]
        if emelt.is_dir() and list(emelt.glob("e_mat_*.pdf")):
            src = emelt
            break
print("SRC", src)
if not src:
    raise SystemExit("emelt folder not found")

out = Path(__file__).resolve().parent / "emelt"
out.mkdir(parents=True, exist_ok=True)
figroot = Path(__file__).resolve().parent.parent / "public" / "figures" / "erettsegi"

pdfs = sorted(src.glob("e_mat_*.pdf"))
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
    print(pdf.name, "pages", doc.page_count, "chars", dest.stat().st_size)

    # figures for feladatlap only
    if "_fl" in pdf.stem:
        m = re.search(r"e_mat_(\d{2})(maj|okt)_fl", pdf.stem)
        if m:
            yy, mon = m.group(1), m.group(2)
            year = 2000 + int(yy)
            folder = figroot / f"{year}{mon}-emelt"
            folder.mkdir(parents=True, exist_ok=True)
            nimg = 0
            for pi, page in enumerate(doc, start=1):
                for ii, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    try:
                        pix = fitz.Pixmap(doc, xref)
                        if pix.n >= 5:
                            pix = fitz.Pixmap(fitz.csRGB, pix)
                        ext = "png" if pix.alpha else "jpeg"
                        name = folder / f"p{pi:02d}-{ii}.{ext if ext=='png' else 'jpeg'}"
                        pix.save(str(name))
                        nimg += 1
                    except Exception as e:
                        print(" img fail", pdf.name, pi, ii, e)
            print("  figures", folder.name, nimg)
    doc.close()
