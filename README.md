# Chemistry content packs

This repo is the Chemistry teaching files for **Uni+ (All-In-One)**. Students do not open this site. Uni+ reads the `content-packs/` folder and shows notes, tools, games, quizzes, summaries, and flashcards in Learning Tools.

## How Uni+ finds content

Each **Layer 1 chapter** from the Chem topic list is one folder, same shape as Physics (`ch1-heat-and-gases`). Uni+ only looks **one level** under `content-packs/`:

```
content-packs/
  ch01-earth/
    manifest.json          ← required. If this file is valid and published, Uni+ can list the chapter
    quiz.json              ← chapter quiz index (every topic in this pack)
    notes/                 ← English PDFs (繁體 UI still opens this file)
    tools/<slug>/          ← labs, games, and flashcard pages (keep index.html here)
    quiz/<topic-slug>/     ← one folder per syllabus topic; quiz.json holds the items
    summaries/
  ch02-microscopic-world-i/
  …
  ch15-analytical-chemistry/
```

`manifest.json` is the table of contents. **A file that is not listed there is invisible** in Uni+.

Do **not** wrap chapters in year folders such as `content-packs/S3/…`. Uni+ will not see them.

Do **not** make one folder per Layer 2 topic (`01-fundamentals-of-chemistry`). Topics live inside the chapter pack.

## S3–S6 is a label on a Topic, not a folder

The syllabus list is `content/topics/chem-topics.json` (from *Chem topic list - Updated.xlsx*). Each Topic has:

- a **Chapter** (Layer 1), e.g. `CH01 Earth`, `CH02 Microscopic World I`
- a **Topic Code** (Layer 2), e.g. `CPE01`, `CMWA01`
- a **Level**, e.g. `(S3)`, `(S4 - S5)`, or `(S6)`
- **Sub-topics** (Layer 3) where the sheet lists them, e.g. `CPE01.1`

Form (S3 vs S6) is **not** chosen by folder name. Do not invent Topic Codes.

## Chapters

| Folder | Learning Tools title | Topics inside |
| --- | --- | --- |
| `ch01-earth` | CH01 Earth / 地球 | CPE01–CPE04 |
| `ch02-microscopic-world-i` | CH02 Microscopic World I / 微觀世界I | CMWA01–CMWA05 |

Later chapters (`CH03`–`CH15`) use the same `chNN-…` folder names when those packs are added.

The S3 multiple-choice bank covers Earth and Microscopic World I. The combined HTML picker stays in `ch01-earth/tools/s3-mc`. Each topic’s questions are also listed under that chapter’s `quiz/<topic-slug>/quiz.json`, and the chapter `quiz.json` indexes them. Flashcard study pages are HTML tools (`*-flashcards-en` and `*-flashcards-zh`), not JSON decks.

## What teachers edit

| You want to change | Edit |
| --- | --- |
| Which items appear | that chapter’s `manifest.json` |
| Notes | one English PDF in `notes/` (`files.en` only) |
| A lab, game, or flashcard page | `tools/<slug>/` (keep `index.html`) and the `tools` list |
| A topic quiz | that chapter’s `quiz.json`, `quiz/<topic-slug>/quiz.json`, and the `quiz` list |
| A summary image | `summaries/` and the `summaries` list |
| Topic codes / year | `content/topics/chem-topics.json` |

Cursor follows `.cursor/rules/chem-content-packs.mdc`.
