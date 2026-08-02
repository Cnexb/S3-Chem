// =============================================================================
// Lab language bridge — map host hot-bar lang to embedded lab iframe lang
// =============================================================================

export const INTERACTIVE_LAB_TOOLS = {
  "ionic-compound-puzzle": {
    path: "public/tools/ionic-compound-puzzle/index.html",
    titleKey: "lab.ionicName",
  },
  "covalent-bond-puzzle": {
    path: "public/tools/covalent-bond-puzzle/index.html",
    titleKey: "lab.covalentName",
  },
  "covalent-properties-sandbox": {
    path: "public/tools/covalent-properties-sandbox/index.html?v=20260703sandbox23",
    titleKey: "lab.sandboxName",
  },
  "titration-lab": {
    path: "public/tools/titration-lab/index.html",
    titleKey: "lab.titrationName",
  },
  "acid-ionization-lab": {
    path: "public/tools/acid-ionization-lab/index.html",
    titleKey: "lab.acidIonizationName",
  },
  "metal-reactions-lab": {
    path: "public/tools/metal-reactions-lab/index.html",
    titleKey: "lab.metalReactivityName",
  },
  "rusting-lab": {
    path: "public/tools/rusting-lab/index.html",
    titleKey: "lab.rustingName",
  },
  "chemical-cells-electrolysis-simulator": {
    path: "public/tools/chemical-cells-electrolysis-simulator/index.html",
    titleKey: "lab.chemicalCellsElectrolysisName",
  },
  "rates-of-reaction-lab": {
    path: "public/tools/rates-of-reaction-lab/index.html",
    titleKey: "lab.ratesOfReactionName",
  },
  "chemical-equilibrium-lab": {
    path: "public/tools/chemical-equilibrium-lab/index.html",
    titleKey: "lab.chemicalEquilibriumName",
  },
  "organic-chemistry-lab": {
    path: "public/tools/organic-chemistry-lab/index.html",
    titleKey: "lab.organicChemistryName",
  },
};

export const LAB_TOOL_TYPES = new Set(Object.keys(INTERACTIVE_LAB_TOOLS));

/** Host hot-bar: en | zh | zh-Hant → lab iframe: en | zh */
export function hostLangToLabLang(hostLang) {
  return hostLang === "en" ? "en" : "zh";
}

export function isLabToolType(toolType) {
  return LAB_TOOL_TYPES.has(toolType);
}

export function buildLabIframeSrc(toolPath, hostLang) {
  const labLang = hostLangToLabLang(hostLang);
  const url = new URL(toolPath, window.location.href);
  url.searchParams.set("lang", labLang);
  url.searchParams.set("embed", "1");
  return `${url.pathname}${url.search}${url.hash}`;
}

export function applyLabLangToIframe(iframe, hostLang) {
  if (!iframe?.contentWindow) return;
  const labLang = hostLangToLabLang(hostLang);
  iframe.contentWindow.postMessage({ type: "uniplus:setLang", lang: labLang }, "*");
}
