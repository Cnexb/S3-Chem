/** Topic 9: Rates of Reactions — flashcard deck */
export const FLASHCARD_TAGS = ["Chemistry", "Topic9Rates", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Rate Curve & Calculations (7 cards)
  {
    id: 1,
    subtopic: "Rate Curve & Calculations",
    front: "For a reaction <strong>A(g) + 2B(g) → 3C(g) + 4D(g)</strong>, how is the <strong>average rate of consumption of A</strong> over the whole reaction calculated?",
    back: "<strong>Average rate = −Δ[A] / Δt</strong><br>where Δ[A] is the change in concentration of A and Δt is the time needed for the whole reaction.",
    image: "./assets/1-rate-curve.png",
    imageAlt: "Rate curve showing concentration of A over time"
  },
  {
    id: 2,
    subtopic: "Rate Curve & Calculations",
    front: "If the average rate of consumption of A is <strong>0.085 mol dm⁻³ min⁻¹</strong>, what is the average rate of consumption of B?",
    back: "<strong>0.17 mol dm⁻³ min⁻¹</strong><br>(Since the mole ratio of A : B is 1 : 2, the rate of B is twice that of A: 0.085 × 2 = 0.17)."
  },
  {
    id: 3,
    subtopic: "Rate Curve & Calculations",
    front: "How is the <strong>instantaneous rate of consumption of A</strong> at a specific time (e.g., t = 2 min) determined from a rate curve?",
    back: "By calculating the negative value of the <strong>slope of the tangent line</strong> to the curve at that specific time.",
    image: "./assets/1-rate-curve.png",
    imageAlt: "Tangent line on concentration-time graph"
  },
  {
    id: 4,
    subtopic: "Rate Curve & Calculations",
    front: "What is the <strong>initial rate of a reaction</strong>, and how is it determined?",
    back: "The <strong>instantaneous rate at time = 0</strong>. It is determined by finding the negative value of the <strong>slope of the tangent line at t = 0</strong>.",
    image: "./assets/1-rate-curve.png",
    imageAlt: "Tangent line at t = 0 on rate curve"
  },
  {
    id: 5,
    subtopic: "Rate Curve & Calculations",
    front: "If the initial rate of consumption of A is <strong>0.5 mol dm⁻³ min⁻¹</strong>, what is the initial rate of formation of D in the reaction: A(g) + 2B(g) → 3C(g) + 4D(g)?",
    back: "<strong>2.0 mol dm⁻³ min⁻¹</strong><br>(Since the mole ratio of A : D is 1 : 4, the rate of formation of D is four times the rate of consumption of A: 0.5 × 4 = 2.0)."
  },
  {
    id: 6,
    subtopic: "Rate Curve & Calculations",
    front: "Why does the rate of a reaction usually <strong>decrease over time</strong>?",
    back: "Because the <strong>concentration of reactants decreases</strong> as they are consumed, leading to a lower frequency of collisions.",
    image: "./assets/1-rate-curve.png",
    imageAlt: "Rate curve slope decreasing over time"
  },
  {
    id: 7,
    subtopic: "Rate Curve & Calculations",
    front: "What does a <strong>horizontal line</strong> on a concentration-time curve represent?",
    back: "The reaction has <strong>stopped</strong> because one or more reactants have been completely used up (or equilibrium has been reached).",
    image: "./assets/1-rate-curve.png",
    imageAlt: "Horizontal line on concentration-time curve"
  },

  // Following Reaction Progress (8 cards)
  {
    id: 8,
    subtopic: "Following Reaction Progress",
    front: "For which type of reactions is measuring the <strong>volume of gas</strong> using a gas syringe suitable? State an exception.",
    back: "Suitable for reactions that <strong>produce a gas</strong>.<br>Exception: <strong>Not suitable</strong> if the gas is <strong>highly soluble in water</strong> (e.g., NH₃, HCl, SO₂) when water is the solvent.",
    image: "./assets/2-methods-part1.png",
    imageAlt: "Gas syringe setup"
  },
  {
    id: 9,
    subtopic: "Following Reaction Progress",
    front: "For which type of reactions is measuring the <strong>change in pressure</strong> using a pressure sensor suitable?",
    back: "Suitable for reactions in a closed system that involve a <strong>change in the number of moles of gas</strong>.",
    image: "./assets/2-methods-part1.png",
    imageAlt: "Pressure sensor setup"
  },
  {
    id: 10,
    subtopic: "Following Reaction Progress",
    front: "State two advantages of using a <strong>data-logger</strong> connected to a sensor (like a pressure sensor) in rate experiments.",
    back: "1. Can collect and store data over <strong>very short time intervals</strong>.<br>2. Experimental data can be <strong>presented graphically on a computer immediately</strong>."
  },
  {
    id: 11,
    subtopic: "Following Reaction Progress",
    front: "For which type of reactions is measuring the <strong>change in mass</strong> of a reaction mixture suitable? State two exceptions.",
    back: "Suitable for reactions that <strong>produce a gas</strong> that escapes.<br>Exceptions: <strong>Not suitable</strong> for highly water-soluble gases (NH₃, HCl, SO₂) or <strong>hydrogen gas (H₂)</strong> because H₂ has an extremely low density.",
    image: "./assets/2-methods-part1.png",
    imageAlt: "Electronic balance setup"
  },
  {
    id: 12,
    subtopic: "Following Reaction Progress",
    front: "What is the purpose of a <strong>cotton wool plug</strong> in the neck of the flask when measuring mass change over time?",
    back: "It allows the <strong>gas to escape</strong> while <strong>preventing the solution from splashing out</strong>.",
    image: "./assets/2-methods-part1.png",
    imageAlt: "Cotton wool plug in flask on balance"
  },
  {
    id: 13,
    subtopic: "Following Reaction Progress",
    front: "For which type of reactions is measuring the <strong>color intensity</strong> using a colorimeter suitable?",
    back: "Suitable for reactions involving a <strong>change in color intensity</strong> due to an increase or decrease in the concentration of a colored species (e.g., Br₂(aq)).",
    image: "./assets/3-methods-part2.png",
    imageAlt: "Colorimeter and colored species"
  },
  {
    id: 14,
    subtopic: "Following Reaction Progress",
    front: "What is the key step in <strong>titrimetric analysis</strong> to follow reaction progress, and why is it necessary?",
    back: "<strong>Quenching</strong> the reaction in withdrawn portions (by rapid cooling, dilution, or removing catalyst). It is necessary to <strong>stop or slow down the reaction</strong> to prevent further concentration changes during titration.",
    image: "./assets/3-methods-part2.png",
    imageAlt: "Titrimetric analysis steps"
  },
  {
    id: 15,
    subtopic: "Following Reaction Progress",
    front: "State two limitations of using <strong>titrimetric analysis</strong> to follow the progress of a reaction.",
    back: "1. The original reaction mixture is <strong>disturbed</strong> when portions are withdrawn.<br>2. <strong>Continuous monitoring</strong> of the reaction progress is impossible."
  },

  // Collision Theory (5 cards)
  {
    id: 16,
    subtopic: "Collision Theory",
    front: "According to collision theory, what are the <strong>two requirements</strong> for a collision between reactant particles to be an <strong>effective collision</strong>?",
    back: "1. Particles must collide with <strong>sufficient energy</strong> (equal to or greater than the activation energy).<br>2. Particles must collide in a <strong>proper orientation</strong>.",
    image: "./assets/5-collisions.png",
    imageAlt: "Effective vs ineffective collisions"
  },
  {
    id: 17,
    subtopic: "Collision Theory",
    front: "What is <strong>activation energy (E_a)</strong>?",
    back: "The <strong>minimum energy</strong> that colliding reactant particles must possess in order to react."
  },
  {
    id: 18,
    subtopic: "Collision Theory",
    front: "How does <strong>temperature</strong> affect the energy of reactant particles and the rate of reaction?",
    back: "At higher temperatures, particles move faster and <strong>collide more frequently</strong>. More importantly, a <strong>much larger fraction of particles</strong> have energy ≥ E_a, greatly increasing the <strong>frequency of effective collisions</strong>.",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "Maxwell-Boltzmann distribution / temperature effect"
  },
  {
    id: 19,
    subtopic: "Collision Theory",
    front: "How does <strong>concentration</strong> affect the reaction rate in terms of collision theory?",
    back: "Higher concentration means <strong>more reactant particles per unit volume</strong>, which increases the <strong>frequency of collisions</strong> and thus the <strong>frequency of effective collisions</strong>.",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "Concentration effect on collisions"
  },
  {
    id: 20,
    subtopic: "Collision Theory",
    front: "How does <strong>surface area</strong> of solid reactants affect the reaction rate in terms of collision theory?",
    back: "A larger surface area exposes <strong>more reactant particles</strong> to collisions, increasing the <strong>frequency of collisions</strong> and thus the <strong>frequency of effective collisions</strong>.",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "Surface area effect on collisions"
  },

  // Factors Affecting Rate (10 cards)
  {
    id: 21,
    subtopic: "Factors Affecting Rate",
    front: "What is a <strong>catalyst</strong>?",
    back: "A substance that <strong>increases the rate of a reaction</strong> by providing an alternative pathway with a <strong>lower activation energy</strong>, while itself remaining <strong>chemically unchanged</strong> at the end.",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "Catalyst energy profile"
  },
  {
    id: 22,
    subtopic: "Factors Affecting Rate",
    front: "If 1.0 g of <strong>MnO₂ (s)</strong> is added as a catalyst to decompose H₂O₂ (aq), what mass of MnO₂ can be recovered at the end of the reaction?",
    back: "<strong>1.0 g</strong><br>(A catalyst is not consumed in a chemical reaction, so its mass remains unchanged).",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "MnO2 as catalyst for H2O2 decomposition"
  },
  {
    id: 23,
    subtopic: "Factors Affecting Rate",
    front: "What are <strong>enzymes</strong>, and how do they differ from inorganic catalysts regarding temperature?",
    back: "Enzymes are <strong>biological catalysts (proteins)</strong>. Unlike inorganic catalysts, their rate does not continuously increase with temperature because they can be <strong>denatured</strong> at high temperatures.",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "Enzymes as biological catalysts"
  },
  {
    id: 24,
    subtopic: "Factors Affecting Rate",
    front: "Write the equation for the fermentation of glucose catalyzed by <strong>zymase</strong> in yeast.",
    back: "<strong>C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂</strong>"
  },
  {
    id: 25,
    subtopic: "Factors Affecting Rate",
    front: "In the reaction of Mg with excess acid: <strong>Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)</strong>, why is the curve for 1 M H₂SO₄ steeper than 1 M HCl?",
    back: "Because H₂SO₄ is a <strong>dibasic acid</strong> and has a <strong>higher [H⁺]</strong> (2 M) than 1 M HCl (1 M), leading to a higher rate of reaction.",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "Mg with different acids curves"
  },
  {
    id: 26,
    subtopic: "Factors Affecting Rate",
    front: "In the reaction of Mg with excess acid, why is the curve for 1 M HCl steeper than 1 M CH₃COOH?",
    back: "Because HCl is a <strong>strong acid</strong> (fully ionized) and has a <strong>higher [H⁺]</strong> than CH₃COOH, which is a <strong>weak acid</strong> (partially ionized).",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "Strong vs weak acid rate curves"
  },
  {
    id: 27,
    subtopic: "Factors Affecting Rate",
    front: "In the reaction of excess CaCO₃ with HCl, why should the HCl be <strong>saturated with CO₂</strong> beforehand to obtain accurate results?",
    back: "Because CO₂ gas is <strong>slightly soluble in water</strong>; saturating the acid prevents CO₂ produced from dissolving, ensuring accurate volume measurements.",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "CaCO3 and HCl setup"
  },
  {
    id: 28,
    subtopic: "Factors Affecting Rate",
    front: "How does the rate of reaction vary with temperature, and what shape is the rate-temperature graph?",
    back: "The rate of reaction increases <strong>exponentially</strong> with temperature, forming an <strong>exponential curve</strong>.",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "Rate vs temperature exponential curve"
  },
  {
    id: 29,
    subtopic: "Factors Affecting Rate",
    front: "In the reaction between <strong>sodium thiosulphate (Na₂S₂O₃)</strong> and sulphuric acid, what causes the solution to turn turbid?",
    back: "The formation of a <strong>creamy yellow precipitate of sulfur (S(s))</strong>:<br><strong>S₂O₃²⁻(aq) + 2H⁺(aq) → SO₂(g) + H₂O(l) + S(s)</strong>",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "Thiosulphate and acid reaction"
  },
  {
    id: 30,
    subtopic: "Factors Affecting Rate",
    front: "How is the average rate of reaction related to the time taken to 'blot out' the cross in the thiosulphate-acid experiment?",
    back: "The average rate of reaction is <strong>inversely proportional</strong> to the time taken (<strong>Rate ∝ 1/time</strong>).",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "Blotting out the cross experiment"
  },

  // Molar Volume & Calculations (5 cards)
  {
    id: 31,
    subtopic: "Molar Volume & Calculations",
    front: "What is the <strong>molar volume of any gas</strong> at room temperature and pressure (RTP)?",
    back: "<strong>24 dm³ mol⁻¹</strong> (or 24000 cm³ mol⁻¹).",
    image: "./assets/4-molar-volume.png",
    imageAlt: "Molar volume at RTP"
  },
  {
    id: 32,
    subtopic: "Molar Volume & Calculations",
    front: "State the formula used to calculate the <strong>moles of a gas</strong> from its volume at RTP.",
    back: "<strong>Mole of gas = Volume of gas (dm³) / 24 dm³ mol⁻¹</strong><br>(or Volume in cm³ / 24000 cm³ mol⁻¹).",
    image: "./assets/4-molar-volume.png",
    imageAlt: "Gas mole calculation formula"
  },
  {
    id: 33,
    subtopic: "Molar Volume & Calculations",
    front: "If 1200 cm³ of CO₂ is collected at RTP, how many moles of CO₂ are produced?",
    back: "<strong>0.05 mol</strong><br>(1200 / 24000 = 0.05 mol).",
    image: "./assets/4-molar-volume.png",
    imageAlt: "CO2 mole calculation"
  },
  {
    id: 34,
    subtopic: "Molar Volume & Calculations",
    front: "For gaseous reactions at constant temperature and pressure, what is the relationship between <strong>mole ratio</strong> and <strong>volume ratio</strong>?",
    back: "The <strong>mole ratio is equal to the volume ratio</strong> (Avogadro's Law).",
    image: "./assets/4-molar-volume.png",
    imageAlt: "Avogadro's Law concept"
  },
  {
    id: 35,
    subtopic: "Molar Volume & Calculations",
    front: "If 100 cm³ of butane (C₄H₁₀) burns in 800 cm³ of O₂: <strong>2C₄H₁₀(g) + 13O₂(g) → 8CO₂(g) + 10H₂O(l)</strong>, what is the volume of the resulting gaseous mixture at RTP?",
    back: "<strong>550 cm³</strong><br>• O₂ used = 100 × 13/2 = 650 cm³ (O₂ left = 800 − 650 = 150 cm³)<br>• CO₂ produced = 100 × 8/2 = 400 cm³<br>• Total gas = 150 + 400 = 550 cm³ (H₂O is liquid at RTP).",
    image: "./assets/4-molar-volume.png",
    imageAlt: "Butane combustion volume calculation"
  }
];
