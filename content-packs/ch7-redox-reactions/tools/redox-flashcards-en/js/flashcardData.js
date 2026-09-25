/** Topic 7: Redox Reactions, Chemical Cells and Electrolysis — flashcard deck */
export const FLASHCARD_TAGS = ["Chemistry", "Topic7Redox", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Chemical Cells in Daily Life (8 cards)
  {
    id: 1,
    subtopic: "Chemical Cells in Daily Life",
    front: "What energy conversion occurs in a <strong>chemical cell</strong>?",
    back: "Converts <strong>chemical energy</strong> into <strong>electrical energy</strong>."
  },
  {
    id: 2,
    subtopic: "Chemical Cells in Daily Life",
    front: "What is the difference between <strong>primary</strong> and <strong>secondary</strong> cells?",
    back: "Primary cells are <strong>not rechargeable</strong>, whereas secondary cells are <strong>rechargeable</strong>."
  },
  {
    id: 3,
    subtopic: "Chemical Cells in Daily Life",
    front: "State the advantages and disadvantages of a <strong>zinc-carbon cell</strong>.",
    back: "Advantages: <strong>Low cost</strong>.<br>Disadvantages: <strong>Low energy density</strong>, poor performance in high-drained devices or at low temperatures."
  },
  {
    id: 4,
    subtopic: "Chemical Cells in Daily Life",
    front: "State the advantages of an <strong>alkaline manganese cell</strong> over a zinc-carbon cell.",
    back: "<strong>Longer shelf life</strong>, wider operating temperature range, and a <strong>steadier voltage</strong> during discharge."
  },
  {
    id: 5,
    subtopic: "Chemical Cells in Daily Life",
    front: "State the advantages and main use of a <strong>silver oxide cell</strong>.",
    back: "Advantages: <strong>Lightweight</strong>, small size, high energy density, and steady voltage.<br>Use: Small devices like <strong>watches and calculators</strong>."
  },
  {
    id: 6,
    subtopic: "Chemical Cells in Daily Life",
    front: "State the advantages of a <strong>lithium-ion cell</strong>.",
    back: "<strong>High voltage (3.7 V)</strong>, high energy density, steady voltage, and can be recharged <strong>over 1200 times</strong>."
  },
  {
    id: 7,
    subtopic: "Chemical Cells in Daily Life",
    front: "State the disadvantages of a <strong>lead-acid accumulator</strong>.",
    back: "It is <strong>very heavy</strong>, and lead metal/lead compounds are <strong>highly toxic</strong>."
  },
  {
    id: 8,
    subtopic: "Chemical Cells in Daily Life",
    front: "Which secondary cell has a <strong>high self-discharge rate</strong>?",
    back: "<strong>Nickel metal hydride (NiMH) cell</strong>."
  },

  // Redox Concepts & Equations (12 cards)
  {
    id: 9,
    subtopic: "Redox Concepts & Equations",
    front: "Define <strong>oxidation</strong> and <strong>reduction</strong> in terms of electron transfer.",
    back: "<strong>Oxidation</strong> is the <strong>loss</strong> of electrons (OIL).<br><strong>Reduction</strong> is the <strong>gain</strong> of electrons (RIG)."
  },
  {
    id: 10,
    subtopic: "Redox Concepts & Equations",
    front: "Define <strong>oxidation</strong> and <strong>reduction</strong> in terms of oxidation number.",
    back: "<strong>Oxidation</strong> is an <strong>increase</strong> in oxidation number.<br><strong>Reduction</strong> is a <strong>decrease</strong> in oxidation number."
  },
  {
    id: 11,
    subtopic: "Redox Concepts & Equations",
    front: "What is the oxidation number of a <strong>free element</strong> (e.g., O₂, Na, Cl₂)?",
    back: "<strong>0</strong>."
  },
  {
    id: 12,
    subtopic: "Redox Concepts & Equations",
    front: "What is the usual oxidation number of <strong>hydrogen</strong> in compounds? What is the exception?",
    back: "Usual: <strong>+1</strong>.<br>Exception: <strong>−1 in metal hydrides</strong> (e.g., NaH, CaH₂)."
  },
  {
    id: 13,
    subtopic: "Redox Concepts & Equations",
    front: "What is the usual oxidation number of <strong>oxygen</strong> in compounds? What are the exceptions?",
    back: "Usual: <strong>−2</strong>.<br>Exceptions: <strong>−1 in peroxides</strong> (e.g., H₂O₂) and <strong>+2 when bonded to fluorine</strong> (e.g., OF₂)."
  },
  {
    id: 14,
    subtopic: "Redox Concepts & Equations",
    front: "Determine the oxidation number of <strong>S</strong> in <strong>SO₃²⁻</strong> and <strong>SO₄²⁻</strong>.",
    back: "In SO₃²⁻: <strong>+4</strong>.<br>In SO₄²⁻: <strong>+6</strong>."
  },
  {
    id: 15,
    subtopic: "Redox Concepts & Equations",
    front: "Determine the oxidation number of <strong>Cr</strong> in <strong>Cr₂O₇²⁻</strong>.",
    back: "<strong>+6</strong> (since 2x + 7(−2) = −2 ⇒ 2x = 12 ⇒ x = +6)."
  },
  {
    id: 16,
    subtopic: "Redox Concepts & Equations",
    front: "Write the balanced ionic half-equation for the reduction of <strong>Cr₂O₇²⁻</strong> to <strong>Cr³⁺</strong> in an acidic medium.",
    back: "<strong>Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O</strong>"
  },
  {
    id: 17,
    subtopic: "Redox Concepts & Equations",
    front: "Write the balanced ionic half-equation for the oxidation of <strong>SO₃²⁻</strong> to <strong>SO₄²⁻</strong> in an alkaline medium.",
    back: "<strong>SO₃²⁻ + 2OH⁻ → SO₄²⁻ + H₂O + 2e⁻</strong>"
  },
  {
    id: 18,
    subtopic: "Redox Concepts & Equations",
    front: "Write the overall balanced ionic equation for the reaction between <strong>SO₂</strong> and <strong>MnO₄⁻</strong> in an acidic medium.",
    back: "<strong>5SO₂ + 2MnO₄⁻ + 2H₂O → 5SO₄²⁻ + 2Mn²⁺ + 4H⁺</strong>"
  },
  {
    id: 19,
    subtopic: "Redox Concepts & Equations",
    front: "Write the overall balanced ionic equation for the reaction between <strong>SO₂</strong> and <strong>MnO₄⁻</strong> in an alkaline medium.",
    back: "<strong>3SO₂ + 2MnO₄⁻ + 4OH⁻ → 3SO₄²⁻ + 2MnO₂ + 2H₂O</strong>"
  },
  {
    id: 20,
    subtopic: "Redox Concepts & Equations",
    front: "What is a <strong>disproportionation</strong> reaction?",
    back: "A redox reaction in which the <strong>same substance is simultaneously oxidized and reduced</strong>."
  },

  // Oxidizing & Reducing Agents (10 cards)
  {
    id: 21,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What is the observation when <strong>acidified MnO₄⁻(aq)</strong> acts as an oxidizing agent?",
    back: "The <strong>purple solution turns colorless</strong>."
  },
  {
    id: 22,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What is the observation when <strong>acidified Cr₂O₇²⁻(aq)</strong> acts as an oxidizing agent?",
    back: "The <strong>orange solution turns green</strong>."
  },
  {
    id: 23,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What are the observations when <strong>concentrated HNO₃</strong> and <strong>dilute HNO₃</strong> react with copper?",
    back: "Conc. HNO₃: <strong>Brown gas (NO₂)</strong> is evolved.<br>Dilute HNO₃: <strong>Colorless gas (NO)</strong> is evolved, which <strong>turns brown in air</strong> (forming NO₂)."
  },
  {
    id: 24,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What is the observation when <strong>concentrated H₂SO₄</strong> acts as an oxidizing agent?",
    back: "A colorless gas with a <strong>choking smell (SO₂)</strong> is formed."
  },
  {
    id: 25,
    subtopic: "Oxidizing & Reducing Agents",
    front: "Why do oxidizing acids (like conc. H₂SO₄ or HNO₃) <strong>NOT</strong> undergo redox reactions when added to metal carbonates?",
    back: "Because metal carbonates are not reducing agents; they react only with the <strong>hydrogen ions (H⁺)</strong> to produce <strong>CO₂ gas</strong>."
  },
  {
    id: 26,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What is the observation when <strong>Fe³⁺(aq)</strong> is reduced to <strong>Fe²⁺(aq)</strong>?",
    back: "The <strong>yellow solution turns green</strong>."
  },
  {
    id: 27,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What is the observation when <strong>iodide ions (I⁻)</strong> are oxidized to <strong>iodine (I₂)</strong>?",
    back: "The <strong>colorless solution turns brown</strong>."
  },
  {
    id: 28,
    subtopic: "Oxidizing & Reducing Agents",
    front: "Why should KMnO₄ <strong>NOT</strong> be acidified with dilute hydrochloric acid (HCl)?",
    back: "Because MnO₄⁻ is a stronger oxidizing agent than Cl₂, and will <strong>oxidize Cl⁻ to toxic Cl₂ gas</strong>."
  },
  {
    id: 29,
    subtopic: "Oxidizing & Reducing Agents",
    front: "Write the chemical equation for chlorine gas dissolving in <strong>cold dilute NaOH(aq)</strong>.",
    back: "<strong>Cl₂ + 2NaOH → NaCl + NaOCl + H₂O</strong>"
  },
  {
    id: 30,
    subtopic: "Oxidizing & Reducing Agents",
    front: "What happens when an <strong>acid</strong> is added to <strong>chlorine bleach</strong>?",
    back: "Toxic <strong>chlorine gas (Cl₂)</strong> is produced:<br><strong>Cl⁻ + OCl⁻ + 2H⁺ → Cl₂ + H₂O</strong>"
  },

  // Chemical Cell Principles (10 cards)
  {
    id: 31,
    subtopic: "Chemical Cell Principles",
    front: "Define an <strong>electrolyte</strong>.",
    back: "A substance that contains mobile ions and <strong>conducts electricity in molten or aqueous state</strong>."
  },
  {
    id: 32,
    subtopic: "Chemical Cell Principles",
    front: "In a chemical cell, what are the names, polarities, and reactions of the two electrodes?",
    back: "<strong>Anode</strong>: Negative electrode, where <strong>oxidation</strong> (loss of electrons) occurs.<br><strong>Cathode</strong>: Positive electrode, where <strong>reduction</strong> (gain of electrons) occurs."
  },
  {
    id: 33,
    subtopic: "Chemical Cell Principles",
    front: "In a cell with Mg and Ag electrodes in their respective nitrate solutions, which is the anode and what is its half-equation?",
    back: "<strong>Mg electrode is the anode (negative)</strong>.<br>Half-equation: <strong>Mg → Mg²⁺ + 2e⁻</strong>"
  },
  {
    id: 34,
    subtopic: "Chemical Cell Principles",
    front: "State the <strong>two main functions</strong> of a <strong>salt bridge</strong>.",
    back: "1. <strong>Completes the circuit</strong> by allowing ions to move between half-cells.<br>2. <strong>Balances charges</strong> in the solutions of the two half-cells."
  },
  {
    id: 35,
    subtopic: "Chemical Cell Principles",
    front: "Why is saturated <strong>KNO₃(aq)</strong> commonly used in a salt bridge?",
    back: "Because K⁺ and NO₃⁻ ions <strong>do not undergo any redox reactions or precipitation</strong> with the electrolytes."
  },
  {
    id: 36,
    subtopic: "Chemical Cell Principles",
    front: "State the <strong>two main functions</strong> of a <strong>porous pot</strong>.",
    back: "1. <strong>Prevents direct mixing</strong> of the two electrolytes.<br>2. <strong>Completes the circuit</strong> by allowing ions to migrate through its small holes."
  },
  {
    id: 37,
    subtopic: "Chemical Cell Principles",
    front: "Write the half-equations at the anode and cathode of a <strong>hydrogen-oxygen fuel cell</strong> in an <strong>alkaline (KOH)</strong> electrolyte.",
    back: "Anode (A): <strong>H₂ + 2OH⁻ → 2H₂O + 2e⁻</strong><br>Cathode (B): <strong>O₂ + 2H₂O + 4e⁻ → 4OH⁻</strong>"
  },
  {
    id: 38,
    subtopic: "Chemical Cell Principles",
    front: "Write the half-equations at the anode and cathode of a <strong>hydrogen-oxygen fuel cell</strong> in an <strong>acidic (H₃PO₄)</strong> electrolyte.",
    back: "Anode (A): <strong>H₂ → 2H⁺ + 2e⁻</strong><br>Cathode (B): <strong>O₂ + 4H⁺ + 4e⁻ → 2H₂O</strong>"
  },
  {
    id: 39,
    subtopic: "Chemical Cell Principles",
    front: "State the <strong>two functions</strong> of the <strong>porous platinum electrodes</strong> in a fuel cell.",
    back: "1. Allow the gases (H₂, O₂) and steam to flow in and out.<br>2. <strong>Catalyze</strong> the redox reactions."
  },
  {
    id: 40,
    subtopic: "Chemical Cell Principles",
    front: "State two advantages and two disadvantages of a <strong>hydrogen-oxygen fuel cell</strong>.",
    back: "Advantages: <strong>High energy efficiency</strong>, product (water) is <strong>non-polluting</strong>, can operate continuously.<br>Disadvantages: Hydrogen is <strong>flammable/explosive</strong>, storage/transport is difficult, Pt catalyst is <strong>expensive</strong>."
  },

  // Electrolysis & Applications (9 cards)
  {
    id: 41,
    subtopic: "Electrolysis & Applications",
    front: "What energy conversion occurs in an <strong>electrolytic cell</strong>?",
    back: "Converts <strong>electrical energy</strong> into <strong>chemical energy</strong>."
  },
  {
    id: 42,
    subtopic: "Electrolysis & Applications",
    front: "In an electrolytic cell, what are the names, polarities, and reactions of the two electrodes?",
    back: "<strong>Anode</strong>: Positive electrode (connected to positive terminal of battery), where <strong>oxidation</strong> occurs.<br><strong>Cathode</strong>: Negative electrode (connected to negative terminal of battery), where <strong>reduction</strong> occurs."
  },
  {
    id: 43,
    subtopic: "Electrolysis & Applications",
    front: "Predict the products at the anode and cathode during the electrolysis of <strong>molten strontium bromide (SrBr₂)</strong>.",
    back: "Anode (+): <strong>Brown bromine gas (Br₂)</strong>.<br>Cathode (−): <strong>Silvery grey strontium metal (Sr)</strong>."
  },
  {
    id: 44,
    subtopic: "Electrolysis & Applications",
    front: "Predict the products and write the half-equations for the electrolysis of <strong>dilute Na₂SO₄(aq)</strong> using carbon electrodes.",
    back: "Anode (+): <strong>O₂ gas</strong> (4OH⁻ → O₂ + 2H₂O + 4e⁻).<br>Cathode (−): <strong>H₂ gas</strong> (2H⁺ + 2e⁻ → H₂).<br><em>(Note: Concentration of Na₂SO₄ increases as water is electrolyzed)</em>"
  },
  {
    id: 45,
    subtopic: "Electrolysis & Applications",
    front: "Predict the products and write the half-equations for the electrolysis of <strong>concentrated NaCl(aq) (brine)</strong> using carbon electrodes.",
    back: "Anode (+): <strong>Yellowish green Cl₂ gas</strong> (2Cl⁻ → Cl₂ + 2e⁻).<br>Cathode (−): <strong>H₂ gas</strong> (2H⁺ + 2e⁻ → H₂).<br><em>(Note: Solution becomes alkaline NaOH)</em>"
  },
  {
    id: 46,
    subtopic: "Electrolysis & Applications",
    front: "In the electroplating of an iron key with copper, what are the anode, cathode, and electrolyte? Write their half-equations.",
    back: "Anode (+): <strong>Copper sheet</strong> (Cu → Cu²⁺ + 2e⁻).<br>Cathode (−): <strong>Iron key</strong> (Cu²⁺ + 2e⁻ → Cu).<br>Electrolyte: <strong>CuSO₄(aq)</strong> (concentration remains unchanged)."
  },
  {
    id: 47,
    subtopic: "Electrolysis & Applications",
    front: "What is the purpose of using a <strong>mercury cathode</strong> in the electrolysis of brine?",
    back: "It favors the discharge of <strong>Na⁺ ions</strong> over H⁺ ions to form sodium metal, which dissolves in mercury to form <strong>sodium amalgam (Na/Hg)</strong>."
  },
  {
    id: 48,
    subtopic: "Electrolysis & Applications",
    front: "During the electrolysis of 1 M NaNO₃(aq) containing litmus indicator, what are the color changes around the anode and cathode?",
    back: "Anode (+): Turns <strong>red</strong> (OH⁻ discharged, leaving excess H⁺).<br>Cathode (−): Turns <strong>blue</strong> (H⁺ discharged, leaving excess OH⁻)."
  },
  {
    id: 49,
    subtopic: "Electrolysis & Applications",
    front: "During the electrolysis of 6 M NaCl(aq) containing litmus indicator, what is the color change around the anode?",
    back: "Turns <strong>red and then colorless quickly</strong>, because Cl⁻ is discharged to form Cl₂ gas, which dissolves to form acidic and bleaching HCl/HOCl."
  }
];
