// ==========================================
// Virtual Organic Chemistry Lab - Core Logic
// ==========================================

// Global Application State (Preset Language to English 'en')
let appState = {
  lang: 'en', // 'en' (default preset) or 'zh'
  mode: 'explore', // 'explore', 'draw'
  activeTab: 'structural', // 'structural' or 'skeletal'
  inspectingCarbonIndex: 0, // Current carbon being edited
  score: 0,
  f4Pool: [], // Pool of shuffled F4 question indices to ensure no repetition
  f56SpecificPool: [], // Pool of shuffled DSE specific question indices
  challengeGrade: 'DSE', // 'F4' or 'DSE'
  exploreSyllabus: 'DSE', // 'F4' or 'DSE' (F4 syllabus filters ester, aldehyde, ketone, amine, amide)

  
  // Viewport: auto-fit base × user zoom
  zoom: 1.0,
  panX: 0,
  panY: 0,
  userZoom: 0.7,
  fitScale: 1.0,
  fitMidX: 0,
  fitMidY: 0,
  
  // Current challenge question
  currentQuestion: null, 
  
  // Reference tables highlight info
  highlights: {
    stem: null, // 1 to 8
    branches: new Set(), // 'methyl', 'ethyl', 'propyl'
    homo: null, // 'carboxylic', 'alcohol', 'alkene', 'alkane'
    halogens: new Set() // 'F', 'Cl', 'Br', 'I'
  }
};

// Molecule Data Model (Default: Butane)
let molecule = {
  chainLength: 4,
  bonds: ['single', 'single', 'single'], // size: chainLength - 1
  carbons: [
    { top: 'H', bottom: 'H', left: 'H' },
    { top: 'H', bottom: 'H' },
    { top: 'H', bottom: 'H' },
    { top: 'H', bottom: 'H', right: 'H' }
  ]
};

// Available attachments definitions
const ATTACHMENT_OPTIONS = {
  top_bottom: [
    { value: 'none', en: 'None', zh: '無基團' },
    { value: 'H', en: 'H (Hydrogen)', zh: 'H (氫)' },
    { value: 'CH3', en: 'CH₃ (Methyl)', zh: 'CH₃ (甲基)' },
    { value: 'CH2CH3', en: 'CH₂CH₃ (Ethyl)', zh: 'CH₂CH₃ (乙基)' },
    { value: 'OH', en: '-OH (Hydroxyl)', zh: '-OH (羥基/醇)' },
    { value: 'O', en: '=O (Ketone)', zh: '=O (酮基/羰基)' },
    { value: 'NH2', en: '-NH₂ (Amine)', zh: '-NH₂ (胺基)' },
    { value: 'ester', en: '-COOR (Ester)', zh: '-COOR (酯基)' },
    { value: 'F', en: '-F (Fluoro)', zh: '-F (氟)' },
    { value: 'Cl', en: '-Cl (Chloro)', zh: '-Cl (氯)' },
    { value: 'Br', en: '-Br (Bromo)', zh: '-Br (溴)' },
    { value: 'I', en: '-I (Iodo)', zh: '-I (碘)' }
  ],
  // Shared by Left Attachment (C1) and Right Attachment (last C)
  left_right: [
    { value: 'none', en: 'None', zh: '無基團' },
    { value: 'H', en: 'H (Hydrogen)', zh: 'H (氫)' },
    { value: 'CH3', en: 'CH₃ (Methyl)', zh: 'CH₃ (甲基)' },
    { value: 'CH2CH3', en: 'CH₂CH₃ (Ethyl)', zh: 'CH₂CH₃ (乙基)' },
    { value: 'COOH', en: '-COOH (Carboxyl)', zh: '-COOH (羧基)' },
    { value: 'CHO', en: '-CHO (Aldehyde)', zh: '-CHO (醛基)' },
    { value: 'ester', en: '-COOR (Ester)', zh: '-COOR (酯基)' },
    { value: 'CONH2', en: '-CONH₂ (Amide)', zh: '-CONH₂ (酰胺基)' },
    { value: 'NH2', en: '-NH₂ (Amine)', zh: '-NH₂ (胺基)' },
    { value: 'OH', en: '-OH (Hydroxyl)', zh: '-OH (羥基/醇)' },
    { value: 'F', en: '-F (Fluoro)', zh: '-F (氟)' },
    { value: 'Cl', en: '-Cl (Chloro)', zh: '-Cl (氯)' },
    { value: 'Br', en: '-Br (Bromo)', zh: '-Br (溴)' },
    { value: 'I', en: '-I (Iodo)', zh: '-I (碘)' }
  ]
};

// ==========================================
// Presets and Challenge Bank
// ==========================================
// ==========================================
// Presets and Challenge Bank
// ==========================================
const PRESETS = {
  butane: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  isobutane: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  fluoroethane: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'F', bottom: 'H', right: 'H' }
    ]
  },
  chloropropane: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'Cl', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  bromopropane: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'Br' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  dimethylbutane: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  bromochlorobutane: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'Cl' },
      { top: 'H', bottom: 'H' },
      { top: 'Br', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  fluorodimethylbutane: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'F' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  ethanol: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H', right: 'OH' }
    ]
  },
  propanoic: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propane: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentane: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexane: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylpentane2: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  custom_methylpentane3: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  dimethylpropane22: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propene: {
    chainLength: 3,
    bonds: ['double', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentene1: {
    chainLength: 5,
    bonds: ['double', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentene2: {
    chainLength: 5,
    bonds: ['single', 'double', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylpropene2: {
    chainLength: 3,
    bonds: ['double', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylbutene31: {
    chainLength: 4,
    bonds: ['double', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propanol1: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'OH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanol1: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'OH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanol2: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'OH', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylpropanol21: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'OH' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methanoic: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH', right: 'H' }
    ]
  },
  ethanoic: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanoic: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylpropanoic2: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylbutanoic3: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'H', bottom: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylmethanoate: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH3', right: 'H' }
    ]
  },
  methylethanoate: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  ethylethanoate: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH2CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylpropanoate: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH3' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  ethylpropanoate: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH2CH3' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methanal: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO', right: 'H' }
    ]
  },
  ethanal: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propanal: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanal: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylpropanal2: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propanone: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'O', bottom: 'none' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanone2: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'O', bottom: 'none' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanone2: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'O', bottom: 'none' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanone3: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'O', bottom: 'none' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methanamide: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'CONH2', right: 'H' }
    ]
  },
  ethanamide: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CONH2' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propanamide: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CONH2' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanamide: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CONH2' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methanamine: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'NH2', right: 'H' }
    ]
  },
  ethanamine: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'NH2' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propanamine1: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'NH2' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propanamine2: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'NH2', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  chloromethane: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'Cl', right: 'H' }
    ]
  },
  fluoropropane1: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'F' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  bromobutane2: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'Br', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  chloromethylpropane22: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'Cl' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  heptane: {
    chainLength: 7,
    bonds: ['single', 'single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  octane: {
    chainLength: 8,
    bonds: ['single', 'single', 'single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylhexane2: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  dimethylbutane22: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'CH3', bottom: 'CH3' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  ethylpentane3: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'CH2CH3', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexene1: {
    chainLength: 6,
    bonds: ['double', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexene2: {
    chainLength: 6,
    bonds: ['single', 'double', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexene3: {
    chainLength: 6,
    bonds: ['single', 'single', 'double', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanol1: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'OH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanol2: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'OH', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanol3: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'OH', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexanol1: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'OH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  dimethylpropanol22: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'OH' },
      { top: 'CH3', bottom: 'CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexanoic: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  dimethylpropanoic22: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'COOH' },
      { top: 'CH3', bottom: 'CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  propylmethanoate: {
    chainLength: 1,
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH2CH2CH3', right: 'H' }
    ]
  },
  propylethanoate: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH2CH2CH3' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  methylbutanoate: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH3' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  ethylbutanoate: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'ester', left_esterR: 'CH2CH3' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanal: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexanal: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CHO' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexanone2: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'O', bottom: 'none' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexanone3: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'O', bottom: 'none' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  pentanamide: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CONH2' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  hexanamide: {
    chainLength: 6,
    bonds: ['single', 'single', 'single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'CONH2' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanamine1: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'NH2' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  butanamine2: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'NH2', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  iodoethane: {
    chainLength: 2,
    bonds: ['single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'I', bottom: 'H', right: 'H' }
    ]
  },
  iodopropane2: {
    chainLength: 3,
    bonds: ['single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'I', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  chlorobutane1: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'Cl' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  chlorobutane2: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'Cl', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  bromobutane1: {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'none', bottom: 'none', left: 'Br' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  bromopentane2: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'Br', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  },
  bromopentane3: {
    chainLength: 5,
    bonds: ['single', 'single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'Br', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  }
};

// Challenge Bank
const CHALLENGES = [
  { id: 'q1', name_en: 'butane', name_zh: '丁烷', preset: PRESETS.butane },
  { id: 'q2', name_en: 'methylpropane', name_zh: '甲基丙烷', preset: PRESETS.isobutane },
  { id: 'q3', name_en: 'fluoroethane', name_zh: '氟乙烷', preset: PRESETS.fluoroethane },
  { id: 'q4', name_en: '2-chloropropane', name_zh: '2-氯丙烷', preset: PRESETS.chloropropane },
  { id: 'q5', name_en: '1-bromopropane', name_zh: '1-溴丙烷', preset: PRESETS.bromopropane },
  { id: 'q6', name_en: '2,3-dimethylbutane', name_zh: '2,3-二甲基丁烷', preset: PRESETS.dimethylbutane },
  { id: 'q7', name_en: '3-bromo-1-chlorobutane', name_zh: '3-溴-1-氯丁烷', preset: PRESETS.bromochlorobutane },
  { id: 'q8', name_en: '1-fluoro-2,3-dimethylbutane', name_zh: '1-氟-2,3-二甲基丁烷', preset: PRESETS.fluorodimethylbutane },
  { id: 'q9', name_en: 'ethanol', name_zh: '乙醇', preset: PRESETS.ethanol },
  { id: 'q10', name_en: 'propanoic acid', name_zh: '丙酸', preset: PRESETS.propanoic },
  
  {
    id: 'q11',
    name_en: 'propan-2-ol',
    name_zh: '丙-2-醇',
    preset: {
      chainLength: 3,
      bonds: ['single', 'single'],
      carbons: [
        { top: 'H', bottom: 'H', left: 'H' },
        { top: 'OH', bottom: 'H' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  {
    id: 'q12',
    name_en: 'but-1-ene',
    name_zh: '丁-1-烯',
    preset: {
      chainLength: 4,
      bonds: ['double', 'single', 'single'],
      carbons: [
        { top: 'H', bottom: 'H', left: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  {
    id: 'q13',
    name_en: 'but-2-ene',
    name_zh: '丁-2-烯',
    preset: {
      chainLength: 4,
      bonds: ['single', 'double', 'single'],
      carbons: [
        { top: 'H', bottom: 'H', left: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  {
    id: 'q14',
    name_en: '2-methylbut-2-ene',
    name_zh: '2-甲基丁-2-烯',
    preset: {
      chainLength: 4,
      bonds: ['single', 'double', 'single'],
      carbons: [
        { top: 'H', bottom: 'H', left: 'H' },
        { top: 'CH3', bottom: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  {
    id: 'q15',
    name_en: '2-methylpropan-2-ol',
    name_zh: '2-甲基丙-2-醇',
    preset: {
      chainLength: 3,
      bonds: ['single', 'single'],
      carbons: [
        { top: 'H', bottom: 'H', left: 'H' },
        { top: 'CH3', bottom: 'OH' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  {
    id: 'q16',
    name_en: 'butanoic acid',
    name_zh: '丁酸',
    preset: {
      chainLength: 4,
      bonds: ['single', 'single', 'single'],
      carbons: [
        { top: 'none', bottom: 'none', left: 'COOH' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  {
    id: 'q17',
    name_en: '2-methylbutanoic acid',
    name_zh: '2-甲基丁酸',
    preset: {
      chainLength: 4,
      bonds: ['single', 'single', 'single'],
      carbons: [
        { top: 'none', bottom: 'none', left: 'COOH' },
        { top: 'CH3', bottom: 'H' },
        { top: 'H', bottom: 'H' },
        { top: 'H', bottom: 'H', right: 'H' }
      ]
    }
  },
  
  // Alkanes Variations
  { id: 'q18', name_en: 'propane', name_zh: '丙烷', preset: PRESETS.propane },
  { id: 'q19', name_en: 'pentane', name_zh: '戊烷', preset: PRESETS.pentane },
  { id: 'q20', name_en: 'hexane', name_zh: '己烷', preset: PRESETS.hexane },
  { id: 'q21', name_en: '2-methylpentane', name_zh: '2-甲基戊烷', preset: PRESETS.methylpentane2 },
  { id: 'q22', name_en: '3-methylpentane', name_zh: '3-甲基戊烷', preset: PRESETS.custom_methylpentane3 },
  { id: 'q23', name_en: '2,2-dimethylpropane', name_zh: '2,2-二甲基丙烷', preset: PRESETS.dimethylpropane22 },

  // Alkenes Variations
  { id: 'q24', name_en: 'propene', name_zh: '丙烯', preset: PRESETS.propene },
  { id: 'q25', name_en: 'pent-1-ene', name_zh: '戊-1-烯', preset: PRESETS.pentene1 },
  { id: 'q26', name_en: 'pent-2-ene', name_zh: '戊-2-烯', preset: PRESETS.pentene2 },
  { id: 'q27', name_en: '2-methylpropene', name_zh: '2-甲基丙烯', preset: PRESETS.methylpropene2 },
  { id: 'q28', name_en: '3-methylbut-1-ene', name_zh: '3-甲基丁-1-烯', preset: PRESETS.methylbutene31 },

  // Alcohols Variations
  { id: 'q29', name_en: 'propan-1-ol', name_zh: '丙-1-醇', preset: PRESETS.propanol1 },
  { id: 'q30', name_en: 'butan-1-ol', name_zh: '丁-1-醇', preset: PRESETS.butanol1 },
  { id: 'q31', name_en: 'butan-2-ol', name_zh: '丁-2-醇', preset: PRESETS.butanol2 },
  { id: 'q32', name_en: '2-methylpropan-1-ol', name_zh: '2-甲基丙-1-醇', preset: PRESETS.methylpropanol21 },

  // Carboxylic Acids Variations
  { id: 'q33', name_en: 'methanoic acid', name_zh: '甲酸', preset: PRESETS.methanoic },
  { id: 'q34', name_en: 'ethanoic acid', name_zh: '乙酸', preset: PRESETS.ethanoic },
  { id: 'q35', name_en: 'pentanoic acid', name_zh: '戊酸', preset: PRESETS.pentanoic },
  { id: 'q36', name_en: '2-methylpropanoic acid', name_zh: '2-甲基丙酸', preset: PRESETS.methylpropanoic2 },
  { id: 'q37', name_en: '3-methylbutanoic acid', name_zh: '3-甲基丁酸', preset: PRESETS.methylbutanoic3 },

  // Esters Variations
  { id: 'q38', name_en: 'methyl methanoate', name_zh: '甲酸甲酯', preset: PRESETS.methylmethanoate },
  { id: 'q39', name_en: 'methyl ethanoate', name_zh: '乙酸甲酯', preset: PRESETS.methylethanoate },
  { id: 'q40', name_en: 'ethyl ethanoate', name_zh: '乙酸乙酯', preset: PRESETS.ethylethanoate },
  { id: 'q41', name_en: 'methyl propanoate', name_zh: '丙酸甲酯', preset: PRESETS.methylpropanoate },
  { id: 'q42', name_en: 'ethyl propanoate', name_zh: '丙酸乙酯', preset: PRESETS.ethylpropanoate },

  // Aldehydes Variations
  { id: 'q43', name_en: 'methanal', name_zh: '甲醛', preset: PRESETS.methanal },
  { id: 'q44', name_en: 'ethanal', name_zh: '乙醛', preset: PRESETS.ethanal },
  { id: 'q45', name_en: 'propanal', name_zh: '丙醛', preset: PRESETS.propanal },
  { id: 'q46', name_en: 'butanal', name_zh: '丁醛', preset: PRESETS.butanal },
  { id: 'q47', name_en: '2-methylpropanal', name_zh: '2-甲基丙醛', preset: PRESETS.methylpropanal2 },

  // Ketones Variations
  { id: 'q48', name_en: 'propanone', name_zh: '丙酮', preset: PRESETS.propanone },
  { id: 'q49', name_en: 'butan-2-one', name_zh: '丁-2-酮', preset: PRESETS.butanone2 },
  { id: 'q50', name_en: 'pentan-2-one', name_zh: '戊-2-酮', preset: PRESETS.pentanone2 },
  { id: 'q51', name_en: 'pentan-3-one', name_zh: '戊-3-酮', preset: PRESETS.pentanone3 },

  // Amides Variations
  { id: 'q52', name_en: 'methanamide', name_zh: '甲酰胺', preset: PRESETS.methanamide },
  { id: 'q53', name_en: 'ethanamide', name_zh: '乙酰胺', preset: PRESETS.ethanamide },
  { id: 'q54', name_en: 'propanamide', name_zh: '丙酰胺', preset: PRESETS.propanamide },
  { id: 'q55', name_en: 'butanamide', name_zh: '丁酰胺', preset: PRESETS.butanamide },

  // Amines Variations
  { id: 'q56', name_en: 'methanamine', name_zh: '甲胺', preset: PRESETS.methanamine },
  { id: 'q57', name_en: 'ethanamine', name_zh: '乙胺', preset: PRESETS.ethanamine },
  { id: 'q58', name_en: 'propan-1-amine', name_zh: '丙-1-胺', preset: PRESETS.propanamine1 },
  { id: 'q59', name_en: 'propan-2-amine', name_zh: '丙-2-胺', preset: PRESETS.propanamine2 },

  // Halides Variations
  { id: 'q60', name_en: 'chloromethane', name_zh: '氯甲烷', preset: PRESETS.chloromethane },
  { id: 'q61', name_en: '1-fluoropropane', name_zh: '1-氟丙烷', preset: PRESETS.fluoropropane1 },
  { id: 'q62', name_en: '2-bromobutane', name_zh: '2-溴丁烷', preset: PRESETS.bromobutane2 },
  { id: 'q63', name_en: '2-chloro-2-methylpropane', name_zh: '2-氯-2-甲基丙烷', preset: PRESETS.chloromethylpropane22 },

  // Additional Alkanes
  { id: 'q64', name_en: 'heptane', name_zh: '庚烷', preset: PRESETS.heptane },
  { id: 'q65', name_en: 'octane', name_zh: '辛烷', preset: PRESETS.octane },
  { id: 'q66', name_en: '2-methylhexane', name_zh: '2-甲基己烷', preset: PRESETS.methylhexane2 },
  { id: 'q67', name_en: '2,2-dimethylbutane', name_zh: '2,2-二甲基丁烷', preset: PRESETS.dimethylbutane22 },
  { id: 'q68', name_en: '3-ethylpentane', name_zh: '3-乙基戊烷', preset: PRESETS.ethylpentane3 },

  // Additional Alkenes
  { id: 'q69', name_en: 'hex-1-ene', name_zh: '己-1-烯', preset: PRESETS.hexene1 },
  { id: 'q70', name_en: 'hex-2-ene', name_zh: '己-2-烯', preset: PRESETS.hexene2 },
  { id: 'q71', name_en: 'hex-3-ene', name_zh: '己-3-烯', preset: PRESETS.hexene3 },

  // Additional Alcohols
  { id: 'q72', name_en: 'pentan-1-ol', name_zh: '戊-1-醇', preset: PRESETS.pentanol1 },
  { id: 'q73', name_en: 'pentan-2-ol', name_zh: '戊-2-醇', preset: PRESETS.pentanol2 },
  { id: 'q74', name_en: 'pentan-3-ol', name_zh: '戊-3-醇', preset: PRESETS.pentanol3 },
  { id: 'q75', name_en: 'hexan-1-ol', name_zh: '己-1-醇', preset: PRESETS.hexanol1 },
  { id: 'q76', name_en: '2,2-dimethylpropan-1-ol', name_zh: '2,2-二甲基丙-1-醇', preset: PRESETS.dimethylpropanol22 },

  // Additional Carboxylic Acids
  { id: 'q77', name_en: 'hexanoic acid', name_zh: '己酸', preset: PRESETS.hexanoic },
  { id: 'q78', name_en: '2,2-dimethylpropanoic acid', name_zh: '2,2-二甲基丙酸', preset: PRESETS.dimethylpropanoic22 },

  // Additional Esters
  { id: 'q79', name_en: 'propyl methanoate', name_zh: '甲酸丙基酯', preset: PRESETS.propylmethanoate },
  { id: 'q80', name_en: 'propyl ethanoate', name_zh: '乙酸丙基酯', preset: PRESETS.propylethanoate },
  { id: 'q81', name_en: 'methyl butanoate', name_zh: '丁酸甲酯', preset: PRESETS.methylbutanoate },
  { id: 'q82', name_en: 'ethyl butanoate', name_zh: '丁酸乙酯', preset: PRESETS.ethylbutanoate },

  // Additional Aldehydes
  { id: 'q83', name_en: 'pentanal', name_zh: '戊醛', preset: PRESETS.pentanal },
  { id: 'q84', name_en: 'hexanal', name_zh: '己醛', preset: PRESETS.hexanal },

  // Additional Ketones
  { id: 'q85', name_en: 'hexan-2-one', name_zh: '己-2-酮', preset: PRESETS.hexanone2 },
  { id: 'q86', name_en: 'hexan-3-one', name_zh: '己-3-酮', preset: PRESETS.hexanone3 },

  // Additional Amides
  { id: 'q87', name_en: 'pentanamide', name_zh: '戊酰胺', preset: PRESETS.pentanamide },
  { id: 'q88', name_en: 'hexanamide', name_zh: '己酰胺', preset: PRESETS.hexanamide },

  // Additional Amines
  { id: 'q89', name_en: 'butan-1-amine', name_zh: '丁-1-胺', preset: PRESETS.butanamine1 },
  { id: 'q90', name_en: 'butan-2-amine', name_zh: '丁-2-胺', preset: PRESETS.butanamine2 },

  // Additional Halides
  { id: 'q91', name_en: 'iodoethane', name_zh: '碘乙烷', preset: PRESETS.iodoethane },
  { id: 'q92', name_en: '2-iodopropane', name_zh: '2-碘丙烷', preset: PRESETS.iodopropane2 },
  { id: 'q93', name_en: '1-chlorobutane', name_zh: '1-氯丁烷', preset: PRESETS.chlorobutane1 },
  { id: 'q94', name_en: '2-chlorobutane', name_zh: '2-氯丁烷', preset: PRESETS.chlorobutane2 },
  { id: 'q95', name_en: '1-bromobutane', name_zh: '1-溴丁烷', preset: PRESETS.bromobutane1 },
  { id: 'q96', name_en: '2-bromopentane', name_zh: '2-溴戊烷', preset: PRESETS.bromopentane2 },
  { id: 'q97', name_en: '3-bromopentane', name_zh: '3-溴戊烷', preset: PRESETS.bromopentane3 }
];

// ==========================================
// Initialization & Navigation
// ==========================================
const USER_ZOOM_MIN = 0.5;
const USER_ZOOM_MAX = 3.0;
const USER_ZOOM_STEP = 0.15;

function readHostUrlParams() {
  try {
    return new URLSearchParams(window.location.search);
  } catch (e) {
    return null;
  }
}

function applyEmbedModeFromUrl() {
  const params = readHostUrlParams();
  if (params && params.get('embed') === '1') {
    document.documentElement.classList.add('embed-mode');
  }
}

function resolveInitialLang() {
  const params = readHostUrlParams();
  const urlLang = params && params.get('lang');
  if (urlLang === 'en' || urlLang === 'zh') return urlLang;
  return 'en';
}

function initHostLangBridge() {
  window.addEventListener('message', function (event) {
    const data = event.data;
    if (data && data.type === 'uniplus:setLang' && (data.lang === 'en' || data.lang === 'zh')) {
      setLanguage(data.lang);
    }
  });
}

window.onload = function() {
  applyEmbedModeFromUrl();
  setLanguage(resolveInitialLang());
  initHostLangBridge();
  switchMode('explore');
  initFormulaZoomControls();
  updateUI();
};

/**
 * Store auto-fit base, then apply fitScale × userZoom (centered on molecule).
 */
function setFitViewport(fitScale, midX, midY) {
  appState.fitScale = fitScale;
  appState.fitMidX = midX;
  appState.fitMidY = midY;
  applyUserZoomToViewport();
}

function applyUserZoomToViewport() {
  const z = appState.fitScale * appState.userZoom;
  appState.zoom = z;
  appState.panX = 400 - z * appState.fitMidX;
  appState.panY = 145 - z * appState.fitMidY;
  applyViewportTransform();
  updateZoomLabel();
}

/**
 * Apply translate/scale onto viewport groups
 */
function applyViewportTransform() {
  const gStructural = document.getElementById('viewport-structural');
  const gSkeletal = document.getElementById('viewport-skeletal');
  
  const transformStr = `translate(${appState.panX}, ${appState.panY}) scale(${appState.zoom})`;
  
  if (gStructural) gStructural.setAttribute('transform', transformStr);
  if (gSkeletal) gSkeletal.setAttribute('transform', transformStr);
}

function clampUserZoom(z) {
  return Math.min(USER_ZOOM_MAX, Math.max(USER_ZOOM_MIN, z));
}

function setUserZoom(z) {
  appState.userZoom = clampUserZoom(z);
  applyUserZoomToViewport();
}

function zoomIn() {
  setUserZoom(appState.userZoom + USER_ZOOM_STEP);
}

function zoomOut() {
  setUserZoom(appState.userZoom - USER_ZOOM_STEP);
}

function resetZoom() {
  setUserZoom(0.7);
}

function updateZoomLabel() {
  const label = document.getElementById('zoom-level-label');
  if (label) label.textContent = `${Math.round(appState.userZoom * 100)}%`;
  const btnIn = document.getElementById('btn-zoom-in');
  const btnOut = document.getElementById('btn-zoom-out');
  if (btnIn) btnIn.disabled = appState.userZoom >= USER_ZOOM_MAX - 1e-6;
  if (btnOut) btnOut.disabled = appState.userZoom <= USER_ZOOM_MIN + 1e-6;
}

function initFormulaZoomControls() {
  const area = document.querySelector('.formula-render-area');
  if (!area) return;

  area.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -USER_ZOOM_STEP : USER_ZOOM_STEP;
    setUserZoom(appState.userZoom + delta);
  }, { passive: false });

  updateZoomLabel();
}

function setLanguage(lang) {
  appState.lang = lang;
  document.documentElement.setAttribute('lang', lang);
  
  // Update active state in buttons
  document.getElementById('btn-lang-zh').classList.toggle('active', lang === 'zh');
  document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');
  
  // Re-render components with language changes
  renderInspector();
  updateNomenclature();
}

function switchMode(mode) {
  appState.mode = mode;
  
  document.getElementById('nav-explore').classList.toggle('active', mode === 'explore');
  document.getElementById('nav-draw').classList.toggle('active', mode === 'draw');
  
  const quizPromptCard = document.getElementById('quiz-prompt-card');
  const drawChallengeActions = document.getElementById('draw-challenge-actions');
  const namingExplanationSection = document.getElementById('naming-explanation-section');
  const nomenclatureCard = document.getElementById('nomenclature-card');
  const challengeGradeSelector = document.getElementById('challenge-grade-selector');
  const exploreSyllabusSelector = document.getElementById('explore-syllabus-selector');
  
  if (mode === 'explore') {
    quizPromptCard.classList.add('hidden');
    drawChallengeActions.classList.add('hidden');
    namingExplanationSection.classList.remove('hidden');
    nomenclatureCard.classList.remove('hidden');
    if (challengeGradeSelector) challengeGradeSelector.classList.add('hidden');
    if (exploreSyllabusSelector) exploreSyllabusSelector.classList.remove('hidden');
  } else if (mode === 'draw') {
    quizPromptCard.classList.remove('hidden');
    drawChallengeActions.classList.remove('hidden');
    namingExplanationSection.classList.add('hidden');
    nomenclatureCard.classList.add('hidden');
    if (challengeGradeSelector) challengeGradeSelector.classList.remove('hidden');
    if (exploreSyllabusSelector) exploreSyllabusSelector.classList.add('hidden');
    startNewChallenge();
  }
  
  updateUI();
}

function switchFormulaTab(tab) {
  appState.activeTab = tab;
  document.getElementById('tab-structural').classList.toggle('active', tab === 'structural');
  document.getElementById('tab-skeletal').classList.toggle('active', tab === 'skeletal');
  
  document.getElementById('container-structural').classList.toggle('hidden', tab !== 'structural');
  document.getElementById('container-skeletal').classList.toggle('hidden', tab !== 'skeletal');
  
  updateUI();
}

// ==========================================
// Chemical Graph Parsing & IUPAC Nomenclature Engine
// ==========================================

function buildCarbonGraph() {
  let nodes = []; 
  let adj = {}; 
  let originalMapping = {}; 
  
  for (let i = 0; i < molecule.chainLength; i++) {
    let id = `C_${i}`;
    nodes.push({ id: id, type: 'chain', chainIdx: i });
    adj[id] = [];
    originalMapping[id] = { type: 'chain', chainIdx: i };
  }
  
  for (let i = 0; i < molecule.chainLength - 1; i++) {
    let u = `C_${i}`;
    let v = `C_${i+1}`;
    adj[u].push(v);
    adj[v].push(u);
  }
  
  for (let i = 0; i < molecule.chainLength; i++) {
    let c = molecule.carbons[i];
    let parentId = `C_${i}`;
    
    let slots = ['top', 'bottom'];
    if (i === 0) slots.push('left');
    if (i === molecule.chainLength - 1) slots.push('right');
    
    slots.forEach(slot => {
      let val = c[slot];
      if (val === 'CH3') {
        let branchId = `M_${slot}_${i}`;
        nodes.push({ id: branchId, type: 'methyl', parentIdx: i });
        adj[branchId] = [parentId];
        adj[parentId].push(branchId);
        originalMapping[branchId] = { type: `methyl_${slot}`, chainIdx: i };
      } else if (val === 'CH2CH3') {
        let eth1Id = `E1_${slot}_${i}`;
        let eth2Id = `E2_${slot}_${i}`;
        
        nodes.push({ id: eth1Id, type: 'ethyl_1', parentIdx: i });
        nodes.push({ id: eth2Id, type: 'ethyl_2', parentIdx: i });
        
        adj[eth1Id] = [parentId, eth2Id];
        adj[parentId].push(eth1Id);
        adj[eth2Id] = [eth1Id];
        
        originalMapping[eth1Id] = { type: `ethyl_1_${slot}`, chainIdx: i };
        originalMapping[eth2Id] = { type: `ethyl_2_${slot}`, chainIdx: i };
      }
    });
  }
  
  let carboxylC = null;
  if (molecule.chainLength >= 1) {
    const c0 = molecule.carbons[0];
    const lastIdx = molecule.chainLength - 1;
    const cLast = molecule.carbons[lastIdx];
    
    function getGroupPriority(val) {
      if (val === 'COOH') return 1;
      if (['COOCH3', 'COOCH2CH3', 'ester'].includes(val)) return 2;
      if (val === 'CONH2') return 3;
      if (val === 'CHO') return 4;
      return 999;
    }
    
    let p0 = 999;
    ['left', 'top', 'bottom'].forEach(s => {
      p0 = Math.min(p0, getGroupPriority(c0[s]));
    });
    
    let pLast = 999;
    if (lastIdx > 0) {
      ['right', 'top', 'bottom'].forEach(s => {
        pLast = Math.min(pLast, getGroupPriority(cLast[s]));
      });
    }
    
    if (p0 !== 999 || pLast !== 999) {
      if (p0 <= pLast) {
        carboxylC = 'C_0';
      } else {
        carboxylC = `C_${lastIdx}`;
      }
    }
  }
  
  return { nodes, adj, carboxylC, originalMapping };
}

function findAllPaths(adj) {
  let paths = [];
  let visited = {};
  
  function dfs(curr, currentPath) {
    paths.push([...currentPath]);
    for (let neighbor of adj[curr]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        currentPath.push(neighbor);
        dfs(neighbor, currentPath);
        currentPath.pop();
        visited[neighbor] = false;
      }
    }
  }
  
  for (let startNode in adj) {
    visited[startNode] = true;
    dfs(startNode, [startNode]);
    visited[startNode] = false;
  }
  
  return paths;
}

function getNodeNaturalIndex(node) {
  if (!node) return 999;
  if (node.startsWith('C_')) return parseInt(node.split('_')[1], 10);
  if (node.startsWith('M_')) return parseInt(node.split('_')[2], 10);
  if (node.startsWith('E1_')) return parseInt(node.split('_')[2], 10);
  if (node.startsWith('E2_')) return parseInt(node.split('_')[2], 10);
  return 999;
}

// ==========================================
// Ester R Group & Subscript Helpers
// ==========================================
function getEsterR(c, slot) {
  const val = c[slot];
  if (val === 'COOCH3') return 'CH3';
  if (val === 'COOCH2CH3') return 'CH2CH3';
  if (val === 'ester') return c[slot + '_esterR'] || 'CH3';
  return null;
}

function countCarbonsInFormula(str) {
  if (!str) return 0;
  const matches = str.match(/C\d*/g);
  if (!matches) return 0;
  let count = 0;
  matches.forEach(m => {
    if (m === 'C') {
      count += 1;
    } else {
      count += parseInt(m.substring(1), 10) || 1;
    }
  });
  return count;
}

function getEsterRName(rGroup) {
  const cCount = countCarbonsInFormula(rGroup);
  const stemsEn = { 1: 'methyl', 2: 'ethyl', 3: 'propyl', 4: 'butyl', 5: 'pentyl', 6: 'hexyl', 7: 'heptyl', 8: 'octyl' };
  const stemsZh = { 1: '甲', 2: '乙', 3: '丙', 4: '丁', 5: '戊', 6: '己', 7: '庚', 8: '辛' };
  
  if (cCount >= 1 && cCount <= 8) {
    return {
      en: stemsEn[cCount],
      zh: stemsZh[cCount]
    };
  }
  
  return {
    en: rGroup.toLowerCase(),
    zh: rGroup
  };
}

function formatSubscripts(str) {
  if (!str) return '';
  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return str.replace(/\d/g, m => subscripts[m] || m);
}

/** Methyl/ethyl/… label oriented so the bond attaches at the carbon, not the subscript. */
function alkylLabelForBondDirection(rGroup, ux, uy) {
  const r = String(rGroup || 'CH3').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)]);
  const toLeft = ux < -0.1;
  if (r === 'CH3' || r === 'H3C') return toLeft ? 'H₃C' : 'CH₃';

  // Parse number of C's and H's
  let numC = 0;
  let numH = 0;
  const matches = r.match(/C\d*|H\d*/g);
  if (matches) {
    matches.forEach(m => {
      if (m.startsWith('C')) {
        const val = m.substring(1);
        numC += val ? parseInt(val, 10) : 1;
      } else if (m.startsWith('H')) {
        const val = m.substring(1);
        numH += val ? parseInt(val, 10) : 1;
      }
    });
  }

  if (numC >= 2) {
    if (toLeft) {
      return formatSubscripts(`H${numH}C${numC}`);
    } else {
      return formatSubscripts(`C${numC}H${numH}`);
    }
  }

  // Longer chains fallback: reverse segment order when label sits to the left of the bond
  const segs = r.match(/CH3|CH2|CH/g);
  if (segs && segs.length && toLeft) {
    const rev = segs.slice().reverse();
    if (rev[0] === 'CH3') rev[0] = 'H3C';
    return formatSubscripts(rev.join(''));
  }
  return formatSubscripts(r);
}

/** Resolve any raw / preformatted alkyl (or NH₂) label for structural drawing. */
function structuralAlkylLabel(rGroupOrLabel, ux, uy) {
  const s = String(rGroupOrLabel || 'CH3');
  if (s === 'NH2' || s === 'NH₂') return 'NH₂';
  // Strip subscripts to detect raw formula
  const raw = s.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)])
    .replace(/^H3CCH2/, 'CH2CH3').replace(/^H3C/, 'CH3');
  if (/^C/.test(raw) || raw === 'CH3' || raw.startsWith('CH2')) {
    return alkylLabelForBondDirection(raw, ux, uy);
  }
  return formatSubscripts(s);
}

function getIUPACName() {
  const graph = buildCarbonGraph();
  const allPaths = findAllPaths(graph.adj);

  // Scan the molecule for all functional groups to find the highest priority one
  let hasAcid = false;
  let hasEster = false;
  let esterType = null; // R-group formula e.g. 'CH3'
  let hasAmide = false;
  let hasAldehyde = false;
  
  let ketoneCarbons = [];
  let alcoholCarbons = [];
  let amineCarbons = [];
  const ESTER_VALUES = ['COOCH3', 'COOCH2CH3', 'ester'];
  let esterSites = []; // { node, slot, isTerminal, rGroup }
  
  for (let i = 0; i < molecule.chainLength; i++) {
    let c = molecule.carbons[i];
    const node = `C_${i}`;
    
    // Check left/right terminal slots
    if (i === 0) {
      if (c.left === 'COOH') hasAcid = true;
      if (ESTER_VALUES.includes(c.left)) {
        esterSites.push({ node, slot: 'left', isTerminal: true, rGroup: getEsterR(c, 'left') });
      }
      if (c.left === 'CONH2') hasAmide = true;
      if (c.left === 'CHO') hasAldehyde = true;
      if (c.left === 'OH') alcoholCarbons.push(node);
      if (c.left === 'NH2') amineCarbons.push(node);
    }
    if (i === molecule.chainLength - 1) {
      if (c.right === 'COOH') hasAcid = true;
      if (ESTER_VALUES.includes(c.right)) {
        esterSites.push({ node, slot: 'right', isTerminal: true, rGroup: getEsterR(c, 'right') });
      }
      if (c.right === 'CONH2') hasAmide = true;
      if (c.right === 'CHO') hasAldehyde = true;
      if (c.right === 'OH') alcoholCarbons.push(node);
      if (c.right === 'NH2') amineCarbons.push(node);
    }
    
    // Check top/bottom slots (side-chain ester / ketone / alcohol / amine)
    if (c.top === 'O') {
      if (i === 0 || i === molecule.chainLength - 1) {
        hasAldehyde = true;
      } else {
        ketoneCarbons.push(node);
      }
    }
    if (c.bottom === 'O') {
      if (i === 0 || i === molecule.chainLength - 1) {
        hasAldehyde = true;
      } else {
        ketoneCarbons.push(node);
      }
    }
    if (c.top === 'OH') alcoholCarbons.push(node);
    if (c.bottom === 'OH') alcoholCarbons.push(node);
    if (c.top === 'NH2') amineCarbons.push(node);
    if (c.bottom === 'NH2') amineCarbons.push(node);
    if (ESTER_VALUES.includes(c.top)) {
      esterSites.push({ node, slot: 'top', isTerminal: (i === 0 || i === molecule.chainLength - 1), rGroup: getEsterR(c, 'top') });
    }
    if (ESTER_VALUES.includes(c.bottom)) {
      esterSites.push({ node, slot: 'bottom', isTerminal: (i === 0 || i === molecule.chainLength - 1), rGroup: getEsterR(c, 'bottom') });
    }
  }

  hasEster = esterSites.length > 0;

  // Choose principal ester site: prefer terminal; else longest acyl chain from attach carbon
  let principalEster = null;
  let isSideChainEsterPFG = false;
  if (hasEster) {
    const terminalSites = esterSites.filter(e => e.isTerminal);
    if (terminalSites.length > 0) {
      principalEster = terminalSites[0];
    } else {
      let best = null;
      let bestLen = -1;
      esterSites.forEach(site => {
        let maxLen = 0;
        allPaths.forEach(p => {
          if (p[0] === site.node || p[p.length - 1] === site.node) {
            maxLen = Math.max(maxLen, p.length);
          }
        });
        if (maxLen > bestLen) {
          bestLen = maxLen;
          best = site;
        }
      });
      principalEster = best || esterSites[0];
    }
    esterType = principalEster.rGroup || 'CH3';
  }

  // Determine Principal Functional Group (PFG) priority
  let pfg = 'alkane';
  if (hasAcid) pfg = 'acid';
  else if (hasEster) pfg = 'ester';
  else if (hasAmide) pfg = 'amide';
  else if (hasAldehyde) pfg = 'aldehyde';
  else if (ketoneCarbons.length > 0) pfg = 'ketone';
  else if (alcoholCarbons.length > 0) pfg = 'alcohol';
  else if (amineCarbons.length > 0) pfg = 'amine';
  else if (molecule.bonds.includes('double')) pfg = 'alkene';

  isSideChainEsterPFG = (pfg === 'ester' && principalEster && !principalEster.isTerminal);

  // Find the highest priority terminal group carbon for path filtering
  let terminalGroupC = null;
  let c0 = molecule.carbons[0];
  let lastIdx = molecule.chainLength - 1;
  let cLast = molecule.carbons[lastIdx];
  
  const terminalPriorities = [
    { type: 'acid', values: ['COOH'] },
    { type: 'ester', values: ESTER_VALUES },
    { type: 'amide', values: ['CONH2'] },
    { type: 'aldehyde', values: ['CHO'] }
  ];
  
  for (let p of terminalPriorities) {
    if (p.type === 'ester' && isSideChainEsterPFG) continue; // side-chain ester handled below
    let hasLeft = p.values.includes(c0.left);
    let hasRight = lastIdx >= 0 && p.values.includes(cLast.right);
    if (p.type === 'aldehyde') {
      if (c0.top === 'O' || c0.bottom === 'O') hasLeft = true;
      if (cLast && (cLast.top === 'O' || cLast.bottom === 'O')) hasRight = true;
    }
    if (p.type === 'ester') {
      if (ESTER_VALUES.includes(c0.top) || ESTER_VALUES.includes(c0.bottom)) hasLeft = true;
      if (cLast && (ESTER_VALUES.includes(cLast.top) || ESTER_VALUES.includes(cLast.bottom))) hasRight = true;
    }
    if (hasLeft && hasRight) {
      terminalGroupC = 'both';
      break;
    } else if (hasLeft) {
      terminalGroupC = 'C_0';
      break;
    } else if (hasRight) {
      terminalGroupC = `C_${lastIdx}`;
      break;
    }
  }

  // Filter paths so they start/end at the terminal group carbon / side-chain ester attach
  let candidatePaths = allPaths.filter(path => {
    if (isSideChainEsterPFG) {
      const attach = principalEster.node;
      return path[0] === attach || path[path.length - 1] === attach;
    }
    if (terminalGroupC) {
      if (terminalGroupC === 'both') {
        return (path[0] === 'C_0' && path[path.length - 1] === `C_${lastIdx}`) ||
               (path[0] === `C_${lastIdx}` && path[path.length - 1] === 'C_0');
      } else {
        if (path[0] !== terminalGroupC && path[path.length - 1] !== terminalGroupC) return false;
      }
    }
    return true;
  });
  
  if (candidatePaths.length === 0) candidatePaths = allPaths;
  
  function forEachAttachment(chainIdx, c, fn) {
    fn(c.top, 'top');
    fn(c.bottom, 'bottom');
    if (chainIdx === 0) fn(c.left, 'left');
    if (chainIdx === molecule.chainLength - 1) fn(c.right, 'right');
  }

  function getPathStats(path) {
    let ohInPath = path.filter(node => alcoholCarbons.includes(node)).length;
    let dbInPath = 0;
    for (let i = 0; i < path.length - 1; i++) {
      let u = path[i], v = path[i+1];
      if (u.startsWith('C_') && v.startsWith('C_')) {
        let idxU = parseInt(u.split('_')[1]);
        let idxV = parseInt(v.split('_')[1]);
        if (molecule.bonds[Math.min(idxU, idxV)] === 'double') dbInPath++;
      }
    }
    let pathSet = new Set(path);
    let subCount = 0;
    path.forEach(node => {
      for (let neighbor of graph.adj[node]) if (!pathSet.has(neighbor)) subCount++;
      if (node.startsWith('C_')) {
        let idx = parseInt(node.split('_')[1]);
        let c = molecule.carbons[idx];
        forEachAttachment(idx, c, (g, slot) => {
          if (['F', 'Cl', 'Br', 'I'].includes(g)) subCount++;
          if (g === 'OH' && pfg !== 'alcohol') subCount++;
          if (g === 'NH2' && pfg !== 'amine') subCount++;
          if (g === 'O' && pfg !== 'ketone') {
            const isTerminalAldehyde = (idx === 0 || idx === molecule.chainLength - 1) && pfg === 'aldehyde';
            if (!isTerminalAldehyde) subCount++;
          }
        });
      }
    });
    return {
      length: path.length,
      hasTerminalGroup: (terminalGroupC && (path[0] === terminalGroupC || path[path.length - 1] === terminalGroupC || terminalGroupC === 'both')) ? 1 : 0,
      ohCount: ohInPath,
      dbCount: dbInPath,
      subCount: subCount
    };
  }
  
  candidatePaths.sort((a, b) => {
    let statsA = getPathStats(a), statsB = getPathStats(b);
    if (statsA.hasTerminalGroup !== statsB.hasTerminalGroup) return statsB.hasTerminalGroup - statsA.hasTerminalGroup;
    if (statsA.ohCount !== statsB.ohCount) return statsB.ohCount - statsA.ohCount;
    if (statsA.dbCount !== statsB.dbCount) return statsB.dbCount - statsA.dbCount;
    if (statsA.length !== statsB.length) return statsB.length - statsA.length;
    return statsB.subCount - statsA.subCount;
  });
  
  let mainChain = candidatePaths[0] || ['C_0'];
  // Side-chain ester PFG: acyl chain starts at attach carbon (= C2); virtual carbonyl = C1
  if (isSideChainEsterPFG) {
    if (mainChain[mainChain.length - 1] === principalEster.node) {
      mainChain = [...mainChain].reverse();
    }
  }
  let L = isSideChainEsterPFG ? mainChain.length + 1 : mainChain.length;

  const ALKYL_NAMES = {
    1: { en: 'methyl', zh: '甲基' },
    2: { en: 'ethyl', zh: '乙基' },
    3: { en: 'propyl', zh: '丙基' },
    4: { en: 'butyl', zh: '丁基' },
    5: { en: 'pentyl', zh: '戊基' },
    6: { en: 'hexyl', zh: '己基' }
  };

  function classifyOffPathAlkyl(startNode, parentOnPath, pathSet) {
    let carbonCount = 0;
    const visited = new Set([parentOnPath]);
    function dfs(node) {
      if (visited.has(node) || pathSet.has(node)) return;
      visited.add(node);
      if (
        node.startsWith('C_') ||
        node.startsWith('M_') ||
        node.startsWith('E1_') ||
        node.startsWith('E2_')
      ) {
        carbonCount++;
      }
      for (let n of graph.adj[node] || []) dfs(n);
    }
    dfs(startNode);
    return ALKYL_NAMES[carbonCount] || null;
  }

  function collectAlkylSubstituentFromNeighbor(neighbor, parentNode, pathSet, locant, sink) {
    if (pathSet.has(neighbor)) return;
    if (neighbor.startsWith('M_')) {
      sink.push({ locant, name_en: 'methyl', name_zh: '甲基' });
    } else if (neighbor.startsWith('E1_')) {
      sink.push({ locant, name_en: 'ethyl', name_zh: '乙基' });
    } else if (neighbor.startsWith('C_')) {
      const alkyl = classifyOffPathAlkyl(neighbor, parentNode, pathSet);
      if (alkyl) sink.push({ locant, name_en: alkyl.en, name_zh: alkyl.zh });
    }
  }
  
  let orderA = [...mainChain], orderB = [...mainChain].reverse();
  
  function isPrincipalEsterAttachment(node, slot) {
    return principalEster && pfg === 'ester' && node === principalEster.node && slot === principalEster.slot;
  }

  function locantOf(idx) {
    // Side-chain ester: virtual carbonyl = C1, attach carbon = C2, …
    return isSideChainEsterPFG ? idx + 2 : idx + 1;
  }
  
  function evaluateDirection(order) {
    let score = { pfgAtStart: 0, pfgLocants: [], dbLocants: [], subLocants: [] };
    
    if (isSideChainEsterPFG) {
      score.pfgAtStart = (order[0] === principalEster.node) ? 1 : 0;
    } else if (['acid', 'ester', 'amide', 'aldehyde'].includes(pfg)) {
      let leftHasPfg = (c0.left === 'COOH' || ESTER_VALUES.includes(c0.left) || c0.left === 'CONH2' || c0.left === 'CHO');
      if (pfg === 'aldehyde' && (c0.top === 'O' || c0.bottom === 'O')) {
        leftHasPfg = true;
      }
      if (pfg === 'ester' && principalEster && principalEster.isTerminal) {
        leftHasPfg = (principalEster.node === 'C_0');
      }
      let targetNode = leftHasPfg ? 'C_0' : `C_${lastIdx}`;
      score.pfgAtStart = (order[0] === targetNode) ? 1 : 0;
    }
    
    order.forEach((node, idx) => {
      let locant = locantOf(idx);
      if (pfg === 'ketone' && ketoneCarbons.includes(node)) score.pfgLocants.push(locant);
      if (pfg === 'alcohol' && alcoholCarbons.includes(node)) score.pfgLocants.push(locant);
      if (pfg === 'amine' && amineCarbons.includes(node)) score.pfgLocants.push(locant);
    });
    score.pfgLocants.sort((x, y) => x - y);
    
    for (let idx = 0; idx < order.length - 1; idx++) {
      let u = order[idx], v = order[idx+1];
      if (u.startsWith('C_') && v.startsWith('C_')) {
        let idxU = parseInt(u.split('_')[1]), idxV = parseInt(v.split('_')[1]);
        if (molecule.bonds[Math.min(idxU, idxV)] === 'double') score.dbLocants.push(locantOf(idx));
      }
    }
    score.dbLocants.sort((x, y) => x - y);
    
    let pathSet = new Set(order);
    order.forEach((node, idx) => {
      let locant = locantOf(idx);
      for (let neighbor of graph.adj[node]) {
        if (!pathSet.has(neighbor)) {
          if (neighbor.startsWith('M_') || neighbor.startsWith('E1_') || neighbor.startsWith('C_')) {
            score.subLocants.push(locant);
          }
        }
      }
      if (node.startsWith('C_')) {
        let chainIdx = parseInt(node.split('_')[1]);
        let c = molecule.carbons[chainIdx];
        forEachAttachment(chainIdx, c, (g, slot) => {
          if (['F', 'Cl', 'Br', 'I'].includes(g)) score.subLocants.push(locant);
          if (g === 'OH' && pfg !== 'alcohol') score.subLocants.push(locant);
          if (g === 'NH2' && pfg !== 'amine') score.subLocants.push(locant);
          if (g === 'O' && pfg !== 'ketone') {
            const isTerminalAldehyde = (chainIdx === 0 || chainIdx === molecule.chainLength - 1) && pfg === 'aldehyde';
            if (!isTerminalAldehyde) score.subLocants.push(locant);
          }
          if (ESTER_VALUES.includes(g) && !isPrincipalEsterAttachment(node, slot)) {
            score.subLocants.push(locant);
          }
        });
      }
    });
    score.subLocants.sort((x, y) => x - y);
    return score;
  }
  
  let scoreA = evaluateDirection(orderA), scoreB = evaluateDirection(orderB);
  let winningOrder = orderA, numberingReason = '', numberingReasonEn = '';
  
  if (isSideChainEsterPFG) {
    winningOrder = (scoreA.pfgAtStart >= scoreB.pfgAtStart) ? orderA : orderB;
    numberingReason = '酯基為主要官能基：羰基碳為 1 號，接有酯基的碳為 2 號，沿最長酰基碳鏈編號。';
    numberingReasonEn = 'Ester is the principal group: the carbonyl carbon is C1, the attachment carbon is C2, and numbering follows the longest acyl chain.';
  } else if (['acid', 'ester', 'amide', 'aldehyde'].includes(pfg)) {
    let hasTerminalCho = (c0.left === 'CHO' || (cLast && cLast.right === 'CHO'));
    let groupNames = {
      acid: '羧酸 (-COOH)',
      ester: '酯 (-COOR)',
      amide: '酰胺 (-CONH2)',
      aldehyde: '醛 (-CHO)'
    };
    let groupNamesEn = {
      acid: 'carboxylic acid (-COOH)',
      ester: 'ester (-COOR)',
      amide: 'amide (-CONH2)',
      aldehyde: 'aldehyde (-CHO)'
    };
    if (scoreA.pfgAtStart > scoreB.pfgAtStart) {
      winningOrder = orderA;
      numberingReason = `因為含有${groupNames[pfg]}基團，其官能基碳必須為 1 號碳，因此編號從左至右開始。`;
      numberingReasonEn = `Since the molecule is a ${groupNamesEn[pfg]}, the functional carbon must be Carbon 1, so numbering starts from the left end.`;
    } else {
      winningOrder = orderB;
      numberingReason = `因為含有${groupNames[pfg]}基團，其官能基碳必須為 1 號碳，因此編號由右至左開始。`;
      numberingReasonEn = `Since the molecule is a ${groupNamesEn[pfg]}, the functional carbon must be Carbon 1, so numbering starts from the right end.`;
    }
  } else {
    let comparePFG = compareLocantSets(scoreA.pfgLocants, scoreB.pfgLocants);
    if (comparePFG !== 0) {
      winningOrder = (comparePFG < 0) ? orderA : orderB;
      let dirText = (comparePFG < 0) ? '左起' : '右起';
      let dirTextEn = (comparePFG < 0) ? 'left-to-right' : 'right-to-left';
      let pfgNames = { ketone: '酮基 (=O)', alcohol: '醇羥基 (-OH)', amine: '胺基 (-NH2)' };
      let pfgNamesEn = { ketone: 'ketone (=O)', alcohol: 'hydroxyl (-OH)', amine: 'amine (-NH2)' };
      numberingReason = `依主要官能基最低編號原則，${pfgNames[pfg]}在「${dirText}」編號時位置較低（${(comparePFG < 0) ? scoreA.pfgLocants.join(',') : scoreB.pfgLocants.join(',')}），故選擇此方向。`;
      numberingReasonEn = `By principal group priority, the ${pfgNamesEn[pfg]} gets lower locants in ${dirTextEn} numbering (${(comparePFG < 0) ? scoreA.pfgLocants.join(',') : scoreB.pfgLocants.join(',')}).`;
    } else {
      let compareDB = compareLocantSets(scoreA.dbLocants, scoreB.dbLocants);
      if (compareDB !== 0) {
        winningOrder = (compareDB < 0) ? orderA : orderB;
        let dirText = (compareDB < 0) ? '左起' : '右起';
        let dirTextEn = (compareDB < 0) ? 'left-to-right' : 'right-to-left';
        numberingReason = `依最低編號原則，雙鍵 (C=C) 在「${dirText}」編號時位置較低（${(compareDB < 0) ? scoreA.dbLocants.join(',') : scoreB.dbLocants.join(',')}），故選擇此方向。`;
        numberingReasonEn = `By lowest locant rule, double bonds (C=C) get lower locants in ${dirTextEn} numbering (${(compareDB < 0) ? scoreA.dbLocants.join(',') : scoreB.dbLocants.join(',')}).`;
      } else {
        let compareSub = compareLocantSets(scoreA.subLocants, scoreB.subLocants);
        if (compareSub !== 0) {
          winningOrder = (compareSub < 0) ? orderA : orderB;
          let dirText = (compareSub < 0) ? '左起' : '右起';
          let dirTextEn = (compareSub < 0) ? 'left-to-right' : 'right-to-left';
          numberingReason = `依取代基最低編號原則，「${dirText}」編號時取代基位置集為 [${(compareSub < 0) ? scoreA.subLocants.join(',') : scoreB.subLocants.join(',')}]，比對手方向更低，故選此方向。`;
          numberingReasonEn = `By lowest locant rule of all substituents, ${dirTextEn} numbering yields a lower set [${(compareSub < 0) ? scoreA.subLocants.join(',') : scoreB.subLocants.join(',')}].`;
        } else {
          winningOrder = orderA; 
          numberingReason = '分子結構兩端完全對稱。預設從左至右編號。';
          numberingReasonEn = 'The molecule is completely symmetrical. Defaulting to left-to-right numbering.';
        }
      }
    }
  }
  
  let substituents = [];
  let pathSet = new Set(winningOrder);
  
  winningOrder.forEach((node, idx) => {
    let locant = locantOf(idx);
    for (let neighbor of graph.adj[node]) {
      collectAlkylSubstituentFromNeighbor(neighbor, node, pathSet, locant, substituents);
    }
    if (node.startsWith('C_')) {
      let chainIdx = parseInt(node.split('_')[1]);
      let c = molecule.carbons[chainIdx];
      forEachAttachment(chainIdx, c, (g, slot) => {
        if (g === 'F') substituents.push({ locant, name_en: 'fluoro', name_zh: '氟' });
        if (g === 'Cl') substituents.push({ locant, name_en: 'chloro', name_zh: '氯' });
        if (g === 'Br') substituents.push({ locant, name_en: 'bromo', name_zh: '溴' });
        if (g === 'I') substituents.push({ locant, name_en: 'iodo', name_zh: '碘' });
        if (g === 'OH' && pfg !== 'alcohol') {
          substituents.push({ locant, name_en: 'hydroxy', name_zh: '羥基' });
        }
        if (g === 'NH2' && pfg !== 'amine') {
          substituents.push({ locant, name_en: 'amino', name_zh: '氨基' });
        }
        if (g === 'O' && pfg !== 'ketone') {
          const isTerminalAldehyde = (chainIdx === 0 || chainIdx === molecule.chainLength - 1) && pfg === 'aldehyde';
          if (!isTerminalAldehyde) {
            substituents.push({ locant, name_en: 'oxo', name_zh: '氧代' });
          }
        }
        if (ESTER_VALUES.includes(g)) {
          if (isPrincipalEsterAttachment(node, slot)) return;
          const rGroup = getEsterR(c, slot);
          const rName = getEsterRName(rGroup);
          const alkoxyEn = ({ methyl: 'methoxy', ethyl: 'ethoxy', propyl: 'propoxy', butyl: 'butoxy', pentyl: 'pentoxy', hexyl: 'hexoxy', heptyl: 'heptoxy', octyl: 'octoxy' })[rName.en]
            || `${rName.en}oxy`;
          substituents.push({
            locant,
            name_en: `${alkoxyEn}carbonyl`,
            name_zh: `${rName.zh}氧羰基`
          });
        }
      });
    }
  });
   let groupedSubs = {};
  substituents.forEach(sub => {
    if (!groupedSubs[sub.name_en]) {
      groupedSubs[sub.name_en] = { name_en: sub.name_en, name_zh: sub.name_zh, locants: [] };
    }
    groupedSubs[sub.name_en].locants.push(sub.locant);
  });
  
  const MULTIPLIERS_EN = { 
    1: '', 
    2: 'di', 
    3: 'tri', 
    4: 'tetra', 
    5: 'penta', 
    6: 'hexa', 
    7: 'hepta', 
    8: 'octa', 
    9: 'nona', 
    10: 'deca',
    11: 'undeca',
    12: 'dodeca',
    13: 'trideca',
    14: 'tetradeca',
    15: 'pentadeca',
    16: 'hexadeca',
    17: 'heptadeca',
    18: 'octadeca'
  };
  const MULTIPLIERS_ZH = { 
    1: '', 
    2: '二', 
    3: '三', 
    4: '四', 
    5: '五', 
    6: '六', 
    7: '七', 
    8: '八', 
    9: '九', 
    10: '十',
    11: '十一',
    12: '十二',
    13: '十三',
    14: '十四',
    15: '十五',
    16: '十六',
    17: '十七',
    18: '十八'
  };
  
  let prefixList = [];
  const totalSubCount = substituents.length;
  const ALKYL_PREFIXES = ['methyl', 'ethyl', 'propyl'];
  const earlyHasDB = molecule.bonds.some(b => b === 'double');
  const earlyHasOH = alcoholCarbons.length > 0;
  const omitAllPrefixLocants = (L === 1) || (L === 2 && totalSubCount === 1);

  for (let key in groupedSubs) {
    let group = groupedSubs[key];
    group.locants.sort((x, y) => x - y);
    let count = group.locants.length;
    let locantsStr = group.locants.join(',');
    let multEn = (count in MULTIPLIERS_EN) ? MULTIPLIERS_EN[count] : `${count}-`;
    let multZh = (count in MULTIPLIERS_ZH) ? MULTIPLIERS_ZH[count] : `${count}-`;

    let omitLocants = omitAllPrefixLocants;
    if (!omitLocants && pfg === 'alkane' && !earlyHasOH && !earlyHasDB &&
        totalSubCount === 1 && count === 1 && ALKYL_PREFIXES.includes(group.name_en)) {
      if (Math.floor((L - 1) / 2) <= 1) omitLocants = true;
    }

    let prefix_en, prefix_zh;
    if (omitLocants) {
      prefix_en = `${multEn}${group.name_en}`;
      prefix_zh = `${multZh}${group.name_zh}`;
    } else {
      prefix_en = `${locantsStr}-${multEn}${group.name_en}`;
      prefix_zh = `${locantsStr}-${multZh}${group.name_zh}`;
    }

    prefixList.push({
      name_en: group.name_en,
      locants: group.locants,
      prefix_en,
      prefix_zh
    });
  }
  
  prefixList.sort((a, b) => a.name_en.localeCompare(b.name_en));
  let prefixStrEn = prefixList.map(p => p.prefix_en).join('-');
  let prefixStrZh = prefixList.map(p => p.prefix_zh).join('-');
  
  const STEMS_EN = { 1: 'meth', 2: 'eth', 3: 'prop', 4: 'but', 5: 'pent', 6: 'hex', 7: 'hept', 8: 'oct' };
  const STEMS_ZH = { 1: '甲', 2: '乙', 3: '丙', 4: '丁', 5: '戊', 6: '己', 7: '庚', 8: '辛' };
  let stemEn = STEMS_EN[L] || 'unknown', stemZh = STEMS_ZH[L] || '未知';
  
  let dbLocants = [];
  for (let i = 0; i < winningOrder.length - 1; i++) {
    let u = winningOrder[i], v = winningOrder[i+1];
    if (u.startsWith('C_') && v.startsWith('C_')) {
      let idxU = parseInt(u.split('_')[1]), idxV = parseInt(v.split('_')[1]);
      if (molecule.bonds[Math.min(idxU, idxV)] === 'double') dbLocants.push(locantOf(i));
    }
  }
  dbLocants.sort((x, y) => x - y);
  let hasDoubleBond = (dbLocants.length > 0);
  
  let suffixEn = '', suffixZh = '';
  
  if (pfg === 'acid') {
    if (hasDoubleBond) {
      suffixEn = `-${dbLocants.join(',')}-enoic acid`;
      suffixZh = `-${dbLocants.join(',')}-烯酸`;
    } else {
      suffixEn = 'anoic acid';
      suffixZh = '酸';
    }
  } else if (pfg === 'ester') {
    const rName = getEsterRName(esterType);
    let esterTypeZh = rName.zh;
    if (hasDoubleBond) {
      suffixEn = `-${dbLocants.join(',')}-enoate`;
      suffixZh = `-${dbLocants.join(',')}-烯酸${esterTypeZh}酯`;
    } else {
      suffixEn = 'anoate';
      suffixZh = `酸${esterTypeZh}酯`;
    }
  } else if (pfg === 'amide') {
    if (hasDoubleBond) {
      suffixEn = `-${dbLocants.join(',')}-enamide`;
      suffixZh = `-${dbLocants.join(',')}-烯酰胺`;
    } else {
      suffixEn = 'anamide';
      suffixZh = '酰胺';
    }
  } else if (pfg === 'aldehyde') {
    if (hasDoubleBond) {
      suffixEn = `-${dbLocants.join(',')}-enal`;
      suffixZh = `-${dbLocants.join(',')}-烯醛`;
    } else {
      // stem "but" + "anal" → butanal (IUPAC -al)
      suffixEn = 'anal';
      suffixZh = '醛';
    }
  } else if (pfg === 'ketone') {
    let ketoneLocants = [];
    winningOrder.forEach((node, idx) => {
      if (ketoneCarbons.includes(node)) ketoneLocants.push(locantOf(idx));
    });
    ketoneLocants.sort((x, y) => x - y);
    // Omit locant only when uniquely determined (propanone / acetone family: L===3)
    const omitKetoneLocant = (L === 3 && ketoneLocants.length === 1);
    const cnMultipliers = ['', '', '二', '三', '四', '五', '六', '七', '八'];
    if (hasDoubleBond) {
      if (omitKetoneLocant) {
        suffixEn = `-${dbLocants.join(',')}-enone`;
        suffixZh = `-${dbLocants.join(',')}-烯酮`;
      } else {
        const multiplier = ketoneLocants.length === 2 ? 'di' : (ketoneLocants.length === 3 ? 'tri' : '');
        suffixEn = `-${dbLocants.join(',')}-en-${ketoneLocants.join(',')}-${multiplier}one`;
        suffixZh = `-${dbLocants.join(',')}-烯-${ketoneLocants.join(',')}-${cnMultipliers[ketoneLocants.length]}酮`;
      }
    } else {
      if (omitKetoneLocant) {
        suffixEn = 'anone';
        suffixZh = '酮';
      } else {
        const multiplier = ketoneLocants.length === 2 ? 'di' : (ketoneLocants.length === 3 ? 'tri' : '');
        const link = ketoneLocants.length > 1 ? 'ane' : 'an';
        suffixEn = `${link}-${ketoneLocants.join(',')}-${multiplier}one`;
        suffixZh = `-${ketoneLocants.join(',')}-${cnMultipliers[ketoneLocants.length]}酮`;
      }
    }
  } else if (pfg === 'alcohol') {
    let ohLocants = [];
    winningOrder.forEach((node, idx) => {
      if (alcoholCarbons.includes(node)) ohLocants.push(locantOf(idx));
    });
    ohLocants.sort((x, y) => x - y);
    const cnMultipliers = ['', '', '二', '三', '四', '五', '六', '七', '八'];
    let isSmallAlcohol = (L <= 2) && ohLocants.length === 1;
    if (hasDoubleBond) {
      const multiplier = ohLocants.length === 2 ? 'di' : (ohLocants.length === 3 ? 'tri' : '');
      suffixEn = `-${dbLocants.join(',')}-en-${ohLocants.join(',')}-${multiplier}ol`;
      suffixZh = `-${dbLocants.join(',')}-烯-${ohLocants.join(',')}-${cnMultipliers[ohLocants.length]}醇`;
    } else {
      if (isSmallAlcohol) {
        suffixEn = 'anol';
        suffixZh = '醇';
      } else {
        const multiplier = ohLocants.length === 2 ? 'di' : (ohLocants.length === 3 ? 'tri' : '');
        const link = ohLocants.length > 1 ? 'ane' : 'an';
        suffixEn = `${link}-${ohLocants.join(',')}-${multiplier}ol`;
        suffixZh = `-${ohLocants.join(',')}-${cnMultipliers[ohLocants.length]}醇`;
      }
    }
  } else if (pfg === 'amine') {
    let amineLocants = [];
    winningOrder.forEach((node, idx) => {
      if (amineCarbons.includes(node)) amineLocants.push(locantOf(idx));
    });
    amineLocants.sort((x, y) => x - y);
    const cnMultipliers = ['', '', '二', '三', '四', '五', '六', '七', '八'];
    let isSmallAmine = (L <= 2) && amineLocants.length === 1;
    if (hasDoubleBond) {
      const multiplier = amineLocants.length === 2 ? 'di' : (amineLocants.length === 3 ? 'tri' : '');
      suffixEn = `-${dbLocants.join(',')}-en-${amineLocants.join(',')}-${multiplier}amine`;
      suffixZh = `-${dbLocants.join(',')}-烯-${amineLocants.join(',')}-${cnMultipliers[amineLocants.length]}胺`;
    } else {
      if (isSmallAmine) {
        suffixEn = 'anamine';
        suffixZh = '胺';
      } else {
        const multiplier = amineLocants.length === 2 ? 'di' : (amineLocants.length === 3 ? 'tri' : '');
        const link = amineLocants.length > 1 ? 'ane' : 'an';
        suffixEn = `${link}-${amineLocants.join(',')}-${multiplier}amine`;
        suffixZh = `-${amineLocants.join(',')}-${cnMultipliers[amineLocants.length]}胺`;
      }
    }
  } else if (hasDoubleBond) {
    let isSmallAlkene = (L <= 3);
    if (isSmallAlkene) {
      suffixEn = 'ene';
      suffixZh = '烯';
    } else {
      suffixEn = `-${dbLocants.join(',')}-ene`;
      suffixZh = `-${dbLocants.join(',')}-烯`;
    }
  } else {
    suffixEn = 'ane';
    suffixZh = '烷';
  }
  
  let finalNameEn = '';
  let finalNameZh = '';
  
  if (pfg === 'ester') {
    const rName = getEsterRName(esterType);
    let esterTypeEn = rName.en;
    // No hyphen between alkyl prefix and stem: "2-methyl" + "butanoate"
    finalNameEn = `${esterTypeEn} ${prefixStrEn || ''}${stemEn}${suffixEn}`;
    finalNameZh = `${prefixStrZh || ''}${stemZh}${suffixZh}`;
  } else {
    finalNameEn = `${prefixStrEn || ''}${stemEn}${suffixEn}`;
    finalNameZh = `${prefixStrZh || ''}${stemZh}${suffixZh}`;
  }
  
  finalNameEn = finalNameEn.replace(/-+/g, '-').replace(/-$/, '').replace(/ -/g, ' ').trim();
  finalNameZh = finalNameZh.replace(/-+/g, '-').replace(/-$/, '');
  
  appState.highlights.stem = L;
  appState.highlights.branches.clear();
  prefixList.forEach(p => {
    if (['methyl', 'ethyl', 'propyl'].includes(p.name_en)) appState.highlights.branches.add(p.name_en);
  });
  
  if (pfg === 'acid') appState.highlights.homo = 'carboxylic';
  else if (pfg === 'ester') appState.highlights.homo = 'ester';
  else if (pfg === 'amide') appState.highlights.homo = 'amide';
  else if (pfg === 'aldehyde') appState.highlights.homo = 'aldehyde';
  else if (pfg === 'ketone') appState.highlights.homo = 'ketone';
  else if (pfg === 'alcohol') appState.highlights.homo = 'alcohol';
  else if (pfg === 'amine') appState.highlights.homo = 'amine';
  else if (hasDoubleBond) appState.highlights.homo = 'alkene';
  else appState.highlights.homo = 'alkane';
  
  appState.highlights.halogens.clear();
  prefixList.forEach(p => {
    if (['fluoro', 'chloro', 'bromo', 'iodo'].includes(p.name_en)) {
      appState.highlights.halogens.add(p.name_en.charAt(0).toUpperCase());
    }
  });
  for (let i = 0; i < molecule.chainLength; i++) {
    ['top', 'bottom', 'left', 'right'].forEach(s => {
      let g = molecule.carbons[i][s];
      if (['F', 'Cl', 'Br', 'I'].includes(g)) appState.highlights.halogens.add(g);
    });
  }

  let step1En = `The longest continuous carbon chain has <strong>${L} carbon(s)</strong>, corresponding to stem word <strong>"${stemEn}-"</strong> (Chinese: <strong>「${stemZh}-」</strong>).`;
  let step1Zh = `檢測到分子中最長的連續碳原子鍵鏈長度為 <strong>${L} 個碳</strong>。根據 Table 1，主鏈字根為 <strong>「${stemZh}-」</strong>（英文：<strong>"${stemEn}-"</strong>）。`;
  if (isSideChainEsterPFG) {
    step1En = `The acyl principal chain includes the ester <strong>carbonyl carbon (C1)</strong> plus <strong>${mainChain.length}</strong> carbon(s) from the attachment point, total <strong>${L}</strong> → stem <strong>"${stemEn}-"</strong>.`;
    step1Zh = `酰基主鏈包含酯的<strong>羰基碳（1 號）</strong>，以及由接點起最長的 <strong>${mainChain.length}</strong> 個碳，共 <strong>${L}</strong> 個碳 → 字根 <strong>「${stemZh}-」</strong>。`;
  } else if (mainChain.length !== molecule.chainLength) {
    step1En += ` Note that branches are part of the continuous path! Path: ${mainChain.map(n => n.replace('C_', 'C')).join(' → ')}.`;
    step1Zh += ` 💡 <strong>請注意：</strong>側鏈上的碳原子也是這條連續碳鏈的一部分！最長路徑為：${mainChain.map(n => n.replace('C_', 'C')).join(' → ')}。`;
  }
  
  let step2En = '', step2Zh = '';
  if (pfg === 'acid') {
    step2En = `The highest priority functional group is the <strong>Carboxylic acid (-COOH)</strong>. The suffix is <strong>"-oic acid"</strong>.`;
    step2Zh = `分子中含有 <strong>羧基 (-COOH)</strong>，它是最高優先級的官能基，因此該化合物為羧酸類，命名尾綴為 <strong>「-酸」</strong>（英文：<strong>"-oic acid"</strong>）。`;
  } else if (pfg === 'ester') {
    step2En = `The highest priority functional group is the <strong>Ester (-COOR)</strong>. Named as an alkyl alkanoate with suffix <strong>"-oate"</strong>.`;
    step2Zh = `分子中含有 <strong>酯基 (-COOR)</strong>，它是最高優先級的官能基，因此該化合物為酯類，以烷基烷酸酯命名，尾綴為 <strong>「-酸酯」</strong>（英文：<strong>"-oate"</strong>）。`;
  } else if (pfg === 'amide') {
    step2En = `The highest priority functional group is the <strong>Unsubstituted Amide (-CONH2)</strong>. Suffix is <strong>"-amide"</strong>.`;
    step2Zh = `分子中含有 <strong>酰胺基 (-CONH2)</strong>，它是最高優先級的官能基，因此該化合物為酰胺類，命名尾綴為 <strong>「-酰胺」</strong>（英文：<strong>"-amide"</strong>）。`;
  } else if (pfg === 'aldehyde') {
    let hasTerminalCho = (c0.left === 'CHO' || (cLast && cLast.right === 'CHO'));
    if (hasTerminalCho) {
      step2En = `The highest priority functional group is the <strong>Aldehyde (-CHO)</strong>. Suffix is <strong>"-al"</strong>.`;
      step2Zh = `分子中含有 <strong>醛基 (-CHO)</strong>，它是最高優先級的官能基，因此該化合物為醛類，命名尾綴為 <strong>「-醛」</strong>（英文：<strong>"-al"</strong>）。`;
    } else {
      step2En = `The highest priority functional group is the <strong>Aldehyde (-CHO on terminal carbon)</strong>. Suffix is <strong>"-al"</strong>.`;
      step2Zh = `分子中含有位於末端碳上的 <strong>醛基 (-CHO)</strong>，它是最高優先級的官能基，因此該化合物為醛類，命名尾綴為 <strong>「-醛」</strong>（英文：<strong>"-al"</strong>）。`;
    }
  } else if (pfg === 'ketone') {
    step2En = `The highest priority functional group is the <strong>Ketone (=O)</strong>. Suffix is <strong>"-one"</strong>.`;
    step2Zh = `分子中含有 <strong>酮羰基 (=O)</strong>，它是最高優先級的官能基，因此該化合物為酮類，命名尾綴為 <strong>「-酮」</strong>（英文：<strong>"-one"</strong>）。`;
  } else if (pfg === 'alcohol') {
    step2En = `The highest priority functional group is the <strong>Alcohol (-OH)</strong>. Suffix is <strong>"-ol"</strong>.`;
    step2Zh = `分子中含有 <strong>羥基 (-OH)</strong>，且沒有更高優先級的官能基。主要官能基為醇，命名尾綴為 <strong>「-醇」</strong>（英文：<strong>"-ol"</strong>）。`;
  } else if (pfg === 'amine') {
    step2En = `The highest priority functional group is the <strong>Primary Amine (-NH2)</strong>. Suffix is <strong>"-amine"</strong>.`;
    step2Zh = `分子中含有 <strong>胺基 (-NH2)</strong>，且沒有更高優先級的官能基。主要官能基為胺，命名尾綴為 <strong>「-胺」</strong>（英文：<strong>"-amine"</strong>）。`;
  } else if (hasDoubleBond) {
    step2En = `The principal functional group is the <strong>Alkene (C=C double bond)</strong>. Suffix is <strong>"-ene"</strong>.`;
    step2Zh = `分子中含有 <strong>碳碳雙鍵 (C=C)</strong>，無其它更高優先級官能基。主要官能基為烯烴，命名尾綴為 <strong>「-烯」</strong>（英文：<strong>"-ene"</strong>）。`;
  } else {
    step2En = `The molecule contains only single bonds. Saturated hydrocarbon, suffix is <strong>"-ane"</strong>.`;
    step2Zh = `分子中只有碳碳單鍵及氫原子。它是飽和烷烴，命名尾綴為 <strong>「-烷」</strong>（英文：<strong>"-ane"</strong>）。`;
  }
  
  return {
    name_en: finalNameEn,
    name_zh: finalNameZh,
    steps: {
      step1: { en: step1En, zh: step1Zh },
      step2: { en: step2En, zh: step2Zh },
      step3: { en: numberingReasonEn, zh: numberingReason },
      step4: { 
        en: prefixList.length > 0 ? `Substituents identified: ${prefixList.map(p => `<strong>${p.prefix_en}</strong>`).join(', ')}. Alphabetized in English.` : 'No substituents found outside the main chain.',
        zh: prefixList.length > 0 ? `識別出取代基為：${prefixList.map(p => `<strong>${p.prefix_zh}</strong>`).join(', ')}。依據英文首字母順序排列。` : '主碳鏈外沒有發現任何取代基。'
      },
      step5: { en: `Combine elements to form name: <strong>${finalNameEn}</strong>.`, zh: `拼合出完整 IUPAC 名稱：<strong>${finalNameZh}</strong>。` }
    }
  };
}

function compareLocantSets(arrA, arrB) {
  let len = Math.max(arrA.length, arrB.length);
  for (let i = 0; i < len; i++) {
    if (arrA[i] === undefined) return -1;
    if (arrB[i] === undefined) return 1;
    if (arrA[i] !== arrB[i]) return arrA[i] - arrB[i];
  }
  return 0;
}

// ==========================================
// Valence Verification Logic
// ==========================================
function getCarbonValence(idx) {
  let c = molecule.carbons[idx];
  let valence = 0;
  
  if (idx === 0) {
    if (['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].includes(c.left)) {
      valence += 3; // =O (2) + other (1)
    } else if (c.left && c.left !== 'none') {
      valence += 1;
    }
  } else {
    valence += (molecule.bonds[idx - 1] === 'double' ? 2 : 1);
  }
  
  if (idx === molecule.chainLength - 1) {
    if (['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].includes(c.right)) {
      valence += 3; // =O (2) + other (1)
    } else if (c.right && c.right !== 'none') {
      valence += 1;
    }
  } else {
    valence += (molecule.bonds[idx] === 'double' ? 2 : 1);
  }
  
  if (c.top && c.top !== 'none') {
    if (c.top === 'ester') {
      const isTerminal = (idx === 0 || idx === molecule.chainLength - 1);
      valence += isTerminal ? 3 : 1;
    } else {
      valence += (c.top === 'O' ? 2 : 1);
    }
  }
  if (c.bottom && c.bottom !== 'none') {
    if (c.bottom === 'ester') {
      const isTerminal = (idx === 0 || idx === molecule.chainLength - 1);
      valence += isTerminal ? 3 : 1;
    } else {
      valence += (c.bottom === 'O' ? 2 : 1);
    }
  }
  
  return valence;
}

/**
 * Automatically removes an 'H' group from the two carbons connected by bondIdx
 * to accommodate a new C=C double bond without exceeding 4 valence.
 */
function adjustValenceForDoubleBond(bondIdx) {
  // Temporarily set to double bond to evaluate resulting valences
  molecule.bonds[bondIdx] = 'double';
  
  // Clean up Carbon 1 (left of bond)
  let val1 = getCarbonValence(bondIdx);
  if (val1 > 4) {
    let c1 = molecule.carbons[bondIdx];
    // Remove 'H' in priority order: top, bottom, left
    if (c1.top === 'H') {
      c1.top = 'none';
    } else if (c1.bottom === 'H') {
      c1.bottom = 'none';
    } else if (bondIdx === 0 && c1.left === 'H') {
      c1.left = 'none';
    }
  }
  
  // Clean up Carbon 2 (right of bond)
  let val2 = getCarbonValence(bondIdx + 1);
  if (val2 > 4) {
    let c2 = molecule.carbons[bondIdx + 1];
    // Remove 'H' in priority order: top, bottom, right
    if (c2.top === 'H') {
      c2.top = 'none';
    } else if (c2.bottom === 'H') {
      c2.bottom = 'none';
    } else if (bondIdx + 1 === molecule.chainLength - 1 && c2.right === 'H') {
      c2.right = 'none';
    }
  }
}

/**
 * Automatically saturates (re-adds 'H') onto the two carbons connected by bondIdx
 * when their connection is downgraded from double to single bond.
 */
function adjustValenceForSingleBond(bondIdx) {
  molecule.bonds[bondIdx] = 'single';
  
  // Restore Carbon 1 (left of bond) if unsaturated
  let val1 = getCarbonValence(bondIdx);
  if (val1 < 4) {
    let c1 = molecule.carbons[bondIdx];
    if (c1.top === 'none') {
      c1.top = 'H';
    } else if (c1.bottom === 'none') {
      c1.bottom = 'H';
    } else if (bondIdx === 0 && c1.left === 'none') {
      c1.left = 'H';
    }
  }
  
  // Restore Carbon 2 (right of bond) if unsaturated
  let val2 = getCarbonValence(bondIdx + 1);
  if (val2 < 4) {
    let c2 = molecule.carbons[bondIdx + 1];
    if (c2.top === 'none') {
      c2.top = 'H';
    } else if (c2.bottom === 'none') {
      c2.bottom = 'H';
    } else if (bondIdx + 1 === molecule.chainLength - 1 && c2.right === 'none') {
      c2.right = 'H';
    }
  }
}

// ==========================================
// UI Rendering - Controls & Inputs
// ==========================================
function updateUI() {
  // Ensure molecule and molecule.bonds are fully valid
  if (molecule) {
    if (!molecule.bonds) {
      molecule.bonds = [];
    }
    while (molecule.bonds.length < molecule.chainLength - 1) {
      molecule.bonds.push('single');
    }
  }

  // Update visibility of skip/continue buttons if in draw mode
  const btnCheck = document.getElementById('btn-check-drawing');
  const btnSkip = document.getElementById('btn-skip-question');
  const btnContinue = document.getElementById('btn-continue-challenge');
  
  if (appState.mode === 'draw') {
    if (btnCheck) btnCheck.classList.toggle('hidden', !!appState.isShowingSolution);
    if (btnSkip) btnSkip.classList.toggle('hidden', !!appState.isShowingSolution);
    if (btnContinue) btnContinue.classList.toggle('hidden', !appState.isShowingSolution);
    
    // Disable reset and slider controls during solution display
    const chainButtons = document.querySelectorAll('.chain-quick-controls button');
    chainButtons.forEach(btn => btn.disabled = !!appState.isShowingSolution);
    
    // Show instruction banner notice if showing solution
    const instructionZh = document.getElementById('quiz-instruction-zh');
    const instructionEn = document.getElementById('quiz-instruction-en');
    if (instructionZh && instructionEn && appState.currentQuestion) {
      if (appState.isShowingSolution) {
        instructionZh.textContent = `請繪製「${appState.currentQuestion.name_zh}」（正確答案已顯示！）`;
        instructionEn.textContent = `Please draw "${appState.currentQuestion.name_en}" (Correct Answer Shown!)`;
      } else {
        instructionZh.textContent = `請繪製「${appState.currentQuestion.name_zh}」`;
        instructionEn.textContent = `Please draw "${appState.currentQuestion.name_en}"`;
      }
    }
  }

  // Also disable all fields inside the inspector if showing solution
  const inspectorElements = document.querySelectorAll('#inspector-panel select, #inspector-panel button, #inspector-panel input');
  inspectorElements.forEach(el => el.disabled = !!appState.isShowingSolution);

  renderCarbonChain();
  renderInspector();
  updateNomenclature();
  updateTableHighlights();
  
  if (appState.activeTab === 'structural') {
    drawStructural();
  } else {
    drawSkeletal();
  }
}

function renderCarbonChain() {
  const container = document.getElementById('carbon-chain-visual');
  container.innerHTML = '';
  
  for (let i = 0; i < molecule.chainLength; i++) {
    const cNode = document.createElement('div');
    cNode.className = `carbon-node ${appState.inspectingCarbonIndex === i ? 'selected' : ''}`;
    
    let valence = getCarbonValence(i);
    if (valence > 4) {
      cNode.style.borderColor = 'var(--accent-danger)';
      cNode.style.boxShadow = '0 0 15px rgba(244,63,94,0.6)';
    }
    
    cNode.onclick = () => {
      appState.inspectingCarbonIndex = i;
      updateUI();
    };
    
    cNode.innerHTML = `<span>C</span><span class="c-index-tag">${i+1}</span>`;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'c-node-wrapper';
    wrapper.appendChild(cNode);
    container.appendChild(wrapper);
    
    if (i < molecule.chainLength - 1) {
      const bond = document.createElement('div');
      let isDouble = (molecule.bonds[i] === 'double');
      bond.className = `carbon-bond-line ${isDouble ? 'double' : ''}`;
      
      bond.onclick = () => {
        if (appState.isShowingSolution) return;
        if (isDouble) {
          adjustValenceForSingleBond(i);
        } else {
          adjustValenceForDoubleBond(i);
        }
        updateUI();
      };
      
      container.appendChild(bond);
    }
  }
  document.getElementById('chain-length-display').textContent = molecule.chainLength;
}

function renderInspector() {
  const i = appState.inspectingCarbonIndex;
  if (i >= molecule.chainLength) {
    appState.inspectingCarbonIndex = 0;
    renderInspector();
    return;
  }
  
  document.getElementById('inspect-index-zh').textContent = i + 1;
  document.getElementById('inspect-index-en').textContent = i + 1;
  
  const c = molecule.carbons[i];
  let valence = getCarbonValence(i);
  const meter = document.getElementById('valence-meter');
  
  if (valence === 4) {
    meter.textContent = `${valence}/4 Bonds Used`;
    meter.className = 'valence-meter val-green';
  } else if (valence > 4) {
    meter.textContent = `${valence}/4 Bonds (OVERVALENT - Impossible!)`;
    meter.className = 'valence-meter val-red';
  } else {
    meter.textContent = `${valence}/4 Bonds (Saturated with Hydrogens)`;
    meter.className = 'valence-meter val-green';
  }
  
  const selectTop = document.getElementById('select-top');
  const selectBottom = document.getElementById('select-bottom');
  
  let topBottomOptions = ATTACHMENT_OPTIONS.top_bottom;
  if (i === 0 || i === molecule.chainLength - 1) {
    topBottomOptions = topBottomOptions.map(opt => {
      if (opt.value === 'O') {
        return { value: 'CHO', en: '-CHO (Aldehyde)', zh: '-CHO (醛基)' };
      }
      return opt;
    });
    // Add Carboxyl and Amide terminal group options to top/bottom slots
    topBottomOptions = [
      ...topBottomOptions.slice(0, 5),
      { value: 'COOH', en: '-COOH (Carboxyl)', zh: '-COOH (羧基)' },
      { value: 'CONH2', en: '-CONH₂ (Amide)', zh: '-CONH₂ (酰胺基)' },
      ...topBottomOptions.slice(5)
    ];
  } else {
    // Remove the ester option for intermediate carbons
    topBottomOptions = topBottomOptions.filter(opt => opt.value !== 'ester');
  }
  
  let leftRightOptions = ATTACHMENT_OPTIONS.left_right;

  // Filter out ester, aldehyde, ketone, amine, amide if F4 Syllabus is selected in Free Explore Mode
  if (appState.mode === 'explore' && appState.exploreSyllabus === 'F4') {
    topBottomOptions = topBottomOptions.filter(opt => {
      return !['ester', 'CHO', 'O', 'CONH2', 'NH2'].includes(opt.value);
    });
    leftRightOptions = leftRightOptions.filter(opt => {
      return !['ester', 'COOCH3', 'COOCH2CH3', 'CHO', 'CONH2', 'NH2'].includes(opt.value);
    });
  }
  
  populateDropdown(selectTop, topBottomOptions, c.top);
  populateDropdown(selectBottom, topBottomOptions, c.bottom);
  
  const leftCard = document.getElementById('left-attachment-card');
  const rightCard = document.getElementById('right-attachment-card');
  
  if (i === 0) {
    leftCard.classList.remove('hidden');
    populateDropdown(document.getElementById('select-left'), leftRightOptions, c.left || 'H');
  } else {
    leftCard.classList.add('hidden');
  }
  
  // Show right slot on the last carbon — including chain length 1 (four branches: top/bottom/left/right)
  if (i === molecule.chainLength - 1) {
    rightCard.classList.remove('hidden');
    if (c.right === undefined || c.right === null) c.right = 'H';
    // Same option list as left — includes -COOH
    populateDropdown(document.getElementById('select-right'), leftRightOptions, c.right);
  } else {
    rightCard.classList.add('hidden');
  }
  
  const nextBondCard = document.getElementById('next-bond-card');
  if (i < molecule.chainLength - 1) {
    nextBondCard.classList.remove('hidden');
    let isDouble = (molecule.bonds[i] === 'double');
    document.getElementById('bond-single').classList.toggle('active', !isDouble);
    document.getElementById('bond-double').classList.toggle('active', isDouble);
  } else {
    nextBondCard.classList.add('hidden');
  }

  // Dynamic Ester Settings Panel
  const esterPanel = document.getElementById('ester-settings-panel');
  if (esterPanel) {
    const esterSlots = [];
    if (c.top === 'ester') esterSlots.push('top');
    if (c.bottom === 'ester') esterSlots.push('bottom');
    if (i === 0 && c.left === 'ester') esterSlots.push('left');
    if (i === molecule.chainLength - 1 && c.right === 'ester') esterSlots.push('right');
    
    if (esterSlots.length > 0) {
      esterPanel.classList.remove('hidden');
      const grid = esterPanel.querySelector('.ester-settings-grid');
      grid.innerHTML = '';
      
      esterSlots.forEach(slot => {
        const currentR = c[slot + '_esterR'] || 'CH3';
        const isCustom = !['CH3', 'CH2CH3', 'CH2CH2CH3', 'CH2CH2CH2CH3', 'CH2CH2CH2CH2CH3', 'CH2CH2CH2CH2CH2CH3', 'CH2CH2CH2CH2CH2CH2CH3', 'CH2CH2CH2CH2CH2CH2CH2CH3'].includes(currentR);
        
        const selectCard = document.createElement('div');
        selectCard.className = 'attachment-control-card';
        
        const labelSlotNames = {
          top: appState.lang === 'zh' ? '⬆️ 上方酯基 R 基團' : '⬆️ Top Ester R-Group',
          bottom: appState.lang === 'zh' ? '⬇️ 下方酯基 R 基團' : '⬇️ Bottom Ester R-Group',
          left: appState.lang === 'zh' ? '⬅️ 左方酯基 R 基團' : '⬅️ Left Ester R-Group',
          right: appState.lang === 'zh' ? '➡️ 右方酯基 R 基團' : '➡️ Right Ester R-Group'
        };
        
        selectCard.innerHTML = `
          <div class="card-label">${labelSlotNames[slot]}</div>
          <select onchange="updateEsterR('${slot}', this.value)">
            <option value="CH3" ${currentR === 'CH3' ? 'selected' : ''}>CH₃ (Methyl / 甲基)</option>
            <option value="CH2CH3" ${currentR === 'CH2CH3' ? 'selected' : ''}>CH₂CH₃ (Ethyl / 乙基)</option>
            <option value="CH2CH2CH3" ${currentR === 'CH2CH2CH3' ? 'selected' : ''}>CH₂CH₂CH₃ (Propyl / 丙基)</option>
            <option value="CH2CH2CH2CH3" ${currentR === 'CH2CH2CH2CH3' ? 'selected' : ''}>CH₂CH₂CH₂CH₃ (Butyl / 丁基)</option>
            <option value="CH2CH2CH2CH2CH3" ${currentR === 'CH2CH2CH2CH2CH3' ? 'selected' : ''}>CH₂CH₂CH₂CH₂CH₃ (Pentyl / 戊基)</option>
            <option value="CH2CH2CH2CH2CH2CH3" ${currentR === 'CH2CH2CH2CH2CH2CH3' ? 'selected' : ''}>CH₂CH₂CH₂CH₂CH₂CH₃ (Hexyl / 己基)</option>
            <option value="CH2CH2CH2CH2CH2CH2CH3" ${currentR === 'CH2CH2CH2CH2CH2CH2CH3' ? 'selected' : ''}>CH₂CH₂CH₂CH₂CH₂CH₂CH₃ (Heptyl / 庚基)</option>
            <option value="CH2CH2CH2CH2CH2CH2CH2CH3" ${currentR === 'CH2CH2CH2CH2CH2CH2CH2CH3' ? 'selected' : ''}>CH₂CH₂CH₂CH₂CH₂CH₂CH₂CH₃ (Octyl / 辛基)</option>
            <option value="custom" ${isCustom ? 'selected' : ''}>Custom (自訂基團)</option>
          </select>
        `;
        grid.appendChild(selectCard);
        
        const customCard = document.createElement('div');
        customCard.className = `attachment-control-card ${isCustom ? '' : 'hidden'}`;
        customCard.innerHTML = `
          <div class="card-label">
            <span class="zh">自訂 R 基團化學式</span>
            <span class="en">Custom R-Group Formula</span>
          </div>
          <input type="text" value="${isCustom ? currentR : ''}" oninput="updateCustomEsterR('${slot}', this.value)" placeholder="e.g. C9H19" />
        `;
        grid.appendChild(customCard);
      });
    } else {
      esterPanel.classList.add('hidden');
    }
  }
}

function updateEsterR(slot, value) {
  const i = appState.inspectingCarbonIndex;
  const c = molecule.carbons[i];
  if (value === 'custom') {
    c[slot + '_esterR'] = 'C9H19';
  } else {
    c[slot + '_esterR'] = value;
  }
  updateUI();
}

function updateCustomEsterR(slot, value) {
  const i = appState.inspectingCarbonIndex;
  const c = molecule.carbons[i];
  c[slot + '_esterR'] = value.replace(/[^a-zA-Z0-9]/g, '');
  updateNomenclature();
  updateTableHighlights();
  if (appState.activeTab === 'structural') {
    drawStructural();
  } else {
    drawSkeletal();
  }
}

function populateDropdown(select, options, currentValue) {
  select.innerHTML = '';
  const shortOnly = (appState.mode === 'draw');
  options.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt.value;
    if (shortOnly) {
      // Challenge mode: show bond / group formula only (e.g. H, not "H (Hydrogen)")
      const shortLabels = {
        H: 'H',
        none: appState.lang === 'zh' ? '無' : 'none',
        CH3: 'CH₃',
        CH2CH3: 'CH₂CH₃',
        OH: 'OH',
        O: 'O',
        NH2: 'NH₂',
        F: 'F',
        Cl: 'Cl',
        Br: 'Br',
        I: 'I',
        COOH: 'COOH',
        CHO: 'CHO',
        COOCH3: 'COOCH₃',
        COOCH2CH3: 'COOCH₂CH₃',
        CONH2: 'CONH₂'
      };
      el.textContent = shortLabels[opt.value] || opt.value;
    } else {
      el.textContent = appState.lang === 'zh' ? opt.zh : opt.en;
    }
    el.selected = (opt.value === currentValue);
    select.appendChild(el);
  });
  select.value = currentValue;
}

function updateAttachment(slot, value) {
  const i = appState.inspectingCarbonIndex;
  
  if (['CHO', 'COOH', 'CONH2', 'ester', 'COOCH3', 'COOCH2CH3'].includes(value) && (slot === 'top' || slot === 'bottom')) {
    if (i === 0) {
      molecule.carbons[i].left = value;
    } else if (i === molecule.chainLength - 1) {
      molecule.carbons[i].right = value;
    }
    molecule.carbons[i].top = 'none';
    molecule.carbons[i].bottom = 'none';
  } else {
    molecule.carbons[i][slot] = value;
    if ((value === 'O' || value === 'ester') && slot === 'top') {
      molecule.carbons[i].bottom = 'none';
    } else if ((value === 'O' || value === 'ester') && slot === 'bottom') {
      molecule.carbons[i].top = 'none';
    }
    if (value === 'ester' && (slot === 'top' || slot === 'bottom')) {
      if (i === 0) {
        molecule.carbons[i].left = 'none';
      }
      if (i === molecule.chainLength - 1) {
        molecule.carbons[i].right = 'none';
      }
    }
  }

  // Terminal 3-bond groups use 3 bonds on the terminal carbon; clear top/bottom so valence stays valid
  if (['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].includes(value) && (slot === 'left' || slot === 'right')) {
    molecule.carbons[i].top = 'none';
    molecule.carbons[i].bottom = 'none';
  }

  updateUI();
}

function updateNextBond(type) {
  const i = appState.inspectingCarbonIndex;
  if (i < molecule.chainLength - 1) {
    if (type === 'double') {
      adjustValenceForDoubleBond(i);
    } else {
      adjustValenceForSingleBond(i);
    }
    updateUI();
  }
}

function adjustChainLength(dir) {
  if (appState.isShowingSolution) return;
  let newLength = molecule.chainLength + dir;
  if (newLength < 1 || newLength > 8) return;
  
  if (dir > 0) {
    molecule.carbons.push({ top: 'H', bottom: 'H' });
    molecule.bonds.push('single');
  } else {
    molecule.carbons.pop();
    molecule.bonds.pop();
  }
  
  molecule.chainLength = newLength;
  molecule.carbons[0].left = molecule.carbons[0].left || 'H';
  if (newLength > 1) {
    molecule.carbons[newLength-1].right = molecule.carbons[newLength-1].right || 'H';
    delete molecule.carbons[0].right;
    for (let i = 1; i < newLength - 1; i++) {
      delete molecule.carbons[i].left;
      delete molecule.carbons[i].right;
    }
  } else {
    molecule.carbons[0].right = 'H';
  }
  
  if (appState.inspectingCarbonIndex >= newLength) {
    appState.inspectingCarbonIndex = newLength - 1;
  }
  
  updateUI();
}

function resetMolecule(preserveActiveTab = false) {
  molecule = {
    chainLength: 4,
    bonds: ['single', 'single', 'single'],
    carbons: [
      { top: 'H', bottom: 'H', left: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H' },
      { top: 'H', bottom: 'H', right: 'H' }
    ]
  };
  appState.inspectingCarbonIndex = 0;
  if (!preserveActiveTab) {
    appState.activeTab = 'structural';
    document.getElementById('tab-structural').classList.add('active');
    document.getElementById('tab-skeletal').classList.remove('active');
    document.getElementById('container-structural').classList.remove('hidden');
    document.getElementById('container-skeletal').classList.add('hidden');
  }
  updateUI();
}

function loadPreset(key) {
  if (PRESETS[key]) {
    molecule = JSON.parse(JSON.stringify(PRESETS[key]));
    appState.inspectingCarbonIndex = 0;
    updateUI();
  }
}

function hasThreeIodinesOnOneCarbon() {
  for (let i = 0; i < molecule.chainLength; i++) {
    const c = molecule.carbons[i];
    let iodoCount = 0;
    if (c.top === 'I') iodoCount++;
    if (c.bottom === 'I') iodoCount++;
    if (i === 0 && c.left === 'I') iodoCount++;
    if (i === molecule.chainLength - 1 && c.right === 'I') iodoCount++;
    if (iodoCount >= 3) {
      return true;
    }
  }
  return false;
}

function updateNomenclature() {
  const result = getIUPACName();
  document.getElementById('iupac-name-en').textContent = result.name_en;
  document.getElementById('iupac-name-zh').textContent = result.name_zh;
  
  document.getElementById('explain-step1').innerHTML = appState.lang === 'zh' ? result.steps.step1.zh : result.steps.step1.en;
  document.getElementById('explain-step2').innerHTML = appState.lang === 'zh' ? result.steps.step2.zh : result.steps.step2.en;
  document.getElementById('explain-step3').innerHTML = appState.lang === 'zh' ? result.steps.step3.zh : result.steps.step3.en;
  document.getElementById('explain-step4').innerHTML = appState.lang === 'zh' ? result.steps.step4.zh : result.steps.step4.en;
  document.getElementById('explain-step5').innerHTML = appState.lang === 'zh' ? result.steps.step5.zh : result.steps.step5.en;

  const warningEl = document.getElementById('theoretical-warning');
  if (warningEl) {
    if (hasThreeIodinesOnOneCarbon()) {
      warningEl.classList.remove('hidden');
    } else {
      warningEl.classList.add('hidden');
    }
  }
}

function toggleExplanation() {
  document.getElementById('explanation-content').classList.toggle('hidden');
}

function updateTableHighlights() {
  document.querySelectorAll('#ref-table-1 td, #ref-table-2 tr, #ref-table-3 tr').forEach(el => {
    el.classList.remove('row-active');
  });
  
  if (appState.highlights.stem) {
    const tdStemEn = document.querySelector(`#row-stem-en td[data-c="${appState.highlights.stem}"]`);
    const tdStemZh = document.querySelector(`#row-stem-zh td[data-c="${appState.highlights.stem}"]`);
    if (tdStemEn) tdStemEn.classList.add('row-active');
    if (tdStemZh) tdStemZh.classList.add('row-active');
  }
  
  appState.highlights.branches.forEach(b => {
    const tdBEn = document.querySelector(`#row-branch-en td[data-branch="${b}"]`);
    const tdBZh = document.querySelector(`#row-branch-zh td[data-branch="${b}"]`);
    if (tdBEn) tdBEn.classList.add('row-active');
    if (tdBZh) tdBZh.classList.add('row-active');
  });
  
  if (appState.highlights.homo) {
    const row = document.getElementById(`row-homo-${appState.highlights.homo}`);
    if (row) row.classList.add('row-active');
  }
  
  appState.highlights.halogens.forEach(hal => {
    const row = document.getElementById(`row-halogen-${hal}`);
    if (row) row.classList.add('row-active');
  });
}

// ==========================================
// Structural Formula Bounding Box (principal-path horizontal layout)
// ==========================================
function getStructuralBounds(spacingX, spacingY, path) {
  const ATOM_R = 14;
  const BOND = 32;
  const LABEL = 14;
  const stub = ATOM_R + BOND + LABEL;
  const pathNodes = path || getOrientedPrincipalPath().path;
  const pathSet = new Set(pathNodes);

  let minX = 0;
  let maxX = Math.max(0, (pathNodes.length - 1) * spacingX);
  let minY = -stub;
  let maxY = stub;

  pathNodes.forEach((nodeId, pi) => {
    const xc = pi * spacingX;
    minX = Math.min(minX, xc - stub);
    maxX = Math.max(maxX, xc + stub);

    if (nodeId === 'V_carbonyl') {
      minY = Math.min(minY, -stub);
      maxY = Math.max(maxY, stub);
      minX = Math.min(minX, xc - 2 * spacingX - stub);
      return;
    }

    if (!nodeId.startsWith('C_')) {
      minY = Math.min(minY, -stub);
      maxY = Math.max(maxY, stub);
      return;
    }

    const ci = parseInt(nodeId.split('_')[1], 10);
    const c = molecule.carbons[ci];
    const last = molecule.chainLength - 1;

    // Find terminal group (COOH, ester, CONH2, CHO) on this carbon if it's a terminal carbon
    function getGroupPriority(val) {
      if (val === 'COOH') return 1;
      if (['COOCH3', 'COOCH2CH3', 'ester'].includes(val)) return 2;
      if (val === 'CONH2') return 3;
      if (val === 'CHO') return 4;
      return 999;
    }

    let terminalGroup = null;
    let terminalSlot = null;
    if (ci === 0 || ci === last) {
      const slotsToCheck = (ci === 0) ? ['left', 'top', 'bottom'] : ['right', 'top', 'bottom'];
      let bestPriority = 999;
      for (let s of slotsToCheck) {
        const val = c[s];
        const pri = getGroupPriority(val);
        if (pri < bestPriority) {
          bestPriority = pri;
          terminalGroup = val;
          terminalSlot = s;
        }
      }
    }

    if (terminalGroup) {
      // Carbonyl =O is drawn vertically up
      minY = Math.min(minY, -spacingY - stub);
      
      // The other part is drawn horizontally left or right depending on screen position
      const isLeft = (pi === 0);
      if (['COOH', 'CHO', 'CONH2'].includes(terminalGroup)) {
        if (isLeft) {
          minX = Math.min(minX, xc - spacingX - stub);
        } else {
          maxX = Math.max(maxX, xc + spacingX + stub);
        }
      } else if (['COOCH3', 'COOCH2CH3', 'ester'].includes(terminalGroup)) {
        if (isLeft) {
          minX = Math.min(minX, xc - 2 * spacingX - stub);
        } else {
          maxX = Math.max(maxX, xc + 2 * spacingX + stub);
        }
      }
    }

    // Now look at all standard slots to see if they are drawn as standard substituents
    ['top', 'bottom', 'left', 'right'].forEach(s => {
      if (s === terminalSlot) return; // Skip terminal group slot already handled above
      const val = c[s];
      if (!val || val === 'none' || val === 'H') return;

      if (s === 'top') {
        if (val === 'CH2CH3') {
          minY = Math.min(minY, -2 * spacingY - stub);
        } else if (val === 'CH3') {
          minY = Math.min(minY, -spacingY - stub);
        } else if (['ester', 'COOCH3', 'COOCH2CH3'].includes(val)) {
          // Double bond =O is drawn horizontally
          if (pi < pathNodes.length - 1) {
            minX = Math.min(minX, xc - spacingX - stub);
          } else {
            maxX = Math.max(maxX, xc + spacingX + stub);
          }
          // -O-Alkyl is drawn vertically up (2 steps)
          minY = Math.min(minY, -2 * spacingY - stub);
        } else {
          // Standard top substituent uses 1 vertical step up
          minY = Math.min(minY, -spacingY - stub);
        }
      } else if (s === 'bottom') {
        if (val === 'CH2CH3') {
          maxY = Math.max(maxY, 2 * spacingY + stub);
        } else if (val === 'CH3') {
          maxY = Math.max(maxY, spacingY + stub);
        } else if (['ester', 'COOCH3', 'COOCH2CH3'].includes(val)) {
          // Double bond =O is drawn horizontally
          if (pi < pathNodes.length - 1) {
            minX = Math.min(minX, xc - spacingX - stub);
          } else {
            maxX = Math.max(maxX, xc + spacingX + stub);
          }
          // -O-Alkyl is drawn vertically down (2 steps)
          maxY = Math.max(maxY, 2 * spacingY + stub);
        } else {
          // Standard bottom substituent uses 1 vertical step down
          maxY = Math.max(maxY, spacingY + stub);
        }
      } else if (pi === 0) {
        const outerSlot = (ci === 0) ? 'left' : 'right';
        if (s === outerSlot) {
          minX = Math.min(minX, xc - spacingX - stub);
        }
      } else if (pi === pathNodes.length - 1) {
        const outerSlot = (ci === 0) ? 'left' : 'right';
        if (s === outerSlot) {
          maxX = Math.max(maxX, xc + spacingX + stub);
        }
      }
    });
  });

  return { minX, maxX, minY, maxY };
}

// ==========================================
// JChemPaint / CDK StandardGenerator depiction style
// Refs: https://github.com/jchempaint/jchempaint
//       CDK StandardGenerator (BondSeparation default 0.18)
//       Brecher, Pure Appl. Chem. 2008; Clark, Mol. Inf. 2013
// ==========================================
const JCP_STYLE = {
  ink: '#111827',
  bondWidth: 2.0,
  bondWidthBold: 2.4,
  doubleSepRatio: 0.18, // CDK StandardGenerator.BondSeparation default
  doublePadRatio: 0.12, // shorten secondary line at ends
  skeletalBondLen: 75,
  skeletalStroke: 2.6,
  skeletalDoubleStroke: 2.0,
  atomFontStructural: 16,
  atomFontSkeletal: 18,
  /** Clearance from heteroatom glyph centre to bond tip (skeletal) */
  atomGapSkeletal: 9,
  /** Bond length after ether O for methyl stub (skeletal) */
  alkoxyStubLen: 40,
  // CPK-like heteroatom colours (aligned with --atom-* CSS vars)
  colors: {
    C: '#111827',
    H: 'var(--atom-h)',
    O: 'var(--atom-o)',
    N: '#3050F8',
    F: 'var(--atom-f)',
    Cl: 'var(--atom-cl)',
    Br: 'var(--atom-br)',
    I: 'var(--atom-i)',
    default: '#111827'
  }
};

function jcpAtomFill(txt) {
  const s = String(txt || '');
  if (s.startsWith('Cl')) return JCP_STYLE.colors.Cl;
  if (s.startsWith('Br')) return JCP_STYLE.colors.Br;
  if (s.startsWith('NH') || s === 'N') return JCP_STYLE.colors.N;
  if (s === 'HO') return JCP_STYLE.colors.O;
  if (s.startsWith('H')) return JCP_STYLE.colors.H;
  if (s.startsWith('O') || s.startsWith('OH')) return JCP_STYLE.colors.O;
  if (s.startsWith('F')) return JCP_STYLE.colors.F;
  if (s.startsWith('I')) return JCP_STYLE.colors.I;
  if (s.startsWith('C')) return JCP_STYLE.colors.C;
  return JCP_STYLE.colors.default;
}

/** Rotate a 2D unit vector by degrees (counter-clockwise). */
function rot2d(ux, uy, deg) {
  const a = (deg * Math.PI) / 180;
  return {
    x: ux * Math.cos(a) - uy * Math.sin(a),
    y: ux * Math.sin(a) + uy * Math.cos(a)
  };
}

/**
 * SVG text-anchor so multi-char labels (H₃C, Cl, NH₂…) keep even bond clearance.
 * Bond approaches from the opposite of (ux,uy).
 */
function labelAnchorForDirection(label, ux, uy) {
  const s = String(label || '');
  if (s.length <= 1) return 'middle';
  if (Math.abs(ux) >= Math.abs(uy)) return ux < 0 ? 'end' : 'start';
  return 'middle';
}

/**
 * C–O–C ≈ 120° at ether oxygen: outgoing alkoxy is ±60° from C→O.
 * Prefers the flatter continuation (avoids near-vertical "bent too much" stubs).
 */
function esterAlkoxyDir(dirOR, preferLeft) {
  const bendA = rot2d(dirOR.x, dirOR.y, 60);
  const bendB = rot2d(dirOR.x, dirOR.y, -60);
  return [bendA, bendB].sort((a, b) => {
    const flat = Math.abs(a.y) - Math.abs(b.y);
    if (Math.abs(flat) > 0.08) return flat;
    if (preferLeft) return a.x - b.x;
    return b.x - a.x;
  })[0];
}

function getAlkylCarbonCount(r) {
  if (!r) return 1;
  const matchCNum = r.match(/^C(\d+)/i);
  if (matchCNum) {
    return parseInt(matchCNum[1], 10);
  }
  const countC = (r.match(/C/g) || []).length;
  if (countC > 0) {
    return countC;
  }
  return 1;
}

/**
 * Draw skeletal O–R stub after ester/ether oxygen (shared by all ester drawings).
 * @param {object} dirOR unit vector from carbonyl toward ether O
 * @param {boolean} preferLeft prefer more-leftward of the two ±60° options when flatness ties
 */
function drawSkeletalAlkoxyStub(fgGroup, lineFn, textFn, orX, orY, dirOR, rGroup, preferLeft) {
  const ink = JCP_STYLE.ink;
  const strokeW = JCP_STYLE.skeletalStroke;
  const ATOM_GAP = JCP_STYLE.atomGapSkeletal;
  const stubLen = JCP_STYLE.alkoxyStubLen;
  const r = rGroup || 'CH3';
  const dirMe = esterAlkoxyDir(dirOR, preferLeft);
  const stub0x = orX + dirMe.x * ATOM_GAP;
  const stub0y = orY + dirMe.y * ATOM_GAP;

  const isAlkyl = /^(CH[23]|[23])+$/i.test(r) || /^C\d+H\d+$/i.test(r);

  if (isAlkyl) {
    const carbonCount = getAlkylCarbonCount(r);
    const pts = [];
    pts.push({ x: stub0x, y: stub0y });

    // First carbon C1
    const pt1 = {
      x: orX + dirMe.x * (ATOM_GAP + stubLen),
      y: orY + dirMe.y * (ATOM_GAP + stubLen)
    };
    pts.push(pt1);

    // Draw first segment
    lineFn(fgGroup, pts[0].x, pts[0].y, pts[1].x, pts[1].y, ink, strokeW);

    if (carbonCount > 1) {
      const bendA = rot2d(dirOR.x, dirOR.y, 60);
      const isBendA = (Math.abs(dirMe.x - bendA.x) < 0.01 && Math.abs(dirMe.y - bendA.y) < 0.01);
      const secondAngle = isBendA ? -60 : 60;

      let currentDir = { x: dirMe.x, y: dirMe.y };
      for (let k = 2; k <= carbonCount; k++) {
        const angle = (k % 2 === 0) ? secondAngle : -secondAngle;
        const nextDir = rot2d(currentDir.x, currentDir.y, angle);

        const prevPt = pts[pts.length - 1];
        const nextPt = {
          x: prevPt.x + nextDir.x * stubLen,
          y: prevPt.y + nextDir.y * stubLen
        };
        pts.push(nextPt);

        lineFn(fgGroup, prevPt.x, prevPt.y, nextPt.x, nextPt.y, ink, strokeW);
        currentDir = nextDir;
      }
    }
  } else {
    const endX = orX + dirMe.x * (ATOM_GAP + 42);
    const endY = orY + dirMe.y * (ATOM_GAP + 42);
    lineFn(fgGroup, stub0x, stub0y, endX, endY, ink, strokeW);
    const lab = formatSubscripts(r);
    const lx = endX + dirMe.x * 16;
    const ly = endY + dirMe.y * 16;
    textFn(fgGroup, lab, lx, ly, null, labelAnchorForDirection(lab, dirMe.x, dirMe.y));
  }
}

/**
 * CDK-style double bond: two parallel strokes separated by doubleSepRatio × bond length,
 * secondary line inset by doublePadRatio at each end.
 */
function jcpDoubleBond(lineFn, parentG, x1, y1, x2, y2, opts = {}) {
  const stroke = opts.stroke || JCP_STYLE.ink;
  const width = opts.width || JCP_STYLE.bondWidth;
  const side = opts.side != null ? opts.side : 0; // -1/0/1: offset direction (0 = centred)
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const sep = (opts.separation != null ? opts.separation : len * JCP_STYLE.doubleSepRatio);
  const pad = (opts.pad != null ? opts.pad : len * JCP_STYLE.doublePadRatio);

  if (side === 0) {
    const ox = nx * (sep / 2);
    const oy = ny * (sep / 2);
    lineFn(parentG, x1 - ox, y1 - oy, x2 - ox, y2 - oy, stroke, width);
    lineFn(parentG, x1 + ox, y1 + oy, x2 + ox, y2 + oy, stroke, width);
  } else {
    // Primary on axis; secondary offset to preferred side (JCP/CDK common for chains)
    lineFn(parentG, x1, y1, x2, y2, stroke, width);
    const ox = side * nx * sep;
    const oy = side * ny * sep;
    lineFn(
      parentG,
      x1 + ox + pad * ux, y1 + oy + pad * uy,
      x2 + ox - pad * ux, y2 + oy - pad * uy,
      stroke,
      opts.secondaryWidth || JCP_STYLE.skeletalDoubleStroke
    );
  }
}

// ==========================================
// SVG Rendering Engine: Structural Formula
// Principal (IUPAC) carbon chain is ALWAYS a straight horizontal line.
// Off-path groups are drawn as vertical branches — no U-shaped overlaps.
// Depicts with JChemPaint/CDK stroke & colour conventions.
// ==========================================
function drawStructural() {
  appState.userZoom = 0.7;
  const svg = document.getElementById('svg-structural');
  svg.innerHTML = '';

  const viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.id = 'viewport-structural';
  svg.appendChild(viewport);

  const spacingX = 85;
  const spacingY = 85;
  const ATOM_R = 14;
  const BOND = 32;
  const LABEL = 14;
  const ink = JCP_STYLE.ink;
  const strokeW = JCP_STYLE.bondWidth;

  const { path, graph, sideChainEster } = getOrientedPrincipalPath();
  const pathSet = new Set(path);

  const bounds = getStructuralBounds(spacingX, spacingY, path);
  const W = Math.max(bounds.maxX - bounds.minX, 40);
  const H = Math.max(bounds.maxY - bounds.minY, 40);
  const midX = (bounds.minX + bounds.maxX) / 2;
  const midY = (bounds.minY + bounds.maxY) / 2;
  const fitScale = Math.min(720 / W, 290 / H, 2.0);

  setFitViewport(fitScale, midX, midY);

  function pathXY(pi) {
    return { x: pi * spacingX, y: 0 };
  }

  function line(parentG, x1, y1, x2, y2, stroke = ink, width = strokeW, className = '') {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', stroke);
    l.setAttribute('stroke-width', width);
    l.setAttribute('stroke-linecap', 'round');
    if (className) l.setAttribute('class', className);
    parentG.appendChild(l);
  }

  function doubleLine(parentG, x1, y1, x2, y2, _verticalUnused = false, stroke = ink) {
    jcpDoubleBond(line, parentG, x1, y1, x2, y2, { stroke, width: strokeW, side: 0 });
  }

  function text(parentG, txt, x, y, className = 'atom-label', textAnchor = 'middle') {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.textContent = txt;
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('class', className + ` ${String(txt).toLowerCase().replace('₃','').replace('₂','')}`);
    t.setAttribute('text-anchor', textAnchor);
    t.style.textAnchor = textAnchor; // beat any CSS default
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('font-size', String(JCP_STYLE.atomFontStructural));
    t.setAttribute('font-weight', 'bold');
    t.setAttribute('fill', jcpAtomFill(txt));
    parentG.appendChild(t);
  }

  function bondFromAtom(parentG, cx, cy, ux, uy, label = null, doubleBond = false) {
    const x1 = cx + ux * ATOM_R;
    const y1 = cy + uy * ATOM_R;
    const x2 = cx + ux * (ATOM_R + BOND);
    const y2 = cy + uy * (ATOM_R + BOND);
    if (doubleBond) doubleLine(parentG, x1, y1, x2, y2);
    else line(parentG, x1, y1, x2, y2);
    if (label) {
      const display = (label === 'NH2') ? 'NH₂' : label;
      const lx = cx + ux * (ATOM_R + BOND + LABEL);
      const ly = cy + uy * (ATOM_R + BOND + LABEL);
      text(parentG, display, lx, ly, 'atom-label', labelAnchorForDirection(display, ux, uy));
    }
  }

  function bondBetweenAtoms(parentG, x1, y1, x2, y2, doubleBond = false) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const ax = x1 + ux * ATOM_R;
    const ay = y1 + uy * ATOM_R;
    const bx = x2 - ux * ATOM_R;
    const by = y2 - uy * ATOM_R;
    if (doubleBond) doubleLine(parentG, ax, ay, bx, by);
    else line(parentG, ax, ay, bx, by);
  }

  function drawO_Alkyl(parentG, cx, cy, ux, uy, rGroupOrLabel) {
    const label = structuralAlkylLabel(rGroupOrLabel, ux, uy);

    // Place O and alkyl on the same grid as C–C so clearances match the chain
    const ox = cx + ux * spacingX;
    const oy = cy + uy * spacingY;
    bondBetweenAtoms(parentG, cx, cy, ox, oy);
    text(parentG, 'O', ox, oy);

    const ax = ox + ux * spacingX;
    const ay = oy + uy * spacingY;
    const len = Math.hypot(ax - ox, ay - oy) || 1;
    const bx = (ax - ox) / len;
    const by = (ay - oy) / len;
    line(parentG, ox + bx * ATOM_R, oy + by * ATOM_R, ax - bx * ATOM_R, ay - by * ATOM_R);
    text(parentG, label, ax, ay, 'atom-label', labelAnchorForDirection(label, ux, uy));
  }

  function drawOH(parentG, cx, cy, ux, uy) {
    const label = (ux < -0.1) ? 'HO' : 'OH';
    bondFromAtom(parentG, cx, cy, ux, uy, label);
  }

  function drawEsterSubstituentStructural(parentG, cx, cy, ux, uy, rGroup, ci) {
    let perpX = -uy;
    let perpY = ux;
    if (ux === 0 && ci !== undefined) {
      perpX = (ci < molecule.chainLength - 1) ? -1 : 1;
      perpY = 0;
    }
    bondFromAtom(parentG, cx, cy, perpX, perpY, 'O', true);
    drawO_Alkyl(parentG, cx, cy, ux, uy, rGroup);
  }

  /** Fully expanded alkyl branch (vertical), used only for OFF-path groups */
  function drawBranchStructural(parentG, cType, startX, startY, dir = 'up') {
    const sign = dir === 'up' ? -1 : 1;
    const branchCy = startY + sign * spacingY;
    bondBetweenAtoms(parentG, startX, startY, startX, branchCy);
    text(parentG, 'C', startX, branchCy);
    if (cType === 'CH3') {
      bondFromAtom(parentG, startX, branchCy, 0, sign, 'H');
      bondFromAtom(parentG, startX, branchCy, -1, 0, 'H');
      bondFromAtom(parentG, startX, branchCy, 1, 0, 'H');
    } else if (cType === 'CH2CH3') {
      bondFromAtom(parentG, startX, branchCy, -1, 0, 'H');
      bondFromAtom(parentG, startX, branchCy, 1, 0, 'H');
      const c2y = branchCy + sign * spacingY;
      bondBetweenAtoms(parentG, startX, branchCy, startX, c2y);
      text(parentG, 'C', startX, c2y);
      bondFromAtom(parentG, startX, c2y, 0, sign, 'H');
      bondFromAtom(parentG, startX, c2y, -1, 0, 'H');
      bondFromAtom(parentG, startX, c2y, 1, 0, 'H');
    }
  }

  function isChainDouble(u, v) {
    if (!u.startsWith('C_') || !v.startsWith('C_')) return false;
    const iu = parseInt(u.split('_')[1], 10);
    const iv = parseInt(v.split('_')[1], 10);
    if (Math.abs(iu - iv) !== 1) return false;
    return molecule.bonds[Math.min(iu, iv)] === 'double';
  }

  // Single-carbon molecule (methane / substituted methane)
  if (molecule.chainLength === 1 && path.length <= 1) {
    const fgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    viewport.appendChild(fgGroup);
    const c = molecule.carbons[0];
    text(fgGroup, 'C', 0, 0);
    const dirs = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] };
    const used = new Set();
    let valenceUsed = 0;

    ['top', 'bottom', 'left', 'right'].forEach(s => {
      const g = c[s];
      if (!g || g === 'H' || g === 'none') return;
      const [ux, uy] = dirs[s];
      used.add(s === 'top' ? 'up' : s === 'bottom' ? 'down' : s);
      if (['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].includes(g) && (s === 'left' || s === 'right')) {
        bondFromAtom(fgGroup, 0, 0, 0, -1, 'O', true);
        used.add('up');
        valenceUsed += 2;
        if (g === 'COOH') {
          drawOH(fgGroup, 0, 0, ux, uy);
        } else if (g === 'CHO') {
          bondFromAtom(fgGroup, 0, 0, ux, uy, 'H');
        } else if (g === 'COOCH3') {
          drawO_Alkyl(fgGroup, 0, 0, ux, uy, 'CH₃');
        } else if (g === 'COOCH2CH3') {
          drawO_Alkyl(fgGroup, 0, 0, ux, uy, 'CH₂CH₃');
        } else if (g === 'ester') {
          const rGroup = getEsterR(c, s);
          drawO_Alkyl(fgGroup, 0, 0, ux, uy, rGroup);
        } else if (g === 'CONH2') {
          drawO_Alkyl(fgGroup, 0, 0, ux, uy, 'NH₂');
        }
        valenceUsed += 1;
      } else if (g === 'ester' && (s === 'top' || s === 'bottom')) {
        drawEsterSubstituentStructural(fgGroup, 0, 0, ux, uy, getEsterR(c, s), 0);
        valenceUsed += 3;
      } else if (g === 'OH') {
        drawOH(fgGroup, 0, 0, ux, uy);
        valenceUsed += 1;
      } else if (g === 'O') {
        bondFromAtom(fgGroup, 0, 0, ux, uy, 'O', true);
        valenceUsed += 2;
      } else if (g === 'NH2') {
        bondFromAtom(fgGroup, 0, 0, ux, uy, 'NH₂');
        valenceUsed += 1;
      } else if (g === 'CH3' || g === 'CH2CH3') {
        drawBranchStructural(fgGroup, g, 0, 0, uy < 0 ? 'up' : 'down');
        valenceUsed += 1;
      } else {
        bondFromAtom(fgGroup, 0, 0, ux, uy, g);
        valenceUsed += 1;
      }
    });

    const hDirs = [];
    if (!used.has('up')) hDirs.push([0, -1]);
    if (!used.has('down')) hDirs.push([0, 1]);
    if (!used.has('left')) hDirs.push([-1, 0]);
    if (!used.has('right')) hDirs.push([1, 0]);
    let needH = Math.max(0, 4 - valenceUsed);
    for (let i = 0; i < hDirs.length && needH > 0; i++) {
      bondFromAtom(fgGroup, 0, 0, hDirs[i][0], hDirs[i][1], 'H');
      needH--;
    }
    applyViewportTransform();
    return;
  }

  const bgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.appendChild(bgGroup);
  const fgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.appendChild(fgGroup);

  // Yellow highlight along the FULL principal chain (including acyl carbonyl)
  for (let i = 0; i < path.length - 1; i++) {
    const a = pathXY(i);
    const b = pathXY(i + 1);
    line(bgGroup, a.x, a.y, b.x, b.y, '#fef08a', 16, 'longest-chain-highlight');
  }

  // Horizontal backbone bonds
  for (let i = 0; i < path.length - 1; i++) {
    const a = pathXY(i);
    const b = pathXY(i + 1);
    bondBetweenAtoms(fgGroup, a.x, a.y, b.x, b.y, isChainDouble(path[i], path[i + 1]));
  }

  // Draw each principal-path carbon + OFF-path vertical branches + H fillers
  path.forEach((nodeId, pi) => {
    const { x: cx, y: cy } = pathXY(pi);
    text(fgGroup, 'C', cx, cy);

    const hasLeft = pi > 0;
    const hasRight = pi < path.length - 1;
    const primaryDir = (pi % 2 === 0) ? 1 : -1;
    let branchSlot = 0;

    function nextBranchSign() {
      const sign = (branchSlot === 0) ? primaryDir : -primaryDir;
      branchSlot++;
      return sign;
    }

    const used = new Set();
    if (hasLeft) used.add('left');
    if (hasRight) used.add('right');

    let valenceUsed = 0;
    if (hasLeft) valenceUsed += isChainDouble(path[pi - 1], path[pi]) ? 2 : 1;
    if (hasRight) valenceUsed += isChainDouble(path[pi], path[pi + 1]) ? 2 : 1;

    // Virtual acyl carbonyl C1: =O up, O–R left as H₃C–O–C(=O)–
    if (nodeId === 'V_carbonyl') {
      bondFromAtom(fgGroup, cx, cy, 0, -1, 'O', true);
      used.add('up');
      valenceUsed += 2;
      const rGroup = sideChainEster ? sideChainEster.rGroup : 'CH3';
      drawO_Alkyl(fgGroup, cx, cy, -1, 0, rGroup);
      used.add('left');
      valenceUsed += 1;
      return;
    }

    if (nodeId.startsWith('C_')) {
      const ci = parseInt(nodeId.split('_')[1], 10);
      const c = molecule.carbons[ci];

      // Find terminal group on this carbon (if it's a terminal carbon)
      function getGroupPriority(val) {
        if (val === 'COOH') return 1;
        if (['COOCH3', 'COOCH2CH3', 'ester'].includes(val)) return 2;
        if (val === 'CONH2') return 3;
        if (val === 'CHO') return 4;
        return 999;
      }

      let terminalGroup = null;
      let terminalSlot = null;
      if (ci === 0 || ci === molecule.chainLength - 1) {
        const slotsToCheck = (ci === 0) ? ['left', 'top', 'bottom'] : ['right', 'top', 'bottom'];
        let bestPriority = 999;
        for (let s of slotsToCheck) {
          const val = c[s];
          const pri = getGroupPriority(val);
          if (pri < bestPriority) {
            bestPriority = pri;
            terminalGroup = val;
            terminalSlot = s;
          }
        }
      }

      if (terminalGroup) {
        bondFromAtom(fgGroup, cx, cy, 0, -1, 'O', true);
        used.add('up');
        valenceUsed += 2;
        
        let ux = 0, uy = 0;
        if (pi === 0) {
          ux = -1; uy = 0;
          used.add('left');
        } else {
          ux = 1; uy = 0;
          used.add('right');
        }
        
        if (terminalGroup === 'COOH') {
          drawOH(fgGroup, cx, cy, ux, uy);
        } else if (terminalGroup === 'CHO') {
          bondFromAtom(fgGroup, cx, cy, ux, uy, 'H');
        } else if (terminalGroup === 'COOCH3') {
          drawO_Alkyl(fgGroup, cx, cy, ux, uy, 'CH₃');
        } else if (terminalGroup === 'COOCH2CH3') {
          drawO_Alkyl(fgGroup, cx, cy, ux, uy, 'CH₂CH₃');
        } else if (terminalGroup === 'ester') {
          const rGroup = getEsterR(c, terminalSlot);
          drawO_Alkyl(fgGroup, cx, cy, ux, uy, rGroup);
        } else if (terminalGroup === 'CONH2') {
          // Unsubstituted amide: direct single-bond to NH₂ from carbonyl carbon
          bondFromAtom(fgGroup, cx, cy, ux, uy, 'NH₂');
        }
        valenceUsed += 1;
      }

      // Determine off-path substituents and their natural directions
      const subsToDraw = [];

      // 1. top slot (skip principal side-chain ester — already drawn as V_carbonyl)
      if (c.top && c.top !== 'H' && c.top !== 'none' && terminalSlot !== 'top') {
        const isPrincipalEster = sideChainEster && sideChainEster.attachNode === `C_${ci}` && sideChainEster.slot === 'top';
        const isPathBranch = (c.top === 'CH3' && pathSet.has(`M_top_${ci}`)) || 
                             (c.top === 'CH2CH3' && pathSet.has(`E1_top_${ci}`));
        if (!isPathBranch && !isPrincipalEster) {
          subsToDraw.push({ g: c.top, dir: 'up', ux: 0, uy: -1 });
        }
      }

      // 2. bottom slot
      if (c.bottom && c.bottom !== 'H' && c.bottom !== 'none' && terminalSlot !== 'bottom') {
        const isPrincipalEster = sideChainEster && sideChainEster.attachNode === `C_${ci}` && sideChainEster.slot === 'bottom';
        const isPathBranch = (c.bottom === 'CH3' && pathSet.has(`M_bottom_${ci}`)) || 
                             (c.bottom === 'CH2CH3' && pathSet.has(`E1_bottom_${ci}`));
        if (!isPathBranch && !isPrincipalEster) {
          subsToDraw.push({ g: c.bottom, dir: 'down', ux: 0, uy: 1 });
        }
      }

      // 3. left slot (only on C_0)
      if (pi === 0) {
        const outerVal = (ci === 0) ? c.left : c.right;
        const outerSlot = (ci === 0) ? 'left' : 'right';
        if (outerVal && outerVal !== 'H' && outerVal !== 'none' && terminalSlot !== outerSlot && !['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].includes(outerVal)) {
          const isPathBranch = (outerVal === 'CH3' && pathSet.has(`M_${outerSlot}_${ci}`)) || 
                               (outerVal === 'CH2CH3' && pathSet.has(`E1_${outerSlot}_${ci}`));
          if (!isPathBranch) {
            subsToDraw.push({ g: outerVal, dir: 'left', ux: -1, uy: 0 });
          }
        }
      }

      // 4. right slot (only on C_last)
      if (pi === path.length - 1) {
        const outerVal = (ci === 0) ? c.left : c.right;
        const outerSlot = (ci === 0) ? 'left' : 'right';
        if (outerVal && outerVal !== 'H' && outerVal !== 'none' && terminalSlot !== outerSlot && !['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].includes(outerVal)) {
          const isPathBranch = (outerVal === 'CH3' && pathSet.has(`M_${outerSlot}_${ci}`)) || 
                               (outerVal === 'CH2CH3' && pathSet.has(`E1_${outerSlot}_${ci}`));
          if (!isPathBranch) {
            subsToDraw.push({ g: outerVal, dir: 'right', ux: 1, uy: 0 });
          }
        }
      }

      // 5. builder-chain neighbors that are off-path
      [ci - 1, ci + 1].forEach(nj => {
        if (nj >= 0 && nj < molecule.chainLength && !pathSet.has(`C_${nj}`)) {
          const ux = nj < ci ? -1 : 1;
          const dir = ux < 0 ? 'left' : 'right';
          const size = countOffPathChainCarbons(nj, ci, pathSet);
          if (size > 0) {
            const g = (size === 2) ? 'CH2CH3' : 'CH3';
            subsToDraw.push({ g, dir, ux, uy: 0 });
          }
        }
      });

      // Draw the collected substituents
      subsToDraw.forEach(({ g, dir, ux, uy }) => {
        if (g === 'CH3' || g === 'CH2CH3') {
          let branchDir = dir;
          if (branchDir === 'left' || branchDir === 'right') {
            branchDir = !used.has('up') ? 'up' : 'down';
          }
          used.add(branchDir);
          valenceUsed += 1;
          drawBranchStructural(fgGroup, g, cx, cy, branchDir);
        } else if (['COOCH3', 'COOCH2CH3', 'ester'].includes(g)) {
          used.add(dir);
          valenceUsed += 3;
          const rGroup = (g === 'COOCH3') ? 'CH3' : (g === 'COOCH2CH3' ? 'CH2CH3' : getEsterR(c, dir === 'up' ? 'top' : (dir === 'down' ? 'bottom' : dir)));
          drawEsterSubstituentStructural(fgGroup, cx, cy, ux, uy, rGroup, ci);
        } else {
          used.add(dir);
          if (g === 'O') {
            valenceUsed += 2;
            bondFromAtom(fgGroup, cx, cy, ux, uy, 'O', true);
          } else {
            valenceUsed += 1;
            if (g === 'OH') {
              drawOH(fgGroup, cx, cy, ux, uy);
            } else if (g === 'NH2') {
              bondFromAtom(fgGroup, cx, cy, ux, uy, 'NH₂');
            } else {
              bondFromAtom(fgGroup, cx, cy, ux, uy, g);
            }
          }
        }
      });
    }

    const hDirs = [];
    if (!used.has('up')) hDirs.push([0, -1]);
    if (!used.has('down')) hDirs.push([0, 1]);
    if (!used.has('left')) hDirs.push([-1, 0]);
    if (!used.has('right')) hDirs.push([1, 0]);

    let needH = Math.max(0, 4 - valenceUsed);
    for (let i = 0; i < hDirs.length && needH > 0; i++) {
      bondFromAtom(fgGroup, cx, cy, hDirs[i][0], hDirs[i][1], 'H');
      needH--;
    }
  });

  applyViewportTransform();
}

// ==========================================
// Skeletal Formula: principal-path zigzag layout
// ==========================================
/**
 * Select & orient the IUPAC principal carbon path for skeletal drawing.
 * Alkyl branches on this path become part of the continuous zigzag backbone.
 * Side-chain ester as PFG: path = longest acyl chain from the attachment carbon.
 */
function getOrientedPrincipalPath() {
  const graph = buildCarbonGraph();
  const allPaths = findAllPaths(graph.adj);
  const hasAcid = (graph.carboxylC !== null);
  const ESTER_VALUES = ['COOCH3', 'COOCH2CH3', 'ester'];

  // Detect side-chain ester sites (top/bottom) when no higher terminal carboxyl FG
  let sideEsterSites = [];
  for (let i = 0; i < molecule.chainLength; i++) {
    if (i === 0 || i === molecule.chainLength - 1) continue;
    const c = molecule.carbons[i];
    if (ESTER_VALUES.includes(c.top)) sideEsterSites.push(`C_${i}`);
    if (ESTER_VALUES.includes(c.bottom)) sideEsterSites.push(`C_${i}`);
  }
  const hasTerminalEster = (() => {
    if (molecule.chainLength < 1) return false;
    const c0 = molecule.carbons[0];
    const cLast = molecule.carbons[molecule.chainLength - 1];
    return ESTER_VALUES.includes(c0.left) || ESTER_VALUES.includes(cLast.right) ||
           ESTER_VALUES.includes(c0.top) || ESTER_VALUES.includes(c0.bottom) ||
           (cLast && (ESTER_VALUES.includes(cLast.top) || ESTER_VALUES.includes(cLast.bottom)));
  })();
  const useSideEsterPath = !hasAcid && !hasTerminalEster && sideEsterSites.length > 0;

  let esterAttach = null;
  if (useSideEsterPath) {
    let best = null;
    let bestLen = -1;
    sideEsterSites.forEach(node => {
      let maxLen = 0;
      allPaths.forEach(p => {
        if (p[0] === node || p[p.length - 1] === node) maxLen = Math.max(maxLen, p.length);
      });
      if (maxLen > bestLen) {
        bestLen = maxLen;
        best = node;
      }
    });
    esterAttach = best;
  }

  let ohCarbons = [];
  for (let i = 0; i < molecule.chainLength; i++) {
    let c = molecule.carbons[i];
    let cnt = (c.top === 'OH' ? 1 : 0) + (c.bottom === 'OH' ? 1 : 0);
    if (i === 0 && c.left === 'OH' && graph.carboxylC !== 'C_0') cnt++;
    if (i === molecule.chainLength - 1 && c.right === 'OH' && graph.carboxylC !== `C_${molecule.chainLength - 1}`) cnt++;
    for (let j = 0; j < cnt; j++) ohCarbons.push(`C_${i}`);
  }

  function pathStats(path) {
    let ohInPath = path.filter(node => ohCarbons.includes(node)).length;
    let dbInPath = 0;
    for (let i = 0; i < path.length - 1; i++) {
      let u = path[i], v = path[i + 1];
      if (u.startsWith('C_') && v.startsWith('C_')) {
        let idxU = parseInt(u.split('_')[1], 10);
        let idxV = parseInt(v.split('_')[1], 10);
        if (molecule.bonds[Math.min(idxU, idxV)] === 'double') dbInPath++;
      }
    }
    let pathSet = new Set(path);
    let subCount = 0;
    path.forEach(node => {
      for (let n of graph.adj[node]) if (!pathSet.has(n)) subCount++;
    });
    return {
      length: path.length,
      hasCarboxyl: (path[0] === graph.carboxylC || path[path.length - 1] === graph.carboxylC) ? 1 : 0,
      ohCount: ohInPath,
      dbCount: dbInPath,
      subCount
    };
  }

  let candidates = allPaths.filter(path => {
    if (useSideEsterPath && esterAttach) {
      return path[0] === esterAttach || path[path.length - 1] === esterAttach;
    }
    if (!hasAcid) return true;
    return path[0] === graph.carboxylC || path[path.length - 1] === graph.carboxylC;
  });
  if (candidates.length === 0) candidates = allPaths;

  candidates.sort((a, b) => {
    let A = pathStats(a), B = pathStats(b);
    if (A.hasCarboxyl !== B.hasCarboxyl) return B.hasCarboxyl - A.hasCarboxyl;
    if (A.ohCount !== B.ohCount) return B.ohCount - A.ohCount;
    if (A.dbCount !== B.dbCount) return B.dbCount - A.dbCount;
    if (A.length !== B.length) return B.length - A.length;
    return B.subCount - A.subCount;
  });

  let mainChain = candidates[0] || ['C_0'];
  let orderA = [...mainChain];
  let orderB = [...mainChain].reverse();

  let winning;
  let sideChainEster = null;
  if (useSideEsterPath && esterAttach) {
    winning = (orderA[0] === esterAttach) ? orderA : orderB;
    const ci = parseInt(esterAttach.split('_')[1], 10);
    const c = molecule.carbons[ci];
    let slot = null;
    if (ESTER_VALUES.includes(c.top)) slot = 'top';
    else if (ESTER_VALUES.includes(c.bottom)) slot = 'bottom';
    if (slot) {
      sideChainEster = {
        attachNode: esterAttach,
        slot,
        rGroup: getEsterR(c, slot) || 'CH3'
      };
      // Virtual carbonyl = IUPAC C1 of the alkanoate (ChemCanvas / JChemPaint style)
      winning = ['V_carbonyl', ...winning];
    }
  } else {
    let idxA = getNodeNaturalIndex(orderA[0]);
    let idxB = getNodeNaturalIndex(orderB[0]);
    winning = idxA <= idxB ? orderA : orderB;
  }

  return {
    path: ensureCarboxylAtPathStart(winning, graph),
    graph,
    sideChainEster
  };
}

function isCarboxylCarbon(node) {
  if (!node) return false;
  if (node === 'V_carbonyl') return true;
  if (!node.startsWith('C_')) return false;
  const ci = parseInt(node.split('_')[1], 10);
  const c = molecule.carbons[ci];
  const terminalTypes = ['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'];
  if (ci === 0) {
    if (terminalTypes.some(t => c.left === t || c.top === t || c.bottom === t)) return true;
  }
  if (ci === molecule.chainLength - 1) {
    if (terminalTypes.some(t => c.right === t || c.top === t || c.bottom === t)) return true;
  }
  return false;
}

/** True when path[0] is a carboxyl / acyl carbonyl (left). */
function isCarboxylAtPathStart(path) {
  if (!path || !path.length) return false;
  return isCarboxylCarbon(path[0]);
}

/** Force carboxylic acids so carboxyl carbon is always path[0] (left). */
function ensureCarboxylAtPathStart(path, graph) {
  if (!path || path.length < 2) return path;
  const first = path[0];
  const last = path[path.length - 1];
  if (isCarboxylCarbon(last) && !isCarboxylCarbon(first)) {
    return [...path].reverse();
  }
  return path;
}

function getSkeletalBounds(dx, dy, L_sub, path) {
  if (!path || path.length === 0) {
    return { minX: -120, maxX: 120, minY: -120, maxY: 120 };
  }

  const acidLeft = isCarboxylAtPathStart(path);
  let minX = 0;
  let maxX = (path.length - 1) * dx;
  let minY = 999;
  let maxY = -999;

  const pathSet = new Set(path);

  function ycOf(pi) {
    // Acid on the left: start at a peak so the first C–C bond goes down-right
    if (acidLeft) return (pi % 2 === 0 ? -dy : dy);
    return (pi % 2 === 0 ? dy : -dy);
  }

  for (let pi = 0; pi < path.length; pi++) {
    let yc = ycOf(pi);
    minY = Math.min(minY, yc);
    maxY = Math.max(maxY, yc);
  }

  path.forEach((nodeId, pi) => {
    let xc = pi * dx;
    let yc = ycOf(pi);

    if (nodeId === 'V_carbonyl') {
      minY = Math.min(minY, yc - 70);
      maxY = Math.max(maxY, yc + 80);
      minX = Math.min(minX, xc - 100);
      return;
    }

    if (!nodeId.startsWith('C_')) return;
    let ci = parseInt(nodeId.split('_')[1], 10);
    let c = molecule.carbons[ci];
    let outwardSign = (yc < 0) ? -1 : 1;

    let offPathSubs = collectSkeletalOffPathSubs(ci, c, pathSet, null);

    const terminalGroups = ['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'ester', 'CONH2'];
    let terminalGroupOnThisC = null;
    if (ci === 0 || ci === path.length - 1) {
      const slotsToCheck = (ci === 0) ? ['left', 'top', 'bottom'] : ['right', 'top', 'bottom'];
      for (let s of slotsToCheck) {
        if (terminalGroups.includes(c[s])) {
          terminalGroupOnThisC = c[s];
          break;
        }
      }
    }

    if (terminalGroupOnThisC) {
      if (['COOCH3', 'COOCH2CH3', 'ester'].includes(terminalGroupOnThisC)) {
        minY = Math.min(minY, yc - 90);
        maxY = Math.max(maxY, yc + 90);
        if (pi === 0) {
          minX = Math.min(minX, xc - 120);
        }
        if (pi === path.length - 1) {
          maxX = Math.max(maxX, xc + 120);
        }
      } else {
        minY = Math.min(minY, yc - 70);
        maxY = Math.max(maxY, yc + 70);
        if (pi === 0) {
          minX = Math.min(minX, xc - 90);
        }
        if (pi === path.length - 1) {
          maxX = Math.max(maxX, xc + 90);
        }
      }
    }

    const esterLike = offPathSubs.some(g => ['COOCH3', 'COOCH2CH3', 'ester', 'COOH', 'CHO', 'CONH2'].includes(g));
    if (esterLike) {
      minY = Math.min(minY, yc - L_sub - 70);
      maxY = Math.max(maxY, yc + L_sub + 70);
      minX = Math.min(minX, xc - L_sub - 40);
      maxX = Math.max(maxX, xc + L_sub + 40);
    }

    if (offPathSubs.length === 1) {
      let endY = yc + outwardSign * L_sub;
      minY = Math.min(minY, endY - 20);
      maxY = Math.max(maxY, endY + 20);
      if (offPathSubs[0] === 'CH2CH3') {
        maxX = Math.max(maxX, xc + L_sub * 0.866 + 22);
      }
    } else if (offPathSubs.length >= 2) {
      minX = Math.min(minX, xc - L_sub * 0.866 - 22);
      maxX = Math.max(maxX, xc + L_sub * 0.866 + 22);
      let ey = yc + outwardSign * L_sub * 0.5;
      minY = Math.min(minY, ey - 20);
      maxY = Math.max(maxY, ey + 20);
    }
  });

  return { minX, maxX, minY, maxY };
}

/**
 * Substituents to draw off a principal-path carbon in the skeletal formula.
 * Includes attachment groups NOT absorbed into the path, plus leftover
 * builder-chain carbons (which appear as methyl / ethyl stubs).
 * @param {object|null} sideChainEster - principal side-chain ester (skip; drawn as acyl C1)
 */
function collectSkeletalOffPathSubs(ci, c, pathSet, sideChainEster = null) {
  const subs = [];
  const ESTER_VALUES = ['COOCH3', 'COOCH2CH3', 'ester'];

  function getGroupPriority(val) {
    if (val === 'COOH') return 1;
    if (['COOCH3', 'COOCH2CH3', 'ester'].includes(val)) return 2;
    if (val === 'CONH2') return 3;
    if (val === 'CHO') return 4;
    return 999;
  }

  let terminalSlot = null;
  if (ci === 0 || ci === molecule.chainLength - 1) {
    const slotsToCheck = (ci === 0) ? ['left', 'top', 'bottom'] : ['right', 'top', 'bottom'];
    let bestPriority = 999;
    for (let s of slotsToCheck) {
      const val = c[s];
      const pri = getGroupPriority(val);
      if (pri < bestPriority) {
        bestPriority = pri;
        terminalSlot = s;
      }
    }
  }

  let list = [['top', c.top], ['bottom', c.bottom]];
  if (ci === 0) list.push(['left', c.left]);
  if (ci === molecule.chainLength - 1) list.push(['right', c.right]);

  list.forEach(([slot, g]) => {
    if (slot === terminalSlot) return; // skip drawn terminal group slot
    if (!g || g === 'H' || g === 'none') return;
    if (sideChainEster && sideChainEster.attachNode === `C_${ci}` && sideChainEster.slot === slot) return;
    if (g === 'CH3' && pathSet.has(`M_${slot}_${ci}`)) return;
    if (g === 'CH2CH3' && pathSet.has(`E1_${slot}_${ci}`)) return;
    
    const terminalGroups = ['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'];
    if ((slot === 'left' || slot === 'right') && terminalGroups.includes(g)) return;
    
    subs.push(g);
  });

  // Off-path chain neighbours → alkyl branch size
  const chainNeighbors = [];
  if (ci > 0) chainNeighbors.push(ci - 1);
  if (ci < molecule.chainLength - 1) chainNeighbors.push(ci + 1);
  chainNeighbors.forEach(nj => {
    if (pathSet.has(`C_${nj}`)) return;
    const size = countOffPathChainCarbons(nj, ci, pathSet);
    if (size <= 0) return;
    if (size === 1) subs.push('CH3');
    else if (size === 2) subs.push('CH2CH3');
    else subs.push('CH3'); // rare longer stub; still show a branch mark
  });

  return subs;
}

/**
 * Acyl carbonyl C1 of skeletal alkanoate (ChemCanvas / JChemPaint / textbook).
 * Trigonal 120°: chain · =O · O–R, with bonds aimed at atom centres.
 */
function drawSkeletalAcylCarbonyl(fgGroup, lineFn, textFn, pt, rGroup, chainPt) {
  const ink = JCP_STYLE.ink;
  const strokeW = JCP_STYLE.skeletalStroke;
  const L = JCP_STYLE.skeletalBondLen;
  const ATOM_GAP = JCP_STYLE.atomGapSkeletal;

  // Unit vector from carbonyl toward next chain carbon
  let cx = 1;
  let cy = 0;
  if (chainPt) {
    cx = chainPt.x - pt.x;
    cy = chainPt.y - pt.y;
    const len = Math.hypot(cx, cy) || 1;
    cx /= len;
    cy /= len;
  }

  // ±120° from the chain bond → trigonal planar carbonyl
  const dA = rot2d(cx, cy, 120);
  const dB = rot2d(cx, cy, -120);
  // =O takes the more upward direction; O–R the other
  const dirOxo = (dA.y <= dB.y) ? dA : dB;
  const dirOR = (dA.y <= dB.y) ? dB : dA;

  // C=O
  const oxoX = pt.x + dirOxo.x * L;
  const oxoY = pt.y + dirOxo.y * L;
  jcpDoubleBond(lineFn, fgGroup, pt.x, pt.y, oxoX, oxoY, {
    stroke: ink,
    width: strokeW,
    side: 0,
    separation: L * JCP_STYLE.doubleSepRatio
  });
  textFn(fgGroup, 'O', pt.x + dirOxo.x * (L + 14), pt.y + dirOxo.y * (L + 14));

  // C–O (ether): stop before the O glyph, resume after for R stub
  const orX = pt.x + dirOR.x * L;
  const orY = pt.y + dirOR.y * L;
  lineFn(
    fgGroup,
    pt.x, pt.y,
    orX - dirOR.x * ATOM_GAP, orY - dirOR.y * ATOM_GAP,
    ink, strokeW
  );
  textFn(fgGroup, 'O', orX, orY);

  drawSkeletalAlkoxyStub(fgGroup, lineFn, textFn, orX, orY, dirOR, rGroup, orX < pt.x);
}

/** Count builder-chain carbons in an off-path side branch starting at startIdx. */
function countOffPathChainCarbons(startIdx, parentIdx, pathSet) {
  let count = 0;
  const visited = new Set([parentIdx]);
  const stack = [startIdx];
  while (stack.length) {
    const i = stack.pop();
    if (visited.has(i) || i < 0 || i >= molecule.chainLength) continue;
    if (pathSet.has(`C_${i}`)) continue;
    visited.add(i);
    count++;
    if (i > 0) stack.push(i - 1);
    if (i < molecule.chainLength - 1) stack.push(i + 1);
  }
  return count;
}

/**
 * Textbook skeletal ester / carboxyl-family branch (JChemPaint/CDK / ChemCanvas):
 * trigonal 120° at carbonyl: parent bond · =O · O–R.
 */
function drawSkeletalEsterFamily(fgGroup, lineFn, textFn, px, py, ux, uy, kind, rGroup, bondLen) {
  const ink = JCP_STYLE.ink;
  const L = bondLen ? bondLen * 0.7 : 50;
  const strokeW = JCP_STYLE.skeletalStroke;
  const ATOM_GAP = JCP_STYLE.atomGapSkeletal;
  const len = Math.hypot(ux, uy) || 1;
  ux /= len;
  uy /= len;

  // Carbonyl centre is the selected carbon atom itself
  const cx = px;
  const cy = py;

  // Chain-equivalent direction for ±120° is the parent→substituent axis (ux,uy)
  const dA = rot2d(ux, uy, 120);
  const dB = rot2d(ux, uy, -120);
  const dirOxo = (dA.y <= dB.y) ? dA : dB;
  const dirOR = (dA.y <= dB.y) ? dB : dA;

  const hasLabelAtCentre = (molecule.chainLength === 1);
  const gap = hasLabelAtCentre ? ATOM_GAP * 1.5 : 0;

  jcpDoubleBond(lineFn, fgGroup, cx + dirOxo.x * gap, cy + dirOxo.y * gap, cx + dirOxo.x * L, cy + dirOxo.y * L, {
    stroke: ink, width: strokeW, side: 0, separation: L * JCP_STYLE.doubleSepRatio
  });
  textFn(fgGroup, 'O', cx + dirOxo.x * (L + 14), cy + dirOxo.y * (L + 14));

  const ox = cx + dirOR.x * L;
  const oy = cy + dirOR.y * L;
  lineFn(fgGroup, cx + dirOR.x * gap, cy + dirOR.y * gap, ox - dirOR.x * ATOM_GAP, oy - dirOR.y * ATOM_GAP, ink, strokeW);

  if (kind === 'COOH') {
    textFn(fgGroup, (dirOR.x < -0.1) ? 'HO' : 'OH', ox, oy);
  } else if (kind === 'CHO') {
    textFn(fgGroup, 'H', ox, oy);
  } else if (kind === 'CONH2') {
    textFn(fgGroup, 'NH₂', ox, oy);
  } else {
    textFn(fgGroup, 'O', ox, oy);
    drawSkeletalAlkoxyStub(fgGroup, lineFn, textFn, ox, oy, dirOR, rGroup, ox < cx);
  }
}

/** Terminal carboxyl-family with 120° geometry relative to the chain (JChemPaint / ChemCanvas). */
function drawSkeletalTerminalCarboxylFamily(fgGroup, lineFn, textFn, pt, isLeft, kind, rGroup, chainPt) {
  const ink = JCP_STYLE.ink;
  const strokeW = JCP_STYLE.skeletalStroke;
  const L = JCP_STYLE.skeletalBondLen;
  const ATOM_GAP = JCP_STYLE.atomGapSkeletal;

  // Chain direction: into the molecule from this terminus
  let cx = isLeft ? 1 : -1;
  let cy = 0;
  if (chainPt) {
    cx = chainPt.x - pt.x;
    cy = chainPt.y - pt.y;
    const len = Math.hypot(cx, cy) || 1;
    cx /= len;
    cy /= len;
  }

  const dA = rot2d(cx, cy, 120);
  const dB = rot2d(cx, cy, -120);
  const dirOxo = (dA.y <= dB.y) ? dA : dB;
  const dirSide = (dA.y <= dB.y) ? dB : dA;

  const gap = 0;

  // C=O
  jcpDoubleBond(lineFn, fgGroup, pt.x + dirOxo.x * gap, pt.y + dirOxo.y * gap, pt.x + dirOxo.x * L, pt.y + dirOxo.y * L, {
    stroke: ink, width: strokeW, side: 0, separation: L * JCP_STYLE.doubleSepRatio
  });
  textFn(fgGroup, 'O', pt.x + dirOxo.x * (L + 14), pt.y + dirOxo.y * (L + 14));

  const sx = pt.x + dirSide.x * L;
  const sy = pt.y + dirSide.y * L;
  lineFn(fgGroup, pt.x + dirSide.x * gap, pt.y + dirSide.y * gap, sx - dirSide.x * ATOM_GAP, sy - dirSide.y * ATOM_GAP, ink, strokeW);

  if (kind === 'COOH') {
    textFn(fgGroup, isLeft ? 'HO' : 'OH', sx, sy);
  } else if (kind === 'CHO') {
    textFn(fgGroup, 'H', sx, sy);
  } else if (kind === 'CONH2') {
    textFn(fgGroup, 'NH₂', sx, sy);
  } else {
    textFn(fgGroup, 'O', sx, sy);
    drawSkeletalAlkoxyStub(fgGroup, lineFn, textFn, sx, sy, dirSide, rGroup, isLeft);
  }
}

// ==========================================
// SVG Rendering Engine: Skeletal Formula
// JChemPaint / CDK: 120° zigzag, C omitted, double-bond sep = 18% bond length
// ==========================================
function drawSkeletal() {
  appState.userZoom = 0.7;
  const svg = document.getElementById('svg-skeletal');
  svg.innerHTML = '';

  const viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.id = 'viewport-skeletal';
  svg.appendChild(viewport);

  // Zigzag with 120° C–C–C bond angles (bonds at ±30° from horizontal) — Brecher / JCP
  const BOND_LEN = JCP_STYLE.skeletalBondLen;
  const HALF_TURN = Math.PI / 6; // 30°
  const dx = BOND_LEN * Math.cos(HALF_TURN);
  const dy = (BOND_LEN * Math.sin(HALF_TURN)) / 2;
  const L_sub = BOND_LEN;
  const ink = JCP_STYLE.ink;
  const strokeW = JCP_STYLE.skeletalStroke;

  function line(parentG, x1, y1, x2, y2, stroke = ink, width = strokeW, className = '') {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', stroke);
    l.setAttribute('stroke-width', width);
    l.setAttribute('stroke-linecap', 'round');
    if (className) l.setAttribute('class', className);
    parentG.appendChild(l);
  }

  function text(parentG, txt, x, y, fillOverride = null, textAnchor = 'middle') {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.textContent = txt;
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('text-anchor', textAnchor);
    t.style.textAnchor = textAnchor;
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('font-size', String(JCP_STYLE.atomFontSkeletal));
    t.setAttribute('font-weight', 'bold');
    t.setAttribute('fill', fillOverride || jcpAtomFill(txt));
    parentG.appendChild(t);
  }

  function drawDoubleBond(parentG, pt1, pt2, pathIdx) {
    // CDK: primary on axis, secondary offset to alternating side
    const side = (pathIdx % 2 === 0) ? 1 : -1;
    jcpDoubleBond(line, parentG, pt1.x, pt1.y, pt2.x, pt2.y, {
      stroke: ink,
      width: strokeW,
      side,
      secondaryWidth: JCP_STYLE.skeletalDoubleStroke
    });
  }

  // Single-carbon special case
  if (molecule.chainLength === 1) {
    const c = molecule.carbons[0];
    const fgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    viewport.appendChild(fgGroup);

    const terminalGroup = ['COOH', 'CHO', 'COOCH3', 'COOCH2CH3', 'CONH2', 'ester'].find(g => c.left === g || c.right === g);
    if (terminalGroup) {
      const isLeft = (c.left === terminalGroup);
      const slot = isLeft ? 'left' : 'right';
      const rGroup = (terminalGroup === 'COOCH3') ? 'CH3'
        : (terminalGroup === 'COOCH2CH3') ? 'CH2CH3'
        : (['ester', 'COOCH3', 'COOCH2CH3'].includes(terminalGroup) ? getEsterR(c, slot) : null);
      const kind = (terminalGroup === 'COOCH3' || terminalGroup === 'COOCH2CH3' || terminalGroup === 'ester') ? 'ester' : terminalGroup;
      drawSkeletalTerminalCarboxylFamily(fgGroup, line, text, { x: 0, y: 0 }, isLeft, kind, rGroup, { x: isLeft ? dx : -dx, y: 2 * dy });
    } else {
      let attachCount = 0;
      ['top', 'bottom', 'left', 'right'].forEach((s, idx) => {
        let g = c[s];
        if (g && g !== 'H' && g !== 'none') {
          const angle = idx * Math.PI / 2;
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const lx = ux * 68;
          const ly = uy * 68;
          if (['COOCH3', 'COOCH2CH3', 'ester'].includes(g)) {
            const rGroup = (g === 'COOCH3') ? 'CH3' : (g === 'COOCH2CH3' ? 'CH2CH3' : getEsterR(c, s));
            drawSkeletalEsterFamily(fgGroup, line, text, 0, 0, ux, uy, 'ester', rGroup, BOND_LEN);
          } else if (['COOH', 'CHO', 'CONH2'].includes(g)) {
            drawSkeletalEsterFamily(fgGroup, line, text, 0, 0, ux, uy, g, null, BOND_LEN);
          } else if (g === 'O') {
            jcpDoubleBond(line, fgGroup, ux * JCP_STYLE.atomGapSkeletal * 1.5, uy * JCP_STYLE.atomGapSkeletal * 1.5, lx, ly, {
              stroke: ink, width: strokeW, side: 0
            });
            text(fgGroup, 'O', lx + ux * 15, ly + uy * 15);
          } else {
            let displayG = g;
            if (displayG === 'NH2') displayG = 'NH₂';
            const gap = JCP_STYLE.atomGapSkeletal;
            line(fgGroup, ux * gap * 2, uy * gap * 2, lx - ux * gap, ly - uy * gap, ink, strokeW);
            text(fgGroup, displayG, lx + ux * 15, ly + uy * 15, null, labelAnchorForDirection(displayG, ux, uy));
          }
          attachCount++;
        }
      });
      if (attachCount === 0) {
        text(fgGroup, 'CH₄', 0, 0);
      } else {
        text(fgGroup, 'C', 0, 0);
      }
    }
    setFitViewport(Math.min(720 / 240, 290 / 240, 2.0), 0, 0);
    return;
  }

  const { path, graph, sideChainEster } = getOrientedPrincipalPath();
  const pathSet = new Set(path);

  const acidLeft = isCarboxylAtPathStart(path);

  function pathCoord(pi) {
    // Acyl / carboxyl on the left: start at a peak so the first C–C bond goes down-right
    if (acidLeft) return { x: pi * dx, y: (pi % 2 === 0 ? -dy : dy) };
    return { x: pi * dx, y: (pi % 2 === 0 ? dy : -dy) };
  }

  // Auto-fit from principal-path layout
  const bounds = getSkeletalBounds(dx, dy, L_sub, path);
  const W = Math.max(bounds.maxX - bounds.minX, 40);
  const H = Math.max(bounds.maxY - bounds.minY, 40);
  const midX = (bounds.minX + bounds.maxX) / 2;
  const midY = (bounds.minY + bounds.maxY) / 2;
  const fitScale = Math.min(720 / W, 290 / H, 2.0);
  setFitViewport(fitScale, midX, midY);

  function isChainDouble(u, v) {
    if (!u.startsWith('C_') || !v.startsWith('C_')) return false;
    const iu = parseInt(u.split('_')[1], 10);
    const iv = parseInt(v.split('_')[1], 10);
    if (Math.abs(iu - iv) !== 1) return false;
    return molecule.bonds[Math.min(iu, iv)] === 'double';
  }

  const bgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.appendChild(bgGroup);
  for (let i = 0; i < path.length - 1; i++) {
    const pt1 = pathCoord(i);
    const pt2 = pathCoord(i + 1);
    line(bgGroup, pt1.x, pt1.y, pt2.x, pt2.y, '#fef08a', 24, 'longest-chain-highlight');
  }

  const fgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.appendChild(fgGroup);

  // Continuous zigzag = principal (IUPAC) carbon chain (includes virtual carbonyl)
  for (let i = 0; i < path.length - 1; i++) {
    const pt1 = pathCoord(i);
    const pt2 = pathCoord(i + 1);
    if (isChainDouble(path[i], path[i + 1])) {
      drawDoubleBond(fgGroup, pt1, pt2, i);
    } else {
      line(fgGroup, pt1.x, pt1.y, pt2.x, pt2.y, ink, strokeW);
    }
  }

  // Off-path substituents drawn from their parent path vertex
  path.forEach((nodeId, pi) => {
    const pt = pathCoord(pi);
    const outwardSign = (pt.y < 0) ? -1 : 1;

    // Virtual acyl carbonyl = C1 of alkanoate
    if (nodeId === 'V_carbonyl') {
      const nextPt = (pi + 1 < path.length) ? pathCoord(pi + 1) : { x: pt.x + dx, y: pt.y };
      drawSkeletalAcylCarbonyl(
        fgGroup, line, text, pt,
        sideChainEster ? sideChainEster.rGroup : 'CH3',
        nextPt
      );
      return;
    }

    if (!nodeId.startsWith('C_')) return;
    const ci = parseInt(nodeId.split('_')[1], 10);
    const c = molecule.carbons[ci];

    // Textbook skeletal style for terminal groups (COOH, CHO, COOCH3, …) on builder ends
    function getGroupPriority(val) {
      if (val === 'COOH') return 1;
      if (['COOCH3', 'COOCH2CH3', 'ester'].includes(val)) return 2;
      if (val === 'CONH2') return 3;
      if (val === 'CHO') return 4;
      return 999;
    }

    let terminalGroup = null;
    let slot = null;
    if (ci === 0 || ci === molecule.chainLength - 1) {
      const slotsToCheck = (ci === 0) ? ['left', 'top', 'bottom'] : ['right', 'top', 'bottom'];
      let bestPriority = 999;
      for (let s of slotsToCheck) {
        const val = c[s];
        const pri = getGroupPriority(val);
        if (pri < bestPriority) {
          bestPriority = pri;
          terminalGroup = val;
          slot = s;
        }
      }
    }

    if (terminalGroup) {
      const isLeft = (pi === 0);
      const rGroup = (terminalGroup === 'COOCH3') ? 'CH3'
        : (terminalGroup === 'COOCH2CH3') ? 'CH2CH3'
        : (['ester', 'COOCH3', 'COOCH2CH3'].includes(terminalGroup) ? getEsterR(c, slot) : null);
      const kind = (terminalGroup === 'COOCH3' || terminalGroup === 'COOCH2CH3' || terminalGroup === 'ester') ? 'ester' : terminalGroup;
      const chainNeighbor = isLeft
        ? (pi + 1 < path.length ? pathCoord(pi + 1) : { x: pt.x + dx, y: pt.y })
        : (pi > 0 ? pathCoord(pi - 1) : { x: pt.x - dx, y: pt.y });
      drawSkeletalTerminalCarboxylFamily(fgGroup, line, text, pt, isLeft, kind, rGroup, chainNeighbor);
      return;
    }

    // Collect substituents that are NOT absorbed into the principal path
    let subs = collectSkeletalOffPathSubs(ci, c, pathSet, sideChainEster).map(g => ({ type: g }));

    function drawOneSub(g, ex, ey, ux, uy) {
      if (g === 'O') g = '=O';
      if (g === 'NH2') g = 'NH₂';
      const gap = JCP_STYLE.atomGapSkeletal;
      if (g === 'CH3') {
        line(fgGroup, pt.x, pt.y, ex, ey, ink, strokeW);
      } else if (g === 'CH2CH3') {
        line(fgGroup, pt.x, pt.y, ex, ey, ink, strokeW);
        if (Math.abs(ux) < 0.1) {
          line(fgGroup, ex, ey, ex + L_sub * 0.866, ey + uy * L_sub * 0.5, ink, strokeW);
        } else {
          const sign = uy >= 0 ? 1 : -1;
          line(fgGroup, ex, ey, ex + Math.sign(ux || 1) * L_sub * 0.866, ey - sign * L_sub * 0.5, ink, strokeW);
        }
      } else if (g === '=O') {
        const lx = pt.x + (L_sub - gap) * ux;
        const ly = pt.y + (L_sub - gap) * uy;
        jcpDoubleBond(line, fgGroup, pt.x, pt.y, lx, ly, {
          stroke: ink, width: strokeW, side: 0
        });
        text(fgGroup, 'O', pt.x + (L_sub + 6) * ux, pt.y + (L_sub + 6) * uy);
      } else if (['COOCH3', 'COOCH2CH3', 'ester'].includes(g)) {
        const slot = (uy < 0) ? 'top' : (uy > 0 ? 'bottom' : (ux < 0 ? 'left' : 'right'));
        const rGroup = (g === 'COOCH3') ? 'CH3' : (g === 'COOCH2CH3' ? 'CH2CH3' : getEsterR(c, slot));
        if (ci === 0 || ci === molecule.chainLength - 1) {
          const chainNeighbor = (ci === 0)
            ? (molecule.chainLength > 1 ? ptOf(1) : null)
            : (molecule.chainLength > 1 ? ptOf(ci - 1) : null);
          drawSkeletalTerminalCarboxylFamily(fgGroup, line, text, pt, ci === 0, 'ester', rGroup, chainNeighbor);
        } else {
          drawSkeletalEsterFamily(fgGroup, line, text, pt.x, pt.y, ux, uy, 'ester', rGroup, L_sub);
        }
      } else if (['COOH', 'CHO', 'CONH2'].includes(g)) {
        if (ci === 0 || ci === molecule.chainLength - 1) {
          const chainNeighbor = (ci === 0)
            ? (molecule.chainLength > 1 ? ptOf(1) : null)
            : (molecule.chainLength > 1 ? ptOf(ci - 1) : null);
          drawSkeletalTerminalCarboxylFamily(fgGroup, line, text, pt, ci === 0, g, null, chainNeighbor);
        } else {
          drawSkeletalEsterFamily(fgGroup, line, text, pt.x, pt.y, ux, uy, g, null, L_sub);
        }
      } else {
        line(fgGroup, pt.x, pt.y, pt.x + (L_sub - gap) * ux, pt.y + (L_sub - gap) * uy, ink, strokeW);
        text(
          fgGroup, g,
          pt.x + (L_sub + 6) * ux, pt.y + (L_sub + 6) * uy,
          null,
          labelAnchorForDirection(g, ux, uy)
        );
      }
    }

    const isTerminal = (pi === 0 || pi === path.length - 1);

    if (isTerminal) {
      // Compute v_chain pointing from the terminal carbon into the chain
      let ux_chain = 0;
      let uy_chain = 0;
      if (pi === 0) {
        const ptNext = pathCoord(1);
        const dx_val = ptNext.x - pt.x;
        const dy_val = ptNext.y - pt.y;
        const len = Math.hypot(dx_val, dy_val) || 1;
        ux_chain = dx_val / len;
        uy_chain = dy_val / len;
      } else {
        const ptPrev = pathCoord(pi - 1);
        const dx_val = ptPrev.x - pt.x;
        const dy_val = ptPrev.y - pt.y;
        const len = Math.hypot(dx_val, dy_val) || 1;
        ux_chain = dx_val / len;
        uy_chain = dy_val / len;
      }

      // Three directions of the 120-degree system pointing away from the chain
      const d1 = { ux: -ux_chain, uy: -uy_chain }; // Straight continuation (180 degrees)
      const d2 = { ux: -ux_chain, uy: uy_chain };  // Diagonal pointing away (120 degrees / zigzag continuation)
      const d3 = { ux: 0, uy: -Math.sign(uy_chain) }; // Vertical pointing away (120 degrees)

      if (subs.length === 1) {
        // 1 substituent: draw along d2 (zigzag continuation)
        const ex = pt.x + L_sub * d2.ux;
        const ey = pt.y + L_sub * d2.uy;
        drawOneSub(subs[0].type, ex, ey, d2.ux, d2.uy);
      } else if (subs.length === 2) {
        // 2 substituents: draw along d2 and d3 (symmetrical Y-shape)
        drawOneSub(subs[0].type, pt.x + L_sub * d2.ux, pt.y + L_sub * d2.uy, d2.ux, d2.uy);
        drawOneSub(subs[1].type, pt.x + L_sub * d3.ux, pt.y + L_sub * d3.uy, d3.ux, d3.uy);
      } else if (subs.length >= 3) {
        // 3 substituents: draw along d1, d2, and d3 (symmetrical tripod)
        const dirs = [d1, d2, d3];
        dirs.forEach((d, idx) => {
          if (idx < subs.length) {
            const ex = pt.x + L_sub * d.ux;
            const ey = pt.y + L_sub * d.uy;
            drawOneSub(subs[idx].type, ex, ey, d.ux, d.uy);
          }
        });
      }
    } else {
      // Internal carbon — ChemCanvas / textbook: opposite vertical stubs for two substituents
      if (subs.length === 1) {
        const ux = 0;
        const uy = outwardSign;
        const ex = pt.x;
        const ey = pt.y + outwardSign * L_sub;
        drawOneSub(subs[0].type, ex, ey, ux, uy);
      } else if (subs.length >= 2) {
        // Prefer methyl/alkyl up, heteroatom down (matches reference ester drawings)
        const ordered = [...subs].sort((a, b) => {
          const rank = (t) => (['CH3', 'CH2CH3'].includes(t.type) ? 0 : 1);
          return rank(a) - rank(b);
        });
        drawOneSub(ordered[0].type, pt.x, pt.y - L_sub, 0, -1);
        drawOneSub(ordered[1].type, pt.x, pt.y + L_sub, 0, 1);
        if (ordered.length > 2) {
          drawOneSub(ordered[2].type, pt.x + L_sub * 0.866, pt.y + outwardSign * L_sub * 0.5, 0.866, outwardSign * 0.5);
        }
      }
    }
  });

  applyViewportTransform();
}

// ==========================================
// Challenge & Quiz Engine (Game Mode)
// ==========================================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isF4Challenge(q) {
  const preset = q.preset;
  if (!preset || !preset.carbons) return true; // fallback
  for (let c of preset.carbons) {
    for (let key in c) {
      const val = c[key];
      if (val === 'CHO' || val === 'O' || val === 'CONH2' || val === 'NH2' || val === 'ester' || val === 'COOCH3' || val === 'COOCH2CH3') {
        return false;
      }
    }
  }
  return true;
}

function isF4Molecule() {
  for (let c of molecule.carbons) {
    for (let key in c) {
      if (['top_esterR', 'bottom_esterR', 'left_esterR', 'right_esterR'].includes(key)) continue;
      const val = c[key];
      if (['CHO', 'O', 'CONH2', 'NH2', 'ester', 'COOCH3', 'COOCH2CH3'].includes(val)) {
        return false;
      }
    }
  }
  return true;
}

function setExploreSyllabus(syllabus) {
  appState.exploreSyllabus = syllabus;
  
  const btnF4 = document.getElementById('btn-explore-f4');
  const btnDse = document.getElementById('btn-explore-dse');
  if (btnF4) btnF4.classList.toggle('active', syllabus === 'F4');
  if (btnDse) btnDse.classList.toggle('active', syllabus === 'DSE');
  
  if (syllabus === 'F4') {
    if (!isF4Molecule()) {
      resetMolecule(true);
    } else {
      updateUI();
    }
  } else {
    updateUI();
  }
}

function setChallengeGrade(grade) {
  appState.challengeGrade = grade;
  
  // Highlight active button
  const btnF4 = document.getElementById('btn-grade-f4');
  const btnF56 = document.getElementById('btn-grade-f56');
  if (btnF4) btnF4.classList.toggle('active', grade === 'F4');
  if (btnF56) btnF56.classList.toggle('active', grade === 'DSE');
  
  // Reset the quiz pools so that questions of the new grade are loaded fresh
  appState.f4Pool = [];
  appState.f56SpecificPool = [];
  startNewChallenge();
  updateUI();
}

function startNewChallenge() {
  if (!appState.f4Pool) appState.f4Pool = [];
  if (!appState.f56SpecificPool) appState.f56SpecificPool = [];

  let qIdx = null;

  if (appState.challengeGrade === 'F4') {
    // F4 Mode: only serve F4 questions
    if (appState.f4Pool.length === 0) {
      let indices = [];
      CHALLENGES.forEach((q, idx) => {
        if (isF4Challenge(q)) indices.push(idx);
      });
      appState.f4Pool = shuffleArray(indices);
    }
    qIdx = appState.f4Pool.pop();
  } else {
    // DSE Mode: 80% chance of DSE specific questions (Esters, Aldehydes, Ketones, Amides, Amines), 20% chance of F4 questions
    let f4Indices = [];
    let f56SpecificIndices = [];
    CHALLENGES.forEach((q, idx) => {
      if (isF4Challenge(q)) {
        f4Indices.push(idx);
      } else {
        f56SpecificIndices.push(idx);
      }
    });

    // Roll probability
    let selectF56Specific = Math.random() < 0.8;
    if (f56SpecificIndices.length === 0) selectF56Specific = false;
    if (f4Indices.length === 0) selectF56Specific = true;

    if (selectF56Specific) {
      if (appState.f56SpecificPool.length === 0) {
        appState.f56SpecificPool = shuffleArray([...f56SpecificIndices]);
      }
      qIdx = appState.f56SpecificPool.pop();
    } else {
      if (appState.f4Pool.length === 0) {
        appState.f4Pool = shuffleArray([...f4Indices]);
      }
      qIdx = appState.f4Pool.pop();
    }
  }
  
  appState.currentQuestion = CHALLENGES[qIdx];
  
  document.getElementById('quiz-instruction-zh').textContent = `請繪製「${appState.currentQuestion.name_zh}」`;
  document.getElementById('quiz-instruction-en').textContent = `Please draw "${appState.currentQuestion.name_en}"`;
  
  if (appState.mode === 'draw') {
    resetMolecule(true);
  }
}

function skipQuestion() {
  appState.isShowingSolution = true;
  // Load target preset into molecule so they see the correct answer
  molecule = JSON.parse(JSON.stringify(appState.currentQuestion.preset));
  appState.inspectingCarbonIndex = 0;
  updateUI();
}

function continueChallenge() {
  appState.isShowingSolution = false;
  startNewChallenge();
  updateUI();
}

/**
 * Normalizes chemical names for robust, typo-tolerant comparisons.
 */
function normalizeChemicalName(name) {
  return name.toLowerCase()
    // Redundant locants that secondary-school names omit
    .replace(/2-methylpropane/g, 'methylpropane')
    .replace(/2-甲基丙烷/g, '甲基丙烷')
    .replace(/2-methylbutane/g, 'methylbutane')
    .replace(/2-甲基丁烷/g, '甲基丁烷')
    .replace(/2-ethylbutane/g, 'ethylbutane')
    .replace(/2-乙基丁烷/g, '乙基丁烷')
    .replace(/1-(fluoro|chloro|bromo|iodo)ethane/g, '$1ethane')
    .replace(/1-(氟|氯|溴|碘)乙烷/g, '$1乙烷')
    .replace(/1-(fluoro|chloro|bromo|iodo)methane/g, '$1methane')
    .replace(/1-(氟|氯|溴|碘)甲烷/g, '$1甲烷')
    .replace(/ethan-1-ol/g, 'ethanol')
    .replace(/乙-1-醇/g, '乙醇')
    .replace(/methan-1-ol/g, 'methanol')
    .replace(/甲-1-醇/g, '甲醇')
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');
}

function checkDrawingAnswer() {
  const result = getIUPACName();
  const target = appState.currentQuestion;
  
  let cleanDrawn = normalizeChemicalName(result.name_en);
  let cleanTarget = normalizeChemicalName(target.name_en);
  
  if (cleanDrawn === cleanTarget) {
    awardSuccess();
  } else {
    alertIncorrectDrawing(result.name_zh, result.name_en);
  }
}

function awardSuccess() {
  appState.score += 10;
  document.getElementById('score-val-zh').textContent = appState.score;
  document.getElementById('score-val-en').textContent = appState.score;
  
  triggerConfetti();
  startNewChallenge();
  updateUI();
}

function alertIncorrectDrawing(drawnZh, drawnEn) {
  if (appState.lang === 'zh') {
    alert(`❌ 答案不太對哦！再試試看！\n你目前繪製的分子是：\n「${drawnZh}」\n(${drawnEn})\n\n而你需要繪製的是：\n「${appState.currentQuestion.name_zh}」`);
  } else {
    alert(`❌ Not quite right yet! Keep trying!\nYour drawn molecule is:\n"${drawnEn}"\n\nBut you need to draw:\n"${appState.currentQuestion.name_en}"`);
  }
}

// ==========================================
// Local Confetti Generator Animation
// ==========================================
function triggerConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#f43f5e', '#0ea5e9', '#10b981', '#f59e0b', '#a855f7'];
  
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    
    el.style.left = `${Math.random() * 100}vw`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    
    container.appendChild(el);
    setTimeout(() => { el.remove(); }, 3000);
  }
}
