import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parents[2]
PUBLIC_QUIZ = REPO_ROOT / "public" / "quiz" / "microscopic-world-i"
SCRIPTS = ROOT
PDF = ROOT / "sources" / "microscopic-world-i-mcq.pdf"
QUESTIONS_JSON = SCRIPTS / "questions.json"
FIGURES_DIR = ROOT / "figures"

CHAPTER_META = {
    5: ("atom-isotopes", "Atom and Isotopes", "原子與同位素", "atom"),
    6: ("periodic-table", "Periodic Table", "週期表", "pt"),
    7: ("ionic-bond", "Ionic Bond", "離子鍵", "ionic"),
    8: ("covalent-bond", "Covalent Bond", "共價鍵", "cov"),
}

FIGURE_FILES = {
    "ionic-7": "ionic-7.png",
    "ionic-9": "ionic-9.png",
    "ionic-10": "ionic-10.png",
    "cov-9": "cov-9.png",
    "cov-10": "cov-10.png",
}

IMAGE_CAPTIONS = {
    "ionic-7": "Electron diagram of lithium oxide",
    "ionic-9": "Electron diagram of a compound from elements X and Y",
    "ionic-10": "Electron diagram of a compound from elements S and T",
    "cov-9": "Electron diagram of a compound from elements X and Y",
    "cov-10": "Electron diagram of a compound from elements A, B and C",
}


def ensure_dirs():
    for sub in ("sources", "extracted", "draft", "figures"):
        (ROOT / sub).mkdir(parents=True, exist_ok=True)
    (PUBLIC_QUIZ / "js").mkdir(parents=True, exist_ok=True)
    (PUBLIC_QUIZ / "assets").mkdir(parents=True, exist_ok=True)


def load_questions():
    data = json.loads(QUESTIONS_JSON.read_text(encoding="utf-8"))
    if len(data) != 40:
        raise ValueError(f"Expected 40 questions, got {len(data)}")
    return data


def item_id(ch, n):
    return f"{CHAPTER_META[ch][3]}-{n}"


def copy_figures(questions):
    assets = PUBLIC_QUIZ / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    referenced_keys = {q["image"] for q in questions if "image" in q}
    image_map = {}

    for img_id in sorted(referenced_keys):
        fname = FIGURE_FILES.get(img_id)
        if not fname:
            raise KeyError(f"No figure file configured for image key: {img_id}")
        src = FIGURES_DIR / fname
        if not src.is_file():
            raise FileNotFoundError(f"Figure not found: {src}")
        out_path = assets / fname
        shutil.copy2(src, out_path)
        image_map[img_id] = {
            "file": fname,
            "alt": IMAGE_CAPTIONS.get(img_id, img_id),
            "caption": IMAGE_CAPTIONS.get(img_id, img_id),
        }

    referenced_files = {FIGURE_FILES[k] for k in referenced_keys}
    for pattern in ("cov-*.png", "ionic-*.png"):
        for stale in assets.glob(pattern):
            if stale.name not in referenced_files:
                stale.unlink()

    return image_map


def write_manifest(questions):
    image_ids = sorted({q["image"] for q in questions if "image" in q})
    manifest = {
        "title": "Microscopic World I MCQ Quiz",
        "titleZh": "微觀世界 I 多項選擇題",
        "sourcesNote": "Original PDF is not in the repo. Rebuild uses committed questions.json and figures/ only.",
        "sourcePdf": "sources/microscopic-world-i-mcq.pdf",
        "questionsFile": "questions.json",
        "figuresDir": "figures",
        "questionCount": len(questions),
        "chapters": [
            {"ch": ch, "sectionId": meta[0], "label": meta[1], "labelZh": meta[2], "count": 10}
            for ch, meta in sorted(CHAPTER_META.items())
        ],
        "imageIds": image_ids,
    }
    (ROOT / "sources" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_sections():
    sections = [
        {"id": meta[0], "label": meta[1], "labelZh": meta[2]}
        for _ch, meta in sorted(CHAPTER_META.items())
    ]
    (ROOT / "extracted" / "sections.json").write_text(
        json.dumps(sections, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_content_map(questions):
    entries = []
    for q in questions:
        ch, n = q["ch"], q["n"]
        meta = CHAPTER_META[ch]
        entries.append(
            {
                "id": item_id(ch, n),
                "chapter": ch,
                "sectionId": meta[0],
                "questionNumber": n,
                "answer": q["answer"],
                "hasImage": "image" in q,
                "imageKey": q.get("image"),
            }
        )
    (ROOT / "extracted" / "content-map.json").write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def write_extraction_review(questions):
    lines = [
        "# Extraction review — Microscopic World I",
        "",
        f"- **Source PDF:** `{PDF}`",
        f"- **Questions file:** `{QUESTIONS_JSON}`",
        f"- **Figures dir:** `{FIGURES_DIR}`",
        f"- **Total MCQ:** {len(questions)}",
        "",
        "## By chapter",
        "",
        "| Ch | Section | Count |",
        "|----|---------|-------|",
    ]
    for ch, meta in sorted(CHAPTER_META.items()):
        lines.append(f"| {ch} | {meta[1]} | 10 |")
    lines.extend(
        [
            "",
            "## Image-linked questions",
            "",
            "| Question id | Image key |",
            "|-------------|-----------|",
        ]
    )
    for q in questions:
        if "image" in q:
            lines.append(f"| {item_id(q['ch'], q['n'])} | {q['image']} |")
    lines.append("")
    (ROOT / "extracted" / "extraction-review.md").write_text("\n".join(lines), encoding="utf-8")


def write_quiz_review(questions):
    lines = [
        "# Quiz review — Microscopic World I",
        "",
        "| # | id | section | answer | image? | stem (truncated) |",
        "|---|-----|---------|--------|--------|------------------|",
    ]
    for i, q in enumerate(questions, 1):
        ch = q["ch"]
        meta = CHAPTER_META[ch]
        qid = item_id(ch, q["n"])
        stem = q["stem"].replace("\n", " ")[:60]
        img = q.get("image", "")
        lines.append(f"| {i} | {qid} | {meta[0]} | {q['answer']} | {img or '—'} | {stem}… |")
    lines.extend(["", f"**Total:** {len(questions)} questions", ""])
    (ROOT / "draft" / "quiz-review.md").write_text("\n".join(lines), encoding="utf-8")


def write_image_map(image_map):
    (ROOT / "draft" / "image-map.json").write_text(
        json.dumps(image_map, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def to_quiz_item(q, image_map):
    ch, n = q["ch"], q["n"]
    meta = CHAPTER_META[ch]
    keys = ["A", "B", "C", "D"]
    options = [
        {"key": keys[i], "text": opt}
        for i, opt in enumerate(q["options"])
    ]
    item = {
        "id": item_id(ch, n),
        "section": meta[0],
        "difficulty": "Standard",
        "stem": q["stem"],
        "stemZh": q["stemZh"],
        "options": options,
        "answer": q["answer"],
        "hint": q["hint"],
    }
    img_key = q.get("image")
    if img_key:
        info = image_map[img_key]
        item["image"] = {
            "src": f"./assets/{info['file']}",
            "alt": info["alt"],
            "caption": info["caption"],
        }
    return item


def write_quiz_data(questions, image_map):
    sections_js = [
        {"id": meta[0], "label": meta[1], "labelZh": meta[2]}
        for _ch, meta in sorted(CHAPTER_META.items())
    ]
    items = [to_quiz_item(q, image_map) for q in questions]
    lines = [
        "/** Auto-generated by scripts/build_quiz.py — do not edit by hand. */",
        "",
        "export const QUIZ_SECTIONS = " + json.dumps(sections_js, ensure_ascii=False, indent=2) + ";",
        "",
        "export const QUIZ_ITEMS = " + json.dumps(items, ensure_ascii=False, indent=2) + ";",
        "",
    ]
    (PUBLIC_QUIZ / "js" / "quizData.js").write_text("\n".join(lines), encoding="utf-8")


def main():
    ensure_dirs()
    questions = load_questions()
    image_map = copy_figures(questions)
    write_manifest(questions)
    write_sections()
    write_content_map(questions)
    write_extraction_review(questions)
    write_quiz_review(questions)
    write_image_map(image_map)
    write_quiz_data(questions, image_map)
    print(f"OK: {len(questions)} questions, {len(image_map)} images")
    print(f"Output quiz: {PUBLIC_QUIZ}")


if __name__ == "__main__":
    main()
