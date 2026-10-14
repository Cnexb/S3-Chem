---
name: review-content-pr
description: Reviews MATH, PHY, CHEM, and BIO lesson PRs and quiz files for New scheme quiz_id/section/question_id, uni-tracker wiring, then tools in local preview. Use in koc-s3-math-dashboard, S3_Phy, S3-Chem, or S3-Bio when reviewing or checking out a content PR, adding or updating a quiz, migrating quiz identity, or asking whether quizzes can be tracked. Rewrites posted identity to New scheme when a quiz is not already using it.
---

# Review content PR

Run these gates in order. Stop the gate that fails; still finish later gates unless the page cannot load. Do not merge unless the user asked to merge.

**PR review:** checkout, then gates 2–4 on the diff. **Quiz update** (new lesson, new set, or an existing quiz the user named): skip checkout if already on the right tree; still run gate 2 on that quiz, then 3–4 on its page.

Frozen-runner / UniPlus-seam rules yield for **New scheme identity only** (`quizId`, `idPrefix`, `section`, pack item `id`, matching `QUIZ_META` and contract tests). Question text stays in the banks. Leave `postMessage`, `fetch`, and `uni-tracker.js` unchanged.

## Subject

Read the repo you are in. Do not assume MATH.

| Repo | Subject | Default branch | Prefix | Code example |
|------|---------|----------------|--------|----------------|
| `koc-s3-math-dashboard` | MATH | `master` | `math-` | `JM28` |
| `S3_Phy` | PHY | `main` | `phy-` | `JPHG01` |
| `S3-Chem` | CHEM | `main` | `chem-` | `CPE01` |
| `S3-Bio` | BIO | `main` | `bio-` | `BB02` |

`subject` in the payload and `*_quiz_attempts` table follow that row (`MATH` → `math_quiz_attempts`, and the same for PHY/CHEM/BIO). Lesson `code` is the topic token on the page (`jm-eyebrow`, pack `chapterCode` / `topicCode`), lowercased in `quiz_id` / `question_id` only.

## 1. Load the work

Checkout a PR onto latest `origin/<default branch>` (or its stated base). For a local quiz update, note the lesson files instead. Serve the repo (`python3 -m http.server` from the repo root). Note the lesson codes and changed paths.

Done when: the tree is ready, the server returns 200 for the lesson page, and the file list is known.

## 2. Quizzes — New scheme

Run this gate if the work touches `*-quiz.js`, `*-quiz-data.js`, `quiz/**/questions.json`, `quiz/**/quiz.json`, pack `manifest.json` quiz entries, `section-quiz.js`, `*quiz-tracker.js`, a lesson `index.html` quiz panel, **or** the user asked to add/update a quiz.

Read the posted `quizId` / `questionId` / `section` from the file that calls `reportQuiz` (or `SectionQuiz.init`, or pack JSON `quizId` / item `id` / `section`). A new quiz with no posted ids yet still goes through this gate: write New scheme on first `init` or first pack JSON. Compare to New scheme.

| Field | New scheme | MATH JM28 Q1 | PHY JPHG01 Q1 | CHEM CPE01 Q1 | BIO BB02 Q1 |
|-------|------------|--------------|---------------|---------------|-------------|
| `quiz_id` | `{prefix}-{code}` lowercase; further sets in the same chapter `-{n}` (`-2`, `-3`, …) | `math-jm28` | `phy-jphg01` | `chem-cpe01` | `bio-bb02` |
| `question_id` | `{code}-{n}` with `idPrefix` `{code}-` | `jm28-1` | `jphg01-1` | `cpe01-1` | `bb02-1` |
| `section` | topic code only | `JM28` | `JPHG01` | `CPE01` | `BB02` |

First set is `{prefix}-{code}`; the next sets are `{prefix}-{code}-2`, then `-3`, matching set order. Extra sets are not `{prefix}-{code}-1` and not a lesson-folder id (`chem-cpe01-1`, `jm26-l01`).

In pack JSON, item `id` **is** `question_id` and numbering is continuous in the chapter (L02 Q1 continues after L01). Keep the pack folder / manifest `slug`. Do not convert option shape (`{ key, text }` vs plain strings).

**Using** already matches that table.

**Not using** includes Excel symbols (`Perc2`, `Index`, `CeTen`, `Earth1A`, `MWI3A`), lesson-prefixed or dotted ids (`loi-l01-q1`, `pct-q1`, `CPE01.1-1`, `BB02.1-1`, `jm26-l01-1`), long or dotted sections (`JM24 Law of Indices`, `JPHG01.3`, `CPE01.1`, `L01`), pack `quizId` that embeds the lesson folder.

When **not using**, rewrite the posted identity to New scheme in the same files (this is the whole point of the gate for future quizzes):

1. Dashboard runners: `quizId`, `idPrefix`, and `section` on `SectionQuiz.init`, each `QUIZ_SETS` row, and the `reportQuiz` meta object. Keep each question object's numeric `id`. `questionId` is `idPrefix + id`.
2. Pack JSON: `quizId`, item `id`, and `section` on `questions.json` / `quiz.json` and matching `manifest.json` quiz entries. `section-quiz.js` may read `activeSet.quizId || config.quizId` so extra sets can differ.
3. Matching tracker `QUIZ_META` rows and contract tests that pin those strings (MATH: `dashboard/scripts/test-math-quiz-tracker.cjs`). Packs: `bun --cwd content-packs run lint:quizzes` when that script exists.

Do not invent Excel codes for a new quiz.

Then label **using** with the new values, or **not using** if the lesson code cannot be read.

Done when: every quiz in scope is labelled using / not using, with the actual values next to the New scheme values, and not-using quizzes were rewritten or blocked with a reason.

## 3. Quizzes — tracker

For each quiz in scope:

1. Lesson page loads `uni-education-elearning.pages.dev/tracker/uni-tracker.js` and the subject quiz-tracker (MATH: `math-quiz-tracker.js`) or the pack runner that posts the same event.
2. Submit (or `reportQuiz`) posts `type: "uniplus:quizAnswer"` with `subject` matching the table above and the contract fields: `quizId`, `questionId`, `section`, `stem`, `selectedAnswer`, `selectedAnswerText`, `correctAnswer`, `correctAnswerText`, `isCorrect`.
3. `uni-tracker.js` has no quiz-id allowlist. New scheme ids can save. Old ids can also save — that is not a pass for gate 2.
4. Local preview without a UniPlus session: expect `[uni-tracker] Got quiz answer but no session yet`. That is **wired, not saved**. With a session, it POSTs `{subject}_quiz_attempts`.
5. Comic follow-up questions that “stay on this tab only” are **not** tracked unless they post `uniplus:quizAnswer`.

Verify in the browser: submit the quiz, capture `uniplus:quizAnswer` (message listener or console). Do not treat a screenshot of the quiz tab as proof.

Done when: each quiz is **tracked** (event reaches uni-tracker with a complete payload) or **not tracked** (missing script, missing post, empty `quizId`/`questionId`, or comics-only).

## 4. Contents — tools and display

Open every changed student surface the way a student would: Concept decks, Interactive Tool labs, Game, Comic, Summary, Quiz. Click, drag, switch chips/tabs, advance slides.

Fail on: console errors, broken relative paths, empty iframe, missing mp4/image, control that does nothing, layout that hides the tool, “Coming soon” on a surface the work claims to add.

Local URLs: MATH `http://127.0.0.1:<port>/dashboard/topics/<topic>/index.html`. Packs: `content-packs/<pack>/tools/` `index.html` (or `tools/<slug>/`), and `content-packs/<pack>/quiz/<id>/` when that is the student surface.

Done when: each changed surface is **usable** or listed with the error.

## Report

```
Repo: <name>  Subject: MATH | PHY | CHEM | BIO
PR: #<n> <title>   |   Lesson: <code> (working tree)
New scheme: using | not using | no quizzes
  quiz_id / question_id / section: <actual>  (expected <New scheme>)
  migrated: yes | already using | blocked (<reason>)
Tracker: tracked | not tracked | no quizzes
  <one line: event + session behaviour>
Contents: usable | errors
  <each changed tab/tool>
Merge: wait | ok if asked | n/a (local quiz update)
```
