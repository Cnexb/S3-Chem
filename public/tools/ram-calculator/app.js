(() => {
  "use strict";

  const MIN_ISOTOPES = 1;
  const MAX_ISOTOPES = 12;
  const TOTAL_TOLERANCE = 0.01;
  const COLORS = ["#2d6be8", "#28a4d9", "#16a179", "#805bd8", "#e58a3a"];
  const { ElementLibrary } = window;

  const MODE_STARTERS = {
    mixture: "Cl",
    mass: "Br",
    abundances: "Mg"
  };

  const TRANSLATIONS = {
    en: {
      appTitle: "Relative Atomic Mass Laboratory",
      appSubtitle: "Interactive isotope weighted-average calculator",
      workspace: "CALCULATION WORKSPACE",
      inputs: "Isotope data",
      modeMixture: "Isotope mixture",
      modeMass: "Find mass number",
      modeAbundances: "Find two abundances",
      workspaceTitleMixture: "Isotope mixture",
      workspaceTitleMass: "Find mass number",
      workspaceTitleAbundances: "Find two abundances",
      enterValuesMixture: "Enter mass and abundance",
      enterValuesMass: "Enter Aᵣ, abundances, and known masses",
      enterValuesAbundances: "Enter Aᵣ, masses, and known abundances",
      arLabel: "Relative atomic mass (A<sub>r</sub>)",
      modeHintMass: "Leave exactly one isotope mass blank — that is the unknown mass number.",
      modeHintAbundances: "Leave exactly two abundance fields blank — those are the unknowns.",
      chooseElement: "Choose from periodic table",
      periodicHub: "PERIODIC TABLE HUB",
      periodicTitle: "Choose an element",
      searchElement: "Search",
      searchPlaceholder: "Cl, Bromine, 溴...",
      selectedElement: "{name} ({symbol}) · Aᵣ {ar}",
      examples: "Examples",
      isotope: "Isotope",
      mass: "Isotope mass",
      abundance: "Abundance (%)",
      addIsotope: "Add isotope",
      calculate: "Calculate Aᵣ",
      calculateMass: "Calculate mass number",
      calculateAbundances: "Calculate abundances",
      reset: "Reset",
      abundanceTotal: "Abundance total",
      totalReady: "Ready — total is 100%",
      totalShort: "Total is {total}%; enter exactly 100%.",
      totalPartial: "Known abundances total {total}%; remaining {remaining}% for the two unknowns.",
      analysis: "LIVE ANALYSIS",
      resultsMixture: "Relative atomic mass",
      resultsMass: "Unknown mass number",
      resultsAbundances: "Unknown abundances",
      valid: "Valid",
      checkData: "Check data",
      calculatedResult: "Calculated result",
      noUnit: "unitless value",
      massUnit: "mass number",
      abundanceUnit: "percentage abundance",
      chartTitle: "Isotope abundance profile",
      percentScale: "0–100% scale",
      working: "Step by step",
      weightedMean: "Weighted mean",
      kicker: "HKDSE CHEMISTRY",
      hideData: "Hide data",
      showData: "Show data",
      hundredTitle: "These percentages add to 100%",
      hundredHint: "Each colour is one isotope. The pieces must fill the whole bar.",
      replay: "Replay",
      questionLabel: "Question",
      givenLabel: "Given",
      unknownLabel: "Find",
      rimHeading: "Relative isotopic mass",
      abundanceHeading: "Abundance",
      ramHeading: "Relative atomic mass",
      stepLet: "1. Let",
      stepFormula: "2. Formula",
      hundredWhy: "÷ 100 because the abundances are in %.",
      stepFind: "3. Find",
      nextStep: "Next",
      prevStep: "Back",
      zoomAll: "All",
      zoomQuestion: "Question",
      zoomAnswer: "Answer",
      zoomBar: "Bar",
      zoomSteps: "Steps",
      readQuestion: "Read what is given",
      stepProgress: "Step {n} of 3",
      gapLabel: "Still {n}% short of 100%",
      overLabel: "{n}% past 100%",
      exactLabel: "The parts add to 100%",
      stepMultiply: "Multiply mass by its percentage",
      stepAdd: "Add the contributions",
      stepDivide: "Divide by 100",
      stepDivideNote: "Abundances are percentages, so the total is out of 100.",
      stepMassTarget: "The weighted total must equal Aᵣ × 100",
      stepMassRemain: "Subtract the known contributions",
      stepMassSolve: "Divide by this isotope's percentage",
      stepSumRule: "The unknown percentages share what is left of 100%",
      stepAbundEq: "Put the masses into the Aᵣ equation",
      stepAbundSolve: "Solve the pair",
      legendSum: "{parts} = {total}%",
      learningNoteMixture: "Relative atomic mass is the weighted average of an element's isotope masses. It has no unit and is usually not a whole number.",
      learningNoteMass: "When Aᵣ and all abundances are known, rearrange the weighted-average formula to find one missing isotope mass.",
      learningNoteAbundances: "When Aᵣ and all isotope masses are known, two unknown abundances can be found using the 100% total and the Aᵣ equation.",
      simplifiedNote: "This element has no characteristic terrestrial isotopic abundance, so a simplified single-isotope example is used.",
      footer: "An original educational tool for isotope calculations.",
      missingValues: "Enter a valid non-negative mass and abundance for every isotope.",
      missingAr: "Enter a valid non-negative relative atomic mass (Aᵣ).",
      abundanceRange: "Each abundance must be between 0% and 100%.",
      totalError: "The isotope abundances must add up to 100%. Current total: {total}%.",
      oneUnknownMass: "Leave exactly one isotope mass blank for the unknown mass number.",
      twoUnknownAbundances: "Leave exactly two abundance fields blank for the unknowns.",
      needTwoIsotopes: "At least two isotopes are required for this mode.",
      equalMasses: "The two unknown isotopes must have different masses.",
      negativeAbundance: "The solved abundances are not between 0% and 100%. Check Aᵣ and the masses.",
      zeroAbundanceMass: "The unknown isotope must have a non-zero abundance.",
      invalidMassResult: "The solved mass number is not valid. Check Aᵣ and the abundances.",
      remainingNegative: "Known abundances already exceed 100%.",
      maxRows: "A maximum of twelve isotopes is supported.",
      minimumRows: "At least one isotope row is required.",
      removeIsotope: "Remove isotope {number}",
      massLabel: "Isotope {number} mass",
      abundanceLabel: "Isotope {number} abundance",
      workingProductsSigFig: "Weighted products: {products}",
      workingSumExact: "Sum of products = {sum}",
      workingResult: "Aᵣ = {sum} ÷ 100 = {result}",
      workingMassSetup: "Aᵣ = [(known products) + (x × {abundance})] ÷ 100",
      workingMassKnown: "Known products = {products} = {sum}",
      workingMassSolve: "{ar} = ({sum} + {abundance}x) ÷ 100 → x = {result}",
      workingAbundSetup: "Let the unknowns be x% and y% for masses {massX} and {massY}.",
      workingAbundSum: "x + y = {remaining}  (because known abundances total {known}%)",
      workingAbundEq: "{ar} = [{knownProducts} + ({massX} × x) + ({massY} × y)] ÷ 100",
      workingAbundSolve: "Substitute y = {remaining} − x → x = {x}, y = {y}",
      isotopeSummaryTitle: "{name} isotopes",
      isotopeSummaryCount: "{natural} natural isotopes",
      isotopeSummaryCountOne: "1 natural isotope (monoisotopic)",
      isotopeSummaryCountSimplified: "0 natural isotopes",
      isotopeSummarySimplified: "No characteristic terrestrial isotopic abundance is known, so a simplified single-isotope example is used for Aᵣ.",
      isotopeExample: "example (100%)",
      categoryAlkali: "Alkali metal",
      categoryAlkalineEarth: "Alkaline earth",
      categoryTransition: "Transition metal",
      categoryPostTransition: "Post-transition metal",
      categoryMetalloid: "Metalloid",
      categoryNonmetal: "Non-metal",
      categoryHalogen: "Halogen",
      categoryNoble: "Noble gas",
      categoryLanthanide: "Lanthanide",
      categoryActinide: "Actinide",
      categoryUnknown: "Unknown"
    },
    zh: {
      appTitle: "相對原子質量實驗室",
      appSubtitle: "互動同位素加權平均計算器",
      workspace: "計算工作區",
      inputs: "同位素數據",
      modeMixture: "同位素混合物",
      modeMass: "求質量數",
      modeAbundances: "求兩個未知豐度",
      workspaceTitleMixture: "同位素混合物",
      workspaceTitleMass: "求質量數",
      workspaceTitleAbundances: "求兩個未知豐度",
      enterValuesMixture: "輸入質量及豐度",
      enterValuesMass: "輸入 Aᵣ、豐度及已知質量",
      enterValuesAbundances: "輸入 Aᵣ、質量及已知豐度",
      arLabel: "相對原子質量 (A<sub>r</sub>)",
      modeHintMass: "請剛好留下一個同位素質量空白 — 那就是未知質量數。",
      modeHintAbundances: "請剛好留下兩個豐度空白 — 那就是兩個未知數。",
      chooseElement: "從週期表選擇元素",
      periodicHub: "週期表互動中心",
      periodicTitle: "選擇元素",
      searchElement: "搜尋",
      searchPlaceholder: "Cl、Bromine、溴...",
      selectedElement: "{name} ({symbol}) · Aᵣ {ar}",
      examples: "例子",
      isotope: "同位素",
      mass: "同位素質量",
      abundance: "豐度 (%)",
      addIsotope: "新增同位素",
      calculate: "計算 Aᵣ",
      calculateMass: "計算質量數",
      calculateAbundances: "計算豐度",
      reset: "重設",
      abundanceTotal: "豐度總和",
      totalReady: "可計算 — 總和為 100%",
      totalShort: "總和為 {total}%；請輸入剛好 100%。",
      totalPartial: "已知豐度總和為 {total}%；兩個未知數合共 {remaining}%。",
      analysis: "即時分析",
      resultsMixture: "相對原子質量",
      resultsMass: "未知質量數",
      resultsAbundances: "未知豐度",
      valid: "有效",
      checkData: "檢查數據",
      calculatedResult: "計算結果",
      noUnit: "沒有單位",
      massUnit: "質量數",
      abundanceUnit: "百分豐度",
      chartTitle: "同位素豐度分佈",
      percentScale: "0–100% 比例",
      working: "逐步計算",
      weightedMean: "加權平均",
      kicker: "HKDSE 化學",
      hideData: "隱藏數據",
      showData: "顯示數據",
      hundredTitle: "這些百分數加起來是 100%",
      hundredHint: "每種顏色是一種同位素。色塊必須填滿整條棒。",
      replay: "重播",
      questionLabel: "題目",
      givenLabel: "已知",
      unknownLabel: "要求",
      rimHeading: "相對同位素質量",
      abundanceHeading: "豐度",
      ramHeading: "相對原子質量",
      stepLet: "1. 設",
      stepFormula: "2. 公式",
      hundredWhy: "÷ 100，因為豐度是百分數。",
      stepFind: "3. 求出未知數",
      nextStep: "下一步",
      prevStep: "上一步",
      zoomAll: "全頁",
      zoomQuestion: "題目",
      zoomAnswer: "答案",
      zoomBar: "百分條",
      zoomSteps: "步驟",
      readQuestion: "先讀已知條件",
      stepProgress: "第 {n} 步，共 3 步",
      gapLabel: "還差 {n}% 才到 100%",
      overLabel: "超出 100% 共 {n}%",
      exactLabel: "各部分加起來是 100%",
      stepMultiply: "質量乘以百分豐度",
      stepAdd: "把各項貢獻加起來",
      stepDivide: "除以 100",
      stepDivideNote: "豐度是百分數，所以總和是以 100 為底。",
      stepMassTarget: "加權總和必須等於 Aᵣ × 100",
      stepMassRemain: "減去已知同位素的貢獻",
      stepMassSolve: "除以這個同位素的百分豐度",
      stepSumRule: "兩個未知百分數合共佔剩下的部分",
      stepAbundEq: "把質量代入 Aᵣ 公式",
      stepAbundSolve: "解出這一對未知數",
      legendSum: "{parts} = {total}%",
      learningNoteMixture: "相對原子質量是元素各同位素質量的加權平均值。它沒有單位，而且通常不是整數。",
      learningNoteMass: "當已知 Aᵣ 及所有豐度時，可重排加權平均公式以求出一個未知同位素質量。",
      learningNoteAbundances: "當已知 Aᵣ 及所有同位素質量時，可利用豐度總和為 100% 及 Aᵣ 方程式求出兩個未知豐度。",
      simplifiedNote: "此元素沒有特徵的陸地同位素豐度，因此使用簡化單同位素例子。",
      footer: "原創同位素計算學習工具。",
      missingValues: "請為每個同位素輸入有效的非負質量及豐度。",
      missingAr: "請輸入有效的非負相對原子質量 (Aᵣ)。",
      abundanceRange: "每個豐度必須介乎 0% 至 100%。",
      totalError: "同位素豐度總和必須為 100%。目前總和：{total}%。",
      oneUnknownMass: "請剛好留下一個同位素質量空白作為未知質量數。",
      twoUnknownAbundances: "請剛好留下兩個豐度空白作為未知數。",
      needTwoIsotopes: "此模式至少需要兩個同位素。",
      equalMasses: "兩個未知同位素的質量必須不同。",
      negativeAbundance: "求得的豐度不在 0% 至 100% 之間。請檢查 Aᵣ 及質量。",
      zeroAbundanceMass: "未知同位素的豐度不可為 0。",
      invalidMassResult: "求得的質量數無效。請檢查 Aᵣ 及豐度。",
      remainingNegative: "已知豐度總和已超過 100%。",
      maxRows: "最多支援十二個同位素。",
      minimumRows: "至少需要一個同位素列。",
      removeIsotope: "移除同位素 {number}",
      massLabel: "同位素 {number} 的質量",
      abundanceLabel: "同位素 {number} 的豐度",
      workingProductsSigFig: "加權乘積：{products}",
      workingSumExact: "乘積總和 = {sum}",
      workingResult: "Aᵣ = {sum} ÷ 100 = {result}",
      workingMassSetup: "Aᵣ = [(已知乘積) + (x × {abundance})] ÷ 100",
      workingMassKnown: "已知乘積 = {products} = {sum}",
      workingMassSolve: "{ar} = ({sum} + {abundance}x) ÷ 100 → x = {result}",
      workingAbundSetup: "設質量 {massX} 及 {massY} 的未知豐度為 x% 及 y%。",
      workingAbundSum: "x + y = {remaining}  （已知豐度總和為 {known}%）",
      workingAbundEq: "{ar} = [{knownProducts} + ({massX} × x) + ({massY} × y)] ÷ 100",
      workingAbundSolve: "代入 y = {remaining} − x → x = {x}，y = {y}",
      isotopeSummaryTitle: "{name} 同位素",
      isotopeSummaryCount: "{natural} 個天然同位素",
      isotopeSummaryCountOne: "1 個天然同位素（單同位素）",
      isotopeSummaryCountSimplified: "0 個天然同位素",
      isotopeSummarySimplified: "沒有特徵的陸地同位素豐度，因此 Aᵣ 使用簡化單同位素例子。",
      isotopeExample: "例子（100%）",
      categoryAlkali: "鹼金屬",
      categoryAlkalineEarth: "鹼土金屬",
      categoryTransition: "過渡金屬",
      categoryPostTransition: "貧金屬",
      categoryMetalloid: "類金屬",
      categoryNonmetal: "非金屬",
      categoryHalogen: "鹵素",
      categoryNoble: "稀有氣體",
      categoryLanthanide: "鑭系元素",
      categoryActinide: "錒系元素",
      categoryUnknown: "未知"
    }
  };

  const CATEGORY_I18N = {
    alkali: "categoryAlkali",
    alkalineEarth: "categoryAlkalineEarth",
    transition: "categoryTransition",
    postTransition: "categoryPostTransition",
    metalloid: "categoryMetalloid",
    nonmetal: "categoryNonmetal",
    halogen: "categoryHalogen",
    noble: "categoryNoble",
    lanthanide: "categoryLanthanide",
    actinide: "categoryActinide",
    unknown: "categoryUnknown"
  };

  const FORMULAS = {
    mixture: [
      { html: "A<sub>r</sub>" },
      { text: "=" },
      { text: "Σ(m × %)" },
      { text: "÷ 100" }
    ],
    mass: [
      { html: "x" },
      { text: "=" },
      { text: "(Aᵣ×100 − Σ known)" },
      { text: "÷ aₓ" }
    ],
    abundances: [
      { text: "x + y = R" },
      { text: "·" },
      { html: "A<sub>r</sub>" },
      { text: "equation" }
    ]
  };

  const state = {
    lang: "en",
    mode: "mixture",
    activeElement: "Cl",
    step: 0,
    lesson: null,
    rows: [],
    arValue: null,
    isotopeMeta: null,
    loadNote: null,
    periodicFilter: ""
  };

  const $ = id => document.getElementById(id);
  let lastFocusedElement = null;

  function t(key, replacements = {}) {
    let value = TRANSLATIONS[state.lang][key] || key;
    Object.entries(replacements).forEach(([name, replacement]) => {
      value = value.replace(`{${name}}`, replacement);
    });
    return value;
  }

  function formatNumber(value, maxDecimals = 4) {
    if (!Number.isFinite(value)) return "—";
    return Number(value.toFixed(maxDecimals)).toLocaleString(state.lang === "zh" ? "zh-HK" : "en-GB", {
      maximumFractionDigits: maxDecimals
    });
  }

  function formatPlain(value, maxDecimals = 4) {
    if (!Number.isFinite(value)) return "—";
    return String(Number(value.toFixed(maxDecimals)));
  }

  function roundSigFig(value, sigFigs = 3) {
    if (!Number.isFinite(value)) return NaN;
    if (value === 0) return 0;
    const abs = Math.abs(value);
    const digits = Math.floor(Math.log10(abs));
    const scale = 10 ** (sigFigs - 1 - digits);
    return Math.round(value * scale) / scale;
  }

  function formatSigFig(value, sigFigs = 3) {
    const rounded = roundSigFig(value, sigFigs);
    if (!Number.isFinite(rounded)) return "—";
    return Number(rounded.toPrecision(sigFigs)).toString();
  }

  function isBlank(value) {
    return value === "" || value === null || value === undefined;
  }

  function parseOptionalNumber(raw) {
    if (isBlank(raw) || String(raw).trim() === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : NaN;
  }

  function clearElementContext() {
    state.activeElement = null;
    state.isotopeMeta = null;
    updatePresetButtons();
    renderPeriodicSelection();
    updateSelectedElementSummary();
  }

  function currentElement() {
    return ElementLibrary.getElementBySymbol(state.activeElement);
  }

  function calculateRelativeAtomicMass(rows) {
    const totalAbundance = rows.reduce((sum, row) => sum + row.abundance, 0);
    const productSum = rows.reduce((sum, row) => sum + row.mass * row.abundance, 0);
    return {
      totalAbundance,
      productSum,
      relativeAtomicMass: productSum / 100
    };
  }

  function setArFromMixtureRows(rows) {
    const { relativeAtomicMass } = calculateRelativeAtomicMass(rows);
    if (!Number.isFinite(relativeAtomicMass)) return;
    state.arValue = relativeAtomicMass;
    $("arInput").value = String(Number(relativeAtomicMass.toFixed(6)));
  }

  function calculateUnknownMass(rows, ar) {
    const unknownIndex = rows.findIndex(row => row.mass === null);
    if (unknownIndex < 0) return { error: "oneUnknownMass" };
    const unknown = rows[unknownIndex];
    if (!(unknown.abundance > 0)) return { error: "zeroAbundanceMass" };

    let knownProducts = 0;
    const knownParts = [];
    rows.forEach((row, index) => {
      if (index === unknownIndex) return;
      knownProducts += row.mass * row.abundance;
      knownParts.push(`(${formatNumber(row.mass, 4)} × ${formatNumber(row.abundance, 4)})`);
    });

    const mass = (ar * 100 - knownProducts) / unknown.abundance;
      if (!Number.isFinite(mass) || mass < 0) return { error: "invalidMassResult" };

    return {
      unknownIndex,
      mass,
      knownProducts,
      knownParts,
      abundance: unknown.abundance,
      ar
    };
  }

  function calculateTwoAbundances(rows, ar) {
    const unknownIndexes = rows
      .map((row, index) => (row.abundance === null ? index : -1))
      .filter(index => index >= 0);
    if (unknownIndexes.length !== 2) return { error: "twoUnknownAbundances" };

    const [i, j] = unknownIndexes;
    const massX = rows[i].mass;
    const massY = rows[j].mass;
    if (Math.abs(massX - massY) < 1e-12) return { error: "equalMasses" };

    let knownSum = 0;
    let knownProducts = 0;
    const knownParts = [];
    rows.forEach((row, index) => {
      if (index === i || index === j) return;
      knownSum += row.abundance;
      knownProducts += row.mass * row.abundance;
      knownParts.push(`(${formatNumber(row.mass, 4)} × ${formatNumber(row.abundance, 4)})`);
    });

    const remaining = 100 - knownSum;
    if (remaining < -TOTAL_TOLERANCE) return { error: "remainingNegative" };

    const x = (ar * 100 - knownProducts - massY * remaining) / (massX - massY);
    const y = remaining - x;
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < -TOTAL_TOLERANCE || y < -TOTAL_TOLERANCE
      || x > 100 + TOTAL_TOLERANCE || y > 100 + TOTAL_TOLERANCE) {
      return { error: "negativeAbundance" };
    }

    return {
      indexes: [i, j],
      x: Math.max(0, x),
      y: Math.max(0, y),
      remaining,
      knownSum,
      knownProducts,
      knownParts,
      massX,
      massY,
      ar
    };
  }

  function readRowsFromDom() {
    const rowNodes = [...$("isotopeRows").querySelectorAll(".isotope-row")];
    state.rows = rowNodes.map(node => ({
      mass: parseOptionalNumber(node.querySelector(".mass-input").value),
      abundance: parseOptionalNumber(node.querySelector(".abundance-input").value)
    }));
    const arRaw = $("arInput").value;
    state.arValue = parseOptionalNumber(arRaw);
  }

  function updateSelectedElementSummary() {
    const element = currentElement();
    if (!element) {
      $("selectedElementSummary").textContent = "—";
      $("heroElement").textContent = "";
      return;
    }
    const name = element[state.lang === "zh" ? "zh" : "en"];
    $("selectedElementSummary").textContent = t("selectedElement", {
      name,
      symbol: element.symbol,
      ar: formatNumber(element.ar, 3)
    });
    $("heroElement").textContent = `${name} (${element.symbol})`;
  }

  function updateLearningNote() {}

  function updateModeChrome() {
    const enterKey = state.mode === "mass"
      ? "enterValuesMass"
      : state.mode === "abundances"
        ? "enterValuesAbundances"
        : "enterValuesMixture";
    const resultsKey = state.mode === "mass"
      ? "resultsMass"
      : state.mode === "abundances"
        ? "resultsAbundances"
        : "resultsMixture";
    const calcKey = state.mode === "mass"
      ? "calculateMass"
      : state.mode === "abundances"
        ? "calculateAbundances"
        : "calculate";

    $("inputTitle").textContent = t(enterKey);
    $("resultsTitle").textContent = t(resultsKey);
    $("calculateButton").textContent = t(calcKey);
    $("arLabelText").innerHTML = t("arLabel");
    $("arInputBlock").hidden = state.mode === "mixture";

    document.querySelectorAll(".mode-tab").forEach(button => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (state.mode === "mixture") {
      $("resultSymbol").innerHTML = "A<sub>r</sub>";
      $("resultUnit").textContent = t("noUnit");
    } else if (state.mode === "mass") {
      $("resultSymbol").textContent = "x";
      $("resultUnit").textContent = t("massUnit");
    } else {
      $("resultSymbol").textContent = "%";
      $("resultUnit").textContent = t("abundanceUnit");
    }
  }

  function renderIsotopeSummary(loadResult) {
    const element = currentElement();
    const summary = $("elementIsotopeSummary");
    if (!element || !loadResult) {
      summary.hidden = true;
      return;
    }

    const name = element[state.lang === "zh" ? "zh" : "en"];
    $("isotopeSummaryTitle").textContent = t("isotopeSummaryTitle", { name });
    $("isotopeSummaryCount").textContent = loadResult.simplified
      ? t("isotopeSummaryCountSimplified")
      : loadResult.naturalCount === 1
        ? t("isotopeSummaryCountOne")
        : t("isotopeSummaryCount", {
          natural: loadResult.naturalCount
        });

    const note = loadResult.simplified
      ? t("isotopeSummarySimplified")
      : "";
    $("isotopeSummaryNote").textContent = note;

    const list = $("isotopeSummaryList");
    list.replaceChildren();
    const visibleIsotopes = loadResult.simplified
      ? loadResult.allIsotopes.filter(row => row.example)
      : loadResult.naturalIsotopes;
    visibleIsotopes.forEach(row => {
      const item = document.createElement("li");
      if (row.natural) item.classList.add("natural");
      if (row.example) item.classList.add("example");
      if (row.loaded) item.classList.add("loaded");
      const label = document.createElement("span");
      const value = document.createElement("span");
      label.textContent = `m = ${row.mass}`;
      if (row.example) {
        value.textContent = t("isotopeExample");
      } else {
        value.textContent = `${formatSigFig(row.abundance, 3)}%`;
      }
      item.append(label, value);
      list.appendChild(item);
    });

    const exampleItem = list.querySelector("li.example");
    exampleItem?.scrollIntoView({ block: "nearest" });

    summary.hidden = false;
  }

  function renderPresetButtons() {
    const container = $("presetButtons");
    container.replaceChildren();
    ElementLibrary.PRESET_SYMBOLS.forEach(symbol => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-button";
      button.dataset.symbol = symbol;
      button.textContent = symbol;
      button.classList.toggle("active", symbol === state.activeElement);
      button.addEventListener("click", () => applyElement(symbol));
      container.appendChild(button);
    });
  }

  function updatePresetButtons() {
    document.querySelectorAll("[data-symbol]").forEach(button => {
      button.classList.toggle("active", button.dataset.symbol === state.activeElement);
    });
  }

  function shapeRowsForMode(rows) {
    const shaped = rows.map(row => ({
      mass: Number.isFinite(row.mass) ? row.mass : null,
      abundance: Number.isFinite(row.abundance) ? row.abundance : null
    }));

    if (state.mode === "mass") {
      if (shaped.length < 2) {
        while (shaped.length < 2) shaped.push({ mass: null, abundance: null });
      }
      const blankMasses = shaped.filter(row => row.mass === null).length;
      if (blankMasses === 0 && shaped.length >= 2) {
        shaped[shaped.length - 1].mass = null;
      } else if (blankMasses > 1) {
        let kept = false;
        shaped.forEach(row => {
          if (row.mass === null) {
            if (!kept) {
              kept = true;
            } else {
              row.mass = 0;
            }
          }
        });
        if (!kept) shaped[shaped.length - 1].mass = null;
      }
      return shaped;
    }

    if (state.mode === "abundances") {
      if (shaped.length < 2) {
        while (shaped.length < 2) shaped.push({ mass: null, abundance: null });
      }
      const blankAbundances = shaped.filter(row => row.abundance === null).length;
      if (blankAbundances === 0 && shaped.length >= 2) {
        shaped[shaped.length - 1].abundance = null;
        if (shaped.length >= 3) shaped[shaped.length - 2].abundance = null;
        else shaped[0].abundance = null;
      } else if (blankAbundances === 1 && shaped.length >= 2) {
        const filled = shaped.find(row => row.abundance !== null);
        if (filled) filled.abundance = null;
      } else if (blankAbundances > 2) {
        let keep = 2;
        shaped.forEach(row => {
          if (row.abundance === null) {
            if (keep > 0) keep -= 1;
            else row.abundance = 0;
          }
        });
      }
      return shaped;
    }

    return shaped.map(row => ({
      mass: row.mass === null ? 0 : row.mass,
      abundance: row.abundance === null ? 0 : row.abundance
    }));
  }

  function teachingExampleRows() {
    if (state.mode === "mass") {
      state.arValue = 79.988;
      $("arInput").value = "79.988";
      return [
        { mass: 79, abundance: 50.6 },
        { mass: null, abundance: 49.4 }
      ];
    }
    if (state.mode === "abundances") {
      state.arValue = 24.327;
      $("arInput").value = "24.327";
      return [
        { mass: 24, abundance: 78.6 },
        { mass: 25, abundance: null },
        { mass: 26, abundance: null }
      ];
    }
    state.arValue = null;
    $("arInput").value = "";
    return null;
  }

  function renderRows() {
    const container = $("isotopeRows");
    const template = $("isotopeRowTemplate");
    container.replaceChildren();

    const minRows = state.mode === "mixture" ? MIN_ISOTOPES : 2;

    state.rows.forEach((row, index) => {
      const fragment = template.content.cloneNode(true);
      const rowNode = fragment.querySelector(".isotope-row");
      const massInput = fragment.querySelector(".mass-input");
      const abundanceInput = fragment.querySelector(".abundance-input");
      const removeButton = fragment.querySelector(".remove-button");
      const number = index + 1;

      fragment.querySelector(".isotope-index").textContent = number;
      massInput.value = row.mass === null || row.mass === undefined ? "" : row.mass;
      abundanceInput.value = row.abundance === null || row.abundance === undefined ? "" : row.abundance;
      massInput.setAttribute("aria-label", t("massLabel", { number }));
      abundanceInput.setAttribute("aria-label", t("abundanceLabel", { number }));
      removeButton.setAttribute("aria-label", t("removeIsotope", { number }));
      removeButton.disabled = state.rows.length <= minRows;

      const massUnknown = state.mode === "mass" && (row.mass === null || row.mass === undefined);
      const abundUnknown = state.mode === "abundances" && (row.abundance === null || row.abundance === undefined);
      massInput.classList.toggle("unknown-slot", massUnknown);
      abundanceInput.classList.toggle("unknown-slot", abundUnknown);
      rowNode.classList.toggle("has-unknown", massUnknown || abundUnknown);

      [massInput, abundanceInput].forEach(input => {
        input.addEventListener("input", () => {
          readRowsFromDom();
          clearElementContext();
          clearInputErrors();
          updateAbundanceMeter();
          calculateAndRender();
        });
      });

      removeButton.addEventListener("click", () => removeIsotope(index));
      container.appendChild(fragment);
    });

    $("isotopeCount").textContent = `${state.rows.length} / ${MAX_ISOTOPES}`;
    $("addIsotopeButton").disabled = state.rows.length >= MAX_ISOTOPES;
  }

  function addIsotope() {
    if (state.rows.length >= MAX_ISOTOPES) {
      showValidation(t("maxRows"));
      return;
    }
    readRowsFromDom();
    if (state.mode === "mass") {
      state.rows.push({ mass: 0, abundance: 0 });
    } else if (state.mode === "abundances") {
      state.rows.push({ mass: 0, abundance: 0 });
    } else {
      state.rows.push({ mass: 0, abundance: 0 });
    }
    clearElementContext();
    renderRows();
    updateAbundanceMeter();
    calculateAndRender();
    const inputs = $("isotopeRows").querySelectorAll(".mass-input");
    inputs[inputs.length - 1]?.focus();
  }

  function removeIsotope(index) {
    const minRows = state.mode === "mixture" ? MIN_ISOTOPES : 2;
    if (state.rows.length <= minRows) {
      showValidation(t("minimumRows"));
      return;
    }
    readRowsFromDom();
    state.rows.splice(index, 1);
    clearElementContext();
    renderRows();
    updateAbundanceMeter();
    calculateAndRender();
  }

  function clearInputErrors() {
    document.querySelectorAll(".isotope-row input").forEach(input => input.classList.remove("invalid"));
    $("arInput").classList.remove("invalid");
    $("validationMessage").textContent = "";
  }

  function showValidation(message) {
    $("validationMessage").textContent = message;
  }

  function validateRows() {
    clearInputErrors();
    readRowsFromDom();

    if (state.mode === "mixture") {
      return validateMixture();
    }
    if (state.mode === "mass") {
      return validateMassMode();
    }
    return validateAbundancesMode();
  }

  function validateMixture() {
    const inputs = [...document.querySelectorAll(".isotope-row input")];
    let missing = false;
    let rangeError = false;

    inputs.forEach(input => {
      const value = Number(input.value);
      const invalid = input.value.trim() === "" || !Number.isFinite(value) || value < 0;
      const outOfRange = input.classList.contains("abundance-input") && value > 100;
      if (invalid || outOfRange) input.classList.add("invalid");
      missing ||= invalid;
      rangeError ||= outOfRange;
    });

    readRowsFromDom();
    const total = state.rows.reduce((sum, row) => sum + (row.abundance || 0), 0);
    if (missing) return { valid: false, message: t("missingValues") };
    if (rangeError) return { valid: false, message: t("abundanceRange") };
    if (Math.abs(total - 100) > TOTAL_TOLERANCE) {
      return { valid: false, message: t("totalError", { total: formatNumber(total, 2) }) };
    }
    return { valid: true };
  }

  function validateMassMode() {
    if (state.rows.length < 2) {
      return { valid: false, message: t("needTwoIsotopes") };
    }
    if (state.arValue === null || Number.isNaN(state.arValue) || state.arValue < 0) {
      $("arInput").classList.add("invalid");
      return { valid: false, message: t("missingAr") };
    }

    let blankMasses = 0;
    let missing = false;
    let rangeError = false;
    const rowNodes = [...$("isotopeRows").querySelectorAll(".isotope-row")];

    state.rows.forEach((row, index) => {
      const massInput = rowNodes[index].querySelector(".mass-input");
      const abundanceInput = rowNodes[index].querySelector(".abundance-input");

      if (row.mass === null) {
        blankMasses += 1;
      } else if (Number.isNaN(row.mass) || row.mass < 0) {
        massInput.classList.add("invalid");
        missing = true;
      }

      if (row.abundance === null || Number.isNaN(row.abundance) || row.abundance < 0) {
        abundanceInput.classList.add("invalid");
        missing = true;
      } else if (row.abundance > 100) {
        abundanceInput.classList.add("invalid");
        rangeError = true;
      }
    });

    if (blankMasses !== 1) {
      rowNodes.forEach((node, index) => {
        if (state.rows[index].mass === null || blankMasses === 0) {
          node.querySelector(".mass-input").classList.add("invalid");
        }
      });
      return { valid: false, message: t("oneUnknownMass") };
    }
    if (missing) return { valid: false, message: t("missingValues") };
    if (rangeError) return { valid: false, message: t("abundanceRange") };

    const total = state.rows.reduce((sum, row) => sum + row.abundance, 0);
    if (Math.abs(total - 100) > TOTAL_TOLERANCE) {
      return { valid: false, message: t("totalError", { total: formatNumber(total, 2) }) };
    }
    return { valid: true };
  }

  function validateAbundancesMode() {
    if (state.rows.length < 2) {
      return { valid: false, message: t("needTwoIsotopes") };
    }
    if (state.arValue === null || Number.isNaN(state.arValue) || state.arValue < 0) {
      $("arInput").classList.add("invalid");
      return { valid: false, message: t("missingAr") };
    }

    let blankAbundances = 0;
    let missing = false;
    let rangeError = false;
    const rowNodes = [...$("isotopeRows").querySelectorAll(".isotope-row")];

    state.rows.forEach((row, index) => {
      const massInput = rowNodes[index].querySelector(".mass-input");
      const abundanceInput = rowNodes[index].querySelector(".abundance-input");

      if (row.mass === null || Number.isNaN(row.mass) || row.mass < 0) {
        massInput.classList.add("invalid");
        missing = true;
      }

      if (row.abundance === null) {
        blankAbundances += 1;
      } else if (Number.isNaN(row.abundance) || row.abundance < 0) {
        abundanceInput.classList.add("invalid");
        missing = true;
      } else if (row.abundance > 100) {
        abundanceInput.classList.add("invalid");
        rangeError = true;
      }
    });

    if (blankAbundances !== 2) {
      rowNodes.forEach((node, index) => {
        if (state.rows[index].abundance === null || blankAbundances < 2) {
          node.querySelector(".abundance-input").classList.add("invalid");
        }
      });
      return { valid: false, message: t("twoUnknownAbundances") };
    }
    if (missing) return { valid: false, message: t("missingValues") };
    if (rangeError) return { valid: false, message: t("abundanceRange") };
    return { valid: true };
  }

  const PALETTE = ["#1d4ed8", "#0f9f8a", "#155e75", "#7c3aed", "#e11d48", "#0369a1", "#3f6212", "#be185d"];
  let lastBoard = null;

  function knownAbundance(row) {
    return row.abundance === null || Number.isNaN(row.abundance) ? 0 : row.abundance;
  }

  function colorAt(index) {
    return PALETTE[index % PALETTE.length];
  }

  function makeEq() {
    const eq = document.createElement("div");
    eq.className = "eq";
    return eq;
  }

  function addText(parent, text, className) {
    const span = document.createElement("span");
    if (className) span.className = className;
    span.textContent = text;
    parent.appendChild(span);
    return span;
  }

  function addMassChip(parent, mass, index) {
    const chip = document.createElement("span");
    chip.className = "mass-chip";
    chip.style.background = colorAt(index);
    chip.textContent = formatNumber(mass, 4);
    parent.appendChild(chip);
  }

  function addPctChip(parent, abundance, index) {
    const chip = document.createElement("span");
    chip.className = "pct-chip";
    chip.style.setProperty("--c", colorAt(index));
    chip.style.setProperty("--w", `${Math.max(0, Math.min(100, abundance))}%`);
    const fill = document.createElement("i");
    const label = document.createElement("b");
    label.textContent = `${formatNumber(abundance, 2)}%`;
    chip.append(fill, label);
    parent.appendChild(chip);
  }

  function addNum(parent, text) {
    const chip = document.createElement("span");
    chip.className = "num-chip";
    chip.textContent = text;
    parent.appendChild(chip);
  }

  function updateAbundanceMeter() {
    renderComposition(state.rows.map(row => ({
      mass: row.mass,
      abundance: knownAbundance(row)
    })));
  }

  let compositionKey = "";

  function renderComposition(rows) {
    const key = `${state.lang}|${rows.map(row => [
      row.mass, row.abundance, row.massText, row.pctText, row.unknown
    ].join(":")).join("|")}`;
    if (key === compositionKey) return;
    compositionKey = key;
    const chart = $("abundanceChart");
    const legend = $("compositionLegend");
    const section = document.querySelector(".hundred");
    const ruler = document.querySelector(".ruler");
    if (!rows.length) {
      chart.replaceChildren();
      legend.replaceChildren();
      section.classList.remove("over", "short", "ready");
      $("abundanceTotal").textContent = "";
      $("gapNote").textContent = "";
      chart.setAttribute("aria-label", "");
      return;
    }
    chart.replaceChildren();
    legend.replaceChildren();

    const total = rows.reduce((sum, row) => sum + knownAbundance(row), 0);
    const over = total > 100 + TOTAL_TOLERANCE;
    const short = total < 100 - TOTAL_TOLERANCE;
    const ready = !over && !short;
    section.classList.toggle("over", over);
    section.classList.toggle("short", short);
    section.classList.toggle("ready", ready);
    ruler.classList.toggle("overflow", over);
    if (over) ruler.style.setProperty("--mark", String(100 / total));

    const widthOf = value => (over ? (value / total) * 100 : value);
    rows.forEach((row, index) => {
      const amount = knownAbundance(row);
      if (amount <= 0) return;
      const slice = document.createElement("div");
      slice.className = "slice";
      slice.style.width = `${widthOf(amount)}%`;
      slice.style.background = colorAt(index);
      const mass = document.createElement("span");
      const pct = document.createElement("span");
      mass.className = "slice-mass";
      mass.textContent = row.massText || (row.mass === null ? "x" : formatNumber(row.mass, 3));
      pct.textContent = row.pctText || `${formatNumber(amount, 2)}%`;
      if (row.unknown) slice.classList.add("slice-unknown");
      if (widthOf(amount) >= 8) slice.append(mass, pct);
      chart.appendChild(slice);

      const item = document.createElement("li");
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = colorAt(index);
      item.append(swatch, document.createTextNode(`${mass.textContent} · ${pct.textContent}`));
      legend.appendChild(item);
    });

    if (short) {
      const gap = document.createElement("div");
      gap.className = "slice-gap";
      gap.style.width = `${100 - total}%`;
      const label = document.createElement("span");
      label.className = "slice-mass";
      label.textContent = `${formatNumber(100 - total, 2)}%`;
      if ((100 - total) >= 8) gap.appendChild(label);
      chart.appendChild(gap);
    }
    if (over) {
      const extra = document.createElement("div");
      extra.className = "slice-over";
      extra.style.width = `${widthOf(total - 100)}%`;
      chart.appendChild(extra);
    }

    const sum = document.createElement("li");
    sum.className = ready ? "sum-chip" : "sum-chip bad";
    sum.textContent = ready
      ? t("exactLabel")
      : over
        ? t("overLabel", { n: formatNumber(total - 100, 2) })
        : t("gapLabel", { n: formatNumber(Math.max(0, 100 - total), 2) });
    legend.appendChild(sum);

    $("gapNote").textContent = short ? t("gapLabel", { n: formatNumber(100 - total, 2) }) : "";
    $("abundanceTotal").textContent = `${formatNumber(total, 2)}%`;
    chart.setAttribute("aria-label", `${formatNumber(total, 2)}%`);
  }

  function isoName(mass) {
    const element = currentElement();
    if (mass === null || Number.isNaN(mass)) return element ? `x${element.symbol}` : "x";
    const massText = formatPlain(mass, 4);
    return element ? `${massText}${element.symbol}` : massText;
  }

  function elementWord() {
    const element = currentElement();
    if (!element) return state.lang === "zh" ? "此元素" : "this element";
    return state.lang === "zh" ? element.zh : element.en;
  }

  function piece(kind, text, unknown = false) {
    return { kind, text, unknown };
  }

  function words(text) {
    return { kind: "text", text };
  }

  function highlightShown(step) {
    return {
      rim: step >= 1,
      abundance: step >= 2,
      ram: step >= 3
    };
  }

  function renderPieces(parent, parts, shown) {
    parent.replaceChildren();
    (parts || []).forEach(part => {
      if (part.kind === "text" || (shown && !shown[part.kind])) {
        parent.append(document.createTextNode(part.text));
        return;
      }
      const mark = document.createElement("mark");
      mark.className = `mark mark-${part.kind}${part.unknown ? " is-unknown" : ""}`;
      mark.textContent = part.text;
      parent.appendChild(mark);
    });
  }

  function fillSlot(list, items, kind) {
    if (!list) return;
    list.replaceChildren();
    const shown = items || [];
    const reserve = state.lesson && state.lesson.slots[kind] ? state.lesson.slots[kind].length : 0;
    const count = Math.max(shown.length, reserve);
    for (let index = 0; index < count; index += 1) {
      const row = document.createElement("li");
      if (shown[index]) {
        row.className = `mark mark-${kind}${shown[index].unknown ? " is-unknown" : ""}`;
        row.textContent = shown[index].text;
      } else {
        row.className = "fact-reserve";
        row.textContent = "\u00a0";
      }
      list.appendChild(row);
    }
  }

  function fractionNode(numerator, denominator) {
    const wrap = document.createElement("span");
    wrap.className = "fraction";
    const top = document.createElement("span");
    const bottom = document.createElement("span");
    top.className = "frac-top";
    bottom.className = "frac-bot";
    if (Array.isArray(numerator)) renderPieces(top, numerator);
    else top.textContent = numerator;
    const hundred = document.createElement("mark");
    hundred.className = "mark mark-abundance";
    hundred.textContent = denominator;
    bottom.appendChild(hundred);
    wrap.append(top, bottom);
    return wrap;
  }

  function appendLessonStep(list, number, title, lines, formula) {
    const item = document.createElement("li");
    item.className = number === 3 ? "step step-answer" : "step";
    const badge = document.createElement("span");
    badge.className = "step-no";
    badge.textContent = String(number);
    const body = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = title;
    body.appendChild(heading);
    lines.forEach(line => {
      const p = document.createElement("p");
      p.className = "lesson-line";
      if (Array.isArray(line)) renderPieces(p, line);
      else p.textContent = line;
      body.appendChild(p);
    });
    if (formula) {
      const eq = document.createElement("div");
      eq.className = "eq";
      if (formula.left && formula.left.kind) {
        const left = document.createElement("mark");
        left.className = `mark mark-${formula.left.kind}${formula.left.unknown ? " is-unknown" : ""}`;
        left.textContent = formula.left.text;
        eq.appendChild(left);
      } else {
        addText(eq, formula.left, "op");
      }
      addText(eq, "=", "op");
      eq.appendChild(fractionNode(formula.numeratorParts || formula.numerator, "100"));
      const row = document.createElement("div");
      row.className = "formula-row";
      const why = document.createElement("p");
      why.className = "hint-red";
      why.textContent = t("hundredWhy");
      row.append(eq, why);
      body.appendChild(row);
    }
    item.append(badge, body);
    list.appendChild(item);
  }

  function term(mass, abundance) {
    const massText = mass === null ? "x" : formatPlain(mass, 4);
    const abundanceText = abundance === null ? "x" : formatPlain(abundance, 4);
    return `(${massText})(${abundanceText})`;
  }

  function buildLesson(payload) {
    const element = currentElement();
    const symbol = element ? element.symbol : "";
    const name = elementWord();
    const zh = state.lang === "zh";
    if (state.mode === "mixture") {
      const rows = payload.rows;
      const questionParts = [words(zh
        ? `${name}有 ${rows.length} 種天然同位素：`
        : `${name} occurs naturally in ${rows.length} stable isotopes: `)];
      rows.forEach((row, index) => {
        if (index) questionParts.push(words(zh ? "、" : ", "));
        questionParts.push(piece("rim", isoName(row.mass)));
      });
      questionParts.push(words(zh ? "。" : ". "));
      rows.forEach((row, index) => {
        questionParts.push(words(index === 0
          ? (zh ? "豐度：" : "Abundance: ")
          : (zh ? "，" : ", ")));
        questionParts.push(piece("rim", isoName(row.mass)));
        questionParts.push(words(zh ? " 是 " : " is "));
        questionParts.push(piece("abundance", `${formatPlain(row.abundance, 4)}%`));
      });
      questionParts.push(words(zh ? "。求 " : ". Calculate the "));
      questionParts.push(piece("ram", zh ? "相對原子質量" : "relative atomic mass", true));
      questionParts.push(words(zh ? `（${symbol || name}）。` : ` of ${symbol || name}.`));
      return {
        questionParts,
        slots: {
          rim: rows.map(row => ({ text: isoName(row.mass) })),
          abundance: rows.map(row => ({ text: `${formatPlain(row.abundance, 4)}%` })),
          ram: [{ text: zh ? "相對原子質量 Aᵣ" : "relative atomic mass Aᵣ", unknown: true }]
        },
        letLines: [[
          words(zh ? "已知豐度加起來是 " : "The given abundances add to "),
          piece("abundance", `${formatPlain(payload.calculation.totalAbundance, 4)}%`),
          words(zh ? "。" : ".")
        ]],
        formula: {
          left: piece("ram", "Aᵣ", true),
          numeratorParts: rows.flatMap((row, index) => [
            ...(index ? [words(" + ")] : []),
            piece("rim", `(${formatPlain(row.mass, 4)})`),
            piece("abundance", `(${formatPlain(row.abundance, 4)})`)
          ])
        },
        findLines: [zh
          ? `Aᵣ = ${formatPlain(payload.calculation.relativeAtomicMass, 4)}`
          : `Aᵣ = ${formatPlain(payload.calculation.relativeAtomicMass, 4)}`],
        hero: formatPlain(payload.calculation.relativeAtomicMass, 4),
        barRows: rows.map(row => ({ mass: row.mass, abundance: row.abundance }))
      };
    }
    if (state.mode === "mass") {
      const result = payload.result;
      const unknown = state.rows[result.unknownIndex];
      const knownRows = state.rows.filter((_, index) => index !== result.unknownIndex);
      const complement = formatPlain(unknown.abundance, 4);
      const knownSum = formatPlain(knownRows.reduce((sum, row) => sum + row.abundance, 0), 4);
      const questionParts = [words(zh ? `${name}有同位素 ` : `${name} occurs naturally as `)];
      knownRows.forEach((row, index) => {
        if (index) questionParts.push(words(zh ? "、" : ", "));
        questionParts.push(piece("rim", isoName(row.mass)));
      });
      questionParts.push(words(zh ? " 和 " : " and "));
      questionParts.push(piece("rim", `x${symbol}`, true));
      questionParts.push(words(zh ? "。豐度：" : ". Abundance: "));
      knownRows.forEach((row, index) => {
        if (index) questionParts.push(words(", "));
        questionParts.push(piece("rim", isoName(row.mass)));
        questionParts.push(words(" "));
        questionParts.push(piece("abundance", `${formatPlain(row.abundance, 4)}%`));
      });
      questionParts.push(words(zh ? "。相對原子質量 " : ". Relative atomic mass "));
      questionParts.push(piece("ram", `Aᵣ = ${formatPlain(result.ar, 4)}`));
      questionParts.push(words(zh ? "。求 " : ". Calculate the "));
      questionParts.push(piece("rim", zh ? `x${symbol} 的相對同位素質量` : `relative isotopic mass of x${symbol}`, true));
      questionParts.push(words("."));
      return {
        questionParts,
        slots: {
          rim: [
            ...knownRows.map(row => ({ text: isoName(row.mass) })),
            { text: `x${symbol}`, unknown: true }
          ],
          abundance: [
            ...knownRows.map(row => ({ text: `${isoName(row.mass)} ${formatPlain(row.abundance, 4)}%` })),
            { text: `x${symbol} = 100% − ${knownSum}%`, unknown: true }
          ],
          ram: [{ text: `Aᵣ = ${formatPlain(result.ar, 4)}` }]
        },
        letLines: [[
          words(zh ? `${`x${symbol}`} 的豐度 = 100% − ${knownSum}% = ` : `The abundance of x${symbol} is 100% − ${knownSum}% = `),
          piece("abundance", `${complement}%`, true),
          words(zh ? "。" : ".")
        ]],
        formula: {
          left: piece("ram", formatPlain(result.ar, 4)),
          numeratorParts: [
            ...knownRows.flatMap((row, index) => [
              ...(index ? [words(" + ")] : []),
              piece("rim", `(${formatPlain(row.mass, 4)})`),
              piece("abundance", `(${formatPlain(row.abundance, 4)})`)
            ]),
            words(" + "),
            piece("rim", "(x)", true),
            piece("abundance", `(${complement})`)
          ]
        },
        findLines: [zh
          ? `x = ${formatPlain(result.mass, 4)}（x${symbol} 的同位素質量是 ${formatPlain(result.mass, 4)}）`
          : `x = ${formatPlain(result.mass, 4)} (the isotopic mass of x${symbol} is ${formatPlain(result.mass, 4)})`],
        hero: formatPlain(result.mass, 4),
        barRows: state.rows.map((row, index) => ({
          mass: row.mass,
          abundance: row.abundance,
          massText: index === result.unknownIndex ? "x" : formatPlain(row.mass, 4),
          unknown: index === result.unknownIndex
        }))
      };
    }
    const result = payload.result;
    const [i, j] = result.indexes;
    const knownRows = state.rows.filter((_, index) => index !== i && index !== j);
    const knownText = knownRows.map(row => `${formatPlain(row.abundance, 4)}`).join(" + ") || "0";
    const yExpr = `${formatPlain(result.remaining, 4)} − x`;
    const questionParts = [words(zh ? `${name}有同位素 ` : `${name} occurs naturally as `)];
    state.rows.forEach((row, index) => {
      if (index) questionParts.push(words(zh ? "、" : ", "));
      questionParts.push(piece("rim", isoName(row.mass)));
    });
    questionParts.push(words(zh ? "。豐度：" : ". Abundance: "));
    knownRows.forEach((row, index) => {
      if (index) questionParts.push(words(", "));
      questionParts.push(piece("rim", isoName(row.mass)));
      questionParts.push(words(" "));
      questionParts.push(piece("abundance", `${formatPlain(row.abundance, 4)}%`));
    });
    questionParts.push(words(zh ? "。相對原子質量 " : ". Relative atomic mass "));
    questionParts.push(piece("ram", `Aᵣ = ${formatPlain(result.ar, 4)}`));
    questionParts.push(words(zh ? "。求豐度 " : ". Calculate the abundance "));
    questionParts.push(piece("abundance", `${isoName(state.rows[i].mass)} = x%`, true));
    questionParts.push(words(zh ? " 和 " : " and "));
    questionParts.push(piece("abundance", `${isoName(state.rows[j].mass)} = y%`, true));
    questionParts.push(words("."));
    return {
      questionParts,
      slots: {
        rim: state.rows.map(row => ({ text: isoName(row.mass) })),
        abundance: [
          ...knownRows.map(row => ({ text: `${isoName(row.mass)} ${formatPlain(row.abundance, 4)}%` })),
          { text: `${isoName(state.rows[i].mass)} = x%`, unknown: true },
          { text: `${isoName(state.rows[j].mass)} = y%`, unknown: true }
        ],
        ram: [{ text: `Aᵣ = ${formatPlain(result.ar, 4)}` }]
      },
      letLines: [[
        words(zh ? "設 " : "Let "),
        piece("abundance", "x%", true),
        words(zh ? ` 為 ${isoName(state.rows[i].mass)} 的豐度，` : ` be the abundance of ${isoName(state.rows[i].mass)} and `),
        piece("abundance", "y%", true),
        words(zh
          ? ` 為 ${isoName(state.rows[j].mass)} 的豐度。因為 ${knownText} + x + y = 100，所以 y = ${yExpr}。`
          : ` be the abundance of ${isoName(state.rows[j].mass)}. Since ${knownText} + x + y = 100, y = ${yExpr}.`)
      ]],
      formula: {
        left: piece("ram", formatPlain(result.ar, 4)),
        numeratorParts: state.rows.flatMap((row, index) => {
          const massPart = piece("rim", `(${formatPlain(row.mass, 4)})`);
          const abundancePart = index === i
            ? piece("abundance", "(x)", true)
            : index === j
              ? piece("abundance", `(${yExpr})`, true)
              : piece("abundance", `(${formatPlain(row.abundance, 4)})`);
          return [...(index ? [words(" + ")] : []), massPart, abundancePart];
        })
      },
      findLines: [zh
        ? `x = ${formatPlain(result.x, 4)}（${isoName(state.rows[i].mass)} 豐度 ${formatPlain(result.x, 4)}%），y = ${yExpr.replace("x", formatPlain(result.x, 4))} = ${formatPlain(result.y, 4)}（${isoName(state.rows[j].mass)} 豐度 ${formatPlain(result.y, 4)}%）`
        : `x = ${formatPlain(result.x, 4)} (${isoName(state.rows[i].mass)} is ${formatPlain(result.x, 4)}%),  y = ${yExpr.replace("x", formatPlain(result.x, 4))} = ${formatPlain(result.y, 4)} (${isoName(state.rows[j].mass)} is ${formatPlain(result.y, 4)}%)`],
      hero: `x = ${formatPlain(result.x, 4)}%    y = ${formatPlain(result.y, 4)}%`,
      barBefore: [
        ...knownRows.map(row => ({ mass: row.mass, abundance: row.abundance })),
        {
          mass: null,
          abundance: result.remaining,
          massText: "x + y",
          pctText: `x + y = ${formatPlain(result.remaining, 4)}%`,
          unknown: true
        }
      ],
      barAfter: state.rows.map((row, index) => {
        if (index === i) return { mass: row.mass, abundance: result.x, pctText: "x%" };
        if (index === j) return { mass: row.mass, abundance: result.y, pctText: "y%" };
        return { mass: row.mass, abundance: row.abundance };
      })
    };
  }

  function setResultValue(value) {
    const node = $("resultValue");
    if (Array.isArray(value)) {
      node.classList.add("result-pair");
      node.replaceChildren(...value.map(line => {
        const span = document.createElement("span");
        span.textContent = line;
        return span;
      }));
      return;
    }
    node.classList.remove("result-pair");
    node.textContent = value;
  }

  function setResultValidity(valid) {
    const badge = $("resultStatus");
    badge.textContent = t(valid ? "valid" : "checkData");
    badge.classList.toggle("valid", valid);
    badge.classList.toggle("invalid", !valid);
  }

  function measureFullBoard(board, width) {
    if (!state.lesson) return board.offsetHeight;
    const probe = board.cloneNode(true);
    probe.style.position = "absolute";
    probe.style.left = "0";
    probe.style.top = "0";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    probe.style.transform = "none";
    probe.style.width = `${width}px`;
    probe.style.height = "auto";
    probe.style.minHeight = "0";
    probe.setAttribute("aria-hidden", "true");
    const lesson = state.lesson;
    const question = probe.querySelector("#questionText");
    if (question) renderPieces(question, lesson.questionParts, highlightShown(6));
    fillSlot(probe.querySelector("#rimList"), lesson.slots.rim, "rim");
    fillSlot(probe.querySelector("#abundanceList"), lesson.slots.abundance, "abundance");
    fillSlot(probe.querySelector("#ramList"), lesson.slots.ram, "ram");
    const value = probe.querySelector("#resultValue");
    if (value) {
      value.classList.remove("result-pair");
      value.textContent = String(lesson.hero).replace(/\n/g, "   ");
    }
    const list = probe.querySelector("#workingSteps");
    if (list) {
      list.replaceChildren();
      appendLessonStep(list, 1, t("stepLet"), lesson.letLines);
      if (lesson.formula) appendLessonStep(list, 2, t("stepFormula"), [], lesson.formula);
      appendLessonStep(list, 3, t("stepFind"), lesson.findLines);
    }
    board.parentElement.appendChild(probe);
    const height = probe.offsetHeight;
    probe.remove();
    return height;
  }

  function fitBoard() {
    const slot = document.querySelector(".board-slot");
    const board = document.querySelector(".board");
    const stage = document.querySelector(".stage");
    if (!slot || !board) return;
    const touch = window.matchMedia("(max-width: 1100px)").matches;
    const zoomed = stage.dataset.zoom !== "all";
    board.style.transform = "none";
    board.style.width = "";
    board.style.height = "";
    board.style.minHeight = "";
    slot.style.overflow = "hidden";
    const width = Math.max(slot.clientWidth, 1);
    board.style.width = !zoomed && touch ? "100%" : `${width}px`;
    const fullH = Math.max(measureFullBoard(board, width), 1);
    board.style.minHeight = `${fullH}px`;
    if (!zoomed && touch) {
      slot.style.overflow = "auto";
      return;
    }
    const neededW = Math.max(board.scrollWidth, 1);
    const scale = Math.min(1, slot.clientWidth / neededW, slot.clientHeight / fullH);
    board.style.transformOrigin = "top center";
    board.style.transform = `scale(${scale})`;
  }

  function barRowsForStep(lesson, step) {
    const calc = step - 3;
    const knownOnly = rows => (rows || []).filter(row => !row.unknown);
    if (step < 2) return [];
    if (calc < 1) return knownOnly(lesson.barBefore || lesson.barRows);
    if (calc < 3) return lesson.barBefore || lesson.barRows;
    if (lesson.barAfter) return lesson.barAfter;
    return (lesson.barRows || []).map(row => (
      row.unknown ? { ...row, massText: lesson.hero, unknown: false } : row
    ));
  }

  function renderLesson() {
    const lesson = state.lesson;
    const step = state.step;
    const marks = highlightShown(step);
    const calc = step - 3;
    renderPieces($("questionText"), lesson ? lesson.questionParts : [], marks);
    fillSlot($("rimList"), lesson && marks.rim ? lesson.slots.rim : [], "rim");
    fillSlot($("abundanceList"), lesson && marks.abundance ? lesson.slots.abundance : [], "abundance");
    fillSlot($("ramList"), lesson && marks.ram ? lesson.slots.ram : [], "ram");
    if (lesson) {
      renderComposition(barRowsForStep(lesson, step));
    }
    const list = $("workingSteps");
    list.replaceChildren();
    if (lesson && calc >= 1) appendLessonStep(list, 1, t("stepLet"), lesson.letLines);
    if (lesson && calc >= 2) appendLessonStep(list, 2, t("stepFormula"), [], lesson.formula);
    if (lesson && calc >= 3) appendLessonStep(list, 3, t("stepFind"), lesson.findLines);
    const highlightLabel = ["readQuestion", "rimHeading", "abundanceHeading", "ramHeading"][step];
    const stepText = highlightLabel ? t(highlightLabel) : t("stepProgress", { n: calc });
    document.querySelectorAll(".step-label").forEach(node => { node.textContent = stepText; });
    document.querySelectorAll(".prev-step").forEach(node => { node.disabled = step === 0; });
    document.querySelectorAll(".next-step").forEach(node => { node.disabled = !lesson || step >= 6; });
    const hero = document.querySelector(".hero-result");
    if (!lesson || calc < 3) {
      hero.classList.add("is-waiting");
      $("resultValue").classList.remove("result-pair");
      $("resultValue").textContent = lesson ? "?" : "—";
      const badge = $("resultStatus");
      badge.textContent = lesson ? t("readQuestion") : t("checkData");
      badge.classList.toggle("valid", Boolean(lesson));
      badge.classList.toggle("invalid", !lesson);
      fitBoard();
      return;
    }
    hero.classList.remove("is-waiting");
    if (lesson.hero.includes("\n")) setResultValue(lesson.hero.split("\n"));
    else setResultValue(lesson.hero);
    setResultValidity(true);
    fitBoard();
  }


  function showWaitingBoard() {
    state.lesson = null;
    state.step = 0;
    document.querySelector(".hero-result").classList.add("is-waiting");
    $("resultValue").classList.remove("result-pair");
    $("resultValue").textContent = "—";
    renderLesson();
  }

  function calculateAndRender(event) {
    event?.preventDefault();
    const validation = validateRows();
    if (!validation.valid) {
      showValidation(validation.message);
      setResultValidity(false);
      showWaitingBoard();
      return false;
    }
    showValidation("");
    if (state.mode === "mixture") {
      state.lesson = buildLesson({
        rows: state.rows,
        calculation: calculateRelativeAtomicMass(state.rows)
      });
    } else if (state.mode === "mass") {
      const result = calculateUnknownMass(state.rows, state.arValue);
      if (result.error) {
        showValidation(t(result.error));
        setResultValidity(false);
        showWaitingBoard();
        return false;
      }
      state.lesson = buildLesson({ result });
    } else {
      const result = calculateTwoAbundances(state.rows, state.arValue);
      if (result.error) {
        showValidation(t(result.error));
        setResultValidity(false);
        showWaitingBoard();
        return false;
      }
      state.lesson = buildLesson({ result });
    }
    state.step = 0;
    renderLesson();
    return true;
  }

  function applyElement(symbol, options = {}) {
    const { useTeachingExample = false } = options;
    const loadResult = ElementLibrary.getIsotopeRows(symbol);
    state.activeElement = symbol;
    state.isotopeMeta = loadResult;
    state.loadNote = loadResult.simplified ? "simplified" : null;

    if (useTeachingExample) {
      const example = teachingExampleRows();
      if (example) {
        state.rows = example;
      } else {
        const mixtureRows = loadResult.rows.map(row => ({ ...row }));
        state.rows = shapeRowsForMode(mixtureRows.map(row => ({ ...row })));
        if (state.mode !== "mixture" && mixtureRows.length) {
          setArFromMixtureRows(mixtureRows);
        }
      }
    } else {
      const mixtureRows = loadResult.rows.map(row => ({ ...row }));
      let rows = mixtureRows.map(row => ({ ...row }));
      if (state.mode === "mass" && rows.length >= 2) {
        setArFromMixtureRows(mixtureRows);
        rows = rows.map((row, index) => (
          index === rows.length - 1
            ? { mass: null, abundance: row.abundance }
            : { mass: row.mass, abundance: row.abundance }
        ));
      } else if (state.mode === "abundances" && rows.length >= 2) {
        setArFromMixtureRows(mixtureRows);
        rows = rows.map((row, index) => {
          if (rows.length === 2) {
            return { mass: row.mass, abundance: null };
          }
          if (index >= rows.length - 2) {
            return { mass: row.mass, abundance: null };
          }
          return { mass: row.mass, abundance: row.abundance };
        });
      } else {
        state.arValue = null;
        $("arInput").value = "";
      }
      state.rows = shapeRowsForMode(rows);
    }

    renderRows();
    updatePresetButtons();
    renderPeriodicSelection();
    updateSelectedElementSummary();
    updateLearningNote();
    clearInputErrors();
    updateAbundanceMeter();
    calculateAndRender();
    closePeriodicModal();
  }

  function switchMode(mode) {
    if (!["mixture", "mass", "abundances"].includes(mode)) return;
    state.mode = mode;
    updateModeChrome();
    updateLearningNote();
    applyElement(MODE_STARTERS[mode], { useTeachingExample: mode !== "mixture" });
  }

  function renderCategoryLegend() {
    const legend = $("categoryLegend");
    legend.replaceChildren();
    Object.entries(ElementLibrary.CATEGORY_KEYS).forEach(([, key]) => {
      const chip = document.createElement("span");
      chip.className = `legend-chip cat-${key}`;
      chip.textContent = t(CATEGORY_I18N[key]);
      legend.appendChild(chip);
    });
  }

  function elementMatchesFilter(element, atomicNumber) {
    if (!state.periodicFilter.trim()) return true;
    const query = state.periodicFilter.trim().toLowerCase();
    const name = `${element.en} ${element.zh} ${element.symbol} ${atomicNumber}`.toLowerCase();
    return name.includes(query);
  }

  function renderPeriodicTable() {
    const grid = $("periodicTableGrid");
    grid.replaceChildren();

    ElementLibrary.PERIODIC_GRID.forEach(row => {
      const rowNode = document.createElement("div");
      rowNode.className = "periodic-row";
      row.forEach(atomicNumber => {
        const cell = document.createElement("div");
        cell.className = "periodic-cell";
        if (!atomicNumber) {
          cell.classList.add("empty");
          rowNode.appendChild(cell);
          return;
        }

        const element = ElementLibrary.getElement(atomicNumber);
        if (!element) {
          rowNode.appendChild(cell);
          return;
        }

        const visible = elementMatchesFilter(element, atomicNumber);
        cell.classList.toggle("hidden-match", !visible);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `element-card cat-${element.category}`;
        button.dataset.symbol = element.symbol;
        button.setAttribute("aria-label", `${element.symbol}, ${element.en}`);
        if (element.symbol === state.activeElement) button.classList.add("selected");

        button.innerHTML = `
          <span class="element-number">${atomicNumber}</span>
          <strong class="element-symbol">${element.symbol}</strong>
          <span class="element-name">${element[state.lang === "zh" ? "zh" : "en"]}</span>
          <span class="element-ar">${formatNumber(element.ar, 3)}</span>
        `;
        button.addEventListener("click", () => applyElement(element.symbol));
        cell.appendChild(button);
        rowNode.appendChild(cell);
      });
      grid.appendChild(rowNode);
    });
  }

  function renderPeriodicSelection() {
    document.querySelectorAll(".element-card").forEach(button => {
      button.classList.toggle("selected", button.dataset.symbol === state.activeElement);
    });
  }

  function openPeriodicModal() {
    lastFocusedElement = document.activeElement;
    $("periodicModal").hidden = false;
    document.body.classList.add("modal-open");
    renderPeriodicTable();
    $("elementSearchInput").focus();
  }

  function closePeriodicModal() {
    $("periodicModal").hidden = true;
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus?.();
  }

  function updateTranslations() {
    document.documentElement.lang = state.lang === "zh" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-i18n]").forEach(node => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(node => {
      node.placeholder = t(node.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(node => {
      node.setAttribute("aria-label", t(node.dataset.i18nAria));
    });
    document.querySelectorAll("[data-lang]").forEach(button => {
      button.classList.toggle("active", button.dataset.lang === state.lang);
    });
    $("closePeriodicTableButton").setAttribute("aria-label", state.lang === "zh" ? "關閉週期表" : "Close periodic table");
    const controlsOpen = !document.querySelector(".lab-body").classList.contains("controls-hidden");
    $("toggleControls").textContent = t(controlsOpen ? "hideData" : "showData");
    updateModeChrome();
  }

  function switchLanguage(lang) {
    readRowsFromDom();
    state.lang = lang;
    updateTranslations();
    renderPresetButtons();
    renderRows();
    renderCategoryLegend();
    renderPeriodicTable();
    updateSelectedElementSummary();
    updateLearningNote();
    updateAbundanceMeter();
    calculateAndRender();
  }

  $("calculatorForm").addEventListener("submit", calculateAndRender);
  $("addIsotopeButton").addEventListener("click", addIsotope);
  $("resetButton").addEventListener("click", () => {
    applyElement(MODE_STARTERS[state.mode], { useTeachingExample: state.mode !== "mixture" });
  });
  $("arInput").addEventListener("input", () => {
    readRowsFromDom();
    clearInputErrors();
    updateAbundanceMeter();
    calculateAndRender();
  });
  $("openPeriodicTableButton").addEventListener("click", openPeriodicModal);
  $("closePeriodicTableButton").addEventListener("click", closePeriodicModal);
  $("periodicModal").addEventListener("click", event => {
    if (event.target.dataset.closeModal === "true") closePeriodicModal();
  });
  $("elementSearchInput").addEventListener("input", event => {
    state.periodicFilter = event.target.value;
    renderPeriodicTable();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !$("periodicModal").hidden) closePeriodicModal();
  });
  document.querySelectorAll("[data-lang]").forEach(button => {
    button.addEventListener("click", () => switchLanguage(button.dataset.lang));
  });
  document.querySelectorAll(".mode-tab").forEach(button => {
    button.addEventListener("click", () => switchMode(button.dataset.mode));
  });
  $("toggleControls").addEventListener("click", () => {
    const body = document.querySelector(".lab-body");
    const open = body.classList.contains("controls-hidden");
    body.classList.toggle("controls-hidden", !open);
    $("toggleControls").setAttribute("aria-expanded", open ? "true" : "false");
    $("toggleControls").textContent = t(open ? "hideData" : "showData");
    fitBoard();
  });
  document.querySelectorAll(".next-step").forEach(button => {
    button.addEventListener("click", () => {
      if (!state.lesson || state.step >= 6) return;
      state.step += 1;
      renderLesson();
    });
  });
  document.querySelectorAll(".prev-step").forEach(button => {
    button.addEventListener("click", () => {
      if (state.step <= 0) return;
      state.step -= 1;
      renderLesson();
    });
  });
  document.querySelectorAll(".box-zoom").forEach(button => {
    button.addEventListener("click", () => {
      const stage = document.querySelector(".stage");
      const next = stage.dataset.zoom === button.dataset.zoom ? "all" : button.dataset.zoom;
      stage.dataset.zoom = next;
      document.querySelectorAll(".box-zoom").forEach(item => {
        const on = item.dataset.zoom === next;
        item.setAttribute("aria-pressed", on ? "true" : "false");
        item.textContent = on ? "–" : "+";
      });
      fitBoard();
    });
  });
  window.addEventListener("resize", fitBoard);

  window.RAMCalculator = {
    calculate: rows => calculateRelativeAtomicMass(rows),
    calculateUnknownMass,
    calculateTwoAbundances,
    applyElement,
    switchMode,
    getState: () => ({
      lang: state.lang,
      mode: state.mode,
      activeElement: state.activeElement,
      rows: state.rows.map(row => ({ ...row })),
      arValue: state.arValue,
      result: $("resultValue").textContent
    })
  };

  const selfTests = [
    { symbol: "Cl", min: 35.4, max: 35.6, minKnown: 20, natural: 2 },
    { symbol: "V", natural: 2, minKnown: 20, minRows: 2, min: 50.9, max: 51.0 },
    { symbol: "Mn", natural: 1, minKnown: 20, minRows: 1, min: 54.9, max: 55.1 },
    { symbol: "Ti", natural: 5, minKnown: 20, minRows: 5, min: 47.8, max: 47.95 },
    { symbol: "U", natural: 3, minKnown: 20, minRows: 3, min: 237.9, max: 238.1 },
    { symbol: "Ca", natural: 6, minKnown: 20, minRows: 6 },
    { symbol: "Sn", natural: 10, minKnown: 20, minRows: 10 },
    { symbol: "Mg", min: 24.31, max: 24.33 },
    { symbol: "Cu", min: 63.59, max: 63.65 },
    { symbol: "Br", min: 79.9, max: 80.0 },
    { symbol: "Pb", min: 207.1, max: 207.3 },
    { symbol: "Fe", natural: 4, min: 55.8, max: 55.92 },
    { symbol: "Hs", simplified: true, exampleMass: 269, minKnown: 10, minRows: 1, min: 268.9, max: 269.1 },
    { symbol: "Tc", simplified: true, exampleMass: 98, minKnown: 10, minRows: 1, min: 97.9, max: 98.1 }
  ];
  const testsPassed = selfTests.every(test => {
    const loadResult = ElementLibrary.getIsotopeRows(test.symbol);
    const result = calculateRelativeAtomicMass(loadResult.rows);
    const abundanceOk = Math.abs(result.totalAbundance - 100) < 0.01;
    const knownOk = !test.minKnown || loadResult.totalIsotopes >= test.minKnown;
    const naturalOk = !test.natural || loadResult.naturalCount === test.natural;
    const simplifiedOk = !test.simplified
      || (loadResult.simplified
        && loadResult.rows.length === 1
        && loadResult.rows[0].mass === test.exampleMass
        && loadResult.allIsotopes.some(row => row.mass === test.exampleMass && row.example && row.abundance === 100));
    if (test.simplified) {
      return simplifiedOk && knownOk && abundanceOk
        && loadResult.rows.length >= (test.minRows || 1)
        && result.relativeAtomicMass >= test.min
        && result.relativeAtomicMass <= test.max;
    }
    if (test.natural || test.minKnown) {
      return knownOk
        && naturalOk
        && loadResult.rows.length >= (test.minRows || 1)
        && abundanceOk
        && (!test.min || result.relativeAtomicMass >= test.min)
        && (!test.max || result.relativeAtomicMass <= test.max);
    }
    return abundanceOk
      && result.relativeAtomicMass >= test.min
      && result.relativeAtomicMass <= test.max;
  });

  const massExample = calculateUnknownMass(
    [{ mass: 79, abundance: 50.6 }, { mass: null, abundance: 49.4 }],
    79.988
  );
  const abundanceExample = calculateTwoAbundances(
    [
      { mass: 24, abundance: 78.6 },
      { mass: 25, abundance: null },
      { mass: 26, abundance: null }
    ],
    24.327
  );
  const snLoad = ElementLibrary.getIsotopeRows("Sn");
  const snMixture = calculateRelativeAtomicMass(snLoad.rows);
  const snMassRows = snLoad.rows.map((row, index) => (
    index === snLoad.rows.length - 1
      ? { mass: null, abundance: row.abundance }
      : { mass: row.mass, abundance: row.abundance }
  ));
  const snMassExample = calculateUnknownMass(snMassRows, snMixture.relativeAtomicMass);
  const snLastMass = snLoad.rows[snLoad.rows.length - 1].mass;
  const modeTestsPassed = !massExample.error
    && Math.abs(massExample.mass - 81) < 0.05
    && !abundanceExample.error
    && Math.abs(abundanceExample.x - 10.1) < 0.15
    && Math.abs(abundanceExample.y - 11.3) < 0.15
    && !snMassExample.error
    && Math.abs(snMassExample.mass - snLastMass) < 0.05;

  const allTestsPassed = testsPassed && modeTestsPassed;
  document.documentElement.dataset.ramTests = allTestsPassed ? "passed" : "failed";
  if (!allTestsPassed) console.error("Relative atomic mass self-tests failed.", {
    testsPassed,
    modeTestsPassed,
    massExample,
    abundanceExample,
    snMassExample
  });

  updateTranslations();
  if (window.matchMedia("(max-width: 1100px)").matches) {
    document.querySelector(".lab-body").classList.add("controls-hidden");
    $("toggleControls").setAttribute("aria-expanded", "false");
    $("toggleControls").textContent = t("showData");
  }
  applyElement("Cl");
  renderPresetButtons();
  renderCategoryLegend();
  document.documentElement.dataset.ramReady = "true";
})();
