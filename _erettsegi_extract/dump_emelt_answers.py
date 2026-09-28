from pathlib import Path
import re

out = Path(__file__).resolve().parent / "emelt"
summary = out / "_answers_dump"
summary.mkdir(exist_ok=True)

for ut in sorted(out.glob("e_mat_*_ut*.txt")):
    text = ut.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    chunks = []
    for i, line in enumerate(lines):
        if "Összesen" in line:
            start = max(0, i - 8)
            block = "\n".join(lines[start : i + 2])
            chunks.append(f"--- line {i+1} ---\n{block}\n")
    dest = summary / (ut.stem + "_ans.txt")
    dest.write_text("\n".join(chunks), encoding="utf-8")
    print(ut.name, "blocks", len(chunks), "->", dest.name)

# also dump FL task starts
for fl in sorted(out.glob("e_mat_*_fl*.txt")):
    text = fl.read_text(encoding="utf-8", errors="replace")
    # keep lines that look like task numbers
    keep = []
    for i, line in enumerate(text.splitlines()):
        if re.match(r"^\s*\d+\.\s", line) or re.match(r"^\s*[a-e]\)", line):
            keep.append(f"{i+1}: {line}")
    dest = summary / (fl.stem + "_tasks.txt")
    dest.write_text("\n".join(keep[:200]), encoding="utf-8")
    print(fl.name, "tasklines", len(keep))
