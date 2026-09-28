import os
from pathlib import Path

import fitz

src_dir = None
for p in Path(r"C:\Users\Windows 11\Desktop").iterdir():
    if p.is_dir() and "feladatsorok" in p.name.lower():
        src_dir = p
        break
if src_dir is None:
    raise SystemExit("source folder not found")

out = Path(__file__).resolve().parent
fig_root = Path(__file__).resolve().parents[1] / "public" / "figures" / "erettsegi"

papers = {
    "k_mat_20maj": ("2020maj-kozep", True),
    "k_mat_20okt": ("2020okt-kozep", True),
    "k_mat_21maj": ("2021maj-kozep", True),
    "k_mat_21okt": ("2021okt-kozep", True),
    "k_mat_22okt": ("2022okt-kozep", True),
    "k_mat_23maj": ("2023maj-kozep", True),
}

for stem, (fig_name, want_figs) in papers.items():
    for kind in ("fl", "ut"):
        pdfs = list(src_dir.glob(f"{stem}_{kind}.pdf"))
        if not pdfs:
            print("MISSING", stem, kind)
            continue
        doc = fitz.open(pdfs[0])
        parts = []
        for i, page in enumerate(doc, start=1):
            parts.append(f"\n===== PAGE {i} =====\n")
            parts.append(page.get_text("text"))
        (out / f"{stem}_{kind}.txt").write_text("".join(parts), encoding="utf-8")
        print("TEXT", stem, kind, "pages", doc.page_count)
        if kind == "fl" and want_figs:
            dest = fig_root / fig_name
            dest.mkdir(parents=True, exist_ok=True)
            n = 0
            for i, page in enumerate(doc, start=1):
                for j, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    data = doc.extract_image(xref)
                    blob = data["image"]
                    if len(blob) < 2500:
                        continue
                    ext = data.get("ext", "png")
                    path = dest / f"p{i:02d}-{j}.{ext}"
                    path.write_bytes(blob)
                    n += 1
            print("FIGS", fig_name, n)
        doc.close()
