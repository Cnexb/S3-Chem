# Microscopic World I Worksheet

HKDSE exercise bank (418 items: 256 MCQ + 162 short answer).

## Rebuild (offline)

From the repo root:

```powershell
python scripts/worksheets/microscopic-world-i/build_worksheet.py
```

Source PDFs/docx are not in the repo. Rebuild uses committed `questions_mc.json` and `questions_lq.json` plus templates in `scripts/templates/quiz/`.

## Deploy

Merge to `main` on GitHub — CI builds and deploys automatically to GitHub Pages. See [CONTRIBUTING.md](../../../CONTRIBUTING.md).
