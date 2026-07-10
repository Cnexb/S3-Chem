import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC_QUIZ = ROOT.parents[2] / "public" / "quiz" / "microscopic-world-i"

js = (PUBLIC_QUIZ / "js" / "quizData.js").read_text(encoding="utf-8")
items = len(re.findall(r'"id":\s*"(?:atom|pt|ionic|cov)-\d+"', js))
imgs = re.findall(r'"src":\s*"(\./assets/[^"]+)"', js)
missing = [p for p in imgs if not (PUBLIC_QUIZ / p[2:]).exists()]
print("items", items)
print("images", len(imgs), "missing", missing)
assert items == 40 and not missing
print("OK")
