/* HKDSE Metal Reactions Lab — Metal & solution data (Topic 3) */
var REACTIVITY_ORDER = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb', 'Cu', 'Ag', 'Pt', 'Au'];

var METALS = {
  K: {
    id: 'K',
    symbol: 'K',
    name: { zh: '鉀', en: 'Potassium' },
    reactivity: 0,
    appearance: '#c0c0c8',
    stripColor: '#d4d4dc',
    state: 'solid'
  },
  Na: {
    id: 'Na',
    symbol: 'Na',
    name: { zh: '鈉', en: 'Sodium' },
    reactivity: 1,
    appearance: '#c8c8d0',
    stripColor: '#dcdce4',
    state: 'solid'
  },
  Ca: {
    id: 'Ca',
    symbol: 'Ca',
    name: { zh: '鈣', en: 'Calcium' },
    reactivity: 2,
    appearance: '#b8b8c0',
    stripColor: '#c8c8d0',
    state: 'solid'
  },
  Mg: {
    id: 'Mg',
    symbol: 'Mg',
    name: { zh: '鎂', en: 'Magnesium' },
    reactivity: 3,
    appearance: '#a8a8b0',
    stripColor: '#b8b8c0',
    state: 'solid'
  },
  Al: {
    id: 'Al',
    symbol: 'Al',
    name: { zh: '鋁', en: 'Aluminium' },
    reactivity: 4,
    appearance: '#b0b8c0',
    stripColor: '#c0c8d0',
    state: 'solid'
  },
  Zn: {
    id: 'Zn',
    symbol: 'Zn',
    name: { zh: '鋅', en: 'Zinc' },
    reactivity: 5,
    appearance: '#9098a0',
    stripColor: '#a0a8b0',
    state: 'solid'
  },
  Fe: {
    id: 'Fe',
    symbol: 'Fe',
    name: { zh: '鐵', en: 'Iron' },
    reactivity: 6,
    appearance: '#787880',
    stripColor: '#888890',
    state: 'solid'
  },
  Pb: {
    id: 'Pb',
    symbol: 'Pb',
    name: { zh: '鉛', en: 'Lead' },
    reactivity: 7,
    appearance: '#707078',
    stripColor: '#808088',
    state: 'solid'
  },
  Cu: {
    id: 'Cu',
    symbol: 'Cu',
    name: { zh: '銅', en: 'Copper' },
    reactivity: 8,
    appearance: '#b45309',
    stripColor: '#b45309',
    state: 'solid'
  },
  Ag: {
    id: 'Ag',
    symbol: 'Ag',
    name: { zh: '銀', en: 'Silver' },
    reactivity: 10,
    appearance: '#c0c0c8',
    stripColor: '#d0d0d8',
    state: 'solid'
  },
  Pt: {
    id: 'Pt',
    symbol: 'Pt',
    name: { zh: '鉑', en: 'Platinum' },
    reactivity: 11,
    appearance: '#b0b0b8',
    stripColor: '#c0c0c8',
    state: 'solid'
  },
  Au: {
    id: 'Au',
    symbol: 'Au',
    name: { zh: '金', en: 'Gold' },
    reactivity: 12,
    appearance: '#ca8a04',
    stripColor: '#eab308',
    state: 'solid'
  }
};

var OXYGEN_REACTIONS = {
  K: {
    reacts: true,
    flameColor: '#e0b0ff',
    flameLabel: { zh: '淡紫色火焰', en: 'Lilac flame' },
    powderColor: '#f8fafc',
    powderHotColor: '#f8fafc',
    equation: '4K(s) + O₂(g) → 2K₂O(s)',
    wordEquation: { zh: '鉀 + 氧 → 氧化鉀', en: 'Potassium + Oxygen → Potassium oxide' },
    observation: {
      zh: '輕微加熱即燃燒，產生淡紫色火焰，留下白色粉末。',
      en: 'Burns on gentle heating with a lilac flame; white powder remains.'
    },
    explanation: {
      zh: '鉀活性很高，容易與空氣中的氧反應形成穩定氧化物。',
      en: 'Potassium is highly reactive and readily forms a stable oxide with oxygen in air.'
    }
  },
  Na: {
    reacts: true,
    flameColor: '#ffaa00',
    flameLabel: { zh: '金黃色火焰', en: 'Golden yellow flame' },
    powderColor: '#f8fafc',
    powderHotColor: '#f8fafc',
    equation: '4Na(s) + O₂(g) → 2Na₂O(s)',
    wordEquation: { zh: '鈉 + 氧 → 氧化鈉', en: 'Sodium + Oxygen → Sodium oxide' },
    observation: {
      zh: '輕微加熱即燃燒，產生金黃色火焰，留下白色粉末。',
      en: 'Burns on gentle heating with a golden yellow flame; white powder remains.'
    },
    explanation: {
      zh: '鈉活性很高，應儲存於石蠟油下以防與氧反應。',
      en: 'Sodium is highly reactive and is stored under paraffin oil to prevent reaction with oxygen.'
    }
  },
  Ca: {
    reacts: true,
    flameColor: '#ff5500',
    flameLabel: { zh: '磚紅色火焰', en: 'Brick-red flame' },
    powderColor: '#f8fafc',
    powderHotColor: '#f8fafc',
    equation: '2Ca(s) + O₂(g) → 2CaO(s)',
    wordEquation: { zh: '鈣 + 氧 → 氧化鈣', en: 'Calcium + Oxygen → Calcium oxide' },
    observation: {
      zh: '強烈加熱時燃燒，產生磚紅色火焰，留下白色粉末。',
      en: 'Burns on strong heating with a brick-red flame; white powder remains.'
    },
    explanation: {
      zh: '鈣應儲存於密封容器內，避免與空氣中的氧及水蒸氣反應。',
      en: 'Calcium should be stored in an airtight container away from oxygen and moisture.'
    }
  },
  Mg: {
    reacts: true,
    flameColor: '#ffffff',
    flameLabel: { zh: '耀眼白色火焰', en: 'Bright white flame' },
    powderColor: '#f8fafc',
    powderHotColor: '#f8fafc',
    equation: '2Mg(s) + O₂(g) → 2MgO(s)',
    wordEquation: { zh: '鎂 + 氧 → 氧化鎂', en: 'Magnesium + Oxygen → Magnesium oxide' },
    observation: {
      zh: '強烈加熱時燃燒，產生耀眼白色火焰，留下白色粉末。',
      en: 'Burns on strong heating with a dazzling white flame; white powder remains.'
    },
    explanation: {
      zh: '鎂與氧反應放大量熱，生成白色氧化鎂。',
      en: 'Magnesium reacts vigorously with oxygen, releasing much heat to form white magnesium oxide.'
    }
  },
  Al: {
    reacts: true,
    flameColor: null,
    flameLabel: { zh: '放出大量熱', en: 'Gives out much heat' },
    powderColor: '#f8fafc',
    powderHotColor: '#f8fafc',
    equation: '4Al(s) + 3O₂(g) → 2Al₂O₃(s)',
    wordEquation: { zh: '鋁 + 氧 → 氧化鋁', en: 'Aluminium + Oxygen → Aluminium oxide' },
    observation: {
      zh: '強烈加熱時燃燒，放出大量熱，留下白色粉末。',
      en: 'Burns on strong heating with much heat released; white powder remains.'
    },
    explanation: {
      zh: '鋁表面常有一層致密的氧化鋁保護膜，但強烈加熱仍可與氧反應。',
      en: 'Aluminium has a protective oxide layer, but it still reacts with oxygen on strong heating.'
    }
  },
  Zn: {
    reacts: true,
    flameColor: null,
    flameLabel: { zh: '放出熱', en: 'Gives out heat' },
    powderColor: '#ffea00',
    powderHotColor: '#ffea00',
    equation: '2Zn(s) + O₂(g) → 2ZnO(s)',
    wordEquation: { zh: '鋅 + 氧 → 氧化鋅', en: 'Zinc + Oxygen → Zinc oxide' },
    observation: {
      zh: '強烈加熱時燃燒，粉末熱時呈黃色，冷卻後變白色。',
      en: 'Burns on strong heating; powder is yellow when hot and white when cold.'
    },
    explanation: {
      zh: '鋅與氧反應生成氧化鋅，為常見的金屬氧化物。',
      en: 'Zinc reacts with oxygen to form zinc oxide.'
    }
  },
  Fe: {
    reacts: true,
    flameColor: null,
    flameLabel: { zh: '黃色火花', en: 'Yellow sparks' },
    powderColor: '#1f2937',
    powderHotColor: '#374151',
    spark: true,
    equation: '3Fe(s) + 2O₂(g) → Fe₃O₄(s)',
    wordEquation: { zh: '鐵 + 氧 → 四氧化三鐵', en: 'Iron + Oxygen → Iron(II,III) oxide' },
    observation: {
      zh: '強烈加熱時產生黃色火花，留下黑色粉末。',
      en: 'Gives yellow sparks on strong heating; black powder remains.'
    },
    explanation: {
      zh: '鐵在空氣中強烈加熱可生成黑色四氧化三鐵（註：三價鐵氧化物常呈棕色）。',
      en: 'Iron forms black iron(II,III) oxide on strong heating in air.'
    }
  },
  Pb: {
    reacts: true,
    flameColor: null,
    flameLabel: { zh: '金屬熔化', en: 'Metal melts' },
    powderColor: '#ffff00', // ultimate cold yellow: pure solid yellow
    powderHotColor: '#ff8c00', // vibrant dark orange (darkorange) - distinct from red, very orange
    equation: '2Pb(s) + O₂(g) → 2PbO(s)',
    wordEquation: { zh: '鉛 + 氧 → 氧化鉛(II)', en: 'Lead + Oxygen → Lead(II) oxide' },
    observation: {
      zh: '強烈加熱時熔化，粉末熱時呈橙色，冷卻後變黃色。',
      en: 'Melts on strong heating; powder is orange when hot and yellow when cold.'
    },
    explanation: {
      zh: '鉛活性較低，需強烈加熱才與氧反應。',
      en: 'Lead is less reactive and requires strong heating to react with oxygen.'
    }
  },
  Cu: {
    reacts: true,
    flameColor: '#0df2bc',
    flameLabel: { zh: '藍綠色火焰', en: 'Bluish-green flame' },
    powderColor: '#1f2937',
    powderHotColor: '#374151',
    equation: '2Cu(s) + O₂(g) → 2CuO(s)',
    wordEquation: { zh: '銅 + 氧 → 氧化銅(II)', en: 'Copper + Oxygen → Copper(II) oxide' },
    observation: {
      zh: '極強烈加熱時，表面變黑並產生藍綠色火焰。',
      en: 'Surface turns black with a bluish-green flame on very strong heating.'
    },
    explanation: {
      zh: '銅活性較低，在強烈加熱下，表面會與氧氣反應生成黑色的氧化銅(II)，並使本生燈火焰呈現特徵的藍綠色。',
      en: 'Copper has low reactivity; on strong heating, its surface reacts with oxygen to form black copper(II) oxide, giving the Bunsen flame a characteristic bluish-green color.'
    }
  },
  Ag: {
    reacts: false,
    equation: null,
    wordEquation: { zh: '無反應', en: 'No reaction' },
    observation: {
      zh: '與氧氣無反應（註：氧化銀為黑色）。',
      en: 'No reaction with oxygen under normal heating (note: silver oxide is black).'
    },
    explanation: {
      zh: '銀活性低，一般加熱條件下不與氧反應。',
      en: 'Silver is unreactive with oxygen under normal heating conditions.'
    }
  },
  Pt: {
    reacts: false,
    equation: null,
    wordEquation: { zh: '無反應', en: 'No reaction' },
    observation: {
      zh: '與氧氣無反應。',
      en: 'No reaction with oxygen.'
    },
    explanation: {
      zh: '鉑為惰性金屬，不與氧反應。',
      en: 'Platinum is an unreactive metal and does not react with oxygen.'
    }
  },
  Au: {
    reacts: false,
    equation: null,
    wordEquation: { zh: '無反應', en: 'No reaction' },
    observation: {
      zh: '與氧氣無反應。',
      en: 'No reaction with oxygen.'
    },
    explanation: {
      zh: '金為最不活潑金屬之一，不與氧反應。',
      en: 'Gold is one of the least reactive metals and does not react with oxygen.'
    }
  }
};

var SOLUTIONS = {
  cold_water: {
    id: 'cold_water',
    category: 'water',
    name: { zh: '冷水 H₂O(l)', en: 'Cold water H₂O(l)' },
    color: 'rgba(186, 230, 253, 0.55)',
    colorAfter: null,
    ionMetal: null
  },
  hot_water: {
    id: 'hot_water',
    category: 'water',
    name: { zh: '熱水 H₂O(l)', en: 'Hot water H₂O(l)' },
    color: 'rgba(186, 230, 253, 0.65)',
    colorAfter: null,
    ionMetal: null
  },
  steam: {
    id: 'steam',
    category: 'water',
    name: { zh: '水蒸氣 H₂O(g)', en: 'Steam H₂O(g)' },
    color: 'rgba(226, 232, 240, 0.45)',
    colorAfter: null,
    ionMetal: null
  },
  hcl: {
    id: 'hcl',
    category: 'acid',
    name: { zh: '稀鹽酸 HCl(aq)', en: 'Dilute hydrochloric acid HCl(aq)' },
    color: 'rgba(186, 230, 253, 0.42)',
    colorAfter: null,
    ionMetal: null,
    acidType: 'hcl'
  },
  h2so4: {
    id: 'h2so4',
    category: 'acid',
    name: { zh: '稀硫酸 H₂SO₄(aq)', en: 'Dilute sulphuric acid H₂SO₄(aq)' },
    color: 'rgba(186, 230, 253, 0.42)',
    colorAfter: null,
    ionMetal: null,
    acidType: 'h2so4'
  },
  cuso4: {
    id: 'cuso4',
    category: 'displacement',
    name: { zh: '硫酸銅(II) CuSO₄(aq)', en: 'Copper(II) sulphate CuSO₄(aq)' },
    color: 'rgba(37, 99, 235, 0.55)',
    colorAfter: 'rgba(186, 230, 253, 0.35)',
    ionMetal: 'Cu',
    depositColor: '#b87333'
  },
  agno3: {
    id: 'agno3',
    category: 'displacement',
    name: { zh: '硝酸銀 AgNO₃(aq)', en: 'Silver nitrate AgNO₃(aq)' },
    color: 'rgba(240, 249, 255, 0.45)',
    colorAfter: 'rgba(240, 249, 255, 0.45)',
    ionMetal: 'Ag',
    depositColor: '#c0c0c8'
  },
  znso4: {
    id: 'znso4',
    category: 'displacement',
    name: { zh: '硫酸鋅 ZnSO₄(aq)', en: 'Zinc sulphate ZnSO₄(aq)' },
    color: 'rgba(240, 249, 255, 0.45)',
    colorAfter: null,
    ionMetal: 'Zn',
    depositColor: null
  },
  feso4: {
    id: 'feso4',
    category: 'displacement',
    name: { zh: '硫酸鐵(II) FeSO₄(aq)', en: 'Iron(II) sulphate FeSO₄(aq)' },
    color: 'rgba(110, 231, 183, 0.75)',
    colorAfter: null,
    ionMetal: 'Fe',
    depositColor: null
  },
  pbno32: {
    id: 'pbno32',
    category: 'displacement',
    name: { zh: '硝酸鉛(II) Pb(NO₃)₂(aq)', en: 'Lead(II) nitrate Pb(NO₃)₂(aq)' },
    color: 'rgba(240, 249, 255, 0.45)',
    colorAfter: null,
    ionMetal: 'Pb',
    depositColor: null
  }
};

var SOLUTION_GROUPS = [
  { id: 'water', label: { zh: '水 / 水蒸氣', en: 'Water / Steam' }, ids: ['cold_water', 'hot_water', 'steam'] },
  { id: 'acid', label: { zh: '稀酸', en: 'Dilute acids' }, ids: ['hcl', 'h2so4'] },
  { id: 'displacement', label: { zh: '置換反應溶液', en: 'Displacement solutions' }, ids: ['cuso4', 'agno3', 'znso4', 'feso4', 'pbno32'] }
];

function getReactivityIndex(metalId) {
  return REACTIVITY_ORDER.indexOf(metalId);
}

function isMoreReactive(metalA, metalB) {
  return getReactivityIndex(metalA) < getReactivityIndex(metalB);
}

function getMetalLabel(metalId, lang) {
  var m = METALS[metalId];
  if (!m) return metalId;
  return m.name[lang] + ' (' + m.symbol + ')';
}

function getSolutionLabel(solutionId, lang) {
  var s = SOLUTIONS[solutionId];
  if (!s) return solutionId;
  return s.name[lang];
}
