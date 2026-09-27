# Chemistry content packs

This repo is the Chemistry teaching files for **Uni+ (All-In-One)**. Students do not open this site. Uni+ reads the `content-packs/` folder and shows notes, tools, games, quizzes, summaries, and flashcards in Learning Tools.

## How Uni+ finds content

Each **syllabus chapter** from the Chem topic list is one folder. The folder name is the CSV chapter number plus the topic name, for example `01-fundamentals-of-chemistry`. Uni+ only looks **one level** under `content-packs/`:

```
content-packs/
  01-fundamentals-of-chemistry/
    manifest.json          ← required. If this file is valid and published, Uni+ can list the chapter
    notes/                 ← English PDFs (繁體 UI still opens this file)
    tools/<slug>/          ← labs, games, quizzes, and flashcard pages (keep index.html here)
    summaries/
  02-atmosphere/
  …
  65-analytical-chemistry-in-society/
```

`manifest.json` is the table of contents. **A file that is not listed there is invisible** in Uni+.

Do **not** wrap chapters in year folders such as `content-packs/S3/…`. Uni+ will not see them.

## S3–S6 is a label on a Topic, not a folder

The syllabus list is `content/topics/chem-topics.json`. Each Topic has:

- a **Symbol** (short code), e.g. `Earth1`, `MWI1A`, `Metal2`
- a **Topic Number**, e.g. `01 Fundamentals of chemistry`, `10 Metal extraction`
- a **Level**, e.g. `(S3)`, `(S4 - S5)`, or `(S6)`
- **Sub-topics** where the sheet lists them, each with its own Symbol

Form (S3 vs S6) is **not** chosen by folder name. Do not invent Symbols.

## Chapters

Each summary sheet lives in the topic-list chapter whose name matches it, for example extraction sheets in `10-metal-extraction` and titration sheets in `19-volumetric-analysis-1`.

The S3 multiple-choice bank covers Earth and Microscopic World I. It lives in `01-fundamentals-of-chemistry` so there is one copy. Flashcard study pages are HTML tools (`*-flashcards-en` and `*-flashcards-zh`), not JSON decks.

The periodic table, ion engine, and equation balancer are still the hub site on `main`. They are not separate lesson folders, so they are not in these packs.

## What teachers edit

| You want to change | Edit |
| --- | --- |
| Which items appear | that chapter’s `manifest.json` |
| Notes | one English PDF in `notes/` (`files.en` only) |
| A lab, game, quiz, or flashcard page | `tools/<slug>/` (keep `index.html`) and the `tools` list |
| A summary image | `summaries/` and the `summaries` list |
| Topic codes / year | `content/topics/chem-topics.json` |

Cursor follows `.cursor/rules/chem-content-packs.mdc`.
