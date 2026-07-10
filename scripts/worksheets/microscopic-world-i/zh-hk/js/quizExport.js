import { createQuizExport } from "../../shared/quiz/quizExport.js";

// Customize titles and file prefix for each quiz app.
const { downloadWord, printSheet } = createQuizExport({
  titleEnQuestions: "Quiz — Questions",
  titleEnAnswers: "Quiz — Answers",
  titleZhQuestions: "測驗 — 試題",
  titleZhAnswers: "測驗 — 答案",
  filePrefix: "quiz",
});

export { downloadWord, printSheet };
