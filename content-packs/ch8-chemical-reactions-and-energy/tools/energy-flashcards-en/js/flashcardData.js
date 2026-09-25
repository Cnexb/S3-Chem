/** Topic 8: Chemical Reactions and Energy — flashcard deck */
export const FLASHCARD_TAGS = ["Chemistry", "Topic8Energy", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Enthalpy Change Concepts (3 cards)
  {
    id: 1,
    subtopic: "Enthalpy Change Concepts",
    front: "What is <strong>enthalpy change (ΔH)</strong>?",
    back: "The heat change of a reaction measured at <strong>constant pressure</strong>."
  },
  {
    id: 2,
    subtopic: "Enthalpy Change Concepts",
    front: "What is the relationship between <strong>enthalpy change (ΔH)</strong> and <strong>internal energy change (ΔU)</strong>?",
    back: "<strong>ΔH = ΔU + w</strong>, where <i>w</i> is the work done on the surroundings."
  },
  {
    id: 3,
    subtopic: "Enthalpy Change Concepts",
    front: "Under what condition is the <strong>enthalpy change (ΔH)</strong> of a reaction almost the same as its <strong>internal energy change (ΔU)</strong>?",
    back: "When the reaction does <strong>not involve any change in the number of moles of gas</strong> (work done on surroundings <i>w</i> = 0)."
  },

  // Endothermic & Exothermic Reactions (9 cards)
  {
    id: 4,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "Define an <strong>exothermic reaction</strong> in terms of heat transfer and temperature change.",
    back: "A reaction that <strong>gives out heat</strong> to the surroundings, causing the temperature of the reaction mixture to <strong>increase</strong> (<strong>ΔH &lt; 0</strong>).",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "Enthalpy profile of exothermic reaction"
  },
  {
    id: 5,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "Define an <strong>endothermic reaction</strong> in terms of heat transfer and temperature change.",
    back: "A reaction that <strong>absorbs heat</strong> from the surroundings, causing the temperature of the reaction mixture to <strong>decrease</strong> (<strong>ΔH &gt; 0</strong>).",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "Enthalpy profile of endothermic reaction"
  },
  {
    id: 6,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "In an <strong>exothermic reaction</strong>, are the reactants or products more energetically stable? Why?",
    back: "The <strong>products</strong> are more stable because they have a <strong>lower energy content</strong> than the reactants.",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "Exothermic reaction energy levels"
  },
  {
    id: 7,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "In an <strong>endothermic reaction</strong>, are the reactants or products more energetically stable? Why?",
    back: "The <strong>reactants</strong> are more stable because they have a <strong>lower energy content</strong> than the products.",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "Endothermic reaction energy levels"
  },
  {
    id: 8,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "Explain <strong>exothermic reactions</strong> in terms of bond breaking and bond forming.",
    back: "The energy absorbed in <strong>breaking bonds</strong> in reactants is <strong>smaller</strong> than the energy released in <strong>forming bonds</strong> in products."
  },
  {
    id: 9,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "Explain <strong>endothermic reactions</strong> in terms of bond breaking and bond forming.",
    back: "The energy absorbed in <strong>breaking bonds</strong> in reactants is <strong>greater</strong> than the energy released in <strong>forming bonds</strong> in products."
  },
  {
    id: 10,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "State three physical or chemical examples of <strong>exothermic processes</strong>.",
    back: "Any three of: <strong>Combustion</strong>, <strong>neutralization</strong>, precipitation, displacement, diluting concentrated acids/alkalis, condensation, freezing, deposition."
  },
  {
    id: 11,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "State three physical or chemical examples of <strong>endothermic processes</strong>.",
    back: "Any three of: <strong>Thermal decomposition</strong> (e.g., of CaCO₃, Ag₂O), <strong>cracking</strong>, ionization of weak acids/alkalis, evaporation, melting, sublimation."
  },
  {
    id: 12,
    subtopic: "Endothermic & Exothermic Reactions",
    front: "Can the enthalpy change of <strong>dissolving a salt</strong> or <strong>formation of a compound</strong> be endothermic or exothermic?",
    back: "Yes, they can be <strong>either endothermic or exothermic</strong>."
  },

  // Standard Enthalpy Changes (13 cards)
  {
    id: 13,
    subtopic: "Standard Enthalpy Changes",
    front: "What are the <strong>standard conditions</strong> for thermochemical measurements?",
    back: "1. Temperature: <strong>298 K (25 °C)</strong><br>2. Pressure: <strong>1 atm</strong><br>3. Substances are in their <strong>standard states</strong>."
  },
  {
    id: 14,
    subtopic: "Standard Enthalpy Changes",
    front: "Define the <strong>standard enthalpy change of combustion (ΔH<sub>c</sub><sup>⦵</sup>)</strong>.",
    back: "The enthalpy change when <strong>1 mole of a substance</strong> is <strong>burnt completely in oxygen</strong> under standard conditions.",
    image: "./assets/2-combustion.png",
    imageAlt: "Standard enthalpy change of combustion concept"
  },
  {
    id: 15,
    subtopic: "Standard Enthalpy Changes",
    front: "Write the thermochemical equation for the standard enthalpy change of combustion of <strong>hexane (C₆H₁₄)</strong>.",
    back: "<strong>C₆H₁₄(l) + 19/2 O₂(g) → 6CO₂(g) + 7H₂O(l)</strong>",
    image: "./assets/2-combustion.png",
    imageAlt: "Hexane combustion equation"
  },
  {
    id: 16,
    subtopic: "Standard Enthalpy Changes",
    front: "Define the <strong>standard enthalpy change of neutralization (ΔH<sub>n</sub><sup>⦵</sup>)</strong>.",
    back: "The enthalpy change when <strong>1 mole of water</strong> is produced from the neutralization between an acid and an alkali under standard conditions.",
    image: "./assets/5-neutralization-concept.png",
    imageAlt: "Standard enthalpy change of neutralization concept"
  },
  {
    id: 17,
    subtopic: "Standard Enthalpy Changes",
    front: "Write the ionic equation representing the standard enthalpy change of neutralization between a <strong>strong acid</strong> and a <strong>strong alkali</strong>.",
    back: "<strong>H⁺(aq) + OH⁻(aq) → H₂O(l)</strong> (ΔH<sub>n</sub><sup>⦵</sup> = −57.3 kJ mol⁻¹)",
    image: "./assets/5-neutralization-concept.png",
    imageAlt: "Strong acid-strong alkali neutralization"
  },
  {
    id: 18,
    subtopic: "Standard Enthalpy Changes",
    front: "Why is the enthalpy change of neutralization for a <strong>weak acid</strong> (e.g., CH₃COOH) with a strong alkali <strong>less exothermic</strong> than −57.3 kJ mol⁻¹?",
    back: "Because weak acids only ionize partially in water; some heat is <strong>absorbed to ionize</strong> the un-ionized weak acid molecules."
  },
  {
    id: 19,
    subtopic: "Standard Enthalpy Changes",
    front: "Define the <strong>standard enthalpy change of formation (ΔH<sub>f</sub><sup>⦵</sup>)</strong>.",
    back: "The enthalpy change when <strong>1 mole of a substance</strong> is formed from its <strong>constituent elements in their standard states</strong> under standard conditions.",
    image: "./assets/3-formation-concept.png",
    imageAlt: "Standard enthalpy change of formation concept"
  },
  {
    id: 20,
    subtopic: "Standard Enthalpy Changes",
    front: "Write the thermochemical equation for the standard enthalpy change of formation of <strong>ammonium hydrogencarbonate (NH₄HCO₃(s))</strong>.",
    back: "<strong>1/2 N₂(g) + 5/2 H₂(g) + C(graphite) + 3/2 O₂(g) → NH₄HCO₃(s)</strong>",
    image: "./assets/4-formation-examples.png",
    imageAlt: "Ammonium hydrogencarbonate formation equation"
  },
  {
    id: 21,
    subtopic: "Standard Enthalpy Changes",
    front: "What is the standard enthalpy change of formation of any <strong>element in its standard state</strong> (e.g., C(graphite), O₂(g))?",
    back: "<strong>0 kJ mol⁻¹</strong>.",
    image: "./assets/3-formation-concept.png",
    imageAlt: "Enthalpy change of formation of elements is zero"
  },
  {
    id: 22,
    subtopic: "Standard Enthalpy Changes",
    front: "Why is the standard enthalpy change of formation of <strong>diamond (C(diamond))</strong> not zero but <strong>+1.9 kJ mol⁻¹</strong>?",
    back: "Because diamond is <strong>not the standard state</strong> of carbon; the standard state is graphite (C(graphite))."
  },
  {
    id: 23,
    subtopic: "Standard Enthalpy Changes",
    front: "Why is it difficult or impossible to determine the standard enthalpy change of formation of most compounds <strong>directly by experiment</strong>?",
    back: "1. Elements may <strong>not react directly</strong> under standard conditions.<br>2. <strong>Side products</strong> are often formed.<br>3. The reaction may proceed <strong>too slowly</strong>.<br>4. The reaction is <strong>too highly exothermic</strong> to be carried out safely."
  },
  {
    id: 24,
    subtopic: "Standard Enthalpy Changes",
    front: "Which standard enthalpy change of combustion is equivalent to the standard enthalpy change of formation of <strong>H₂O(l)</strong>?",
    back: "The standard enthalpy change of combustion of <strong>H₂(g)</strong>:<br><strong>H₂(g) + 1/2 O₂(g) → H₂O(l)</strong>"
  },
  {
    id: 25,
    subtopic: "Standard Enthalpy Changes",
    front: "Which standard enthalpy change of combustion is equivalent to the standard enthalpy change of formation of <strong>CO₂(g)</strong>?",
    back: "The standard enthalpy change of combustion of <strong>C(graphite)</strong>:<br><strong>C(graphite) + O₂(g) → CO₂(g)</strong>"
  },

  // Calorimetry & Experimental Errors (3 cards)
  {
    id: 26,
    subtopic: "Calorimetry & Experimental Errors",
    front: "What formula is used to calculate the heat released in simple calorimetry?",
    back: "<strong>Heat released = m · c · ΔT</strong><br>where <i>m</i> is mass of water/mixture, <i>c</i> is specific heat capacity, and <i>ΔT</i> is temperature change."
  },
  {
    id: 27,
    subtopic: "Calorimetry & Experimental Errors",
    front: "State four sources of error in determining the enthalpy change of <strong>combustion</strong> using a simple calorimeter.",
    back: "1. <strong>Heat loss</strong> to the surroundings.<br>2. <strong>Incomplete combustion</strong> of fuel.<br>3. <strong>Heat capacity</strong> of the metal can is neglected.<br>4. Fuel may <strong>vaporize</strong> without being burnt."
  },
  {
    id: 28,
    subtopic: "Calorimetry & Experimental Errors",
    front: "State four sources of error in determining the enthalpy change of <strong>neutralization</strong> using a simple calorimeter.",
    back: "1. <strong>Heat loss</strong> to the surroundings.<br>2. <strong>Specific heat capacity</strong> of the mixture is assumed to be the same as water.<br>3. <strong>Heat capacity</strong> of the polystyrene cup is neglected.<br>4. <strong>Density</strong> of the mixture is assumed to be the same as water.",
    image: "./assets/6-neutralization-calorimetry.png",
    imageAlt: "Neutralization calorimetry setup and errors"
  },

  // Hess's Law & Enthalpy Cycles (1 card)
  {
    id: 29,
    subtopic: "Hess's Law & Enthalpy Cycles",
    front: "State <strong>Hess's Law</strong>.",
    back: "The total enthalpy change of a chemical reaction <strong>depends only on the initial and final states</strong> of the reaction, but is <strong>independent of the route taken</strong>.",
    image: "./assets/7-hess-law.png",
    imageAlt: "Hess's Law cycle and diagram"
  },

  // Enthalpy Calculations (6 cards)
  {
    id: 30,
    subtopic: "Enthalpy Calculations",
    front: "State the formula to calculate the enthalpy change of a reaction (ΔH<sup>⦵</sup>) using <strong>standard enthalpy changes of formation (ΔH<sub>f</sub><sup>⦵</sup>)</strong>.",
    back: "<strong>ΔH<sup>⦵</sup> = ∑ ΔH<sub>f</sub><sup>⦵</sup>(products) − ∑ ΔH<sub>f</sub><sup>⦵</sup>(reactants)</strong>"
  },
  {
    id: 31,
    subtopic: "Enthalpy Calculations",
    front: "State the formula to calculate the enthalpy change of a reaction (ΔH<sup>⦵</sup>) using <strong>standard enthalpy changes of combustion (ΔH<sub>c</sub><sup>⦵</sup>)</strong>.",
    back: "<strong>ΔH<sup>⦵</sup> = ∑ ΔH<sub>c</sub><sup>⦵</sup>(reactants) − ∑ ΔH<sub>c</sub><sup>⦵</sup>(products)</strong>"
  },
  {
    id: 32,
    subtopic: "Enthalpy Calculations",
    front: "In Hess's Law calculations, if you reverse a chemical equation, what happens to its enthalpy change value?",
    back: "Its sign is reversed (e.g., <strong>+x kJ mol⁻¹ becomes −x kJ mol⁻¹</strong>)."
  },
  {
    id: 33,
    subtopic: "Enthalpy Calculations",
    front: "In Hess's Law calculations, if you multiply the coefficients of an equation by a factor of <i>n</i>, what happens to its enthalpy change value?",
    back: "The enthalpy change value is also <strong>multiplied by <i>n</i></strong>."
  },
  {
    id: 34,
    subtopic: "Enthalpy Calculations",
    front: "What is the <strong>algebraic method</strong> in Hess's Law calculations?",
    back: "Manipulating given thermochemical equations (reversing, multiplying) and adding them algebraically to obtain the target equation and its enthalpy change.",
    image: "./assets/8-algebraic-method.png",
    imageAlt: "Algebraic method example"
  },
  {
    id: 35,
    subtopic: "Enthalpy Calculations",
    front: "In neutralization calorimetry, how do you determine the <strong>moles of water formed</strong> if the acid and alkali are not in stoichiometric ratio?",
    back: "Determine the <strong>limiting reactant</strong> first, then use the chemical equation to calculate the moles of water formed from the limiting reactant."
  }
];
