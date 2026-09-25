/** quizData.js — Topic 3 Metals question bank (48 items from topic-03-metals.pdf) */

export const QUIZ_SECTIONS = [
  { id: "uses", label: "Uses of Metals", labelZh: "金屬用途" },
  { id: "extraction", label: "Extraction (Fe / Al)", labelZh: "金屬提取（鐵／鋁）" },
  { id: "reactivity", label: "Reactivity Series", labelZh: "金屬活性序" },
  { id: "reactions", label: "Metal Reactions", labelZh: "金屬反應" },
  { id: "displacement", label: "Displacement", labelZh: "置換反應" },
  { id: "corrosion", label: "Corrosion & Rust", labelZh: "腐蝕與生鏽" },
  { id: "mole", label: "Mole Calculations", labelZh: "摩爾計算" },
];

const T = (value) => ({ type: "text", value });
const B = (accept) => ({ type: "blank", accept });

export const QUIZ_ITEMS = [
  /* Uses of metals — 6 */
  {
    id: "uses-1", section: "uses", difficulty: "Foundation",
    stem: "Which property makes copper suitable for electric wires?",
    options: [
      { key: "A", text: "Low density" },
      { key: "B", text: "Good electrical conductor and ductile" },
      { key: "C", text: "Magnetic" },
      { key: "D", text: "Liquid at room temperature" },
    ],
    answer: "B", hint: "Copper is used for wiring because electrons flow easily through it.",
  },
  {
    id: "uses-2", section: "uses", difficulty: "Foundation",
    stem: "Aluminium is used in aircraft bodies mainly because it is:",
    options: [
      { key: "A", text: "Magnetic and cheap" },
      { key: "B", text: "Strong, corrosion resistant and low density" },
      { key: "C", text: "The best electrical conductor" },
      { key: "D", text: "Liquid at room temperature" },
    ],
    answer: "B", hint: "Aircraft need lightweight, strong materials.",
  },
  {
    id: "uses-3", section: "uses", difficulty: "Foundation",
    stem: "Mercury is used in thermometers because it:",
    options: [
      { key: "A", text: "Is a gas at room temperature" },
      { key: "B", text: "Expands on heating and is liquid at room conditions" },
      { key: "C", text: "Is the best electrical conductor" },
      { key: "D", text: "Does not react with anything" },
    ],
    answer: "B", hint: "Thermometers need a liquid that expands predictably.",
  },
  {
    id: "uses-4", section: "uses", difficulty: "Foundation",
    stem: "Titanium is used for metal implants in the human body because it is:",
    options: [
      { key: "A", text: "Magnetic" },
      { key: "B", text: "Low density, corrosion resistant and biocompatible" },
      { key: "C", text: "The cheapest metal" },
      { key: "D", text: "Liquid at body temperature" },
    ],
    answer: "B", hint: "Implants must not corrode inside the body.",
  },
  {
    id: "uses-5", section: "uses", difficulty: "Foundation",
    stem: "Which metal is used in jewellery partly because of its attractive appearance and corrosion resistance?",
    options: [
      { key: "A", text: "Iron" },
      { key: "B", text: "Sodium" },
      { key: "C", text: "Gold" },
      { key: "D", text: "Calcium" },
    ],
    answer: "C", hint: "A precious metal that does not tarnish easily.",
  },
  {
    id: "uses-6", section: "uses", difficulty: "Foundation",
    stem: "Iron is widely used in construction because it is:",
    options: [
      { key: "A", text: "Soft and low density" },
      { key: "B", text: "Hard, strong, malleable and cheap" },
      { key: "C", text: "Liquid at room temperature" },
      { key: "D", text: "The best electrical conductor" },
    ],
    answer: "B", hint: "Construction materials need strength and affordability.",
  },

  /* Extraction — 9 */
  {
    id: "ext-1", section: "extraction", difficulty: "Standard",
    stem: "In the blast furnace, what is the reducing agent that converts Fe₂O₃ to iron?",
    options: [
      { key: "A", text: "Carbon dioxide" },
      { key: "B", text: "Carbon monoxide" },
      { key: "C", text: "Oxygen" },
      { key: "D", text: "Calcium oxide" },
    ],
    answer: "B", hint: "Step 3: 3CO + Fe₂O₃ → 3CO₂ + 2Fe",
  },
  {
    id: "ext-2", section: "extraction", difficulty: "Standard",
    stem: "What is the purpose of adding limestone to the blast furnace?",
    options: [
      { key: "A", text: "To reduce iron ore" },
      { key: "B", text: "To remove impurities as slag" },
      { key: "C", text: "To produce carbon monoxide" },
      { key: "D", text: "To cool the furnace" },
    ],
    answer: "B", hint: "CaO reacts with SiO₂ to form CaSiO₃ slag.",
  },
  {
    id: "ext-3", section: "extraction", format: "tf", difficulty: "Foundation",
    stem: "Cryolite is added during aluminium extraction to reduce the melting point of the ore.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "Bauxite alone melts at about 2000 °C.",
  },
  {
    id: "ext-4", section: "extraction", difficulty: "Standard",
    stem: "At the negative electrode during aluminium extraction, the reaction is:",
    options: [
      { key: "A", text: "2O²⁻ → O₂ + 4e⁻" },
      { key: "B", text: "Al³⁺ + 3e⁻ → Al" },
      { key: "C", text: "Al → Al³⁺ + 3e⁻" },
      { key: "D", text: "O₂ + 4e⁻ → 2O²⁻" },
    ],
    answer: "B", hint: "Aluminium ions gain electrons at the cathode.",
  },
  {
    id: "ext-5", section: "extraction", difficulty: "Standard",
    stem: "Iron was discovered and used much earlier than aluminium because:",
    options: [
      { key: "A", text: "Iron is more reactive" },
      { key: "B", text: "Iron is less reactive and its ore is easier to extract" },
      { key: "C", text: "Iron is more abundant only" },
      { key: "D", text: "Aluminium does not form ores" },
    ],
    answer: "B", hint: "Less reactive metals have less stable ores.",
  },
  {
    id: "ext-6", section: "extraction", difficulty: "Standard",
    stem: "Which extraction method is used for aluminium?",
    options: [
      { key: "A", text: "Heating ore alone" },
      { key: "B", text: "Heating with carbon" },
      { key: "C", text: "Electrolysis of molten ore" },
      { key: "D", text: "Heating with hydrogen only" },
    ],
    answer: "C", hint: "Al is very reactive — needs electrolysis.",
  },
  {
    id: "ext-7", section: "extraction", format: "tf", difficulty: "Standard",
    stem: "Heating CuO with hydrogen can produce copper metal.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "CuO + H₂ → Cu + H₂O",
  },
  {
    id: "ext-8", section: "extraction", difficulty: "Standard",
    stem: "Which metals can be extracted by heating their oxides alone (e.g. 2Ag₂O → 4Ag + O₂)?",
    options: [
      { key: "A", text: "K and Na" },
      { key: "B", text: "Al and Mg" },
      { key: "C", text: "Ag and Hg" },
      { key: "D", text: "Fe and Zn" },
    ],
    answer: "C", hint: "Only the least reactive metals.",
  },
  {
    id: "ext-fill-1", section: "extraction", format: "fill", difficulty: "Foundation",
    stem: "Fill in the blank — blast furnace extraction of iron",
    lines: [
      {
        segments: [
          T("In Step 3, haematite (Fe₂O₃) is reduced by "),
          B(["carbon monoxide", "CO"]),
          T(", which acts as the reducing agent."),
        ],
      },
    ],
    hint: "Step 3: 3CO + Fe₂O₃ → 3CO₂ + 2Fe",
  },

  /* Reactivity series — 6 */
  {
    id: "react-1", section: "reactivity", difficulty: "Foundation",
    stem: "Which metal is the MOST reactive in the series K, Na, Ca, Mg, Al, Zn, Fe, Pb, Cu, Hg, Ag, Au?",
    options: [
      { key: "A", text: "Gold (Au)" },
      { key: "B", text: "Potassium (K)" },
      { key: "C", text: "Copper (Cu)" },
      { key: "D", text: "Zinc (Zn)" },
    ],
    answer: "B", hint: "K is at the top of the reactivity series.",
  },
  {
    id: "react-2", section: "reactivity", difficulty: "Foundation",
    stem: "Which metals do NOT react with oxygen in air under normal heating conditions?",
    options: [
      { key: "A", text: "K and Na" },
      { key: "B", text: "Mg and Al" },
      { key: "C", text: "Silver, platinum and gold" },
      { key: "D", text: "Zn and Fe" },
    ],
    answer: "C", hint: "The least reactive metals show no reaction.",
  },
  {
    id: "react-3", section: "reactivity", difficulty: "Foundation",
    stem: "Potassium and sodium should be stored under paraffin oil because:",
    options: [
      { key: "A", text: "They are liquids" },
      { key: "B", text: "They react with air and water" },
      { key: "C", text: "They are radioactive" },
      { key: "D", text: "They are too expensive" },
    ],
    answer: "B", hint: "Very reactive metals tarnish in air.",
  },
  {
    id: "react-4", section: "reactivity", format: "tf", difficulty: "Standard",
    stem: "The lower the position of a metal in the reactivity series, the more easily it can be extracted from its ore.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "Less reactive = less stable ore = easier extraction.",
  },
  {
    id: "react-5", section: "reactivity", difficulty: "Foundation",
    stem: "When sodium reacts with cold water, the flame colour observed is:",
    options: [
      { key: "A", text: "Lilac" },
      { key: "B", text: "Golden yellow" },
      { key: "C", text: "Brick-red" },
      { key: "D", text: "Bright white" },
    ],
    answer: "B", hint: "Lilac is potassium; brick-red is calcium.",
  },
  {
    id: "react-6", section: "reactivity", difficulty: "Foundation",
    stem: "Which metals react with cold water?",
    options: [
      { key: "A", text: "Mg, Al and Zn" },
      { key: "B", text: "K, Na and Ca" },
      { key: "C", text: "Fe, Pb and Cu" },
      { key: "D", text: "Ag, Pt and Au" },
    ],
    answer: "B", hint: "Only the top three react with cold water.",
  },

  /* Metal reactions — 9 */
  {
    id: "rxn-1", section: "reactions", difficulty: "Foundation",
    stem: "Magnesium burns in oxygen to form:",
    options: [
      { key: "A", text: "Mg(OH)₂" },
      { key: "B", text: "MgO" },
      { key: "C", text: "MgCl₂" },
      { key: "D", text: "MgCO₃" },
    ],
    answer: "B", hint: "Metal + Oxygen → Metal oxide",
  },
  {
    id: "rxn-2", section: "reactions", difficulty: "Standard",
    stem: "Zinc reacts with steam to produce:",
    options: [
      { key: "A", text: "Zn(OH)₂ and O₂" },
      { key: "B", text: "ZnO and H₂" },
      { key: "C", text: "ZnCl₂ and H₂" },
      { key: "D", text: "Zn and H₂O" },
    ],
    answer: "B", hint: "Zn + H₂O(g) → ZnO + H₂",
  },
  {
    id: "rxn-3", section: "reactions", difficulty: "Standard",
    stem: "Which metals react with dilute hydrochloric acid to give hydrogen?",
    options: [
      { key: "A", text: "Cu, Ag and Au" },
      { key: "B", text: "K, Na, Ca, Mg, Al, Zn, Fe and Pb" },
      { key: "C", text: "Only K and Na" },
      { key: "D", text: "All metals including gold" },
    ],
    answer: "B", hint: "Copper and below do not react with dilute acids.",
  },
  {
    id: "rxn-4", section: "reactions", format: "tf", difficulty: "Standard",
    stem: "Aluminium does not react with steam easily because of its oxide layer.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "Al₂O₃ layer prevents further reaction.",
  },
  {
    id: "rxn-5", section: "reactions", difficulty: "Standard",
    stem: "When calcium reacts with dilute sulphuric acid, the reaction may stop because:",
    options: [
      { key: "A", text: "No gas is produced" },
      { key: "B", text: "Insoluble calcium sulphate covers the metal surface" },
      { key: "C", text: "Calcium does not react with acids" },
      { key: "D", text: "The acid becomes too concentrated" },
    ],
    answer: "B", hint: "CaSO₄ is insoluble and forms a barrier.",
  },
  {
    id: "rxn-6", section: "reactions", difficulty: "Standard",
    stem: "Iron reacts with steam to form:",
    options: [
      { key: "A", text: "Fe(OH)₂ and H₂" },
      { key: "B", text: "Iron(II,III) oxide and H₂" },
      { key: "C", text: "FeCl₂ and H₂" },
      { key: "D", text: "Fe and O₂" },
    ],
    answer: "B", hint: "Iron + Steam → Iron oxide + Hydrogen",
  },
  {
    id: "rxn-7", section: "reactions", difficulty: "Foundation",
    stem: "The appearance of copper is:",
    options: [
      { key: "A", text: "Yellow solid" },
      { key: "B", text: "Reddish brown solid" },
      { key: "C", text: "Silvery grey liquid" },
      { key: "D", text: "White powder" },
    ],
    answer: "B", hint: "Gold is yellow; mercury is liquid.",
  },
  {
    id: "rxn-8", section: "reactions", format: "tf", difficulty: "Standard",
    stem: "Potassium and sodium react explosively with dilute acids because flammable hydrogen is produced rapidly.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "Very reactive metals produce H₂ very quickly with heat.",
  },
  {
    id: "rxn-fill-1", section: "reactions", format: "fill", difficulty: "Foundation",
    stem: "Fill in the blank — reaction with oxygen",
    lines: [
      {
        segments: [
          T("Magnesium burns in oxygen to form "),
          B(["magnesium oxide", "MgO"]),
          T("."),
        ],
      },
    ],
    hint: "2Mg(s) + O₂(g) → 2MgO(s)",
  },

  /* Displacement — 4 */
  {
    id: "disp-1", section: "displacement", difficulty: "Standard",
    stem: "Zinc can displace copper from copper(II) sulphate solution because:",
    options: [
      { key: "A", text: "Zinc is less reactive than copper" },
      { key: "B", text: "Zinc is more reactive than copper" },
      { key: "C", text: "Zinc is a liquid" },
      { key: "D", text: "Copper is more reactive than zinc" },
    ],
    answer: "B", hint: "A more reactive metal displaces a less reactive one.",
  },
  {
    id: "disp-2", section: "displacement", difficulty: "Standard",
    stem: "Silver + ZnSO₄(aq) → ?",
    options: [
      { key: "A", text: "AgSO₄ + Zn" },
      { key: "B", text: "No reaction" },
      { key: "C", text: "Ag₂SO₄ + Zn" },
      { key: "D", text: "Ag + Zn + SO₄" },
    ],
    answer: "B", hint: "Silver is less reactive than zinc.",
  },
  {
    id: "disp-3", section: "displacement", difficulty: "Standard",
    stem: "Cu(s) + 2AgNO₃(aq) → Cu(NO₃)₂(aq) + 2Ag(s). This shows that:",
    options: [
      { key: "A", text: "Silver is more reactive than copper" },
      { key: "B", text: "Copper is more reactive than silver" },
      { key: "C", text: "No displacement occurs" },
      { key: "D", text: "Copper is less reactive than silver" },
    ],
    answer: "B", hint: "Copper displaces silver from solution.",
  },
  {
    id: "disp-4", section: "displacement", format: "tf", difficulty: "Standard",
    stem: "When potassium is added to a metal compound solution, gas may be given off because potassium reacts with water in the solution.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "K reacts with water before or alongside displacement.",
  },

  /* Corrosion — 7 */
  {
    id: "corr-1", section: "corrosion", difficulty: "Foundation",
    stem: "The essential conditions for rusting of iron are:",
    options: [
      { key: "A", text: "Carbon dioxide and nitrogen" },
      { key: "B", text: "Water and oxygen" },
      { key: "C", text: "Salt only" },
      { key: "D", text: "Acid only" },
    ],
    answer: "B", hint: "Both water and oxygen must be present.",
  },
  {
    id: "corr-2", section: "corrosion", format: "tf", difficulty: "Foundation",
    stem: "Rusting refers to the corrosion of any metal, not just iron.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "F", hint: "Rusting is specific to iron.",
  },
  {
    id: "corr-3", section: "corrosion", difficulty: "Standard",
    stem: "In the rusting experiment, the iron nail in tube 1 (with anhydrous CaCl₂) does not rust because:",
    options: [
      { key: "A", text: "There is no oxygen" },
      { key: "B", text: "There is no water" },
      { key: "C", text: "There is no iron" },
      { key: "D", text: "The temperature is too low" },
    ],
    answer: "B", hint: "CaCl₂ is a drying agent.",
  },
  {
    id: "corr-4", section: "corrosion", difficulty: "Standard",
    stem: "Galvanizing protects iron even when scratched because:",
    options: [
      { key: "A", text: "Zinc is less reactive than iron" },
      { key: "B", text: "Zinc acts as sacrificial protection" },
      { key: "C", text: "Zinc is non-toxic only" },
      { key: "D", text: "Iron becomes stainless" },
    ],
    answer: "B", hint: "Zinc corrodes preferentially.",
  },
  {
    id: "corr-5", section: "corrosion", difficulty: "Standard",
    stem: "When tin plating on a food can is scratched, iron rusts MORE quickly because:",
    options: [
      { key: "A", text: "Tin is more reactive than iron" },
      { key: "B", text: "Tin is less reactive than iron" },
      { key: "C", text: "Tin produces acid" },
      { key: "D", text: "Iron becomes more reactive" },
    ],
    answer: "B", hint: "Tin is less reactive — iron becomes the anode.",
  },
  {
    id: "corr-6", section: "corrosion", format: "tf", difficulty: "Standard",
    stem: "Anodization thickens the aluminium oxide layer to improve corrosion resistance.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "Al is connected to the positive terminal during anodization.",
  },
  {
    id: "corr-fill-1", section: "corrosion", format: "fill", difficulty: "Foundation",
    stem: "Fill in the blanks — conditions for rusting",
    lines: [
      {
        segments: [
          T("Rusting of iron requires both "),
          B(["water", "H2O"]),
          T(" and "),
          B(["oxygen", "O2"]),
          T("."),
        ],
      },
    ],
    hint: "Essential conditions: water and oxygen.",
  },

  /* Mole calculations — 7 */
  {
    id: "mole-1", section: "mole", difficulty: "Applied",
    stem: "How many moles are in 60.1 g of SiO₂? (Si=28.1, O=16.0)",
    options: [
      { key: "A", text: "0.5 mol" },
      { key: "B", text: "1 mol" },
      { key: "C", text: "2 mol" },
      { key: "D", text: "60.1 mol" },
    ],
    answer: "B", hint: "Mr = 28.1 + 32 = 60.1; mole = mass/Mr",
  },
  {
    id: "mole-2", section: "mole", difficulty: "Applied",
    stem: "1 mol of Fe₂(SO₄)₃ contains how many ions in total?",
    options: [
      { key: "A", text: "3.01×10²³" },
      { key: "B", text: "6.02×10²³" },
      { key: "C", text: "1.204×10²⁴" },
      { key: "D", text: "3.01×10²⁴" },
    ],
    answer: "D", hint: "2 Fe³⁺ + 3 SO₄²⁻ = 5 ions per formula unit.",
  },
  {
    id: "mole-3", section: "mole", difficulty: "Applied",
    stem: "17 g of NH₃ (Mr=17) is used in: 4NH₃ + 5O₂ → 4NO + 6H₂O. Theoretical mass of H₂O formed is:",
    options: [
      { key: "A", text: "5.4 g" },
      { key: "B", text: "18 g" },
      { key: "C", text: "27 g" },
      { key: "D", text: "34 g" },
    ],
    answer: "C", hint: "1 mol NH₃ → 1.5 mol H₂O → 27 g",
  },
  {
    id: "mole-4", section: "mole", difficulty: "Applied",
    stem: "If theoretical yield of H₂O is 27 g but actual yield is 5.4 g, the percentage yield is:",
    options: [
      { key: "A", text: "5%" },
      { key: "B", text: "20%" },
      { key: "C", text: "50%" },
      { key: "D", text: "80%" },
    ],
    answer: "B", hint: "Percentage yield = actual/theoretical × 100%",
  },
  {
    id: "mole-5", section: "mole", difficulty: "Applied",
    stem: "In SiO₂ + 2Mg → 2MgO + Si, 1.0 g SiO₂ and 1.0 g Mg are used. The limiting reactant is:",
    options: [
      { key: "A", text: "Mg" },
      { key: "B", text: "SiO₂" },
      { key: "C", text: "Both are limiting" },
      { key: "D", text: "Neither" },
    ],
    answer: "B", hint: "0.0166 mol SiO₂ needs 0.0333 mol Mg; only 0.0411 mol Mg available — SiO₂ limits.",
  },
  {
    id: "mole-6", section: "mole", difficulty: "Applied",
    stem: "An oxide of platinum: 2.21 g heated → 1.97 g Pt remains. Empirical formula is:",
    options: [
      { key: "A", text: "PtO" },
      { key: "B", text: "PtO₂" },
      { key: "C", text: "Pt₂O₃" },
      { key: "D", text: "Pt₂O" },
    ],
    answer: "C", hint: "Pt:O mole ratio = 0.01:0.015 = 1:1.5 = 2:3",
  },
  {
    id: "mole-7", section: "mole", format: "tf", difficulty: "Standard",
    stem: "Percentage yield cannot reach 100% because reactions may be incomplete.",
    options: [{ key: "T", text: "True" }, { key: "F", text: "False" }],
    answer: "T", hint: "Side reactions and incomplete conversion also reduce yield.",
  },
];
