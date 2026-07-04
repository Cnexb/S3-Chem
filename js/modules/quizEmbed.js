// Quiz tab — chapter switcher (Microscopic World I + Topic 3 Metals)

const CACHE_BUST = "v=20260704v1";

const QUIZZES = {
  "microscopic-world-i": `./public/quiz/microscopic-world-i/quiz.html?v=20260704v4`,
  metals: `./public/quiz/metals/quiz.html?${CACHE_BUST}`,
};

export function initQuizEmbed() {
  if (window.__quizEmbedInited) return;
  window.__quizEmbedInited = true;

  const frame = document.getElementById("quiz-embed-frame");
  const btnMwi = document.getElementById("quiz-embed-topic-mwi");
  const btnMetals = document.getElementById("quiz-embed-topic-metals");
  if (!frame || !btnMwi || !btnMetals) return;

  function setTopic(topic) {
    const isMwi = topic === "microscopic-world-i";
    frame.src = isMwi ? QUIZZES["microscopic-world-i"] : QUIZZES.metals;
    frame.title = isMwi ? "Microscopic World I Quiz" : "Topic 3: Metals Quiz";
    btnMwi.classList.toggle("active", isMwi);
    btnMetals.classList.toggle("active", !isMwi);
    btnMwi.setAttribute("aria-pressed", isMwi ? "true" : "false");
    btnMetals.setAttribute("aria-pressed", isMwi ? "false" : "true");
  }

  btnMwi.addEventListener("click", () => setTopic("microscopic-world-i"));
  btnMetals.addEventListener("click", () => setTopic("metals"));
}
