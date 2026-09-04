#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC_QUIZ = ROOT.parents[2] / "public" / "quiz" / "s3-mc"

js = (PUBLIC_QUIZ / "js" / "quizData.js").read_text(encoding="utf-8")
items = len(re.findall(r'"id":\s*"(?:Earth|MW)[^"]+"', js))
sections = len(re.findall(r'"id":\s*"(?:earth|mw)[^"]+"', js.split("QUIZ_ITEMS")[0]))
imgs = re.findall(r'"src":\s*"(\./assets/[^"]+)"', js)
missing = [p for p in imgs if not (PUBLIC_QUIZ / p[2:]).exists()]
print("items", items)
print("sections", sections)
print("images", len(imgs), "missing", missing)
assert items == 389 and not missing
assert sections == 81
print("OK")
