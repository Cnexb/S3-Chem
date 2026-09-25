(() => {
  "use strict";

  const CATEGORY_KEYS = {
    alkali: "alkali",
    alkalineEarth: "alkalineEarth",
    transition: "transition",
    postTransition: "postTransition",
    metalloid: "metalloid",
    nonmetal: "nonmetal",
    halogen: "halogen",
    noble: "noble",
    lanthanide: "lanthanide",
    actinide: "actinide",
    unknown: "unknown"
  };

  const PERIODIC_GRID = [
    [1, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2],
    [3, 4, null, null, null, null, null, null, null, null, null, null, 5, 6, 7, 8, 9, 10],
    [11, 12, null, null, null, null, null, null, null, null, null, null, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    [null, null, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, null, null],
    [null, null, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, null, null]
  ];

  const ELEMENTS = [
    null,
    { symbol: "H", en: "Hydrogen", zh: "氫", category: "nonmetal", ar: 1.008 },
    { symbol: "He", en: "Helium", zh: "氦", category: "noble", ar: 4.003 },
    { symbol: "Li", en: "Lithium", zh: "鋰", category: "alkali", ar: 6.94 },
    { symbol: "Be", en: "Beryllium", zh: "鈹", category: "alkalineEarth", ar: 9.012 },
    { symbol: "B", en: "Boron", zh: "硼", category: "metalloid", ar: 10.81 },
    { symbol: "C", en: "Carbon", zh: "碳", category: "nonmetal", ar: 12.011 },
    { symbol: "N", en: "Nitrogen", zh: "氮", category: "nonmetal", ar: 14.007 },
    { symbol: "O", en: "Oxygen", zh: "氧", category: "nonmetal", ar: 15.999 },
    { symbol: "F", en: "Fluorine", zh: "氟", category: "halogen", ar: 18.998 },
    { symbol: "Ne", en: "Neon", zh: "氖", category: "noble", ar: 20.18 },
    { symbol: "Na", en: "Sodium", zh: "鈉", category: "alkali", ar: 22.99 },
    { symbol: "Mg", en: "Magnesium", zh: "鎂", category: "alkalineEarth", ar: 24.305 },
    { symbol: "Al", en: "Aluminium", zh: "鋁", category: "postTransition", ar: 26.982 },
    { symbol: "Si", en: "Silicon", zh: "矽", category: "metalloid", ar: 28.085 },
    { symbol: "P", en: "Phosphorus", zh: "磷", category: "nonmetal", ar: 30.974 },
    { symbol: "S", en: "Sulfur", zh: "硫", category: "nonmetal", ar: 32.06 },
    { symbol: "Cl", en: "Chlorine", zh: "氯", category: "halogen", ar: 35.45 },
    { symbol: "Ar", en: "Argon", zh: "氬", category: "noble", ar: 39.948 },
    { symbol: "K", en: "Potassium", zh: "鉀", category: "alkali", ar: 39.098 },
    { symbol: "Ca", en: "Calcium", zh: "鈣", category: "alkalineEarth", ar: 40.078 },
    { symbol: "Sc", en: "Scandium", zh: "鈧", category: "transition", ar: 44.956 },
    { symbol: "Ti", en: "Titanium", zh: "鈦", category: "transition", ar: 47.867 },
    { symbol: "V", en: "Vanadium", zh: "釩", category: "transition", ar: 50.942 },
    { symbol: "Cr", en: "Chromium", zh: "鉻", category: "transition", ar: 51.996 },
    { symbol: "Mn", en: "Manganese", zh: "錳", category: "transition", ar: 54.938 },
    { symbol: "Fe", en: "Iron", zh: "鐵", category: "transition", ar: 55.845 },
    { symbol: "Co", en: "Cobalt", zh: "鈷", category: "transition", ar: 58.933 },
    { symbol: "Ni", en: "Nickel", zh: "鎳", category: "transition", ar: 58.693 },
    { symbol: "Cu", en: "Copper", zh: "銅", category: "transition", ar: 63.546 },
    { symbol: "Zn", en: "Zinc", zh: "鋅", category: "transition", ar: 65.38 },
    { symbol: "Ga", en: "Gallium", zh: "鎵", category: "postTransition", ar: 69.723 },
    { symbol: "Ge", en: "Germanium", zh: "鍺", category: "metalloid", ar: 72.63 },
    { symbol: "As", en: "Arsenic", zh: "砷", category: "metalloid", ar: 74.922 },
    { symbol: "Se", en: "Selenium", zh: "硒", category: "nonmetal", ar: 78.971 },
    { symbol: "Br", en: "Bromine", zh: "溴", category: "halogen", ar: 79.904 },
    { symbol: "Kr", en: "Krypton", zh: "氪", category: "noble", ar: 83.798 },
    { symbol: "Rb", en: "Rubidium", zh: "銣", category: "alkali", ar: 85.468 },
    { symbol: "Sr", en: "Strontium", zh: "鍶", category: "alkalineEarth", ar: 87.62 },
    { symbol: "Y", en: "Yttrium", zh: "釔", category: "transition", ar: 88.906 },
    { symbol: "Zr", en: "Zirconium", zh: "鋯", category: "transition", ar: 91.224 },
    { symbol: "Nb", en: "Niobium", zh: "鈮", category: "transition", ar: 92.906 },
    { symbol: "Mo", en: "Molybdenum", zh: "鉬", category: "transition", ar: 95.95 },
    { symbol: "Tc", en: "Technetium", zh: "鍀", category: "transition", ar: 98 },
    { symbol: "Ru", en: "Ruthenium", zh: "釕", category: "transition", ar: 101.07 },
    { symbol: "Rh", en: "Rhodium", zh: "銠", category: "transition", ar: 102.91 },
    { symbol: "Pd", en: "Palladium", zh: "鈀", category: "transition", ar: 106.42 },
    { symbol: "Ag", en: "Silver", zh: "銀", category: "transition", ar: 107.87 },
    { symbol: "Cd", en: "Cadmium", zh: "鎘", category: "transition", ar: 112.41 },
    { symbol: "In", en: "Indium", zh: "銦", category: "postTransition", ar: 114.82 },
    { symbol: "Sn", en: "Tin", zh: "錫", category: "postTransition", ar: 118.71 },
    { symbol: "Sb", en: "Antimony", zh: "銻", category: "metalloid", ar: 121.76 },
    { symbol: "Te", en: "Tellurium", zh: "碲", category: "metalloid", ar: 127.6 },
    { symbol: "I", en: "Iodine", zh: "碘", category: "halogen", ar: 126.9 },
    { symbol: "Xe", en: "Xenon", zh: "氙", category: "noble", ar: 131.29 },
    { symbol: "Cs", en: "Caesium", zh: "銫", category: "alkali", ar: 132.91 },
    { symbol: "Ba", en: "Barium", zh: "鋇", category: "alkalineEarth", ar: 137.33 },
    { symbol: "La", en: "Lanthanum", zh: "鑭", category: "lanthanide", ar: 138.91 },
    { symbol: "Ce", en: "Cerium", zh: "鈰", category: "lanthanide", ar: 140.12 },
    { symbol: "Pr", en: "Praseodymium", zh: "鐠", category: "lanthanide", ar: 140.91 },
    { symbol: "Nd", en: "Neodymium", zh: "釹", category: "lanthanide", ar: 144.24 },
    { symbol: "Pm", en: "Promethium", zh: "鉕", category: "lanthanide", ar: 145 },
    { symbol: "Sm", en: "Samarium", zh: "釤", category: "lanthanide", ar: 150.36 },
    { symbol: "Eu", en: "Europium", zh: "銪", category: "lanthanide", ar: 151.96 },
    { symbol: "Gd", en: "Gadolinium", zh: "釓", category: "lanthanide", ar: 157.25 },
    { symbol: "Tb", en: "Terbium", zh: "鋱", category: "lanthanide", ar: 158.93 },
    { symbol: "Dy", en: "Dysprosium", zh: "鏑", category: "lanthanide", ar: 162.5 },
    { symbol: "Ho", en: "Holmium", zh: "鈥", category: "lanthanide", ar: 164.93 },
    { symbol: "Er", en: "Erbium", zh: "鉺", category: "lanthanide", ar: 167.26 },
    { symbol: "Tm", en: "Thulium", zh: "銩", category: "lanthanide", ar: 168.93 },
    { symbol: "Yb", en: "Ytterbium", zh: "鐿", category: "lanthanide", ar: 173.05 },
    { symbol: "Lu", en: "Lutetium", zh: "鎦", category: "lanthanide", ar: 174.97 },
    { symbol: "Hf", en: "Hafnium", zh: "鉿", category: "transition", ar: 178.49 },
    { symbol: "Ta", en: "Tantalum", zh: "鉭", category: "transition", ar: 180.95 },
    { symbol: "W", en: "Tungsten", zh: "鎢", category: "transition", ar: 183.84 },
    { symbol: "Re", en: "Rhenium", zh: "錸", category: "transition", ar: 186.21 },
    { symbol: "Os", en: "Osmium", zh: "鋨", category: "transition", ar: 190.23 },
    { symbol: "Ir", en: "Iridium", zh: "銥", category: "transition", ar: 192.22 },
    { symbol: "Pt", en: "Platinum", zh: "鉑", category: "transition", ar: 195.08 },
    { symbol: "Au", en: "Gold", zh: "金", category: "transition", ar: 196.97 },
    { symbol: "Hg", en: "Mercury", zh: "汞", category: "transition", ar: 200.59 },
    { symbol: "Tl", en: "Thallium", zh: "鉈", category: "postTransition", ar: 204.38 },
    { symbol: "Pb", en: "Lead", zh: "鉛", category: "postTransition", ar: 207.2 },
    { symbol: "Bi", en: "Bismuth", zh: "鉍", category: "postTransition", ar: 208.98 },
    { symbol: "Po", en: "Polonium", zh: "釙", category: "metalloid", ar: 209 },
    { symbol: "At", en: "Astatine", zh: "砈", category: "halogen", ar: 210 },
    { symbol: "Rn", en: "Radon", zh: "氡", category: "noble", ar: 222 },
    { symbol: "Fr", en: "Francium", zh: "鈁", category: "alkali", ar: 223 },
    { symbol: "Ra", en: "Radium", zh: "鐳", category: "alkalineEarth", ar: 226 },
    { symbol: "Ac", en: "Actinium", zh: "錒", category: "actinide", ar: 227 },
    { symbol: "Th", en: "Thorium", zh: "釷", category: "actinide", ar: 232.04 },
    { symbol: "Pa", en: "Protactinium", zh: "鏷", category: "actinide", ar: 231.04 },
    { symbol: "U", en: "Uranium", zh: "鈾", category: "actinide", ar: 238.03 },
    { symbol: "Np", en: "Neptunium", zh: "錼", category: "actinide", ar: 237 },
    { symbol: "Pu", en: "Plutonium", zh: "鈽", category: "actinide", ar: 244 },
    { symbol: "Am", en: "Americium", zh: "鎇", category: "actinide", ar: 243 },
    { symbol: "Cm", en: "Curium", zh: "鋦", category: "actinide", ar: 247 },
    { symbol: "Bk", en: "Berkelium", zh: "錇", category: "actinide", ar: 247 },
    { symbol: "Cf", en: "Californium", zh: "鐦", category: "actinide", ar: 251 },
    { symbol: "Es", en: "Einsteinium", zh: "鎄", category: "actinide", ar: 252 },
    { symbol: "Fm", en: "Fermium", zh: "鐨", category: "actinide", ar: 257 },
    { symbol: "Md", en: "Mendelevium", zh: "鍆", category: "actinide", ar: 258 },
    { symbol: "No", en: "Nobelium", zh: "鍩", category: "actinide", ar: 259 },
    { symbol: "Lr", en: "Lawrencium", zh: "鐒", category: "actinide", ar: 266 },
    { symbol: "Rf", en: "Rutherfordium", zh: "鑪", category: "transition", ar: 267 },
    { symbol: "Db", en: "Dubnium", zh: "𨧀", category: "transition", ar: 268 },
    { symbol: "Sg", en: "Seaborgium", zh: "𨭎", category: "transition", ar: 269 },
    { symbol: "Bh", en: "Bohrium", zh: "𨨏", category: "transition", ar: 270 },
    { symbol: "Hs", en: "Hassium", zh: "𨭆", category: "transition", ar: 269 },
    { symbol: "Mt", en: "Meitnerium", zh: "䥑", category: "unknown", ar: 278 },
    { symbol: "Ds", en: "Darmstadtium", zh: "鐽", category: "unknown", ar: 281 },
    { symbol: "Rg", en: "Roentgenium", zh: "錀", category: "unknown", ar: 282 },
    { symbol: "Cn", en: "Copernicium", zh: "鎶", category: "unknown", ar: 285 },
    { symbol: "Nh", en: "Nihonium", zh: "鉨", category: "unknown", ar: 286 },
    { symbol: "Fl", en: "Flerovium", zh: "鈇", category: "unknown", ar: 289 },
    { symbol: "Mc", en: "Moscovium", zh: "鏌", category: "unknown", ar: 290 },
    { symbol: "Lv", en: "Livermorium", zh: "鉝", category: "unknown", ar: 293 },
    { symbol: "Ts", en: "Tennessine", zh: "鿬", category: "unknown", ar: 294 },
    { symbol: "Og", en: "Oganesson", zh: "鿫", category: "unknown", ar: 294 }
  ];

  const ISOTOPE_PRESETS = {
    H: [{ mass: 1, abundance: 99.9855 }, { mass: 2, abundance: 0.0145 }],
    He: [{ mass: 3, abundance: 0.0002 }, { mass: 4, abundance: 99.9998 }],
    Li: [{ mass: 6, abundance: 4.85 }, { mass: 7, abundance: 95.15 }],
    Be: [{ mass: 9, abundance: 100 }],
    B: [{ mass: 10, abundance: 19.65 }, { mass: 11, abundance: 80.35 }],
    C: [{ mass: 12, abundance: 98.94 }, { mass: 13, abundance: 1.06 }],
    N: [{ mass: 14, abundance: 99.6205 }, { mass: 15, abundance: 0.3795 }],
    O: [{ mass: 16, abundance: 99.757 }, { mass: 17, abundance: 0.03835 }, { mass: 18, abundance: 0.2045 }],
    F: [{ mass: 19, abundance: 100 }],
    Ne: [{ mass: 20, abundance: 90.48 }, { mass: 21, abundance: 0.27 }, { mass: 22, abundance: 9.25 }],
    Na: [{ mass: 23, abundance: 100 }],
    Mg: [{ mass: 24, abundance: 78.965 }, { mass: 25, abundance: 10.011 }, { mass: 26, abundance: 11.025 }],
    Al: [{ mass: 27, abundance: 100 }],
    Si: [{ mass: 28, abundance: 92.2545 }, { mass: 29, abundance: 4.672 }, { mass: 30, abundance: 3.0735 }],
    P: [{ mass: 31, abundance: 100 }],
    S: [{ mass: 32, abundance: 94.85 }, { mass: 33, abundance: 0.763 }, { mass: 34, abundance: 4.365 }, { mass: 36, abundance: 0.0158 }],
    Cl: [{ mass: 35, abundance: 75.8 }, { mass: 37, abundance: 24.2 }],
    Ar: [{ mass: 36, abundance: 1.035 }, { mass: 38, abundance: 2.15 }, { mass: 40, abundance: 96.8 }],
    K: [{ mass: 39, abundance: 93.2581 }, { mass: 40, abundance: 0.0117 }, { mass: 41, abundance: 6.7302 }],
    Ca: [{ mass: 40, abundance: 96.941 }, { mass: 42, abundance: 0.647 }, { mass: 43, abundance: 0.135 }, { mass: 44, abundance: 2.086 }, { mass: 46, abundance: 0.004 }, { mass: 48, abundance: 0.187 }],
    Sc: [{ mass: 45, abundance: 100 }],
    Ti: [{ mass: 46, abundance: 8.25 }, { mass: 47, abundance: 7.44 }, { mass: 48, abundance: 73.72 }, { mass: 49, abundance: 5.41 }, { mass: 50, abundance: 5.18 }],
    V: [{ mass: 50, abundance: 0.25 }, { mass: 51, abundance: 99.75 }],
    Cr: [{ mass: 50, abundance: 4.345 }, { mass: 52, abundance: 83.789 }, { mass: 53, abundance: 9.501 }, { mass: 54, abundance: 2.365 }],
    Mn: [{ mass: 55, abundance: 100 }],
    Fe: [{ mass: 53.939608, abundance: 5.845 }, { mass: 55.934936, abundance: 91.754 }, { mass: 56.935392, abundance: 2.119 }, { mass: 57.933274, abundance: 0.282 }],
    Co: [{ mass: 59, abundance: 100 }],
    Ni: [{ mass: 58, abundance: 68.0769 }, { mass: 60, abundance: 26.2231 }, { mass: 61, abundance: 1.1399 }, { mass: 62, abundance: 3.6345 }, { mass: 64, abundance: 0.9256 }],
    Cu: [{ mass: 63, abundance: 69.15 }, { mass: 65, abundance: 30.85 }],
    Zn: [{ mass: 64, abundance: 49.17 }, { mass: 66, abundance: 27.73 }, { mass: 67, abundance: 4.04 }, { mass: 68, abundance: 18.45 }, { mass: 70, abundance: 0.61 }],
    Ga: [{ mass: 69, abundance: 60.108 }, { mass: 71, abundance: 39.892 }],
    Ge: [{ mass: 70, abundance: 20.52 }, { mass: 72, abundance: 27.45 }, { mass: 73, abundance: 7.76 }, { mass: 74, abundance: 36.52 }, { mass: 76, abundance: 7.75 }],
    As: [{ mass: 75, abundance: 100 }],
    Se: [{ mass: 74, abundance: 0.86 }, { mass: 76, abundance: 9.23 }, { mass: 77, abundance: 7.6 }, { mass: 78, abundance: 23.69 }, { mass: 80, abundance: 49.8 }, { mass: 82, abundance: 8.82 }],
    Br: [{ mass: 79, abundance: 50.65 }, { mass: 81, abundance: 49.35 }],
    Kr: [{ mass: 78, abundance: 0.355 }, { mass: 80, abundance: 2.286 }, { mass: 82, abundance: 11.593 }, { mass: 83, abundance: 11.5 }, { mass: 84, abundance: 56.987 }, { mass: 86, abundance: 17.279 }],
    Rb: [{ mass: 85, abundance: 72.17 }, { mass: 87, abundance: 27.83 }],
    Sr: [{ mass: 84, abundance: 0.56 }, { mass: 86, abundance: 9.86 }, { mass: 87, abundance: 7 }, { mass: 88, abundance: 82.58 }],
    Y: [{ mass: 89, abundance: 100 }],
    Zr: [{ mass: 90, abundance: 51.47 }, { mass: 91, abundance: 11.23 }, { mass: 92, abundance: 17.16 }, { mass: 94, abundance: 17.36 }, { mass: 96, abundance: 2.78 }],
    Nb: [{ mass: 93, abundance: 100 }],
    Mo: [{ mass: 92, abundance: 14.649 }, { mass: 94, abundance: 9.187 }, { mass: 95, abundance: 15.873 }, { mass: 96, abundance: 16.673 }, { mass: 97, abundance: 9.582 }, { mass: 98, abundance: 24.292 }, { mass: 100, abundance: 9.744 }],
    Ru: [{ mass: 96, abundance: 5.54 }, { mass: 98, abundance: 1.87 }, { mass: 99, abundance: 12.76 }, { mass: 100, abundance: 12.6 }, { mass: 101, abundance: 17.06 }, { mass: 102, abundance: 31.55 }, { mass: 104, abundance: 18.62 }],
    Rh: [{ mass: 103, abundance: 100 }],
    Pd: [{ mass: 102, abundance: 1.02 }, { mass: 104, abundance: 11.14 }, { mass: 105, abundance: 22.33 }, { mass: 106, abundance: 27.33 }, { mass: 108, abundance: 26.46 }, { mass: 110, abundance: 11.72 }],
    Ag: [{ mass: 107, abundance: 51.839 }, { mass: 109, abundance: 48.161 }],
    Cd: [{ mass: 106, abundance: 1.245 }, { mass: 108, abundance: 0.888 }, { mass: 110, abundance: 12.47 }, { mass: 111, abundance: 12.795 }, { mass: 112, abundance: 24.109 }, { mass: 113, abundance: 12.227 }, { mass: 114, abundance: 28.754 }, { mass: 116, abundance: 7.512 }],
    In: [{ mass: 113, abundance: 4.281 }, { mass: 115, abundance: 95.719 }],
    Sn: [{ mass: 112, abundance: 0.97 }, { mass: 114, abundance: 0.66 }, { mass: 115, abundance: 0.34 }, { mass: 116, abundance: 14.54 }, { mass: 117, abundance: 7.68 }, { mass: 118, abundance: 24.22 }, { mass: 119, abundance: 8.59 }, { mass: 120, abundance: 32.59 }, { mass: 122, abundance: 4.63 }, { mass: 124, abundance: 5.79 }],
    Sb: [{ mass: 121, abundance: 57.21 }, { mass: 123, abundance: 42.79 }],
    Te: [{ mass: 120, abundance: 0.09 }, { mass: 122, abundance: 2.55 }, { mass: 123, abundance: 0.89 }, { mass: 124, abundance: 4.74 }, { mass: 125, abundance: 7.07 }, { mass: 126, abundance: 18.84 }, { mass: 128, abundance: 31.74 }, { mass: 130, abundance: 34.08 }],
    I: [{ mass: 127, abundance: 100 }],
    Xe: [{ mass: 124, abundance: 0.095 }, { mass: 126, abundance: 0.089 }, { mass: 128, abundance: 1.91 }, { mass: 129, abundance: 26.401 }, { mass: 130, abundance: 4.071 }, { mass: 131, abundance: 21.232 }, { mass: 132, abundance: 26.909 }, { mass: 134, abundance: 10.436 }, { mass: 136, abundance: 8.857 }],
    Cs: [{ mass: 133, abundance: 100 }],
    Ba: [{ mass: 130, abundance: 0.11 }, { mass: 132, abundance: 0.1 }, { mass: 134, abundance: 2.42 }, { mass: 135, abundance: 6.59 }, { mass: 136, abundance: 7.85 }, { mass: 137, abundance: 11.23 }, { mass: 138, abundance: 71.7 }],
    La: [{ mass: 138, abundance: 0.08881 }, { mass: 139, abundance: 99.91119 }],
    Ce: [{ mass: 136, abundance: 0.185 }, { mass: 138, abundance: 0.251 }, { mass: 140, abundance: 88.45 }, { mass: 142, abundance: 11.114 }],
    Pr: [{ mass: 141, abundance: 100 }],
    Nd: [{ mass: 142, abundance: 27.152 }, { mass: 143, abundance: 12.174 }, { mass: 144, abundance: 23.798 }, { mass: 145, abundance: 8.293 }, { mass: 146, abundance: 17.189 }, { mass: 148, abundance: 5.756 }, { mass: 150, abundance: 5.638 }],
    Sm: [{ mass: 144, abundance: 3.08 }, { mass: 147, abundance: 15 }, { mass: 148, abundance: 11.25 }, { mass: 149, abundance: 13.82 }, { mass: 150, abundance: 7.37 }, { mass: 152, abundance: 26.74 }, { mass: 154, abundance: 22.74 }],
    Eu: [{ mass: 151, abundance: 47.81 }, { mass: 153, abundance: 52.19 }],
    Gd: [{ mass: 152, abundance: 0.204 }, { mass: 154, abundance: 2.187 }, { mass: 155, abundance: 14.828 }, { mass: 156, abundance: 20.493 }, { mass: 157, abundance: 15.657 }, { mass: 158, abundance: 24.82 }, { mass: 160, abundance: 21.811 }],
    Tb: [{ mass: 159, abundance: 100 }],
    Dy: [{ mass: 156, abundance: 0.056 }, { mass: 158, abundance: 0.095 }, { mass: 160, abundance: 2.329 }, { mass: 161, abundance: 18.889 }, { mass: 162, abundance: 25.475 }, { mass: 163, abundance: 24.896 }, { mass: 164, abundance: 28.26 }],
    Ho: [{ mass: 165, abundance: 100 }],
    Er: [{ mass: 162, abundance: 0.139 }, { mass: 164, abundance: 1.601 }, { mass: 166, abundance: 33.503 }, { mass: 167, abundance: 22.869 }, { mass: 168, abundance: 26.978 }, { mass: 170, abundance: 14.91 }],
    Tm: [{ mass: 169, abundance: 100 }],
    Yb: [{ mass: 168, abundance: 0.126 }, { mass: 170, abundance: 3.023 }, { mass: 171, abundance: 14.216 }, { mass: 172, abundance: 21.754 }, { mass: 173, abundance: 16.098 }, { mass: 174, abundance: 31.896 }, { mass: 176, abundance: 12.887 }],
    Lu: [{ mass: 175, abundance: 97.414 }, { mass: 176, abundance: 2.586 }],
    Hf: [{ mass: 174, abundance: 0.161 }, { mass: 176, abundance: 5.24 }, { mass: 177, abundance: 18.58 }, { mass: 178, abundance: 27.28 }, { mass: 179, abundance: 13.63 }, { mass: 180, abundance: 35.12 }],
    Ta: [{ mass: 180, abundance: 0.01176 }, { mass: 181, abundance: 99.98824 }],
    W: [{ mass: 180, abundance: 0.12 }, { mass: 182, abundance: 26.5 }, { mass: 183, abundance: 14.31 }, { mass: 184, abundance: 30.64 }, { mass: 186, abundance: 28.43 }],
    Re: [{ mass: 185, abundance: 37.4 }, { mass: 187, abundance: 62.6 }],
    Os: [{ mass: 184, abundance: 0.02 }, { mass: 186, abundance: 1.59 }, { mass: 187, abundance: 1.96 }, { mass: 188, abundance: 13.24 }, { mass: 189, abundance: 16.15 }, { mass: 190, abundance: 26.26 }, { mass: 192, abundance: 40.78 }],
    Ir: [{ mass: 191, abundance: 37.23 }, { mass: 193, abundance: 62.77 }],
    Pt: [{ mass: 190, abundance: 0.012 }, { mass: 192, abundance: 0.782 }, { mass: 194, abundance: 32.864 }, { mass: 195, abundance: 33.775 }, { mass: 196, abundance: 25.211 }, { mass: 198, abundance: 7.356 }],
    Au: [{ mass: 197, abundance: 100 }],
    Hg: [{ mass: 196, abundance: 0.15 }, { mass: 198, abundance: 10.04 }, { mass: 199, abundance: 16.94 }, { mass: 200, abundance: 23.14 }, { mass: 201, abundance: 13.17 }, { mass: 202, abundance: 29.74 }, { mass: 204, abundance: 6.82 }],
    Tl: [{ mass: 203, abundance: 29.515 }, { mass: 205, abundance: 70.485 }],
    Pb: [{ mass: 204, abundance: 1.4 }, { mass: 206, abundance: 24.1 }, { mass: 207, abundance: 22.1 }, { mass: 208, abundance: 52.4 }],
    Bi: [{ mass: 209, abundance: 100 }],
    Th: [{ mass: 230, abundance: 0.02 }, { mass: 232, abundance: 99.98 }],
    Pa: [{ mass: 231, abundance: 100 }],
    U: [{ mass: 234, abundance: 0.0054 }, { mass: 235, abundance: 0.7204 }, { mass: 238, abundance: 99.2742 }]
  };

  const PRESET_SYMBOLS = ["Cl", "Ca", "Mg", "Cu", "Br", "Pb", "Fe", "Ag"];

  function getElement(atomicNumber) {
    return ELEMENTS[atomicNumber] || null;
  }

  function getElementBySymbol(symbol) {
    return ELEMENTS.find(element => element && element.symbol === symbol) || null;
  }

  function normalizeRows(rows) {
    const total = rows.reduce((sum, row) => sum + row.abundance, 0);
    if (total <= 0) return rows.map(row => ({ ...row }));
    return rows.map(row => ({
      mass: row.mass,
      abundance: row.abundance * 100 / total
    }));
  }

  function getIsotopeRows(symbol) {
    const element = getElementBySymbol(symbol);
    if (!element) {
      return { rows: [], allIsotopes: [], naturalIsotopes: [], totalIsotopes: 0, naturalCount: 0, simplified: false, truncated: false };
    }

    const preset = ISOTOPE_PRESETS[symbol];
    const naturalSource = preset
      ? normalizeRows(preset.map(row => ({ ...row })))
      : [];
    const allIsotopes = window.IsotopeCatalog.mergeKnownIsotopes(symbol, naturalSource);
    const naturalIsotopes = allIsotopes.filter(row => row.natural);
    const simplified = naturalIsotopes.length === 0;

    if (!simplified) {
      const rows = [...naturalIsotopes]
        .sort((a, b) => a.mass - b.mass)
        .map(row => ({
          mass: row.mass,
          abundance: row.abundance
        }));
      return {
        rows,
        allIsotopes: allIsotopes.map(row => ({
          ...row,
          loaded: row.natural
        })),
        naturalIsotopes,
        totalIsotopes: allIsotopes.length,
        naturalCount: naturalIsotopes.length,
        simplified: false,
        truncated: false
      };
    }

    const knownMasses = allIsotopes.map(row => row.mass);
    const targetMass = Math.round(element.ar);
    const exampleMass = knownMasses.length
      ? knownMasses.reduce((closest, mass) => (
        Math.abs(mass - targetMass) < Math.abs(closest - targetMass) ? mass : closest
      ))
      : targetMass;
    const exampleRow = { mass: exampleMass, abundance: 100, natural: false, example: true, loaded: true };
    const fallbackList = (allIsotopes.length ? allIsotopes : [exampleRow]).map(row => (
      row.mass === exampleMass
        ? { ...row, abundance: 100, natural: false, example: true, loaded: true }
        : { ...row, example: false, loaded: false }
    ));
    if (!fallbackList.some(row => row.mass === exampleMass)) {
      fallbackList.push(exampleRow);
      fallbackList.sort((a, b) => a.mass - b.mass);
    }
    return {
      rows: [{ mass: exampleMass, abundance: 100 }],
      allIsotopes: fallbackList,
      naturalIsotopes: [],
      totalIsotopes: fallbackList.length,
      naturalCount: 0,
      simplified: true,
      truncated: false
    };
  }

  window.ElementLibrary = {
    CATEGORY_KEYS,
    PERIODIC_GRID,
    ELEMENTS,
    ISOTOPE_PRESETS,
    PRESET_SYMBOLS,
    getElement,
    getElementBySymbol,
    getIsotopeRows
  };
})();
