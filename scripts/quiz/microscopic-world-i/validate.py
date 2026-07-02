import re
from pathlib import Path
root = Path(r"C:\Users\UniplusUser02\Desktop\CHEM\S3\quiz\microscopic-world-i")
js = (root / "js" / "quizData.js").read_text(encoding="utf-8")
items = len(re.findall(r'"id":\s*"(?:atom|pt|ionic|cov)-\d+"', js))
imgs = re.findall(r'"src":\s*"(\./assets/[^"]+)"', js)
missing = [p for p in imgs if not (root / p[2:]).exists()]
print("items", items)
print("images", len(imgs), "missing", missing)
assert items == 40 and not missing
print("OK")
