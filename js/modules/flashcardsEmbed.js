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
  "topic-4-acids-and-bases": {
    en: "./public/flashcards/topic-4-acids-and-bases/en/flashcards-study.html",
    zh: "./public/flashcards/topic-4-acids-and-bases/zh-hk/flashcards-study.html",
  },
  "topic-5-fossil-fuels-and-carbon-compounds": {
    en: "./public/flashcards/topic-5-fossil-fuels-and-carbon-compounds/en/flashcards-study.html",
    zh: "./public/flashcards/topic-5-fossil-fuels-and-carbon-compounds/zh-hk/flashcards-study.html",
  },
  "topic-6-microscopic-world-ii": {
    en: "./public/flashcards/topic-6-microscopic-world-ii/en/flashcards-study.html",
    zh: "./public/flashcards/topic-6-microscopic-world-ii/zh-hk/flashcards-study.html",
  },
  "topic-7-redox-reactions-chemical-cells-and-electrolysis": {
    en: "./public/flashcards/topic-7-redox-reactions-chemical-cells-and-electrolysis/en/flashcards-study.html",
    zh: "./public/flashcards/topic-7-redox-reactions-chemical-cells-and-electrolysis/zh-hk/flashcards-study.html",
  },
  "topic-8-chemical-reactions-and-energy": {
    en: "./public/flashcards/topic-8-chemical-reactions-and-energy/en/flashcards-study.html",
    zh: "./public/flashcards/topic-8-chemical-reactions-and-energy/zh-hk/flashcards-study.html",
  },
  "topic-9-rates-of-reactions": {
    en: "./public/flashcards/topic-9-rates-of-reactions/en/flashcards-study.html",
    zh: "./public/flashcards/topic-9-rates-of-reactions/zh-hk/flashcards-study.html",
  },
  "topic-10-chemical-equilibrium": {
    en: "./public/flashcards/topic-10-chemical-equilibrium/en/flashcards-study.html",
    zh: "./public/flashcards/topic-10-chemical-equilibrium/en/flashcards-study.html",
  },
};

const TITLES = {
  "microscopic-world-i": "Microscopic World I Flashcards",
  "topic-3-metals": "Topic 3: Metals Flashcards",
  "topic-4-acids-and-bases": "Topic 4: Acids and Bases Flashcards",
  "topic-5-fossil-fuels-and-carbon-compounds": "Topic 5: Fossil Fuels and Carbon Compounds Flashcards",
  "topic-6-microscopic-world-ii": "Topic 6: Microscopic World II Flashcards",
  "topic-7-redox-reactions-chemical-cells-and-electrolysis": "Topic 7: Redox Reactions, Chemical Cells and Electrolysis Flashcards",
  "topic-8-chemical-reactions-and-energy": "Topic 8: Chemical Reactions and Energy Flashcards",
  "topic-9-rates-of-reactions": "Topic 9: Rates of Reactions Flashcards",
  "topic-10-chemical-equilibrium": "Topic 10: Chemical Equilibrium Flashcards",
};

export function initFlashcardsEmbed() {
  if (window.__flashcardsEmbedInited) return;
  window.__flashcardsEmbedInited = true;

  const frame = document.getElementById("fc-embed-frame");
  const btnEn = document.getElementById("fc-embed-lang-en");
  const btnZh = document.getElementById("fc-embed-lang-zh");
  const topicSelect = document.getElementById("fc-embed-topic-select");
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

    if (topicSelect) {
      topicSelect.value = topic;
    }

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

  if (topicSelect) {
    topicSelect.addEventListener("change", (e) => {
      const topic = e.target.value;
      if (topic && DECKS[topic]) setDeck(topic, currentLocale);
    });
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
