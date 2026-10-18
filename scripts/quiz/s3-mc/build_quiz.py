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


def stamp_item_ids(questions, sections):
    """Physics-style ids: Excel section + sequence, no difficulty letter."""
    by_ch = {s["ch"]: s for s in sections}
    n = {}
    for q in questions:
        excel = by_ch[q["ch"]].get("excel") or q["code"]
        n[excel] = n.get(excel, 0) + 1
        q["itemId"] = f"{excel}-{n[excel]}"


def item_id(q: dict, sec: dict | None = None) -> str:
    if q.get("itemId"):
        return q["itemId"]
    excel = (sec or {}).get("excel")
    if excel:
        return f"{excel}-{q['n']}"
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
    text = re.sub(r"(\.js)\?v=[^\"]+", r"\1?v=20261018s3mc4", text)
    text = re.sub(r"(quiz\.html)\?v=[^\"]+", r"\1?v=20261018s3mc4", text)
    (PUBLIC_QUIZ / "quiz.html").write_text(text, encoding="utf-8")

    for name in ("quizApp.js", "quizUtils.js", "quizSummary.js", "quizExport.js", "quizEffects.js"):
        local = ui_root / "js" / name
        src = local if local.exists() else (mw / "js" / name if (mw / "js" / name).exists() else TEMPLATE_DIR / "js" / name)
        raw = src.read_text(encoding="utf-8")
        raw = re.sub(r"(\.js)\?v=[^\"]+", r"\1?v=20261018s3mc4", raw)
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
    referenced = set()
    for q in questions:
        if q.get("images"):
            referenced.update(q["images"])
        elif q.get("image"):
            referenced.add(q["image"])
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
        "imageIds": sorted({k for q in questions for k in (q.get("images") or ([q["image"]] if q.get("image") else []))}),
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
        meta = by_ch[q["ch"]]
        sec = meta.get("excel") or meta["id"]
        stem = q["stem"].replace("\n", " ")[:55]
        lines.append(
            f"| {i} | {item_id(q, meta)} | {sec} | {q.get('difficulty','')} | {q['answer']} | {q.get('image','—')} | {stem} |"
        )
    lines.append("")
    (ROOT / "draft" / "quiz-review.md").write_text("\n".join(lines), encoding="utf-8")


def to_quiz_item(q, image_map, sections_by_ch):
    sec = sections_by_ch[q["ch"]]
    options = [{"key": letter, "text": text} for letter, text in zip("ABCD", q["options"])]
    item = {
        "id": item_id(q, sec),
        "setId": sec["id"],
        "section": sec.get("excel") or sec["id"],
        "topic": sec.get("topic"),
        "quizId": sec.get("quizId"),
        "difficulty": q.get("difficulty") or "Standard",
        "stem": q["stem"],
        "options": options,
        "answer": q["answer"],
        "hint": "",
    }
    if q.get("stemZh"):
        item["stemZh"] = q["stemZh"]
    keys = list(q.get("images") or [])
    if not keys and q.get("image"):
        keys = [q["image"]]
    objs = []
    for img_key in keys:
        info = image_map[img_key]
        objs.append({
            "src": f"./assets/{info['file']}",
            "alt": info["alt"],
            "caption": info["caption"],
        })
    if len(objs) == 1:
        item["image"] = objs[0]
    elif len(objs) > 1:
        item["images"] = objs
    return item


def write_quiz_data(questions, image_map, sections):
    sections_by_ch = {s["ch"]: s for s in sections}
    seen = {}
    items = []
    for q in questions:
        sec = sections_by_ch[q["ch"]]
        n = seen.get(sec["id"], 0)
        part = n // 4 + 1
        seen[sec["id"]] = n + 1
        item = to_quiz_item(q, image_map, sections_by_ch)
        item["part"] = part
        # Keep part next to the category fields.
        ordered = {
            "id": item["id"],
            "setId": item["setId"],
            "section": item["section"],
            "topic": item["topic"],
            "quizId": item["quizId"],
            "difficulty": item["difficulty"],
            "part": part,
        }
        for key, value in item.items():
            if key not in ordered:
                ordered[key] = value
        items.append(ordered)
    max_part = {}
    for item in items:
        max_part[item["setId"]] = max(max_part.get(item["setId"], 1), item["part"])
    sections_js = []
    for s in sections:
        nparts = max_part.get(s["id"], 1)
        excel = s.get("excel", s["code"])
        for part in range(1, nparts + 1):
            label = f"{excel} · {s['label']}"
            label_zh = f"{excel} · {s['labelZh']}"
            if nparts > 1:
                label += f" ({part})"
                label_zh += f"（{part}）"
            sections_js.append({"id": s["id"], "part": part, "label": label, "labelZh": label_zh})
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
    stamp_item_ids(questions, sections)
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
