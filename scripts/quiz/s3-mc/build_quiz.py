#!/usr/bin/env python3
"""Build S3 MC quiz (Earth* / MW* bank) into public/quiz/s3-mc/."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parents[2]
PUBLIC_QUIZ = REPO_ROOT / "public" / "quiz" / "s3-mc"
TEMPLATE_DIR = Path(
    __import__("os").environ.get("QUIZ_TEMPLATE_DIR", str(REPO_ROOT / "scripts" / "templates" / "quiz"))
)
QUESTIONS_JSON = ROOT / "questions.json"
SECTIONS_JSON = ROOT / "sections_meta.json"
FIGURE_MAP = ROOT / "figure_map.json"
FIGURES_DIR = ROOT / "figures"

DIFF_LABEL = {
    "Foundation": "Easy",
    "Standard": "Medium",
    "Applied": "Difficult",
}


def load_sections():
    return json.loads(SECTIONS_JSON.read_text(encoding="utf-8"))


def load_questions():
    data = json.loads(QUESTIONS_JSON.read_text(encoding="utf-8"))
    if len(data) != 389:
        raise ValueError(f"Expected 389 questions, got {len(data)}")
    return data


def load_figure_map():
    return json.loads(FIGURE_MAP.read_text(encoding="utf-8"))


def item_id(q: dict) -> str:
    return f"{q['code']}-{q['n']}"


def ensure_dirs():
    for sub in ("sources", "extracted", "draft", "figures"):
        (ROOT / sub).mkdir(parents=True, exist_ok=True)
    (PUBLIC_QUIZ / "js").mkdir(parents=True, exist_ok=True)
    (PUBLIC_QUIZ / "assets").mkdir(parents=True, exist_ok=True)


def copy_ui():
    """Copy quiz shell; prefer local s3-mc/ui overrides (set-based generate)."""
    ui_root = ROOT / "ui"
    mw = REPO_ROOT / "public" / "quiz" / "microscopic-world-i"

    html_src = ui_root / "quiz.html"
    if not html_src.exists():
        html_src = mw / "quiz.html" if (mw / "quiz.html").exists() else TEMPLATE_DIR / "quiz.html"
    text = html_src.read_text(encoding="utf-8")
    text = text.replace(
        "Microscopic World I · Ch5–8 Quiz",
        "S3 Chemistry · Earth & Microscopic World MCQ",
    )
    text = text.replace("Microscopic World I", "S3 Chemistry MCQ")
    text = text.replace("微觀世界 I", "中三化學選擇題")
    text = re.sub(r"(\.js)\?v=[^\"]+", r"\1?v=20260904s3mc3", text)
    text = re.sub(r"(quiz\.html)\?v=[^\"]+", r"\1?v=20260904s3mc3", text)
    (PUBLIC_QUIZ / "quiz.html").write_text(text, encoding="utf-8")

    for name in ("quizApp.js", "quizUtils.js", "quizSummary.js", "quizExport.js", "quizEffects.js"):
        local = ui_root / "js" / name
        src = local if local.exists() else (mw / "js" / name if (mw / "js" / name).exists() else TEMPLATE_DIR / "js" / name)
        raw = src.read_text(encoding="utf-8")
        raw = re.sub(r"(\.js)\?v=[^\"]+", r"\1?v=20260904s3mc3", raw)
        if not local.exists():
            raw = raw.replace("Microscopic World I", "S3 Chemistry MCQ")
            raw = raw.replace("微觀世界 I", "中三化學選擇題")
            raw = raw.replace("S3 Chemistry MCQ · Ch5–8", "S3 Chemistry MCQ · Earth & Microscopic World")
            raw = raw.replace("S3 Chemistry MCQ (Ch5–8)", "S3 Chemistry MCQ")
            raw = raw.replace("中三化學選擇題（第五至八章）", "中三化學選擇題")
            raw = raw.replace("micworld1_", "s3mc_")
        (PUBLIC_QUIZ / "js" / name).write_text(raw, encoding="utf-8")


def copy_figures(questions, figure_map):
    assets = PUBLIC_QUIZ / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    figure_files = figure_map["figure_files"]
    captions = figure_map["image_captions"]
    image_map = {}
    referenced = {q["image"] for q in questions if "image" in q}
    for key in sorted(referenced):
        fname = figure_files[key]
        src = FIGURES_DIR / fname
        if not src.is_file():
            raise FileNotFoundError(src)
        shutil.copy2(src, assets / fname)
        image_map[key] = {
            "file": fname,
            "alt": captions.get(key, key),
            "caption": captions.get(key, key),
        }
    # prune stale
    keep = {figure_files[k] for k in referenced}
    for stale in assets.glob("*.png"):
        if stale.name not in keep:
            stale.unlink()
    return image_map


def write_manifest(questions, sections):
    manifest = {
        "title": "S3 Chemistry MCQ (Earth & Microscopic World)",
        "titleZh": "中三化學選擇題（地球與微觀世界）",
        "questionsFile": "questions.json",
        "figuresDir": "figures",
        "questionCount": len(questions),
        "sections": [
            {
                "ch": s["ch"],
                "code": s["code"],
                "sectionId": s["id"],
                "label": s["label"],
                "labelZh": s["labelZh"],
                "count": s["count"],
            }
            for s in sections
        ],
        "imageIds": sorted({q["image"] for q in questions if "image" in q}),
        "note": "Old public/quiz/microscopic-world-i remains on disk but is hidden from the Quiz page.",
    }
    (ROOT / "sources" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_sections(sections):
    out = [{"id": s["id"], "label": s["label"], "labelZh": s["labelZh"]} for s in sections]
    (ROOT / "extracted" / "sections.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_reviews(questions, sections):
    by_ch = {s["ch"]: s for s in sections}
    lines = [
        "# Quiz review — S3 MC (Earth / MW)",
        "",
        f"**Total:** {len(questions)}",
        "",
        "| # | id | section | diff | answer | image? | stem |",
        "|---|-----|---------|------|--------|--------|------|",
    ]
    for i, q in enumerate(questions, 1):
        sec = by_ch[q["ch"]]["id"]
        stem = q["stem"].replace("\n", " ")[:55]
        lines.append(
            f"| {i} | {item_id(q)} | {sec} | {q.get('difficulty','')} | {q['answer']} | {q.get('image','—')} | {stem} |"
        )
    lines.append("")
    (ROOT / "draft" / "quiz-review.md").write_text("\n".join(lines), encoding="utf-8")


def to_quiz_item(q, image_map, sections_by_ch):
    sec = sections_by_ch[q["ch"]]
    options = [{"key": letter, "text": text} for letter, text in zip("ABCD", q["options"])]
    item = {
        "id": item_id(q),
        "section": sec["id"],
        "difficulty": q.get("difficulty") or "Standard",
        "stem": q["stem"],
        "options": options,
        "answer": q["answer"],
        "hint": "",
    }
    if q.get("stemZh"):
        item["stemZh"] = q["stemZh"]
    img_key = q.get("image")
    if img_key:
        info = image_map[img_key]
        item["image"] = {
            "src": f"./assets/{info['file']}",
            "alt": info["alt"],
            "caption": info["caption"],
        }
    return item


def write_quiz_data(questions, image_map, sections):
    sections_by_ch = {s["ch"]: s for s in sections}
    sections_js = [
        {"id": s["id"], "label": f"{s['code']} · {s['label']}", "labelZh": f"{s['code']} · {s['labelZh']}"}
        for s in sections
    ]
    items = [to_quiz_item(q, image_map, sections_by_ch) for q in questions]
    lines = [
        "/** Auto-generated by scripts/quiz/s3-mc/build_quiz.py — do not edit by hand. */",
        "",
        "export const QUIZ_SECTIONS = " + json.dumps(sections_js, ensure_ascii=False, indent=2) + ";",
        "",
        "export const QUIZ_ITEMS = " + json.dumps(items, ensure_ascii=False, indent=2) + ";",
        "",
    ]
    (PUBLIC_QUIZ / "js" / "quizData.js").write_text("\n".join(lines), encoding="utf-8")


def main():
    ensure_dirs()
    sections = load_sections()
    questions = load_questions()
    figure_map = load_figure_map()
    copy_ui()
    image_map = copy_figures(questions, figure_map)
    write_manifest(questions, sections)
    write_sections(sections)
    write_reviews(questions, sections)
    write_quiz_data(questions, image_map, sections)
    print(f"OK: {len(questions)} questions, {len(sections)} sections, {len(image_map)} images")
    print(f"Output: {PUBLIC_QUIZ}")


if __name__ == "__main__":
    main()
