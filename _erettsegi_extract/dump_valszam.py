from pathlib import Path
import hashlib
import json

out = Path(__file__).resolve().parent / "bme_valszam"
files = sorted(out.glob("*.txt"))
summary = []
for f in files:
    raw = f.read_bytes()
    text = raw.decode("utf-8", errors="replace")
    h = hashlib.sha1(raw).hexdigest()[:12]
    summary.append({
        "file": f.name,
        "sha": h,
        "chars": len(text),
        "preview": text[:400].replace("\n", " | "),
    })
    utf = out / f"{f.stem}.utf8.md"
    utf.write_text(text, encoding="utf-8")

(out / "_index.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
print("files", len(files))
for s in summary:
    print(f"{s['file']:32} {s['sha']} {s['chars']:5} {s['preview'][:80]}")
