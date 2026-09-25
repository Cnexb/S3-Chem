/** Topic 10: Chemical equilibrium — flashcard deck */
export const FLASHCARD_TAGS = ["Chemistry", "Topic10Equilibrium", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Dynamic Equilibrium (6 cards)
  {
    id: 1,
    subtopic: "Dynamic Equilibrium",
    front: "What is the definition of a chemical system at <strong>dynamic equilibrium</strong>?",
    back: "A state where the <strong>reactants are converted to products</strong> and the <strong>products are converted to reactants</strong> at the <strong>same rate</strong>, with no net change observed."
  },
  {
    id: 2,
    subtopic: "Dynamic Equilibrium",
    front: "At dynamic equilibrium, are both reactants and products present, and do their concentrations change?",
    back: "<strong>Yes</strong>. Both reactants and products are present (concentrations do not drop to 0) and their <strong>concentrations remain unchanged</strong>."
  },
  {
    id: 3,
    subtopic: "Dynamic Equilibrium",
    front: "Do the <strong>equilibrium concentrations</strong> of reactants and products necessarily follow the mole ratio of the reaction?",
    back: "<strong>No</strong>. Their equilibrium concentrations do NOT necessarily follow the mole ratio, but their <strong>change in concentration</strong> during the reaction does."
  },
  {
    id: 4,
    subtopic: "Dynamic Equilibrium",
    front: "How do the rates of the <strong>forward and backward reactions</strong> compare at dynamic equilibrium?",
    back: "The rate of the forward reaction is <strong>equal to</strong> the rate of the backward reaction."
  },
  {
    id: 5,
    subtopic: "Dynamic Equilibrium",
    front: "Can chemical equilibrium be reached starting from <strong>either direction</strong> of a reversible reaction?",
    back: "<strong>Yes</strong>. The same equilibrium mixture can be obtained starting with either 100% reactants or 100% products under the same conditions."
  },
  {
    id: 6,
    subtopic: "Dynamic Equilibrium",
    front: "Why can dynamic equilibrium only be established in a <strong>closed system</strong>?",
    back: "In an open system, <strong>gaseous species can escape</strong> to the surroundings, meaning the backward reaction cannot occur and equilibrium can never be reached."
  },

  // Equilibrium Constant Kc (5 cards)
  {
    id: 7,
    subtopic: "Equilibrium Constant Kc",
    front: "For the reversible reaction: <strong>w A + x B ⇌ y C + z D</strong>, how is the equilibrium constant <strong>K_c</strong> calculated?",
    back: "<strong>K_c = ([C]^y [D]^z) / ([A]^w [B]^x)</strong><br>where concentrations are taken at equilibrium at a given temperature."
  },
  {
    id: 8,
    subtopic: "Equilibrium Constant Kc",
    front: "What three types of species are <strong>omitted</strong> (concentration taken as 1) from the K_c expression?",
    back: "1. <strong>Solids</strong><br>2. <strong>Pure liquids</strong><br>3. <strong>H₂O(l) as a solvent</strong> (where other species are aqueous)."
  },
  {
    id: 9,
    subtopic: "Equilibrium Constant Kc",
    front: "What does the <strong>magnitude of K_c</strong> indicate about a chemical reaction?",
    back: "It indicates the <strong>extent of the reaction</strong> (how far it proceeds to completion), but <strong>NOT the rate</strong> of the reaction."
  },
  {
    id: 10,
    subtopic: "Equilibrium Constant Kc",
    front: "If a reversible reaction is <strong>reversed</strong>, how is its new equilibrium constant <strong>K_c'</strong> related to the original K_c?",
    back: "The new constant is the <strong>reciprocal of the original</strong>:<br><strong>K_c' = 1 / K_c</strong> (or K_c⁻¹)."
  },
  {
    id: 11,
    subtopic: "Equilibrium Constant Kc",
    front: "If the stoichiometric coefficients of a reaction are <strong>multiplied by a factor of n</strong>, how is the new equilibrium constant K_c' calculated?",
    back: "The original equilibrium constant is raised to the power of n:<br><strong>K_c' = (K_c)^n</strong>."
  },

  // Reaction Quotient Qc (4 cards)
  {
    id: 12,
    subtopic: "Reaction Quotient Qc",
    front: "What is the difference between the <strong>reaction quotient Q_c</strong> and the <strong>equilibrium constant K_c</strong>?",
    back: "<strong>Q_c</strong> is calculated from species concentrations at <strong>any particular moment</strong>, while <strong>K_c</strong> is calculated strictly using <strong>equilibrium concentrations</strong>."
  },
  {
    id: 13,
    subtopic: "Reaction Quotient Qc",
    front: "If <strong>Q_c < K_c</strong>, how will the equilibrium position shift to reach equilibrium?",
    back: "The equilibrium position will <strong>shift to the right (forward)</strong>, converting reactants to products (forward rate > backward rate)."
  },
  {
    id: 14,
    subtopic: "Reaction Quotient Qc", front: "If <strong>Q_c > K_c</strong>, how will the equilibrium position shift to reach equilibrium?",
    back: "The equilibrium position will <strong>shift to the left (backward)</strong>, converting products to reactants (backward rate > forward rate)."
  },
  {
    id: 15,
    subtopic: "Reaction Quotient Qc",
    front: "What does it mean when <strong>Q_c = K_c</strong>?",
    back: "The chemical system is already at <strong>dynamic equilibrium</strong> (concentrations are constant, forward rate = backward rate)."
  },

  // Le Châtelier's Principle (7 cards)
  {
    id: 16,
    subtopic: "Le Châtelier's Principle",
    front: "State <strong>Le Châtelier's Principle</strong>.",
    back: "When a chemical system at equilibrium is disturbed by a change in conditions, the equilibrium position will <strong>shift in a direction that tends to counteract the change</strong>."
  },
  {
    id: 17,
    subtopic: "Le Châtelier's Principle",
    front: "What is the effect of adding a <strong>catalyst</strong> on the equilibrium position and K_c?",
    back: "<strong>No effect</strong> on either. A catalyst increases both forward and backward rates to the same extent, only <strong>shortening the time</strong> needed to reach equilibrium."
  },
  {
    id: 18,
    subtopic: "Le Châtelier's Principle",
    front: "Do changes in concentration, pressure, or volume affect the value of <strong>K_c</strong> at constant temperature?",
    back: "<strong>No</strong>. The value of the equilibrium constant K_c depends on <strong>temperature only</strong>."
  },
  {
    id: 19,
    subtopic: "Le Châtelier's Principle",
    front: "If more <strong>reactants are added</strong> to an equilibrium mixture, how does the system respond?",
    back: "According to Le Châtelier's Principle, the system shifts to the <strong>right (products side)</strong> to consume the added reactants."
  },
  {
    id: 20,
    subtopic: "Le Châtelier's Principle",
    front: "For a gaseous system where <strong>moles of reactants > moles of products</strong>, what is the effect of an <strong>increase in pressure</strong>?",
    back: "The equilibrium position shifts to the <strong>right (product side)</strong> to favor the side with <strong>fewer moles of gas</strong> to decrease the pressure."
  },
  {
    id: 21,
    subtopic: "Le Châtelier's Principle",
    front: "For a gaseous system with <strong>equal moles of gas</strong> on both sides (e.g., H₂(g) + I₂(g) ⇌ 2HI(g)), what is the effect of a <strong>pressure change</strong>?",
    back: "An increase or decrease in pressure has <strong>no effect on the equilibrium position</strong> because both sides are affected equally."
  },
  {
    id: 22,
    subtopic: "Le Châtelier's Principle",
    front: "How does an <strong>increase in temperature</strong> affect the equilibrium position of endothermic and exothermic reactions?",
    back: "An increase in temperature favors the <strong>endothermic reaction</strong>:<br>- <strong>Endothermic (ΔH > 0)</strong>: shifts to the <strong>right</strong> (K_c increases)<br>- <strong>Exothermic (ΔH < 0)</strong>: shifts to the <strong>left</strong> (K_c decreases)"
  },

  // Water Ionization (4 cards)
  {
    id: 23,
    subtopic: "Water Ionization",
    front: "Write the equation for the self-ionization of water and state its enthalpy change.",
    back: "<strong>H₂O(l) ⇌ H⁺(aq) + OH⁻(aq)</strong><br>The reaction is <strong>endothermic (ΔH > 0)</strong>."
  },
  {
    id: 24,
    subtopic: "Water Ionization",
    front: "What is the expression and value of the equilibrium constant for water self-ionization (<strong>K_w</strong>) at 298 K?",
    back: "<strong>K_w = [H⁺(aq)][OH⁻(aq)] = 1 × 10⁻¹⁴ mol² dm⁻⁶</strong><br>(At 298 K, pH of pure water is 7.0)."
  },
  {
    id: 25,
    subtopic: "Water Ionization",
    front: "How does <strong>heating pure water</strong> (e.g., to 328 K) affect its pH?",
    back: "The pH <strong>decreases</strong> (becomes less than 7.0). Heating favors the endothermic forward reaction, shifting equilibrium to the right and <strong>increasing [H⁺(aq)]</strong>."
  },
  {
    id: 26,
    subtopic: "Water Ionization",
    front: "Is pure water <strong>acidic, neutral, or alkaline</strong> at 328 K (where pH is 6.63)? Explain.",
    back: "<strong>Neutral</strong>. Although the pH is less than 7.0, the concentrations of <strong>[H⁺(aq)] and [OH⁻(aq)] are still equal</strong> in pure water."
  }
];
