(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.SeparationEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ROOM_TEMP = 25;
  const SAMPLES = ["ironSulphur", "sandWater", "custom", "acidifiedWater"];

  const ELEMENTS = {
    H: { z: 1, symbol: "H", nameEn: "Hydrogen", nameZh: "氫", mp: -259, colour: "#7ec8e3", magnetic: false, group: 1, period: 1, roomState: "gas" },
    He: { z: 2, symbol: "He", nameEn: "Helium", nameZh: "氦", mp: -272, colour: "#c9b6ff", magnetic: false, group: 18, period: 1, roomState: "gas" },
    Li: { z: 3, symbol: "Li", nameEn: "Lithium", nameZh: "鋰", mp: 181, colour: "#c8cdd3", magnetic: false, group: 1, period: 2 },
    Be: { z: 4, symbol: "Be", nameEn: "Beryllium", nameZh: "鈹", mp: 1287, colour: "#b8bcc2", magnetic: false, group: 2, period: 2 },
    B: { z: 5, symbol: "B", nameEn: "Boron", nameZh: "硼", mp: 2076, colour: "#c4a484", magnetic: false, group: 13, period: 2 },
    C: { z: 6, symbol: "C", nameEn: "Carbon", nameZh: "碳", mp: 3550, colour: "#3d3d3d", magnetic: false, group: 14, period: 2 },
    N: { z: 7, symbol: "N", nameEn: "Nitrogen", nameZh: "氮", mp: -210, colour: "#6ea8fe", magnetic: false, group: 15, period: 2, roomState: "gas" },
    O: { z: 8, symbol: "O", nameEn: "Oxygen", nameZh: "氧", mp: -219, colour: "#e85d4c", magnetic: false, group: 16, period: 2, roomState: "gas" },
    F: { z: 9, symbol: "F", nameEn: "Fluorine", nameZh: "氟", mp: -220, colour: "#7ad3a0", magnetic: false, group: 17, period: 2, roomState: "gas" },
    Ne: { z: 10, symbol: "Ne", nameEn: "Neon", nameZh: "氖", mp: -249, colour: "#ff8fab", magnetic: false, group: 18, period: 2, roomState: "gas" },
    Na: { z: 11, symbol: "Na", nameEn: "Sodium", nameZh: "鈉", mp: 98, colour: "#c8cdd3", magnetic: false, group: 1, period: 3 },
    Mg: { z: 12, symbol: "Mg", nameEn: "Magnesium", nameZh: "鎂", mp: 650, colour: "#b8c0c8", magnetic: false, group: 2, period: 3 },
    Al: { z: 13, symbol: "Al", nameEn: "Aluminium", nameZh: "鋁", mp: 660, colour: "#c5ccd6", magnetic: false, group: 13, period: 3 },
    Si: { z: 14, symbol: "Si", nameEn: "Silicon", nameZh: "硅", mp: 1414, colour: "#8b9bb4", magnetic: false, group: 14, period: 3 },
    P: { z: 15, symbol: "P", nameEn: "Phosphorus", nameZh: "磷", mp: 44, colour: "#c23b22", magnetic: false, group: 15, period: 3 },
    S: { z: 16, symbol: "S", nameEn: "Sulphur", nameZh: "硫", mp: 115, colour: "#f0c43a", magnetic: false, group: 16, period: 3 },
    Cl: { z: 17, symbol: "Cl", nameEn: "Chlorine", nameZh: "氯", mp: -102, colour: "#63c36b", magnetic: false, group: 17, period: 3, roomState: "gas" },
    Ar: { z: 18, symbol: "Ar", nameEn: "Argon", nameZh: "氬", mp: -189, colour: "#9ad7d6", magnetic: false, group: 18, period: 3, roomState: "gas" },
    K: { z: 19, symbol: "K", nameEn: "Potassium", nameZh: "鉀", mp: 64, colour: "#c8cdd3", magnetic: false, group: 1, period: 4 },
    Ca: { z: 20, symbol: "Ca", nameEn: "Calcium", nameZh: "鈣", mp: 842, colour: "#c5ccd4", magnetic: false, group: 2, period: 4 },
    Sc: { z: 21, symbol: "Sc", nameEn: "Scandium", nameZh: "鈧", mp: 1541, colour: "#9bb7d4", magnetic: false, group: 3, period: 4 },
    Ti: { z: 22, symbol: "Ti", nameEn: "Titanium", nameZh: "鈦", mp: 1668, colour: "#8a93a0", magnetic: false, group: 4, period: 4 },
    V: { z: 23, symbol: "V", nameEn: "Vanadium", nameZh: "釩", mp: 1910, colour: "#6f8faf", magnetic: false, group: 5, period: 4 },
    Cr: { z: 24, symbol: "Cr", nameEn: "Chromium", nameZh: "鉻", mp: 1907, colour: "#7a8b99", magnetic: false, group: 6, period: 4 },
    Mn: { z: 25, symbol: "Mn", nameEn: "Manganese", nameZh: "錳", mp: 1246, colour: "#9aa0a8", magnetic: false, group: 7, period: 4 },
    Fe: { z: 26, symbol: "Fe", nameEn: "Iron", nameZh: "鐵", mp: 1538, colour: "#8a93a0", magnetic: true, group: 8, period: 4 },
    Co: { z: 27, symbol: "Co", nameEn: "Cobalt", nameZh: "鈷", mp: 1495, colour: "#7a828c", magnetic: true, group: 9, period: 4 },
    Ni: { z: 28, symbol: "Ni", nameEn: "Nickel", nameZh: "鎳", mp: 1455, colour: "#c5c2b8", magnetic: true, group: 10, period: 4 },
    Cu: { z: 29, symbol: "Cu", nameEn: "Copper", nameZh: "銅", mp: 1085, colour: "#b87333", magnetic: false, group: 11, period: 4 },
    Zn: { z: 30, symbol: "Zn", nameEn: "Zinc", nameZh: "鋅", mp: 420, colour: "#b8c4ce", magnetic: false, group: 12, period: 4 },
    Ga: { z: 31, symbol: "Ga", nameEn: "Gallium", nameZh: "鎵", mp: 30, colour: "#c9d4dc", magnetic: false, group: 13, period: 4 },
    Ge: { z: 32, symbol: "Ge", nameEn: "Germanium", nameZh: "鍺", mp: 938, colour: "#8e9a8c", magnetic: false, group: 14, period: 4 },
    As: { z: 33, symbol: "As", nameEn: "Arsenic", nameZh: "砷", mp: 817, colour: "#6e7b6c", magnetic: false, group: 15, period: 4 },
    Se: { z: 34, symbol: "Se", nameEn: "Selenium", nameZh: "硒", mp: 221, colour: "#4a4a4e", magnetic: false, group: 16, period: 4 },
    Br: { z: 35, symbol: "Br", nameEn: "Bromine", nameZh: "溴", mp: -7, colour: "#8b2e1a", magnetic: false, group: 17, period: 4 },
    Kr: { z: 36, symbol: "Kr", nameEn: "Krypton", nameZh: "氪", mp: -157, colour: "#b7a6e0", magnetic: false, group: 18, period: 4, roomState: "gas" },
    Rb: { z: 37, symbol: "Rb", nameEn: "Rubidium", nameZh: "銣", mp: 39, colour: "#c8cdd3", magnetic: false, group: 1, period: 5 },
    Sr: { z: 38, symbol: "Sr", nameEn: "Strontium", nameZh: "鍶", mp: 777, colour: "#c5ccd4", magnetic: false, group: 2, period: 5 },
    Y: { z: 39, symbol: "Y", nameEn: "Yttrium", nameZh: "釔", mp: 1526, colour: "#8aa4b8", magnetic: false, group: 3, period: 5 },
    Zr: { z: 40, symbol: "Zr", nameEn: "Zirconium", nameZh: "鋯", mp: 1855, colour: "#9aa3ad", magnetic: false, group: 4, period: 5 },
    Nb: { z: 41, symbol: "Nb", nameEn: "Niobium", nameZh: "鈮", mp: 2477, colour: "#6f7f9a", magnetic: false, group: 5, period: 5 },
    Mo: { z: 42, symbol: "Mo", nameEn: "Molybdenum", nameZh: "鉬", mp: 2623, colour: "#5c6b7a", magnetic: false, group: 6, period: 5 },
    Tc: { z: 43, symbol: "Tc", nameEn: "Technetium", nameZh: "鎝", mp: 2157, colour: "#9aa3ad", magnetic: false, group: 7, period: 5 },
    Ru: { z: 44, symbol: "Ru", nameEn: "Ruthenium", nameZh: "釕", mp: 2334, colour: "#6a6f78", magnetic: false, group: 8, period: 5 },
    Rh: { z: 45, symbol: "Rh", nameEn: "Rhodium", nameZh: "銠", mp: 1964, colour: "#c5c8cc", magnetic: false, group: 9, period: 5 },
    Pd: { z: 46, symbol: "Pd", nameEn: "Palladium", nameZh: "鈀", mp: 1555, colour: "#9aa0a6", magnetic: false, group: 10, period: 5 },
    Ag: { z: 47, symbol: "Ag", nameEn: "Silver", nameZh: "銀", mp: 962, colour: "#d0d5da", magnetic: false, group: 11, period: 5 },
    Cd: { z: 48, symbol: "Cd", nameEn: "Cadmium", nameZh: "鎘", mp: 321, colour: "#8a93a0", magnetic: false, group: 12, period: 5 },
    In: { z: 49, symbol: "In", nameEn: "Indium", nameZh: "銦", mp: 157, colour: "#7a8fa6", magnetic: false, group: 13, period: 5 },
    Sn: { z: 50, symbol: "Sn", nameEn: "Tin", nameZh: "錫", mp: 232, colour: "#c8cdd3", magnetic: false, group: 14, period: 5 },
    Sb: { z: 51, symbol: "Sb", nameEn: "Antimony", nameZh: "銻", mp: 631, colour: "#8d8f86", magnetic: false, group: 15, period: 5 },
    Te: { z: 52, symbol: "Te", nameEn: "Tellurium", nameZh: "碲", mp: 450, colour: "#9aa3ad", magnetic: false, group: 16, period: 5 },
    I: { z: 53, symbol: "I", nameEn: "Iodine", nameZh: "碘", mp: 114, colour: "#2c2c32", magnetic: false, group: 17, period: 5 },
    Xe: { z: 54, symbol: "Xe", nameEn: "Xenon", nameZh: "氙", mp: -112, colour: "#8ec5e8", magnetic: false, group: 18, period: 5, roomState: "gas" },
    Ba: { z: 56, symbol: "Ba", nameEn: "Barium", nameZh: "鋇", mp: 727, colour: "#c5ccd4", magnetic: false, group: 2, period: 6 },
    W: { z: 74, symbol: "W", nameEn: "Tungsten", nameZh: "鎢", mp: 3422, colour: "#5a6570", magnetic: false, group: 6, period: 6 },
    Pt: { z: 78, symbol: "Pt", nameEn: "Platinum", nameZh: "鉑", mp: 1768, colour: "#c5c8cc", magnetic: false, group: 10, period: 6 },
    Au: { z: 79, symbol: "Au", nameEn: "Gold", nameZh: "金", mp: 1064, colour: "#d4a017", magnetic: false, group: 11, period: 6 },
    Hg: { z: 80, symbol: "Hg", nameEn: "Mercury", nameZh: "汞", mp: -39, colour: "#9aa3ad", magnetic: false, group: 12, period: 6 },
    Pb: { z: 82, symbol: "Pb", nameEn: "Lead", nameZh: "鉛", mp: 327, colour: "#6a6f78", magnetic: false, group: 14, period: 6 }
  };

  const PERIODIC_LAYOUT = [
    { symbol: "H", z: 1, group: 1, period: 1 },
    { symbol: "He", z: 2, group: 18, period: 1 },
    { symbol: "Li", z: 3, group: 1, period: 2 },
    { symbol: "Be", z: 4, group: 2, period: 2 },
    { symbol: "B", z: 5, group: 13, period: 2 },
    { symbol: "C", z: 6, group: 14, period: 2 },
    { symbol: "N", z: 7, group: 15, period: 2 },
    { symbol: "O", z: 8, group: 16, period: 2 },
    { symbol: "F", z: 9, group: 17, period: 2 },
    { symbol: "Ne", z: 10, group: 18, period: 2 },
    { symbol: "Na", z: 11, group: 1, period: 3 },
    { symbol: "Mg", z: 12, group: 2, period: 3 },
    { symbol: "Al", z: 13, group: 13, period: 3 },
    { symbol: "Si", z: 14, group: 14, period: 3 },
    { symbol: "P", z: 15, group: 15, period: 3 },
    { symbol: "S", z: 16, group: 16, period: 3 },
    { symbol: "Cl", z: 17, group: 17, period: 3 },
    { symbol: "Ar", z: 18, group: 18, period: 3 },
    { symbol: "K", z: 19, group: 1, period: 4 },
    { symbol: "Ca", z: 20, group: 2, period: 4 },
    { symbol: "Sc", z: 21, group: 3, period: 4 },
    { symbol: "Ti", z: 22, group: 4, period: 4 },
    { symbol: "V", z: 23, group: 5, period: 4 },
    { symbol: "Cr", z: 24, group: 6, period: 4 },
    { symbol: "Mn", z: 25, group: 7, period: 4 },
    { symbol: "Fe", z: 26, group: 8, period: 4 },
    { symbol: "Co", z: 27, group: 9, period: 4 },
    { symbol: "Ni", z: 28, group: 10, period: 4 },
    { symbol: "Cu", z: 29, group: 11, period: 4 },
    { symbol: "Zn", z: 30, group: 12, period: 4 },
    { symbol: "Ga", z: 31, group: 13, period: 4 },
    { symbol: "Ge", z: 32, group: 14, period: 4 },
    { symbol: "As", z: 33, group: 15, period: 4 },
    { symbol: "Se", z: 34, group: 16, period: 4 },
    { symbol: "Br", z: 35, group: 17, period: 4 },
    { symbol: "Kr", z: 36, group: 18, period: 4 },
    { symbol: "Rb", z: 37, group: 1, period: 5 },
    { symbol: "Sr", z: 38, group: 2, period: 5 },
    { symbol: "Y", z: 39, group: 3, period: 5 },
    { symbol: "Zr", z: 40, group: 4, period: 5 },
    { symbol: "Nb", z: 41, group: 5, period: 5 },
    { symbol: "Mo", z: 42, group: 6, period: 5 },
    { symbol: "Tc", z: 43, group: 7, period: 5 },
    { symbol: "Ru", z: 44, group: 8, period: 5 },
    { symbol: "Rh", z: 45, group: 9, period: 5 },
    { symbol: "Pd", z: 46, group: 10, period: 5 },
    { symbol: "Ag", z: 47, group: 11, period: 5 },
    { symbol: "Cd", z: 48, group: 12, period: 5 },
    { symbol: "In", z: 49, group: 13, period: 5 },
    { symbol: "Sn", z: 50, group: 14, period: 5 },
    { symbol: "Sb", z: 51, group: 15, period: 5 },
    { symbol: "Te", z: 52, group: 16, period: 5 },
    { symbol: "I", z: 53, group: 17, period: 5 },
    { symbol: "Xe", z: 54, group: 18, period: 5 },
    { symbol: "Cs", z: 55, group: 1, period: 6 },
    { symbol: "Ba", z: 56, group: 2, period: 6 },
    { symbol: "La", z: 57, group: 3, period: 6 },
    { symbol: "Hf", z: 72, group: 4, period: 6 },
    { symbol: "Ta", z: 73, group: 5, period: 6 },
    { symbol: "W", z: 74, group: 6, period: 6 },
    { symbol: "Re", z: 75, group: 7, period: 6 },
    { symbol: "Os", z: 76, group: 8, period: 6 },
    { symbol: "Ir", z: 77, group: 9, period: 6 },
    { symbol: "Pt", z: 78, group: 10, period: 6 },
    { symbol: "Au", z: 79, group: 11, period: 6 },
    { symbol: "Hg", z: 80, group: 12, period: 6 },
    { symbol: "Tl", z: 81, group: 13, period: 6 },
    { symbol: "Pb", z: 82, group: 14, period: 6 },
    { symbol: "Bi", z: 83, group: 15, period: 6 },
    { symbol: "Po", z: 84, group: 16, period: 6 },
    { symbol: "At", z: 85, group: 17, period: 6 },
    { symbol: "Rn", z: 86, group: 18, period: 6 },
    { symbol: "Fr", z: 87, group: 1, period: 7 },
    { symbol: "Ra", z: 88, group: 2, period: 7 },
    { symbol: "Ac", z: 89, group: 3, period: 7 },
    { symbol: "Rf", z: 104, group: 4, period: 7 },
    { symbol: "Db", z: 105, group: 5, period: 7 },
    { symbol: "Sg", z: 106, group: 6, period: 7 },
    { symbol: "Bh", z: 107, group: 7, period: 7 },
    { symbol: "Hs", z: 108, group: 8, period: 7 },
    { symbol: "Mt", z: 109, group: 9, period: 7 },
    { symbol: "Ds", z: 110, group: 10, period: 7 },
    { symbol: "Rg", z: 111, group: 11, period: 7 },
    { symbol: "Cn", z: 112, group: 12, period: 7 },
    { symbol: "Nh", z: 113, group: 13, period: 7 },
    { symbol: "Fl", z: 114, group: 14, period: 7 },
    { symbol: "Mc", z: 115, group: 15, period: 7 },
    { symbol: "Lv", z: 116, group: 16, period: 7 },
    { symbol: "Ts", z: 117, group: 17, period: 7 },
    { symbol: "Og", z: 118, group: 18, period: 7 },
    { symbol: "Ce", z: 58, group: 4, period: 9 },
    { symbol: "Pr", z: 59, group: 5, period: 9 },
    { symbol: "Nd", z: 60, group: 6, period: 9 },
    { symbol: "Pm", z: 61, group: 7, period: 9 },
    { symbol: "Sm", z: 62, group: 8, period: 9 },
    { symbol: "Eu", z: 63, group: 9, period: 9 },
    { symbol: "Gd", z: 64, group: 10, period: 9 },
    { symbol: "Tb", z: 65, group: 11, period: 9 },
    { symbol: "Dy", z: 66, group: 12, period: 9 },
    { symbol: "Ho", z: 67, group: 13, period: 9 },
    { symbol: "Er", z: 68, group: 14, period: 9 },
    { symbol: "Tm", z: 69, group: 15, period: 9 },
    { symbol: "Yb", z: 70, group: 16, period: 9 },
    { symbol: "Lu", z: 71, group: 17, period: 9 },
    { symbol: "Th", z: 90, group: 4, period: 10 },
    { symbol: "Pa", z: 91, group: 5, period: 10 },
    { symbol: "U", z: 92, group: 6, period: 10 },
    { symbol: "Np", z: 93, group: 7, period: 10 },
    { symbol: "Pu", z: 94, group: 8, period: 10 },
    { symbol: "Am", z: 95, group: 9, period: 10 },
    { symbol: "Cm", z: 96, group: 10, period: 10 },
    { symbol: "Bk", z: 97, group: 11, period: 10 },
    { symbol: "Cf", z: 98, group: 12, period: 10 },
    { symbol: "Es", z: 99, group: 13, period: 10 },
    { symbol: "Fm", z: 100, group: 14, period: 10 },
    { symbol: "Md", z: 101, group: 15, period: 10 },
    { symbol: "No", z: 102, group: 16, period: 10 },
    { symbol: "Lr", z: 103, group: 17, period: 10 }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function emptyVessels() {
    return {
      dish: [],
      magnetPile: [],
      beaker: [],
      poured: [],
      residue: [],
      filtrate: [],
      cathode: [],
      anode: []
    };
  }

  function isFeSPair(symbols) {
    const set = {};
    (symbols || []).forEach(function (symbol) {
      set[symbol] = true;
    });
    return set.Fe && set.S && symbols.length === 2;
  }

  function isDishSample(sample) {
    return sample === "ironSulphur" || sample === "custom";
  }

  function canPlaceOnPlate(symbol) {
    const element = ELEMENTS[symbol];
    return !!(element && element.roomState !== "gas");
  }

  function componentFromElement(element, location) {
    return {
      id: element.symbol,
      nameKey: element.symbol,
      nameEn: element.nameEn,
      nameZh: element.nameZh,
      formula: element.symbol,
      amount: 1,
      unit: "portion",
      magnetic: !!element.magnetic,
      colour: element.colour,
      phase: element.mp <= ROOM_TEMP ? "liquid" : "solid",
      meltingPoint: element.mp,
      location: location || "dish"
    };
  }

  function withLabMeta(state) {
    state.temperature = typeof state.temperature === "number" ? state.temperature : ROOM_TEMP;
    state.customElements = state.customElements || null;
    state.energy = state.energy || { heat: false, electricity: false };
    return state;
  }

  function makeCustomPair(symbols) {
    const pair = (symbols || []).filter(canPlaceOnPlate).slice(0, 2);
    if (pair.length < 2) {
      return makePreset("ironSulphur");
    }
    if (isFeSPair(pair)) {
      const preset = makePreset("ironSulphur");
      preset.customElements = pair.slice();
      return preset;
    }

    const first = ELEMENTS[pair[0]];
    const second = ELEMENTS[pair[1]];
    const components = [
      componentFromElement(first, "dish"),
      componentFromElement(second, "dish")
    ];

    return withLabMeta({
      sample: "custom",
      customElements: pair.slice(),
      kind: "mixture",
      bonded: false,
      formula: first.symbol + " + " + second.symbol,
      massRatio: "",
      phase: "mixed",
      components: components,
      vessels: Object.assign(emptyVessels(), { dish: [first.symbol, second.symbol] }),
      energy: { heat: false, electricity: false },
      temperature: ROOM_TEMP,
      gasVolumes: { H2: 0, O2: 0 },
      warning: null,
      log: {
        action: "loadSample",
        outcome: "ready",
        captionKey: "captionCustomStart",
        equation: ""
      }
    });
  }

  function makePreset(sample) {
    if (sample === "sandWater") {
      return withLabMeta({
        sample: "sandWater",
        kind: "mixture",
        bonded: false,
        formula: "SiO2 + H2O",
        massRatio: "",
        phase: "mixed",
        components: [
          {
            id: "sand",
            nameKey: "sand",
            formula: "SiO2",
            amount: 1,
            unit: "portion",
            magnetic: false,
            colour: "#c9a36a",
            phase: "solid",
            meltingPoint: 1710,
            location: "beaker"
          },
          {
            id: "water",
            nameKey: "water",
            formula: "H2O",
            amount: 1,
            unit: "portion",
            magnetic: false,
            colour: "#6cb7e8",
            phase: "liquid",
            meltingPoint: 0,
            location: "beaker"
          }
        ],
        vessels: Object.assign(emptyVessels(), { beaker: ["sand", "water"] }),
        energy: { heat: false, electricity: false },
        temperature: ROOM_TEMP,
        gasVolumes: { H2: 0, O2: 0 },
        warning: null,
        log: {
          action: "loadSample",
          outcome: "ready",
          captionKey: "captionSandStart",
          equation: ""
        }
      });
    }

    if (sample === "acidifiedWater") {
      return withLabMeta({
        sample: "acidifiedWater",
        kind: "compound",
        bonded: true,
        formula: "H2O",
        massRatio: "",
        phase: "compound",
        components: [
          {
            id: "water",
            nameKey: "acidifiedWater",
            formula: "H2O",
            amount: 1,
            unit: "portion",
            magnetic: false,
            colour: "#6cb7e8",
            phase: "liquid",
            meltingPoint: 0,
            location: "beaker"
          }
        ],
        vessels: Object.assign(emptyVessels(), { beaker: ["water"] }),
        energy: { heat: false, electricity: false },
        temperature: ROOM_TEMP,
        gasVolumes: { H2: 0, O2: 0 },
        warning: null,
        log: {
          action: "loadSample",
          outcome: "ready",
          captionKey: "captionWaterStart",
          equation: ""
        }
      });
    }

    if (sample === "custom") {
      return makeCustomPair(["Fe", "Cu"]);
    }

    return withLabMeta({
      sample: "ironSulphur",
      kind: "mixture",
      bonded: false,
      formula: "Fe + S",
      massRatio: "7 : 4",
      phase: "mixed",
      components: [
        {
          id: "Fe",
          nameKey: "iron",
          formula: "Fe",
          amount: 7,
          unit: "g",
          magnetic: true,
          colour: "#8a93a0",
          phase: "solid",
          meltingPoint: 1538,
          location: "dish"
        },
        {
          id: "S",
          nameKey: "sulphur",
          formula: "S",
          amount: 4,
          unit: "g",
          magnetic: false,
          colour: "#f0c43a",
          phase: "solid",
          meltingPoint: 115,
          location: "dish"
        }
      ],
      vessels: Object.assign(emptyVessels(), { dish: ["Fe", "S"] }),
      energy: { heat: false, electricity: false },
      temperature: ROOM_TEMP,
      gasVolumes: { H2: 0, O2: 0 },
      warning: null,
      log: {
        action: "loadSample",
        outcome: "ready",
        captionKey: "captionIronStart",
        equation: ""
      }
    });
  }

  function restoreState(state) {
    if (state.sample === "custom" && state.customElements) {
      return makeCustomPair(state.customElements);
    }
    return makePreset(state.sample);
  }

  function setLog(state, action, outcome, captionKey, equation) {
    state.log = {
      action: action,
      outcome: outcome,
      captionKey: captionKey,
      equation: equation || ""
    };
    return state;
  }

  function block(state, action, titleKey, bodyKey) {
    state.warning = {
      level: "danger",
      titleKey: titleKey,
      bodyKey: bodyKey
    };
    return setLog(state, action, "blocked", bodyKey, "");
  }

  function note(state, action, captionKey) {
    return setLog(state, action, "note", captionKey, "");
  }

  function moveComponent(state, id, location) {
    const component = state.components.find((item) => item.id === id);
    if (component) {
      component.location = location;
    }
    Object.keys(state.vessels).forEach((vessel) => {
      state.vessels[vessel] = state.vessels[vessel].filter((item) => item !== id);
    });
    if (state.vessels[location]) {
      state.vessels[location].push(id);
    }
  }

  function magneticComponents(state) {
    return state.components.filter(function (item) {
      return item.magnetic;
    });
  }

  function applyMagnet(state) {
    if (state.kind === "compound") {
      if (state.sample === "ironSulphur") {
        return block(state, "magnet", "warnFeSMagnetTitle", "warnFeSMagnetBody");
      }
      return block(state, "magnet", "warnWaterPhysicalTitle", "warnWaterPhysicalBody");
    }

    if (state.sample === "sandWater") {
      return note(state, "magnet", "noteNoIron");
    }

    if (!isDishSample(state.sample)) {
      return note(state, "magnet", "noteAlreadyElectrolysed");
    }

    if (state.phase === "magnetSeparated") {
      return note(state, "magnet", "noteAlreadySeparated");
    }

    const magnets = magneticComponents(state);
    if (!magnets.length) {
      return note(state, "magnet", "noteNoMagnetic");
    }

    const solidMagnets = magnets.filter(function (item) {
      return item.phase !== "liquid";
    });
    if (!solidMagnets.length) {
      return note(state, "magnet", "noteMoltenMagnetCurie");
    }

    solidMagnets.forEach(function (item) {
      moveComponent(state, item.id, "magnetPile");
    });
    state.phase = "magnetSeparated";
    return setLog(
      state,
      "magnet",
      "separated",
      state.sample === "custom" ? "captionMagnetCustom" : "captionMagnetSuccess",
      ""
    );
  }

  function applyDecant(state) {
    if (state.kind === "compound") {
      if (state.sample === "ironSulphur") {
        return block(state, "decant", "warnFeSPhysicalTitle", "warnFeSPhysicalBody");
      }
      return block(state, "decant", "warnWaterPhysicalTitle", "warnWaterPhysicalBody");
    }
    if (state.sample !== "sandWater") {
      return note(state, "decant", "noteNotSolidLiquid");
    }
    if (state.phase === "molten") {
      return note(state, "decant", "noteMoltenSandPhysical");
    }
    if (state.phase === "filtered") {
      return note(state, "decant", "noteAlreadySeparated");
    }
    if (state.phase === "decanted") {
      return note(state, "decant", "noteAlreadyDecanted");
    }
    moveComponent(state, "water", "poured");
    state.phase = "decanted";
    return setLog(state, "decant", "separated", "captionDecantSuccess", "");
  }

  function applyFilter(state) {
    if (state.kind === "compound") {
      if (state.sample === "ironSulphur") {
        return block(state, "filter", "warnFeSPhysicalTitle", "warnFeSPhysicalBody");
      }
      return block(state, "filter", "warnWaterPhysicalTitle", "warnWaterPhysicalBody");
    }
    if (state.sample !== "sandWater") {
      return note(state, "filter", "noteNotSolidLiquid");
    }
    if (state.phase === "molten") {
      return note(state, "filter", "noteMoltenSandPhysical");
    }
    if (state.phase === "filtered") {
      return note(state, "filter", "noteAlreadySeparated");
    }
    moveComponent(state, "sand", "residue");
    moveComponent(state, "water", "filtrate");
    state.phase = "filtered";
    return setLog(state, "filter", "separated", "captionFilterSuccess", "");
  }

  function applyHeat(state) {
    if (state.sample === "custom") {
      return note(state, "heat", "noteHeatCustomPair");
    }
    if (state.sample !== "ironSulphur") {
      return note(state, "heat", "noteHeatWrongSample");
    }
    if (state.kind === "compound") {
      return note(state, "heat", "noteAlreadyFeS");
    }
    if (state.phase === "magnetSeparated") {
      return note(state, "heat", "noteHeatSeparated");
    }
    state.kind = "compound";
    state.bonded = true;
    state.formula = "FeS";
    state.phase = "compound";
    state.energy.heat = true;
    state.temperature = Math.max(state.temperature || ROOM_TEMP, 1538);
    state.components = [
      {
        id: "FeS",
        nameKey: "ironSulphide",
        formula: "FeS",
        amount: 11,
        unit: "g",
        magnetic: false,
        colour: "#1c1c1e",
        phase: "solid",
        meltingPoint: 1194,
        location: "dish"
      }
    ];
    state.vessels = Object.assign(emptyVessels(), { dish: ["FeS"] });
    return setLog(state, "heat", "combined", "captionHeatSuccess", "Fe + S → FeS");
  }

  function meltCaption(state, meltedAny) {
    if (!meltedAny) {
      return "captionMeltAlreadyLiquid";
    }
    if (state.sample === "sandWater") {
      return "captionMeltSand";
    }
    if (state.kind === "compound") {
      return "captionMeltCompound";
    }
    if (state.sample === "custom") {
      return "captionMeltCustom";
    }
    return "captionMeltIron";
  }

  function applyMelt(state) {
    if (state.sample === "acidifiedWater") {
      return note(state, "melt", "noteMeltWrongSample");
    }

    const solids = state.components.filter(function (item) {
      return item.phase === "solid";
    });

    if (!solids.length && state.phase === "molten") {
      return note(state, "melt", "noteAlreadyMolten");
    }

    solids.forEach(function (item) {
      item.phase = "liquid";
      if (item.location === "magnetPile") {
        moveComponent(state, item.id, "dish");
      }
    });

    const peaks = state.components.map(function (item) {
      return typeof item.meltingPoint === "number" ? item.meltingPoint : ROOM_TEMP;
    });
    state.temperature = Math.max.apply(null, [ROOM_TEMP].concat(peaks));
    state.energy.heat = true;
    state.phase = "molten";

    return setLog(state, "melt", "melted", meltCaption(state, solids.length > 0), "");
  }

  function applyElectrolyse(state) {
    if (state.sample !== "acidifiedWater") {
      return note(state, "electrolyse", "noteElectrolyseMixture");
    }
    if (state.kind === "elements") {
      return note(state, "electrolyse", "noteAlreadyElectrolysed");
    }
    state.kind = "elements";
    state.bonded = false;
    state.formula = "H2 + O2";
    state.phase = "electrolysed";
    state.energy.electricity = true;
    state.gasVolumes = { H2: 20, O2: 10 };
    state.components = [
      {
        id: "H2",
        nameKey: "hydrogen",
        formula: "H2",
        amount: 20,
        unit: "cm3",
        magnetic: false,
        colour: "colourless",
        phase: "gas",
        meltingPoint: -259,
        location: "cathode"
      },
      {
        id: "O2",
        nameKey: "oxygen",
        formula: "O2",
        amount: 10,
        unit: "cm3",
        magnetic: false,
        colour: "colourless",
        phase: "gas",
        meltingPoint: -219,
        location: "anode"
      }
    ];
    state.vessels = Object.assign(emptyVessels(), {
      cathode: ["H2"],
      anode: ["O2"]
    });
    return setLog(state, "electrolyse", "decomposed", "captionElectrolyseSuccess", "2H2O(l) → 2H2(g) + O2(g)");
  }

  function reduce(state, action) {
    if (!action || !action.type) {
      return state;
    }
    if (action.type === "loadSample") {
      if (action.sample === "custom") {
        return makeCustomPair(action.elements || (state && state.customElements));
      }
      const sample = SAMPLES.includes(action.sample) ? action.sample : "ironSulphur";
      if (sample === "custom") {
        return makeCustomPair(action.elements || (state && state.customElements));
      }
      return makePreset(sample);
    }
    if (action.type === "reset") {
      return restoreState(state);
    }

    const next = clone(state);
    next.warning = null;

    if (action.type === "magnet") {
      return applyMagnet(next);
    }
    if (action.type === "decant") {
      return applyDecant(next);
    }
    if (action.type === "filter") {
      return applyFilter(next);
    }
    if (action.type === "heat") {
      return applyHeat(next);
    }
    if (action.type === "melt") {
      return applyMelt(next);
    }
    if (action.type === "electrolyse") {
      return applyElectrolyse(next);
    }
    return next;
  }

  function createLab(initialSample) {
    let state = makePreset(SAMPLES.includes(initialSample) ? initialSample : "ironSulphur");

    return {
      getState: function () {
        return clone(state);
      },
      dispatch: function (action) {
        state = reduce(state, action);
        return clone(state);
      },
      reset: function () {
        state = restoreState(state);
        return clone(state);
      }
    };
  }

  return {
    SAMPLES: SAMPLES,
    ELEMENTS: ELEMENTS,
    PERIODIC_LAYOUT: PERIODIC_LAYOUT,
    ROOM_TEMP: ROOM_TEMP,
    createLab: createLab,
    makePreset: makePreset,
    makeCustomPair: makeCustomPair,
    canPlaceOnPlate: canPlaceOnPlate,
    reduce: reduce
  };
});
