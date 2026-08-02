/* HKDSE Chemistry Ionization Lab — Chemistry Engine */
var Chemistry = (function () {
  // Define constants for the system
  var Kw = 1e-14;

  // Chemical database
  var chemicals = {
    // Acids
    hcl: {
      id: 'hcl',
      nameKey: 'chem.hcl',
      type: 'acid',
      strength: 'strong',
      basicity: 1,
      formula: 'HCl'
    },
    hno3: {
      id: 'hno3',
      nameKey: 'chem.hno3',
      type: 'acid',
      strength: 'strong',
      basicity: 1,
      formula: 'HNO₃'
    },
    h2so4: {
      id: 'h2so4',
      nameKey: 'chem.h2so4',
      type: 'acid',
      strength: 'strong',
      basicity: 2,
      formula: 'H₂SO₄'
    },
    ch3cooh: {
      id: 'ch3cooh',
      nameKey: 'chem.ch3cooh',
      type: 'acid',
      strength: 'weak',
      basicity: 1,
      Ka: 1.8e-5,
      formula: 'CH₃COOH'
    },
    hno2: {
      id: 'hno2',
      nameKey: 'chem.hno2',
      type: 'acid',
      strength: 'weak',
      basicity: 1,
      Ka: 4.5e-4,
      formula: 'HNO₂'
    },
    // Alkalis
    naoh: {
      id: 'naoh',
      nameKey: 'chem.naoh',
      type: 'alkali',
      strength: 'strong',
      basicity: 1, // OH- equivalent
      formula: 'NaOH'
    },
    koh: {
      id: 'koh',
      nameKey: 'chem.koh',
      type: 'alkali',
      strength: 'strong',
      basicity: 1,
      formula: 'KOH'
    },
    caoh2: {
      id: 'caoh2',
      nameKey: 'chem.caoh2',
      type: 'alkali',
      strength: 'strong',
      basicity: 2,
      solubilityLimit: 0.02, // cap dissolved concentration at 0.02M
      formula: 'Ca(OH)₂'
    },
    nh3: {
      id: 'nh3',
      nameKey: 'chem.nh3',
      type: 'alkali',
      strength: 'weak',
      basicity: 1,
      Kb: 1.8e-5,
      formula: 'NH₃'
    }
  };

  // Helper: log10
  function log10(x) {
    return Math.log(x) / Math.LN10;
  }

  /**
   * Calculate chemical properties of a single solution
   * @param {string} id - Chemical ID
   * @param {number} C - Nominal Molarity (M)
   * @returns {object} Calculated properties
   */
  function calculateProperties(id, C) {
    var chem = chemicals[id];
    if (!chem) return null;

    var h = 1e-7; // [H+] concentration
    var oh = 1e-7; // [OH-] concentration
    var alpha = 1.0; // Ionization degree (fraction 0-1)
    var dissolvedC = C;
    var explanation = '';
    var noteKey = '';

    // If Ca(OH)2 is selected, cap active concentration due to solubility limits
    var cappedBySolubility = false;
    if (chem.id === 'caoh2' && C > chem.solubilityLimit) {
      dissolvedC = chem.solubilityLimit;
      cappedBySolubility = true;
    }

    if (chem.type === 'acid') {
      if (chem.strength === 'strong') {
        alpha = 1.0;
        h = dissolvedC * chem.basicity;
        oh = Kw / h;
      } else {
        // Weak acid monobasic: solve h^2 + Ka*h - Ka*C = 0
        var Ka = chem.Ka;
        h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * dissolvedC)) / 2;
        oh = Kw / h;
        alpha = dissolvedC > 0 ? h / dissolvedC : 0;
        if (alpha > 1.0) alpha = 1.0;
      }
    } else {
      // Alkalis
      if (chem.strength === 'strong') {
        alpha = 1.0;
        oh = dissolvedC * chem.basicity;
        h = Kw / oh;
      } else {
        // Weak alkali monobasic: solve oh^2 + Kb*oh - Kb*C = 0
        var Kb = chem.Kb;
        oh = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * dissolvedC)) / 2;
        h = Kw / oh;
        alpha = dissolvedC > 0 ? oh / dissolvedC : 0;
        if (alpha > 1.0) alpha = 1.0;
      }
    }

    // Safety check for extreme concentration bounds
    if (h < 1e-14) h = 1e-14;
    if (h > 15) h = 15; // physical cap

    var pH = -log10(h);
    if (pH < 0.0) pH = 0.0; // cap strictly to 0.0-14.0 standard school scale
    if (pH > 14.0) pH = 14.0;

    // Total mobile ion concentration calculation
    var mobileIonsConc = 0;
    if (chem.type === 'acid') {
      if (chem.strength === 'strong') {
        // H+ and A- (basicity accounts for anions)
        mobileIonsConc = h + dissolvedC; // e.g. HCl: H+ + Cl-, H2SO4: 2H+ + SO42-
      } else {
        // HA ⇌ H+ + A-. Total ions is [H+] + [A-]
        mobileIonsConc = h + h;
      }
    } else {
      // Alkalis
      if (chem.strength === 'strong') {
        mobileIonsConc = oh + dissolvedC; // e.g. NaOH: Na+ + OH-, Ca(OH)2: Ca2+ + 2OH-
      } else {
        // NH3 + H2O ⇌ NH4+ + OH-. Total ions is [NH4+] + [OH-]
        mobileIonsConc = oh + oh;
      }
    }

    // Dynamic explanations tailored for HKDSE students
    var lang = I18n.getLang();
    if (lang === 'zh') {
      if (chem.id === 'hcl' || chem.id === 'hno3') {
        explanation = `<strong>${chem.formula}</strong> 是一種強單質子酸，在水中<strong>完全電離</strong> (電離度 α ≈ 100%)。每溶解 1 莫耳酸分子會釋出 1 莫耳的 H⁺ 離子。因此 H⁺ 離子濃度等於酸的莫耳濃度，燈泡發光非常明亮。`;
      } else if (chem.id === 'h2so4') {
        explanation = `<strong>H₂SO₄</strong> 是一種強雙質子酸，在稀溶液中<strong>完全電離</strong> (α ≈ 100%)。每個 H₂SO₄ 分子電離會產生<strong>兩個</strong> H⁺ 離子：H₂SO₄ ➔ 2H⁺ + SO₄²⁻。因此，在相同濃度下，其 H⁺ 濃度和導電性均為單質子強酸的兩倍！其 pH 顯著較低。`;
      } else if (chem.id === 'ch3cooh') {
        explanation = `<strong>CH₃COOH</strong> 是一種弱單質子酸，在水中<strong>僅輕微電離</strong> (α ≈ ${ (alpha * 100).toFixed(2) }%)，主要以中性乙酸分子存在。其 [H⁺] 遠低於初始酸濃度，溶液中流動離子數量極少，因此導電燈泡非常暗，pH 值較高。`;
      } else if (chem.id === 'hno2') {
        explanation = `<strong>HNO₂</strong> 也是弱單質子酸，但其電離常數 Ka (${chem.Ka}) 比乙酸大，電離度約為 ${ (alpha * 100).toFixed(2) }%。雖然仍屬於弱酸（大部分仍以未電離分子存在），但在相同濃度下它釋出的 H⁺ 較多，因此 pH 比乙酸略低，導電燈泡也稍亮一些。`;
      } else if (chem.id === 'naoh' || chem.id === 'koh') {
        explanation = `<strong>${chem.formula}</strong> 是一種強鹼（強鹼金屬氫氧化物），在水中<strong>完全離解</strong> (α ≈ 100%)，釋出大量流動的 OH⁻ 與陽離子。這提供了極高的自由流動離子濃度，導電性極強，pH 很高。`;
      } else if (chem.id === 'caoh2') {
        explanation = `<strong>Ca(OH)₂</strong> 是強鹼，但它在水中<strong>微溶</strong>。其飽和溶解度約為 0.02 M。當設定濃度高於 0.02 M 時，多餘的部分將無法溶解，因此實際溶解濃度被限制在 0.02 M。溶解的部分會完全離解，釋出 Ca²⁺ 和兩倍的 OH⁻：Ca(OH)₂ ➔ Ca²⁺ + 2OH⁻。`;
      } else if (chem.id === 'nh3') {
        explanation = `<strong>NH₃</strong> 是一種弱鹼，在水中與水分子反應<strong>僅輕微電離</strong>：NH₃ + H₂O ⇌ NH₄⁺ + OH⁻。在 0.1 M 下其電離度僅約 1.3%，流動離子濃度低，導電性弱，pH 顯著低於強鹼。`;
      }
    } else {
      // English explanations
      if (chem.id === 'hcl' || chem.id === 'hno3') {
        explanation = `<strong>${chem.formula}</strong> is a strong monobasic acid that <strong>completely ionizes</strong> in water (α ≈ 100%). Every mole of acid releases 1 mole of H⁺ ions. Thus, [H⁺] equals the molarity of the acid, producing very high mobile ion concentration and a very bright bulb.`;
      } else if (chem.id === 'h2so4') {
        explanation = `<strong>H₂SO₄</strong> is a strong dibasic acid that <strong>completely ionizes</strong> in dilute solution (α ≈ 100%). Each molecule releases <strong>two</strong> H⁺ ions: H₂SO₄ ➔ 2H⁺ + SO₄²⁻. Thus, at identical molarity, its [H⁺] and conductivity are double those of a monobasic strong acid, yielding a much lower pH.`;
      } else if (chem.id === 'ch3cooh') {
        explanation = `<strong>CH₃COOH</strong> is a weak monobasic acid that <strong>ionizes only slightly</strong> in water (α ≈ ${ (alpha * 100).toFixed(2) }%), remaining mostly as neutral CH₃COOH molecules. Its [H⁺] is far below its concentration, mobile ions are very scarce, the bulb glows very dimly, and pH is higher.`;
      } else if (chem.id === 'hno2') {
        explanation = `<strong>HNO₂</strong> is a weak monobasic acid, but with a Ka (${chem.Ka}) ten times larger than ethanoic acid. Its degree of ionization is about ${ (alpha * 100).toFixed(2) }%. While still a weak acid, it releases more H⁺ ions than CH₃COOH at the same concentration, giving a lower pH and a slightly brighter bulb.`;
      } else if (chem.id === 'naoh' || chem.id === 'koh') {
        explanation = `<strong>${chem.formula}</strong> is a strong alkali that <strong>dissociates completely</strong> in water (α ≈ 100%), releasing high concentrations of OH⁻ and metal cations. This provides excellent electrical conductivity (very bright bulb) and a high pH.`;
      } else if (chem.id === 'caoh2') {
        explanation = `<strong>Ca(OH)₂</strong> is a strong base but is <strong>only slightly soluble</strong> in water (saturated concentration is capped at ~0.02 M). Any set molarity exceeding 0.02 M will not dissolve. The dissolved part dissociates completely: Ca(OH)₂ ➔ Ca²⁺ + 2OH⁻.`;
      } else if (chem.id === 'nh3') {
        explanation = `<strong>NH₃</strong> is a weak alkali that reacts with water to <strong>ionize slightly</strong>: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. At 0.1 M, its ionization degree is only ~1.3%. Mobile ion concentration is low, resulting in a dim bulb and a lower alkaline pH.`;
      }
    }

    if (cappedBySolubility) {
      if (lang === 'zh') {
        explanation += `<br><span class="text-danger">⚠️ 注意：氫氧化鈣微溶。設定濃度已超出其溶解度極限 (0.02 M)，底部在實際中會出現未溶沉澱。已按 0.02 M 飽和度計算。</span>`;
      } else {
        explanation += `<br><span class="text-danger">⚠️ Note: Calcium hydroxide is slightly soluble. The set concentration exceeds its solubility limit (0.02 M); undissolved precipitate would form. Solved at 0.02 M saturation.</span>`;
      }
    }

    return {
      id: chem.id,
      name: chem.formula,
      type: chem.type,
      strength: chem.strength,
      basicity: chem.basicity,
      molarity: C,
      dissolvedMolarity: dissolvedC,
      pH: pH,
      alpha: alpha,
      h: h,
      oh: oh,
      mobileIonsConc: mobileIonsConc,
      explanation: explanation,
      cappedBySolubility: cappedBySolubility
    };
  }

  return {
    chemicals: chemicals,
    calculateProperties: calculateProperties
  };
})();
