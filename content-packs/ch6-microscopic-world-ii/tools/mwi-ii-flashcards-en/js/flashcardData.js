/** Topic 6: Microscopic World II — flashcard deck */
export const FLASHCARD_TAGS = ["Chemistry", "Topic6Microscopic", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Molecular Shape (10 cards)
  {
    id: 1,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>2 bond pairs</strong> and <strong>0 lone pairs</strong> (obeying octet rule, e.g., CO₂)?",
    back: "<strong>Linear</strong>."
  },
  {
    id: 2,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>3 bond pairs</strong> and <strong>0 lone pairs</strong> (e.g., BF₃)?",
    back: "<strong>Trigonal planar</strong>."
  },
  {
    id: 3,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>4 bond pairs</strong> and <strong>0 lone pairs</strong> (e.g., CH₄)?",
    back: "<strong>Tetrahedral</strong>."
  },
  {
    id: 4,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>5 bond pairs</strong> and <strong>0 lone pairs</strong> (e.g., PCl₅)?",
    back: "<strong>Trigonal bipyramidal</strong> (does NOT obey octet rule)."
  },
  {
    id: 5,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>6 bond pairs</strong> and <strong>0 lone pairs</strong> (e.g., SF₆)?",
    back: "<strong>Octahedral</strong> (does NOT obey octet rule)."
  },
  {
    id: 6,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>3 bond pairs</strong> and <strong>1 lone pair</strong> (e.g., NH₃)?",
    back: "<strong>Trigonal pyramidal</strong>."
  },
  {
    id: 7,
    subtopic: "Molecular Shape",
    front: "What is the molecular shape of a molecule with <strong>2 bond pairs</strong> and <strong>2 lone pairs</strong> (e.g., H₂O)?",
    back: "<strong>V-shaped</strong>."
  },
  {
    id: 8,
    subtopic: "Molecular Shape",
    front: "What are the rules regarding <strong>octet expansion</strong> for Period 2 vs. Period 3 or above atoms?",
    back: "<strong>Period 2</strong> atoms can only have <strong>up to 8</strong> outermost shell electrons (OF₆, NF₅ do NOT exist).<br><strong>Period 3 or above</strong> atoms can expand their octet and have <strong>more than 8</strong> outermost shell electrons."
  },
  {
    id: 9,
    subtopic: "Molecular Shape",
    front: "Using electron pair repulsion, explain why a <strong>H₂O</strong> molecule is <strong>V-shaped</strong>.",
    back: "There are <strong>2 bond pairs</strong> and <strong>2 lone pairs</strong> of electrons around the central O atom. To <strong>minimize repulsion</strong> between electron pairs, they adopt a tetrahedral arrangement of electron pairs, resulting in a <strong>V-shaped</strong> molecular geometry."
  },
  {
    id: 10,
    subtopic: "Molecular Shape",
    front: "Why do lone pairs cause greater repulsion than bond pairs?",
    back: "Lone pairs are held closer to the central nucleus and occupy more space, so the order of repulsion is:<br><strong>lone pair-lone pair &gt; lone pair-bond pair &gt; bond pair-bond pair</strong>."
  },

  // Electronegativity & Polar Bonds (8 cards)
  {
    id: 11,
    subtopic: "Electronegativity & Polar Bonds",
    front: "Define <strong>electronegativity</strong>.",
    back: "The power of an atom to <strong>attract bonding electrons</strong> to itself in a covalent bond."
  },
  {
    id: 12,
    subtopic: "Electronegativity & Polar Bonds",
    front: "What are the periodic trends for <strong>electronegativity</strong>?",
    back: "<strong>Across a period</strong> (left to right): <strong>increases</strong>.<br><strong>Down a group</strong>: generally <strong>decreases</strong>."
  },
  {
    id: 13,
    subtopic: "Electronegativity & Polar Bonds",
    front: "What is a <strong>polar covalent bond</strong>?",
    back: "A covalent bond where the bonding electrons are <strong>not equally shared</strong> between the bonded atoms, due to their <strong>different electronegativities</strong>."
  },
  {
    id: 14,
    subtopic: "Electronegativity & Polar Bonds",
    front: "Why is a <strong>Cl–Cl</strong> bond non-polar, while a <strong>H–Cl</strong> bond is polar?",
    back: "Both Cl atoms have the <strong>same electronegativity</strong> (equal sharing). H and Cl have <strong>different electronegativities</strong> (unequal sharing); since Cl is more electronegative, shared electrons are attracted more strongly towards Cl (δ−)."
  },
  {
    id: 15,
    subtopic: "Electronegativity & Polar Bonds",
    front: "What happens if the electronegativity difference between two bonded atoms is <strong>extremely large</strong>?",
    back: "An <strong>ionic bond</strong> is formed instead of a covalent bond (complete transfer of electrons)."
  },
  {
    id: 16,
    subtopic: "Electronegativity & Polar Bonds",
    front: "Which is the <strong>most electronegative</strong> element in the periodic table?",
    back: "<strong>Fluorine (F)</strong>."
  },
  {
    id: 17,
    subtopic: "Electronegativity & Polar Bonds",
    front: "In a polar bond, which atom gets the <strong>partial negative charge (δ−)</strong>?",
    back: "The <strong>more electronegative</strong> atom."
  },
  {
    id: 18,
    subtopic: "Electronegativity & Polar Bonds",
    front: "What is a <strong>dipole</strong>?",
    back: "A separation of equal and opposite partial charges (δ+ and δ−) across a polar bond or molecule."
  },

  // Polar & Non-polar Molecules (9 cards)
  {
    id: 19,
    subtopic: "Polar & Non-polar Molecules",
    front: "What are the two main criteria for a molecule to be <strong>non-polar</strong> (under the DSE syllabus)?",
    back: "A. Molecules <strong>without polar bonds</strong> (e.g., H₂, O₂, Cl₂).<br>B. Molecules <strong>with polar bonds</strong> where:<br>1. There is <strong>no lone pair</strong> on the central atom.<br>2. <strong>All polar bonds are identical</strong> (symmetrical, so polarities cancel)."
  },
  {
    id: 20,
    subtopic: "Polar & Non-polar Molecules",
    front: "Why is <strong>CO₂</strong> non-polar, but <strong>H₂O</strong> is polar?",
    back: "CO₂ is <strong>linear and symmetrical</strong>; the polarities of the two C=O bonds <strong>cancel out</strong>.<br>H₂O is <strong>V-shaped and asymmetrical</strong>; the polarities of the O-H bonds <strong>cannot cancel out</strong>."
  },
  {
    id: 21,
    subtopic: "Polar & Non-polar Molecules",
    front: "Why is <strong>BF₃</strong> non-polar, but <strong>NH₃</strong> is polar?",
    back: "BF₃ is <strong>trigonal planar and symmetrical</strong>; B-F polarities <strong>cancel out</strong>.<br>NH₃ is <strong>trigonal pyramidal and asymmetrical</strong> (due to a lone pair); N-H polarities <strong>cannot cancel out</strong>."
  },
  {
    id: 22,
    subtopic: "Polar & Non-polar Molecules",
    front: "Why is <strong>CCl₄</strong> non-polar, but <strong>CHCl₃</strong> is polar?",
    back: "CCl₄ is <strong>tetrahedral and symmetrical</strong>; all four C-Cl polarities <strong>cancel out</strong>.<br>CHCl₃ is <strong>asymmetrical</strong>; C-H and C-Cl polar bonds have different polarities and <strong>cannot cancel out</strong>."
  },
  {
    id: 23,
    subtopic: "Polar & Non-polar Molecules",
    front: "Is <strong>PCl₅</strong> polar or non-polar? Explain why.",
    back: "<strong>Non-polar</strong>. Its shape is trigonal bipyramidal and <strong>symmetrical</strong>, so the polarities of the five identical P-Cl bonds <strong>cancel out</strong>."
  },
  {
    id: 24,
    subtopic: "Polar & Non-polar Molecules",
    front: "Explain the result of the <strong>charged rod experiment</strong> with a jet of <strong>CHCl₃</strong>.",
    back: "The jet is <strong>deflected (attracted)</strong> because CHCl₃ is a <strong>polar molecule</strong>. The molecules orientate themselves so that their opposite charges are attracted to the charged rod."
  },
  {
    id: 25,
    subtopic: "Polar & Non-polar Molecules",
    front: "What is the effect on a jet of <strong>CHCl₃</strong> if the negatively charged rod is replaced by a <strong>positively charged rod</strong>?",
    back: "The jet is <strong>still attracted</strong>. The polar molecules will simply <strong>reorientate</strong> so that their negative ends (Cl side) are attracted to the positive rod."
  },
  {
    id: 26,
    subtopic: "Polar & Non-polar Molecules",
    front: "Would a jet of <strong>CCl₄</strong> deflect in the charged rod experiment? Explain.",
    back: "<strong>No deflection</strong>. CCl₄ is <strong>non-polar</strong> because its tetrahedral shape is symmetrical and C-Cl bond polarities cancel out. Non-polar molecules are not attracted by the electric field."
  },
  {
    id: 27,
    subtopic: "Polar & Non-polar Molecules",
    front: "Why is <strong>HF</strong> a polar molecule?",
    back: "It has only <strong>one polar H-F bond</strong>, so there is no other bond to cancel its polarity, making the entire molecule highly polar."
  },

  // Intermolecular Forces (10 cards)
  {
    id: 28,
    subtopic: "Intermolecular Forces",
    front: "What are <strong>van der Waals' forces</strong>?",
    back: "Weak <strong>electrostatic attractions</strong> that exist between <strong>ALL molecules</strong>."
  },
  {
    id: 29,
    subtopic: "Intermolecular Forces",
    front: "How do van der Waals' forces arise in <strong>polar molecules</strong> (e.g., HCl)?",
    back: "Through <strong>permanent dipole-dipole attractions</strong> between the permanent positive end (δ+) of one molecule and the permanent negative end (δ−) of another."
  },
  {
    id: 30,
    subtopic: "Intermolecular Forces",
    front: "How do van der Waals' forces arise in <strong>non-polar molecules</strong> (e.g., N₂)?",
    back: "Constant motion of electrons causes a <strong>temporary uneven distribution</strong>, creating a temporary dipole. This <strong>induces dipoles</strong> in neighboring molecules, leading to weak temporary attractions."
  },
  {
    id: 31,
    subtopic: "Intermolecular Forces",
    front: "What are the <strong>three main factors</strong> affecting the strength of van der Waals' forces?",
    back: "1. <strong>Molecular size</strong> (number of electrons)<br>2. <strong>Molecular shape</strong> (area of contact)<br>3. <strong>Molecular polarity</strong>"
  },
  {
    id: 32,
    subtopic: "Intermolecular Forces",
    front: "Explain how <strong>molecular size</strong> affects the boiling points of halogens (F₂ &lt; Cl₂ &lt; Br₂ &lt; I₂).",
    back: "Larger molecules have <strong>more electrons</strong>, increasing the chance of uneven electron distribution. This leads to <strong>stronger temporary dipoles</strong> and <strong>stronger van der Waals' forces</strong>, requiring more energy to overcome."
  },
  {
    id: 33,
    subtopic: "Intermolecular Forces",
    front: "Explain why <strong>pentane</strong> has a higher boiling point (36.1 °C) than <strong>dimethylpropane</strong> (9.5 °C).",
    back: "Pentane is <strong>rod-shaped (straight chain)</strong>, while dimethylpropane is <strong>spherical (branched)</strong>. Pentane has a <strong>larger area of contact</strong> between molecules, resulting in <strong>stronger van der Waals' forces</strong>."
  },
  {
    id: 34,
    subtopic: "Intermolecular Forces",
    front: "Explain why <strong>cis-1,2-dichloroethene</strong> has a higher boiling point (60.1 °C) than <strong>trans-1,2-dichloroethene</strong> (48.7 °C).",
    back: "The cis isomer is <strong>polar</strong> (C-Cl polarities do not cancel), whereas the trans isomer is <strong>non-polar</strong> (C-Cl polarities cancel symmetrically). Van der Waals' forces between polar cis molecules are <strong>stronger</strong>."
  },
  {
    id: 35,
    subtopic: "Intermolecular Forces",
    front: "What is a <strong>hydrogen bond</strong>?",
    back: "A exceptionally strong intermolecular force that forms when a <strong>H atom is bonded to a highly electronegative atom (N, O, F)</strong>, attracting a <strong>lone pair</strong> on N, O, F of a neighboring molecule."
  },
  {
    id: 36,
    subtopic: "Intermolecular Forces",
    front: "What is the average number of hydrogen bonds formed per molecule in <strong>H₂O</strong>, <strong>HF</strong>, and <strong>NH₃</strong>?",
    back: "<strong>H₂O</strong>: <strong>2</strong> hydrogen bonds on average (2 H atoms, 2 lone pairs on O).<br><strong>HF</strong>: <strong>1</strong> hydrogen bond on average (1 H atom, 3 lone pairs on F).<br><strong>NH₃</strong>: <strong>1</strong> hydrogen bond on average (3 H atoms, 1 lone pair on N)."
  },
  {
    id: 37,
    subtopic: "Intermolecular Forces",
    front: "Explain the boiling point trend of hydrogen halides: <strong>HCl &lt; HBr &lt; HF</strong>.",
    back: "HCl and HBr are held by weak van der Waals' forces; HBr is larger, so its van der Waals' forces are stronger than HCl.<br><strong>HF has the highest boiling point</strong> because its molecules are held by <strong>strong hydrogen bonds</strong>."
  },

  // Hydrogen Bonding & Physical Properties (8 cards)
  {
    id: 38,
    subtopic: "Hydrogen Bonding & Properties",
    front: "State <strong>three physical properties</strong> of water that are exceptionally high due to extensive hydrogen bonding.",
    back: "1. <strong>High boiling point</strong><br>2. <strong>High viscosity</strong><br>3. <strong>High surface tension</strong>"
  },
  {
    id: 39,
    subtopic: "Hydrogen Bonding & Properties",
    front: "Why does <strong>ethanol</strong> have a high boiling point and high viscosity?",
    back: "Due to the presence of <strong>extensive hydrogen bonds</strong> between ethanol molecules (via its hydroxyl -OH group)."
  },
  {
    id: 40,
    subtopic: "Hydrogen Bonding & Properties",
    front: "Why is water <strong>more viscous</strong> than ethanol?",
    back: "Water molecules can form <strong>more hydrogen bonds on average (2)</strong> than ethanol molecules (1), resulting in a stronger network that resists flow."
  },
  {
    id: 41,
    subtopic: "Hydrogen Bonding & Properties",
    front: "Why is <strong>ethanol highly soluble in water</strong>?",
    back: "The <strong>hydroxyl group (-OH)</strong> of ethanol can form <strong>hydrogen bonds with water molecules</strong>."
  },
  {
    id: 42,
    subtopic: "Hydrogen Bonding & Properties",
    front: "Explain why <strong>ice is less dense than liquid water</strong>.",
    back: "In ice, water molecules are held in a fixed, <strong>open tetrahedral structure</strong> by extensive hydrogen bonding, taking up a <strong>larger volume</strong>. When ice melts, this structure <strong>collapses</strong>, and molecules pack <strong>more closely</strong>."
  },
  {
    id: 43,
    subtopic: "Hydrogen Bonding & Properties",
    front: "What happens to the volume of water when it <strong>freezes</strong>?",
    back: "The volume <strong>increases</strong> (expands) because of the open tetrahedral structure formed in ice."
  },
  {
    id: 44,
    subtopic: "Hydrogen Bonding & Properties",
    front: "Do van der Waals' forces exist in substances that have hydrogen bonding (like H₂O or HF)?",
    back: "<strong>Yes</strong>, van der Waals' forces <strong>always exist</strong> between all molecules, in addition to hydrogen bonding."
  },
  {
    id: 45,
    subtopic: "Hydrogen Bonding & Properties",
    front: "What is <strong>surface tension</strong>?",
    back: "The property of a liquid surface to shrink into the minimum surface area possible, behaving like an elastic film, caused by cohesive forces (like hydrogen bonds in water)."
  }
];
