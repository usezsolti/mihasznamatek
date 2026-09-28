from pathlib import Path

out = Path(__file__).resolve().parent
stems = [
    "k_mat_20maj",
    "k_mat_20okt",
    "k_mat_21maj",
    "k_mat_21okt",
    "k_mat_22okt",
    "k_mat_23maj",
]

for stem in stems:
    ut = (out / f"{stem}_ut.txt").read_text(encoding="utf-8")
    fl = (out / f"{stem}_fl.txt").read_text(encoding="utf-8")
    # keep from first standalone "I." after page 3-ish
    parts = ut.split("===== PAGE ")
    body = []
    for p in parts:
        if not p.strip():
            continue
        num = p.split("=====", 1)[0].strip()
        try:
            n = int(num)
        except ValueError:
            continue
        if n >= 4:
            body.append(f"----- UT PAGE {n} -----\n" + p.split("=====", 1)[-1][:4000])
    summary = "\n".join(body)
    (out / f"{stem}_ut_body.txt").write_text(summary, encoding="utf-8")
    # FL tasks only: pages 3-7 and 12-22 typically
    fl_parts = fl.split("===== PAGE ")
    fl_body = []
    for p in fl_parts:
        if not p.strip():
            continue
        num = p.split("=====", 1)[0].strip()
        try:
            n = int(num)
        except ValueError:
            continue
        if n in {3, 4, 5, 6, 7, 12, 14, 16, 18, 20, 22}:
            fl_body.append(f"----- FL PAGE {n} -----\n" + p.split("=====", 1)[-1][:3500])
    (out / f"{stem}_fl_body.txt").write_text("\n".join(fl_body), encoding="utf-8")
    print(stem, "ut_body", len(summary), "fl_body", sum(len(x) for x in fl_body))
