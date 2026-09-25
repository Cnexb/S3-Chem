# Chemistry content packs

This repo is the Chemistry teaching files for **Uni+ (All-In-One)**. Students do not open this site. Uni+ reads the `content-packs/` folder and shows notes, tools, games, quizzes, summaries, and flashcards in Learning Tools.

## How Uni+ finds content

Each **textbook chapter** is one folder. Uni+ only looks **one level** under `content-packs/`:

```
content-packs/
  ch1-planet-earth/
    manifest.json          ← required. If this file is valid and published, Uni+ can list the chapter
    notes/                 ← English PDFs (繁體 UI still opens this file)
    tools/<slug>/          ← labs, games, quizzes, and flashcard pages (keep index.html here)
    summaries/
  ch2-microscopic-world-i/
  …
  ch15-analytical-chemistry/
```

`manifest.json` is the table of contents. **A file that is not listed there is invisible** in Uni+.

Do **not** wrap chapters in year folders such as `content-packs/S3/…`. Uni+ will not see them.

## Chapters

| Folder | Chapter |
| --- | --- |
| `ch1-planet-earth` | Planet Earth, including laboratory safety |
| `ch2-microscopic-world-i` | Microscopic World I |
| `ch3-metals` | Metals |
| `ch4-acids-and-bases` | Acids and Bases |
| `ch5-fossil-fuels-and-carbon-compounds` | Fossil Fuels and Carbon Compounds |
| `ch6-microscopic-world-ii` | Microscopic World II |
| `ch7-redox-reactions` | Redox Reactions, Chemical Cells and Electrolysis |
| `ch8-chemical-reactions-and-energy` | Chemical Reactions and Energy |
| `ch9-rate-of-reaction` | Rate of Reaction |
| `ch10-chemical-equilibrium` | Chemical Equilibrium |
| `ch11-chemistry-of-carbon-compounds` | Chemistry of Carbon Compounds |
| `ch12-patterns-in-the-chemical-world` | Patterns in the Chemical World |
| `ch13-industrial-chemistry` | Industrial Chemistry |
| `ch14-materials-chemistry` | Materials Chemistry |
| `ch15-analytical-chemistry` | Analytical Chemistry |

The S3 multiple-choice bank covers Earth and Microscopic World I. It lives in `ch1-planet-earth` so there is one copy. Flashcard study pages are HTML tools (`*-flashcards-en` and `*-flashcards-zh`), not JSON decks.

The periodic table, ion engine, and equation balancer are still the hub site on `main`. They are not separate lesson folders, so they are not in these packs.

## What teachers edit

| You want to change | Edit |
| --- | --- |
| Which items appear | that chapter’s `manifest.json` |
| Notes | one English PDF in `notes/` (`files.en` only) |
| A lab, game, quiz, or flashcard page | `tools/<slug>/` (keep `index.html`) and the `tools` list |
| A summary image | `summaries/` and the `summaries` list |
| Topic codes | the `topicCode` on the note row. Do not invent syllabus Symbols |

Cursor follows `.cursor/rules/chem-content-packs.mdc`.

```bash
npm test
```
