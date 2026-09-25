/* HKDSE Titration Lab — Chemical database */
var CHEMICALS = {
  HCl: {
    id: 'HCl',
    name: 'Hydrochloric acid',
    nameZh: '鹽酸',
    formula: 'HCl',
    type: 'acid',
    strength: 'strong',
    equivalents: 1,
    defaultConc: 0.1,
    Ka: null
  },
  H2SO4: {
    id: 'H2SO4',
    name: 'Sulphuric acid',
    nameZh: '硫酸',
    formula: 'H₂SO₄',
    type: 'acid',
    strength: 'strong',
    equivalents: 2,
    defaultConc: 0.1,
    Ka: null
  },
  HNO3: {
    id: 'HNO3',
    name: 'Nitric acid',
    nameZh: '硝酸',
    formula: 'HNO₃',
    type: 'acid',
    strength: 'strong',
    equivalents: 1,
    defaultConc: 0.1,
    Ka: null
  },
  CH3COOH: {
    id: 'CH3COOH',
    name: 'Ethanoic acid',
    nameZh: '乙酸',
    formula: 'CH₃COOH',
    type: 'acid',
    strength: 'weak',
    equivalents: 1,
    defaultConc: 0.1,
    Ka: 1.8e-5
  },
  NaOH: {
    id: 'NaOH',
    name: 'Sodium hydroxide',
    nameZh: '氫氧化鈉',
    formula: 'NaOH',
    type: 'base',
    strength: 'strong',
    equivalents: 1,
    defaultConc: 0.1,
    Kb: null
  },
  KOH: {
    id: 'KOH',
    name: 'Potassium hydroxide',
    nameZh: '氫氧化鉀',
    formula: 'KOH',
    type: 'base',
    strength: 'strong',
    equivalents: 1,
    defaultConc: 0.1,
    Kb: null
  },
  CaOH2: {
    id: 'CaOH2',
    name: 'Calcium hydroxide',
    nameZh: '氫氧化鈣',
    formula: 'Ca(OH)₂',
    type: 'base',
    strength: 'strong',
    equivalents: 2,
    defaultConc: 0.05,
    Kb: null
  },
  Na2CO3: {
    id: 'Na2CO3',
    name: 'Sodium carbonate',
    nameZh: '碳酸鈉',
    formula: 'Na₂CO₃',
    type: 'base',
    strength: 'weak',
    equivalents: 2,
    defaultConc: 1.06,
    Kb: 2.1e-4
  },
  NH3: {
    id: 'NH3',
    name: 'Aqueous ammonia',
    nameZh: '氨水',
    formula: 'NH₃(aq)',
    type: 'base',
    strength: 'weak',
    equivalents: 1,
    defaultConc: 0.1,
    Kb: 1.8e-5
  }
};

var ACID_IDS = ['HCl', 'H2SO4', 'HNO3', 'CH3COOH'];
var BASE_IDS = ['NaOH', 'KOH', 'CaOH2', 'Na2CO3', 'NH3'];

var PRESETS = [
  {
    id: 'sa_sb',
    flaskId: 'NaOH',
    flaskConc: 0.1,
    flaskVol: 25,
    buretteId: 'HCl',
    buretteConc: 0.1,
    indicator: 'phenolphthalein'
  },
  {
    id: 'sa_wb',
    flaskId: 'NH3',
    flaskConc: 0.1,
    flaskVol: 25,
    buretteId: 'H2SO4',
    buretteConc: 0.1,
    indicator: 'methylOrange'
  },
  {
    id: 'wa_sb',
    flaskId: 'CH3COOH',
    flaskConc: 0.1,
    flaskVol: 25,
    buretteId: 'NaOH',
    buretteConc: 0.1,
    indicator: 'phenolphthalein'
  },
  {
    id: 'na2co3_hcl',
    flaskId: 'Na2CO3',
    flaskConc: 1.06,
    flaskVol: 10,
    buretteId: 'HCl',
    buretteConc: 0.5,
    indicator: 'methylOrange'
  },
  {
    id: 'compare_alkali',
    flaskId: 'KOH',
    flaskConc: 0.1,
    flaskVol: 25,
    buretteId: 'HCl',
    buretteConc: 0.1,
    indicator: 'phenolphthalein'
  }
];

function getChemical(id) {
  return CHEMICALS[id] || null;
}

function getAcids() {
  return ACID_IDS.map(function (id) { return CHEMICALS[id]; });
}

function getBases() {
  return BASE_IDS.map(function (id) { return CHEMICALS[id]; });
}

function formatChemicalLabel(chem, lang) {
  lang = lang || (typeof I18n !== 'undefined' ? I18n.getLang() : 'zh');
  if (lang === 'en') {
    return chem.formula + ' — ' + chem.name;
  }
  return chem.formula + ' — ' + chem.nameZh;
}

function getPresetLabel(presetId, lang) {
  lang = lang || (typeof I18n !== 'undefined' ? I18n.getLang() : 'zh');
  return I18n.t('preset.' + presetId);
}

function getPresetNote(presetId, lang) {
  lang = lang || (typeof I18n !== 'undefined' ? I18n.getLang() : 'zh');
  return I18n.t('note.' + presetId);
}
