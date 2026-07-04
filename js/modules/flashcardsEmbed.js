// Flashcards — iframe topic + language switcher for #flashcards-page

const CACHE_BUST = "v=20260704b";

const DECKS = {
  "microscopic-world-i": {
    en: "./public/flashcards/microscopic-world-i/en/flashcards-study.html",
    zh: "./public/flashcards/microscopic-world-i/zh-hk/flashcards-study.html",
  },
  "topic-3-metals": {
    en: "./public/flashcards/topic-3-metals/en/flashcards-study.html",
    zh: "./public/flashcards/topic-3-metals/zh-hk/flashcards-study.html",
  },
};

const TITLES = {
  "microscopic-world-i": "Microscopic World I Flashcards",
  "topic-3-metals": "Topic 3: Metals Flashcards",
};

export function initFlashcardsEmbed() {
  if (window.__flashcardsEmbedInited) return;
  window.__flashcardsEmbedInited = true;

  const frame = document.getElementById("fc-embed-frame");
  const btnEn = document.getElementById("fc-embed-lang-en");
  const btnZh = document.getElementById("fc-embed-lang-zh");
  const topicBtns = document.querySelectorAll("[data-fc-topic]");
  if (!frame || !btnEn || !btnZh) return;

  let currentTopic = "microscopic-world-i";
  let currentLocale = "en";

  function setDeck(topic, locale) {
    const deck = DECKS[topic];
    if (!deck || !deck[locale]) return;

    currentTopic = topic;
    currentLocale = locale;
    frame.src = `${deck[locale]}?${CACHE_BUST}`;
    frame.title = TITLES[topic] || "Flashcards";

    topicBtns.forEach((btn) => {
      const active = btn.dataset.fcTopic === topic;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const isEn = locale === "en";
    btnEn.classList.toggle("active", isEn);
    btnZh.classList.toggle("active", !isEn);
    btnEn.setAttribute("aria-pressed", isEn ? "true" : "false");
    btnZh.setAttribute("aria-pressed", isEn ? "false" : "true");
  }

  topicBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.dataset.fcTopic;
      if (topic && DECKS[topic]) setDeck(topic, currentLocale);
    });
  });

  btnEn.addEventListener("click", () => setDeck(currentTopic, "en"));
  btnZh.addEventListener("click", () => setDeck(currentTopic, "zh"));

  setDeck(currentTopic, currentLocale);
}
