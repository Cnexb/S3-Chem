/* HKDSE Metal Reactions Lab — Reaction engine */
var ReactionEngine = (function () {
  var ACID_REACTIVE = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb'];
  var COLD_WATER_REACTIVE = ['K', 'Na', 'Ca'];
  var HOT_WATER_REACTIVE = ['Ca', 'Mg'];
  var STEAM_REACTIVE = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe'];
  var WATER_IN_SOLUTION_REACTIVE = ['K', 'Na', 'Ca'];

  var EXPLOSIVE_METALS_SOLUTION = ['K']; // Let potassium float and burn, then trigger an explosive burst at the end
  var EXPLOSIVE_METALS_OXYGEN = [];
  var ACID_DISSOLVE_METALS = ['Mg', 'Al', 'Zn', 'Fe'];
  var ACID_DISSOLVE_MS = { Mg: 2000, Al: 2800, Zn: 2400, Fe: 3500 };
  var EXPLOSION_COLORS = { K: '#e0b0ff', Na: '#facc15', Ca: '#ef4444' };
  var EXPLOSION_INTENSITY = { K: 1, Na: 0.9, Ca: 0.65 };

  function addExplosiveFx(metalId, fx, mode) {
    var list = mode === 'oxygen' ? EXPLOSIVE_METALS_OXYGEN : EXPLOSIVE_METALS_SOLUTION;
    if (list.indexOf(metalId) < 0) return fx;
    fx.explosive = true;
    fx.metalDisappear = true;
    fx.explosionIntensity = EXPLOSION_INTENSITY[metalId];
    fx.explosionColor = fx.flameColor || EXPLOSION_COLORS[metalId] || (METALS[metalId] && METALS[metalId].stripColor) || '#fde047';
    fx.debrisColor = '#f8fafc';
    if (fx.depositColor) {
      fx.debrisColor = fx.depositColor;
      fx.depositColor = null;
    }
    if (fx.powderColor) {
      fx.powderColor = null;
      fx.powderHotColor = null;
    }
    return fx;
  }

  function makeNoReaction(metalId, solutionId, reason) {
    var metal = METALS[metalId];
    var solution = SOLUTIONS[solutionId];
    return {
      reacts: false,
      equation: null,
      wordEquation: { zh: '無反應', en: 'No reaction' },
      observation: reason,
      explanation: reason,
      visualEffects: {
        bubbleRate: 0,
        depositColor: null,
        solutionColorAfter: solution ? solution.color : null,
        flameOnWater: false
      },
      note: null
    };
  }

  function getOxygenResult(metalId) {
    var data = OXYGEN_REACTIONS[metalId];
    if (!data) {
      return {
        reacts: false,
        equation: null,
        wordEquation: { zh: '無反應', en: 'No reaction' },
        observation: { zh: '未知金屬。', en: 'Unknown metal.' },
        explanation: { zh: '', en: '' },
        visualEffects: {},
        note: null
      };
    }

    var fx = {
        flameColor: data.flameColor,
        flameLabel: data.flameLabel,
        glowIntensity: data.reacts ? 1 : 0,
        powderColor: data.powderColor || null,
        powderHotColor: data.powderHotColor || data.powderColor || null,
        spark: !!data.spark
      };
    if (data.reacts) addExplosiveFx(metalId, fx, 'oxygen');

    return {
      reacts: data.reacts,
      equation: data.equation,
      wordEquation: data.wordEquation,
      observation: data.observation,
      explanation: data.explanation,
      visualEffects: fx,
      note: null
    };
  }

  function getColdWaterResult(metalId) {
    if (COLD_WATER_REACTIVE.indexOf(metalId) >= 0) {
      var hydroxide = metalId;
      var eqMap = {
        K: '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g)',
        Na: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)',
        Ca: 'Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)'
      };
      var wordMap = {
        K: { zh: '鉀 + 水 → 氫氧化鉀 + 氫', en: 'Potassium + Water → Potassium hydroxide + Hydrogen' },
        Na: { zh: '鈉 + 水 → 氫氧化鈉 + 氫', en: 'Sodium + Water → Sodium hydroxide + Hydrogen' },
        Ca: { zh: '鈣 + 水 → 氫氧化鈣 + 氫', en: 'Calcium + Water → Calcium hydroxide + Hydrogen' }
      };
      var obsMap = {
        K: {
          zh: '與冷水劇烈反應：熔成銀色小球、在水面移動並發出嘶嘶聲，燃燒呈淡紫色火焰，生成鹼性溶液。',
          en: 'Reacts vigorously with cold water: melts to a silvery ball, moves on the surface with hissing, burns with lilac flame, forms alkaline solution.'
        },
        Na: {
          zh: '與冷水劇烈反應：熔成銀色小球、在水面移動並發出嘶嘶聲，燃燒呈金黃色火焰，生成鹼性溶液。',
          en: 'Reacts vigorously with cold water: melts to a silvery ball, moves on the surface with hissing, burns with golden yellow flame, forms alkaline solution.'
        },
        Ca: {
          zh: '與冷水反應：沉入水底，迅速產生無色氣泡，形成乳白色懸濁液（氫氧化鈣）。',
          en: 'Reacts with cold water: sinks, gives colourless gas bubbles readily, forms milky suspension (calcium hydroxide).'
        }
      };
      return {
        reacts: true,
        equation: eqMap[metalId],
        wordEquation: wordMap[metalId],
        observation: obsMap[metalId],
        explanation: {
          zh: '鉀、鈉、鈣活性高，可與冷水反應生成氫氧化物及氫氣。',
          en: 'K, Na and Ca are reactive enough to react with cold water, forming metal hydroxide and hydrogen.'
        },
        visualEffects: addExplosiveFx(metalId, {
          bubbleRate: metalId === 'Ca' ? 0.7 : 1,
          depositColor: null,
          solutionColorAfter: metalId === 'Ca' ? 'rgba(248, 250, 252, 0.7)' : 'rgba(186, 230, 253, 0.5)',
          flameOnWater: metalId === 'K' || metalId === 'Na',
          flameColor: metalId === 'K' ? '#e0b0ff' : (metalId === 'Na' ? '#ffaa00' : null)
        }, 'solution'),
        note: null
      };
    }
    return makeNoReaction(metalId, 'cold_water', {
      zh: metalId + ' 不與冷水反應。',
      en: METALS[metalId].name.en + ' does not react with cold water.'
    });
  }

  function getHotWaterResult(metalId) {
    if (metalId === 'K' || metalId === 'Na') {
      // Potassium and Sodium react with hot water even more vigorously and burn instantly
      var eqMap = {
        K: '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g)',
        Na: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)'
      };
      var wordMap = {
        K: { zh: '鉀 + 水 → 氫氧化鉀 + 氫', en: 'Potassium + Water → Potassium hydroxide + Hydrogen' },
        Na: { zh: '鈉 + 水 → 氫氧化鈉 + 氫', en: 'Sodium + Water → Sodium hydroxide + Hydrogen' }
      };
      var obsMap = {
        K: {
          zh: '與熱水反應極其劇烈：熔成銀色小球，在水面極速移動並發出強烈嘶嘶聲，劇烈燃燒呈淡紫色火焰。',
          en: 'Reacts extremely vigorously with hot water: melts to a silvery ball, darts extremely rapidly on the surface with loud hissing, burning with intense lilac flame.'
        },
        Na: {
          zh: '與熱水反應極其劇烈：熔成銀色小球，在水面極速移動並發出強烈嘶嘶聲，劇烈燃燒呈金黃色火焰。',
          en: 'Reacts extremely vigorously with hot water: melts to a silvery ball, darts extremely rapidly on the surface with loud hissing, burning with intense golden yellow flame.'
        }
      };
      return {
        reacts: true,
        equation: eqMap[metalId],
        wordEquation: wordMap[metalId],
        observation: obsMap[metalId],
        explanation: {
          zh: '鉀和鈉的活性極高，與熱水反應比冷水更加劇烈，產生的反應熱會令其瞬間劇烈燃燒，並可能發生爆炸。',
          en: 'K and Na are extremely reactive. They react even more violently with hot water than cold water. The massive reaction heat ignites the hydrogen instantly, causing vigorous burning and possible explosion.'
        },
        visualEffects: addExplosiveFx(metalId, {
          bubbleRate: 1.2,
          depositColor: null,
          solutionColorAfter: 'rgba(186, 230, 253, 0.5)',
          flameOnWater: true,
          flameColor: metalId === 'K' ? '#e0b0ff' : '#ffaa00'
        }, 'solution'),
        note: null
      };
    }

    if (HOT_WATER_REACTIVE.indexOf(metalId) >= 0) {
      if (metalId === 'Ca') {
        return {
          reacts: true,
          equation: 'Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)',
          wordEquation: { zh: '鈣 + 水 → 氫氧化鈣 + 氫', en: 'Calcium + Water → Calcium hydroxide + Hydrogen' },
          observation: {
            zh: '與熱水迅速反應：沉入水底，極其迅速產生大量無色氣泡，形成乳白色懸濁液（氫氧化鈣）。',
            en: 'Reacts rapidly with hot water: sinks, gives a large amount of colourless gas bubbles very quickly, forming milky suspension (calcium hydroxide).'
          },
          explanation: {
            zh: '鈣活性高，與熱水反應比冷水更為劇烈，生成微溶的氫氧化鈣及氫氣。',
            en: 'Calcium reacts with hot water more vigorously and rapidly than with cold water, forming slightly soluble calcium hydroxide and hydrogen gas.'
          },
          visualEffects: {
            bubbleRate: 0.95,
            depositColor: null,
            solutionColorAfter: 'rgba(248, 250, 252, 0.75)',
            flameOnWater: false
          },
          note: null
        };
      }

      return {
        reacts: true,
        equation: 'Mg(s) + 2H₂O(l) → Mg(OH)₂(aq) + H₂(g)',
        wordEquation: { zh: '鎂 + 水 → 氫氧化鎂 + 氫', en: 'Magnesium + Water → Magnesium hydroxide + Hydrogen' },
        observation: {
          zh: '與熱水反應緩慢，產生少量無色氣泡。',
          en: 'Reacts slowly with hot water, giving a few colourless gas bubbles.'
        },
        explanation: {
          zh: '鎂活性中等，與熱水反應比冷水慢得多。',
          en: 'Magnesium reacts slowly with hot water compared to cold water.'
        },
        visualEffects: {
          bubbleRate: 0.3,
          depositColor: null,
          solutionColorAfter: SOLUTIONS.hot_water.color,
          flameOnWater: false
        },
        note: null
      };
    }
    return makeNoReaction(metalId, 'hot_water', {
      zh: METALS[metalId].name.zh + ' 不與熱水反應（或反應極慢）。',
      en: METALS[metalId].name.en + ' does not react with hot water (or reacts very slowly).'
    });
  }

  function getSteamResult(metalId, options) {
    if (STEAM_REACTIVE.indexOf(metalId) < 0) {
      return makeNoReaction(metalId, 'steam', {
        zh: METALS[metalId].name.zh + ' 不與水蒸氣反應。',
        en: METALS[metalId].name.en + ' does not react with steam.'
      });
    }

    var eqMap = {
      Mg: 'Mg(s) + H₂O(g) → MgO(s) + H₂(g)',
      Al: '2Al(s) + 3H₂O(g) → Al₂O₃(s) + 3H₂(g)',
      Zn: 'Zn(s) + H₂O(g) → ZnO(s) + H₂(g)',
      Fe: '3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)'
    };
    var wordMap = {
      Mg: { zh: '鎂 + 水蒸氣 → 氧化鎂 + 氫', en: 'Magnesium + Steam → Magnesium oxide + Hydrogen' },
      Al: { zh: '鋁 + 水蒸氣 → 氧化鋁 + 氫', en: 'Aluminium + Steam → Aluminium oxide + Hydrogen' },
      Zn: { zh: '鋅 + 水蒸氣 → 氧化鋅 + 氫', en: 'Zinc + Steam → Zinc oxide + Hydrogen' },
      Fe: { zh: '鐵 + 水蒸氣 → 四氧化三鐵 + 氫', en: 'Iron + Steam → Iron(II,III) oxide + Hydrogen' }
    };

    if (metalId === 'K' || metalId === 'Na' || metalId === 'Ca') {
      var steamEq = {
        K: '2K(s) + H₂O(g) → K₂O(s) + H₂(g)',
        Na: '2Na(s) + H₂O(g) → Na₂O(s) + H₂(g)',
        Ca: 'Ca(s) + H₂O(g) → CaO(s) + H₂(g)'
      };
      var steamWord = {
        K: { zh: '鉀 + 水蒸氣 → 氧化鉀 + 氫', en: 'Potassium + Steam → Potassium oxide + Hydrogen' },
        Na: { zh: '鈉 + 水蒸氣 → 氧化鈉 + 氫', en: 'Sodium + Steam → Sodium oxide + Hydrogen' },
        Ca: { zh: '鈣 + 水蒸氣 → 氧化鈣 + 氫', en: 'Calcium + Steam → Calcium oxide + Hydrogen' }
      };
      var steamObs = {
        K: {
          zh: '與水蒸氣劇烈反應，產生無色氫氣及白色氧化物。',
          en: 'Reacts vigorously with steam, giving colourless hydrogen and a white oxide.'
        },
        Na: {
          zh: '與水蒸氣劇烈反應，產生無色氫氣及白色氧化物. ',
          en: 'Reacts vigorously with steam, giving colourless hydrogen and a white oxide.'
        },
        Ca: {
          zh: '與水蒸氣反應，產生無色氫氣及白色氧化物。',
          en: 'Reacts with steam, giving colourless hydrogen and a white oxide.'
        }
      };
      return {
        reacts: true,
        equation: steamEq[metalId],
        wordEquation: steamWord[metalId],
        observation: steamObs[metalId],
        explanation: {
          zh: '活性高的金屬與水蒸氣反應生成金屬氧化物及氫氣。',
          en: 'Highly reactive metals react with steam to form metal oxide and hydrogen.'
        },
        visualEffects: addExplosiveFx(metalId, {
          bubbleRate: 1,
          depositColor: null,
          solutionColorAfter: SOLUTIONS.steam.color,
          flameOnWater: metalId === 'K' || metalId === 'Na',
          flameColor: metalId === 'K' ? '#e0b0ff' : (metalId === 'Na' ? '#ffaa00' : null)
        }, 'solution'),
        note: null
      };
    }

    var obsMap = {
      Mg: {
        zh: '與水蒸氣劇烈反應，發出耀眼白光，生成白色固體及無色氫氣。',
        en: 'Reacts vigorously with steam, giving intense white light, white solid and colourless hydrogen.'
      },
      Al: {
        zh: '與水蒸氣反應，生成氧化鋁及氫氣。',
        en: 'Reacts with steam to form aluminium oxide and hydrogen.'
      },
      Zn: {
        zh: '與水蒸氣反應，生成氧化鋅（熱時黃色，冷卻後白色）及氫氣。',
        en: 'Reacts with steam to form zinc oxide (yellow when hot, white when cold) and hydrogen.'
      },
      Fe: {
        zh: '與水蒸氣反應，生成黑色四氧化三鐵及氫氣。',
        en: 'Reacts with steam to form black iron(II,III) oxide and hydrogen.'
      }
    };

    return {
      reacts: true,
      equation: eqMap[metalId] || 'Metal + Steam → Metal oxide + H₂',
      wordEquation: wordMap[metalId],
      observation: obsMap[metalId],
      explanation: {
        zh: '中等活性金屬需與水蒸氣（而非冷水）反應。',
        en: 'Moderately reactive metals react with steam rather than cold water.'
      },
      visualEffects: {
        bubbleRate: metalId === 'Mg' ? 0.9 : 0.6,
        depositColor: metalId === 'Fe' ? '#1f2937' : (metalId === 'Zn' ? '#fde047' : '#f8fafc'),
        solutionColorAfter: SOLUTIONS.steam.color,
        flameOnWater: metalId === 'Mg',
        flameColor: metalId === 'Mg' ? '#ffffff' : null,
        whiteFlash: metalId === 'Mg'
      },
      note: null
    };
  }

  function getAcidResult(metalId, solutionId, options) {
    if (ACID_REACTIVE.indexOf(metalId) < 0) {
      return makeNoReaction(metalId, solutionId, {
        zh: METALS[metalId].name.zh + ' 的活性低於氫，不能置換稀酸中的氫離子，故無反應。',
        en: METALS[metalId].name.en + ' is less reactive than hydrogen and cannot displace H⁺ from dilute acids — no reaction.'
      });
    }

    var acidType = SOLUTIONS[solutionId].acidType;
    var symbol = METALS[metalId].symbol;
    var eq;
    var word;
    var obs;
    var note = null;
    var bubbleRate = 0.8;

    if (acidType === 'hcl') {
      var coeff = { K: 1, Na: 1, Ca: 1, Mg: 1, Al: 2, Zn: 1, Fe: 1, Pb: 1 };
      var c = coeff[metalId] || 1;
      var salt = symbol + 'Cl' + (c > 1 && metalId !== 'Al' ? '₂' : (metalId === 'Al' ? '₃' : ''));
      if (metalId === 'Al') {
        eq = '2Al(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂(g)';
      } else if (metalId === 'Ca') {
        eq = 'Ca(s) + 2HCl(aq) → CaCl₂(aq) + H₂(g)';
      } else if (metalId === 'Mg') {
        eq = 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)';
      } else if (metalId === 'Zn') {
        eq = 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)';
      } else if (metalId === 'Fe') {
        eq = 'Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g)';
      } else if (metalId === 'Pb') {
        eq = 'Pb(s) + 2HCl(aq) → PbCl₂(aq) + H₂(g)';
        bubbleRate = 0.15;
        note = { zh: '鉛與稀酸反應極慢；生成的氯化鉛(II)不溶，會覆蓋金屬表面使反應停止。', en: 'Lead reacts very slowly; insoluble lead(II) chloride covers the surface and stops the reaction.' };
      } else {
        eq = '2' + symbol + '(s) + 2HCl(aq) → 2' + symbol + 'Cl(aq) + H₂(g)';
      }
      word = { zh: symbol + ' + 稀鹽酸 → 氯化物 + 氫', en: symbol + ' + Dilute HCl → Metal chloride + Hydrogen' };
    } else {
      if (metalId === 'Ca') {
        eq = 'Ca(s) + H₂SO₄(aq) → CaSO₄(s) + H₂(g)';
        note = { zh: '反應初期有氣泡，但生成的硫酸鈣不溶，覆蓋金屬表面後反應停止。', en: 'Gas is given off initially, but insoluble calcium sulphate covers the metal and stops the reaction.' };
        bubbleRate = 0.4;
      } else if (metalId === 'Al') {
        eq = '2Al(s) + 3H₂SO₄(aq) → Al₂(SO₄)₃(aq) + 3H₂(g)';
      } else if (metalId === 'Mg') {
        eq = 'Mg(s) + H₂SO₄(aq) → MgSO₄(aq) + H₂(g)';
      } else if (metalId === 'Zn') {
        eq = 'Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)';
      } else if (metalId === 'Fe') {
        eq = 'Fe(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂(g)';
      } else if (metalId === 'Pb') {
        eq = 'Pb(s) + H₂SO₄(aq) → PbSO₄(s) + H₂(g)';
        bubbleRate = 0.15;
        note = { zh: '鉛與稀硫酸反應極慢；生成的硫酸鉛(II)不溶，會覆蓋金屬表面使反應停止。', en: 'Lead reacts very slowly; insoluble lead(II) sulphate covers the surface and stops the reaction.' };
      } else {
        eq = '2' + symbol + '(s) + H₂SO₄(aq) → ' + symbol + 'SO₄(aq) + H₂(g)';
      }
      word = { zh: symbol + ' + 稀硫酸 → 硫酸鹽 + 氫', en: symbol + ' + Dilute H₂SO₄ → Metal sulphate + Hydrogen' };
    }

    if (metalId === 'K' || metalId === 'Na') {
      obs = {
        zh: '反應劇烈甚至爆炸性，因放出易燃氫氣並產生大量熱。',
        en: 'Reacts explosively — flammable hydrogen is given off and much heat is produced.'
      };
      bubbleRate = 1;
    } else if (metalId === 'Pb') {
      obs = {
        zh: '反應極慢，僅有少量無色氣泡；不溶性鹽可能覆蓋表面。',
        en: 'Reacts very slowly with a few colourless gas bubbles; insoluble salt may cover the surface.'
      };
    } else if (ACID_DISSOLVE_METALS.indexOf(metalId) >= 0) {
      obs = {
        zh: '金屬逐漸溶解於酸中，並產生無色氫氣泡。',
        en: 'The metal gradually dissolves in the acid, giving colourless hydrogen gas bubbles.'
      };
    } else {
      obs = {
        zh: '反應並產生無色氫氣泡。',
        en: 'Reacts readily, giving colourless hydrogen gas bubbles.'
      };
    }

    var solutionColorAfter = SOLUTIONS[solutionId].color;
    if (metalId === 'Fe') {
      solutionColorAfter = SOLUTIONS.feso4.color;
    }

    var visualFx = {
      bubbleRate: bubbleRate,
      depositColor: null,
      solutionColorAfter: solutionColorAfter,
      flameOnWater: metalId === 'K' || metalId === 'Na',
      flameColor: metalId === 'K' ? '#e0b0ff' : (metalId === 'Na' ? '#ffaa00' : null)
    };

    if (ACID_DISSOLVE_METALS.indexOf(metalId) >= 0 && EXPLOSIVE_METALS_SOLUTION.indexOf(metalId) < 0) {
      visualFx.metalDissolve = true;
      visualFx.dissolveMs = ACID_DISSOLVE_MS[metalId] || 2500;
    }

    return {
      reacts: true,
      equation: eq,
      wordEquation: word,
      observation: obs,
      explanation: {
        zh: '活性高於氫的金屬可與稀酸反應，置換出氫氣並生成鹽。',
        en: 'Metals more reactive than hydrogen displace H⁺ from dilute acids, forming a salt and hydrogen gas.'
      },
      visualEffects: addExplosiveFx(metalId, visualFx, 'solution'),
      note: note
    };
  }

  function getDisplacementResult(metalId, solutionId, options) {
    var solution = SOLUTIONS[solutionId];
    if (!solution) {
      return makeNoReaction(metalId, solutionId, { zh: '請選擇溶液。', en: 'Please select a solution.' });
    }
    var ionMetal = solution.ionMetal;

    if (metalId === 'K' || metalId === 'Na' || metalId === 'Ca') {
      var nameZh = METALS[metalId].name.zh;
      var nameEn = METALS[metalId].name.en;
      var alkaliZh = metalId === 'K' ? '氫氧化鉀' : (metalId === 'Na' ? '氫氧化鈉' : '氫氧化鈣');
      var alkaliEn = metalId === 'K' ? 'Potassium hydroxide' : (metalId === 'Na' ? 'Sodium hydroxide' : 'Calcium hydroxide');
      var formula = metalId === 'K' ? '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g)' : (metalId === 'Na' ? '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)' : 'Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)');

      var pptZh = '';
      var pptEn = '';
      var wordZh = '';
      var wordEn = '';
      var solColorAfter = solution.color;

      if (solutionId === 'cuso4') {
        if (metalId === 'Ca') {
          pptZh = '藍色絮狀沉澱（氫氧化銅(II)）與白色沉澱（硫酸鈣）的混合物';
          pptEn = 'blue gelatinous precipitate of copper(II) hydroxide mixed with white precipitate of calcium sulphate';
          wordZh = '鈣 + 水 → 氫氧化鈣 + 氫 ； 氫氧化鈣 + 硫酸銅(II) → 氫氧化銅(II) (藍色沉澱) + 硫酸鈣 (白色沉澱)';
          wordEn = 'Calcium + Water → Calcium hydroxide + Hydrogen ; Calcium hydroxide + Copper(II) sulphate → Copper(II) hydroxide (blue ppt) + Calcium sulphate (white ppt)';
          solColorAfter = 'rgba(191, 219, 254, 0.85)'; // hazy light blue
        } else {
          pptZh = '藍色絮狀沉澱（氫氧化銅(II)）';
          pptEn = 'blue gelatinous precipitate of copper(II) hydroxide';
          wordZh = nameZh + ' + 水 → ' + alkaliZh + ' + 氫 ； ' + alkaliZh + ' + 硫酸銅(II) → 氫氧化銅(II) (藍色沉澱) + 硫酸' + (metalId === 'K' ? '鉀' : '鈉');
          wordEn = nameEn + ' + Water → ' + alkaliEn + ' + Hydrogen ; ' + alkaliEn + ' + Copper(II) sulphate → Copper(II) hydroxide (blue ppt) + ' + nameEn + ' sulphate';
          solColorAfter = 'rgba(147, 197, 253, 0.75)';
        }
      } else if (solutionId === 'agno3') {
        pptZh = '棕黑色沉澱（氧化銀）';
        pptEn = 'brownish-black precipitate of silver oxide';
        wordZh = nameZh + ' + 水 → ' + alkaliZh + ' + 氫 ； ' + alkaliZh + ' + 硝酸銀 → 氧化銀 (棕黑色沉澱) + 硝酸' + (metalId === 'K' ? '鉀' : (metalId === 'Na' ? '鈉' : '鈣')) + (metalId === 'Ca' ? ' (與水)' : '');
        wordEn = nameEn + ' + Water → ' + alkaliEn + ' + Hydrogen ; ' + alkaliEn + ' + Silver nitrate → Silver oxide (brown-black ppt) + ' + nameEn + ' nitrate' + (metalId === 'Ca' ? ' + Water' : ' + Water');
        solColorAfter = 'rgba(120, 113, 108, 0.75)';
      } else if (solutionId === 'znso4') {
        if (metalId === 'Ca') {
          pptZh = '白色沉澱（氫氧化鋅與微溶的硫酸鈣）';
          pptEn = 'white precipitate of zinc hydroxide and slightly soluble calcium sulphate';
          wordZh = '鈣 + 水 → 氫氧化鈣 + 氫 ； 氫氧化鈣 + 硫酸鋅 → 氫氧化鋅 (白色沉澱) + 硫酸鈣 (微溶)';
          wordEn = 'Calcium + Water → Calcium hydroxide + Hydrogen ; Calcium hydroxide + Zinc sulphate → Zinc hydroxide (white ppt) + Calcium sulphate';
        } else {
          wordZh = nameZh + ' + 水 → ' + alkaliZh + ' + 氫 ； ' + alkaliZh + ' + 硫酸鋅 → 氫氧化鋅 (白色沉澱) + 硫酸' + (metalId === 'K' ? '鉀' : '鈉');
          wordEn = nameEn + ' + Water → ' + alkaliEn + ' + Hydrogen ; ' + alkaliEn + ' + Zinc sulphate → Zinc hydroxide (white ppt) + ' + nameEn + ' sulphate';
          pptZh = '白色沉澱（氫氧化鋅）';
          pptEn = 'white precipitate of zinc hydroxide';
        }
        solColorAfter = 'rgba(241, 245, 249, 0.8)';
      } else if (solutionId === 'feso4') {
        if (metalId === 'Ca') {
          pptZh = '綠色沉澱（氫氧化鐵(II)）與白色沉澱（硫酸鈣）';
          pptEn = 'green precipitate of iron(II) hydroxide and white precipitate of calcium sulphate';
          wordZh = '鈣 + 水 → 氫氧化鈣 + 氫 ； 氫氧化鈣 + 硫酸鐵(II) → 氫氧化鐵(II) (綠色沉澱) + 硫酸鈣 (白色沉澱)';
          wordEn = 'Calcium + Water → Calcium hydroxide + Hydrogen ; Calcium hydroxide + Iron(II) sulphate → Iron(II) hydroxide (green ppt) + Calcium sulphate (white ppt)';
        } else {
          wordZh = nameZh + ' + 水 → ' + alkaliZh + ' + 氫 ； ' + alkaliZh + ' + 硫酸鐵(II) → 氫氧化鐵(II) (綠色沉澱) + 硫酸' + (metalId === 'K' ? '鉀' : '鈉');
          wordEn = nameEn + ' + Water → ' + alkaliEn + ' + Hydrogen ; ' + alkaliEn + ' + Iron(II) sulphate → Iron(II) hydroxide (green ppt) + ' + nameEn + ' sulphate';
          pptZh = '綠色沉澱（氫氧化鐵(II)）';
          pptEn = 'green precipitate of iron(II) hydroxide';
        }
        solColorAfter = 'rgba(110, 231, 183, 0.85)';
      } else if (solutionId === 'pbno32') {
        pptZh = '白色沉澱（氫氧化鉛(II)）';
        pptEn = 'white precipitate of lead(II) hydroxide';
        wordZh = nameZh + ' + 水 → ' + alkaliZh + ' + 氫 ； ' + alkaliZh + ' + 硝酸鉛(II) → 氫氧化鉛(II) (白色沉澱) + 硝酸' + (metalId === 'K' ? '鉀' : (metalId === 'Na' ? '鈉' : '鈣'));
        wordEn = nameEn + ' + Water → ' + alkaliEn + ' + Hydrogen ; ' + alkaliEn + ' + Lead(II) nitrate → Lead(II) hydroxide (white ppt) + ' + nameEn + ' nitrate';
        solColorAfter = 'rgba(241, 245, 249, 0.8)';
      } else {
        pptZh = '沉澱物';
        pptEn = 'precipitate';
        wordZh = nameZh + ' + 水 → ' + alkaliZh + ' + 氫';
        wordEn = nameEn + ' + Water → ' + alkaliEn + ' + Hydrogen';
      }

      var obsZh = '';
      var obsEn = '';
      if (metalId === 'Ca') {
        obsZh = '與溶液迅速反應：金屬沉入底部，極其迅速產生大量無色氣泡。同時，溶液中迅速生成大量的' + pptZh + '，使整杯溶液變混濁。';
        obsEn = 'Reacts rapidly with the solution: metal sinks to the bottom, giving a large amount of colourless gas bubbles very quickly. Meanwhile, a large amount of ' + pptEn + ' forms immediately, turning the entire solution turbid.';
      } else {
        var flameNameZh = metalId === 'K' ? '淡紫色火焰' : '金黃色火焰';
        var flameNameEn = metalId === 'K' ? 'lilac flame' : 'golden yellow flame';
        obsZh = '與溶液劇烈反應：金屬在表面迅速熔成銀色小球並極速移動，發出嘶嘶聲，劇烈燃燒呈' + flameNameZh + '。同時，溶液中迅速生成' + pptZh + '。';
        obsEn = 'Reacts violently: metal melts into a silvery ball and moves extremely rapidly on the surface with hissing, burning with intense ' + flameNameEn + '. Meanwhile, a ' + pptEn + ' is formed immediately in the solution.';
      }

      var expZh = '';
      var expEn = '';
      if (metalId === 'Ca') {
        expZh = '鈣的活性非常高。當投入鹽溶液中時，它不會直接置換溶液中的金屬離子，而是優先與水發生劇烈的化學反應，釋放氫氣並生成強鹼（氫氧化鈣）。隨後，生成的強鹼再與溶液中的金屬離子發生複分解反應，形成不溶性的金屬氫氧化物（或氧化物）及硫酸鈣沉澱。';
        expEn = 'Calcium is highly reactive. When added to an aqueous salt solution, it does not directly undergo a displacement reaction. Instead, it reacts preferentially and rapidly with water to release hydrogen gas and form Calcium hydroxide (a strong alkali). The alkali then undergoes double decomposition with the metal ions in the solution, forming insoluble metal hydroxide (or oxide) and calcium sulphate precipitates.';
      } else {
        expZh = nameZh + '的活性極高。當投入鹽溶液中時，它不會直接置換溶液中的金屬離子，而是優先與水發生極其劇烈的反應，釋放氫氣、產生大量熱並使其劇烈燃燒。反應生成的強鹼（' + alkaliZh + '）隨即與溶液中的金屬離子結合，生成不溶性的金屬氫氧化物（或氧化物）沉澱。';
        expEn = nameEn + ' is extremely reactive. When added to an aqueous salt solution, it does not directly displace the metal ions. Instead, it reacts preferentially and extremely vigorously with water, releasing hydrogen gas and massive heat which ignites the metal. The strong alkali produced (' + alkaliEn + ') then reacts with the metal ions in the solution to form an insoluble metal hydroxide (or oxide) precipitate.';
      }

      var flameCol = metalId === 'K' ? '#e0b0ff' : '#ffaa00';

      return {
        reacts: true,
        equation: formula,
        wordEquation: {
          zh: wordZh,
          en: wordEn
        },
        observation: {
          zh: obsZh,
          en: obsEn
        },
        explanation: {
          zh: expZh,
          en: expEn
        },
        visualEffects: addExplosiveFx(metalId, {
          bubbleRate: metalId === 'Ca' ? 0.85 : 1.2,
          depositColor: null,
          solutionColorAfter: solColorAfter,
          flameOnWater: metalId !== 'Ca',
          flameColor: metalId === 'Ca' ? null : flameCol
        }, 'solution'),
        note: {
          zh: '注意：' + nameZh + '優先與溶液中的水反應，而非直接發生金屬置換反應。這是 HKDSE 常考的重要化學觀念。',
          en: 'Note: ' + nameEn + ' reacts preferentially with water in the solution rather than undergoing a direct metal displacement. This is a crucial concept in the HKDSE Chemistry curriculum.'
        }
      };
    }

    var waterNote = null;
    var extraH2 = false;

    if (WATER_IN_SOLUTION_REACTIVE.indexOf(metalId) >= 0) {
      extraH2 = true;
      waterNote = {
        zh: '注意：' + METALS[metalId].name.zh + ' 亦會與溶液中的水反應，放出無色氫氣。',
        en: 'Note: ' + METALS[metalId].name.en + ' also reacts with water in the solution, giving colourless hydrogen.'
      };
    }

    if (!isMoreReactive(metalId, ionMetal)) {
      var reason = {
        zh: METALS[metalId].name.zh + ' 的活性低於或等於 ' + METALS[ionMetal].name.zh + '，不能置換溶液中的 ' + METALS[ionMetal].symbol + '²⁺/⁺ 離子。',
        en: METALS[metalId].name.en + ' is less reactive than (or equal to) ' + METALS[ionMetal].name.en + ' and cannot displace ' + METALS[ionMetal].symbol + ' ions from solution.'
      };
      if (extraH2) {
        return getColdWaterResult(metalId);
      }
      return makeNoReaction(metalId, solutionId, reason);
    }

    var eqMap = {
      cuso4: {
        Zn: 'Zn(s) + CuSO₄(aq) → Cu(s) + ZnSO₄(aq)',
        Fe: 'Fe(s) + CuSO₄(aq) → Cu(s) + FeSO₄(aq)',
        Mg: 'Mg(s) + CuSO₄(aq) → Cu(s) + MgSO₄(aq)',
        Al: '2Al(s) + 3CuSO₄(aq) → 3Cu(s) + Al₂(SO₄)₃(aq)',
        Pb: 'Pb(s) + CuSO₄(aq) → Cu(s) + PbSO₄(s)'
      },
      agno3: {
        Cu: 'Cu(s) + 2AgNO₃(aq) → 2Ag(s) + Cu(NO₃)₂(aq)',
        Zn: 'Zn(s) + 2AgNO₃(aq) → 2Ag(s) + Zn(NO₃)₂(aq)',
        Fe: 'Fe(s) + 2AgNO₃(aq) → 2Ag(s) + Fe(NO₃)₂(aq)',
        Mg: 'Mg(s) + 2AgNO₃(aq) → 2Ag(s) + Mg(NO₃)₂(aq)',
        Al: '2Al(s) + 6AgNO₃(aq) → 6Ag(s) + 2Al(NO₃)₃(aq)',
        Pb: 'Pb(s) + 2AgNO₃(aq) → 2Ag(s) + Pb(NO₃)₂(aq)'
      },
      znso4: {
        Mg: 'Mg(s) + ZnSO₄(aq) → Zn(s) + MgSO₄(aq)',
        Al: '2Al(s) + 3ZnSO₄(aq) → 3Zn(s) + Al₂(SO₄)₃(aq)',
        Fe: 'Fe(s) + ZnSO₄(aq) → Zn(s) + FeSO₄(aq)'
      },
      feso4: {
        Zn: 'Zn(s) + FeSO₄(aq) → Fe(s) + ZnSO₄(aq)',
        Mg: 'Mg(s) + FeSO₄(aq) → Fe(s) + MgSO₄(aq)',
        Al: '2Al(s) + 3FeSO₄(aq) → 3Fe(s) + Al₂(SO₄)₃(aq)'
      },
      pbno32: {
        Zn: 'Zn(s) + Pb(NO₃)₂(aq) → Pb(s) + Zn(NO₃)₂(aq)',
        Fe: 'Fe(s) + Pb(NO₃)₂(aq) → Pb(s) + Fe(NO₃)₂(aq)',
        Mg: 'Mg(s) + Pb(NO₃)₂(aq) → Pb(s) + Mg(NO₃)₂(aq)',
        Cu: 'Cu(s) + Pb(NO₃)₂(aq) → Pb(s) + Cu(NO₃)₂(aq)',
        Al: '2Al(s) + 3Pb(NO₃)₂(aq) → 3Pb(s) + 2Al(NO₃)₃(aq)'
      }
    };

    var eq = eqMap[solutionId] && eqMap[solutionId][metalId];
    if (!eq) {
      eq = METALS[metalId].symbol + '(s) + ' + solution.name.en.split(' ').pop() + ' → ' + METALS[ionMetal].symbol + '(s) + salt(aq)';
    }

    var obs = {
      zh: '較活潑的 ' + METALS[metalId].name.zh + ' 置換出較不活潑的 ' + METALS[ionMetal].name.zh + '，金屬片浸沒部分出現 ' + METALS[ionMetal].name.zh + ' 沉積。',
      en: 'More reactive ' + METALS[metalId].name.en + ' displaces less reactive ' + METALS[ionMetal].name.en + '; deposited metal appears on the submerged part of the strip.'
    };

    if (solutionId === 'cuso4') {
      if (metalId === 'Pb') {
        obs = {
          zh: '反應極其緩慢（接近無反應）：生成的硫酸鉛(II)不溶，會迅速覆蓋在鉛的表面，阻止進一步的置換反應。僅表面出現極微量紅棕色銅沉積。',
          en: 'Reaction is extremely slow: insoluble lead(II) sulphate forms quickly and covers the lead surface, stopping further displacement. Only a tiny amount of reddish-brown copper deposits on the surface.'
        };
      } else {
        obs = {
          zh: '藍色溶液逐漸變無色（或淡色），鋅/鐵等金屬片上出現紅棕色銅沉積。',
          en: 'Blue solution fades to colourless (or pale); reddish-brown copper deposits on the metal strip.'
        };
      }
    }
    if (solutionId === 'agno3') {
      obs = {
        zh: '無色溶液中，金屬片表面出現銀灰色銀沉積。',
        en: 'Silvery-grey silver deposits on the metal strip in the colourless solution.'
      };
    }

    var solutionColorAfter = solution.colorAfter || solution.color;
    if (metalId === 'Fe') {
      solutionColorAfter = SOLUTIONS.feso4.color;
    } else if (metalId === 'Cu') {
      solutionColorAfter = SOLUTIONS.cuso4.color;
    } else if (metalId === 'Mg' || metalId === 'Zn' || metalId === 'Al') {
      solutionColorAfter = 'rgba(240, 249, 255, 0.45)';
    }

    var visualFx = {
      bubbleRate: extraH2 ? 0.8 : 0,
      depositColor: solution.depositColor,
      solutionColorAfter: solutionColorAfter,
      flameOnWater: extraH2 && (metalId === 'K' || metalId === 'Na'),
      flameColor: metalId === 'K' ? '#e0b0ff' : (metalId === 'Na' ? '#ffaa00' : null)
    };

    var customNote = waterNote;
    if (metalId === 'Pb' && solutionId === 'cuso4') {
      visualFx.depositColor = '#555555'; // dull grey/white layer of PbSO4 instead of copper deposit
      customNote = {
        zh: '注意：雖然在活性序中鉛比銅活潑，但因生成不溶性的硫酸鉛(II)包裹金屬表面，使反應很快停止。這是不溶性鹽鈍化作用的經典例子。',
        en: 'Note: Although lead is more reactive than copper, the reaction stops quickly because insoluble lead(II) sulphate covers the surface. This is a classic example of salt passivation.'
      };
    }

    return {
      reacts: true,
      equation: eq,
      wordEquation: {
        zh: METALS[metalId].name.zh + ' + ' + METALS[ionMetal].name.zh + ' 化合物 → ' + METALS[ionMetal].name.zh + ' + ' + METALS[metalId].name.zh + ' 化合物',
        en: METALS[metalId].name.en + ' + ' + METALS[ionMetal].name.en + ' compound → ' + METALS[ionMetal].name.en + ' + ' + METALS[metalId].name.en + ' compound'
      },
      observation: obs,
      explanation: {
        zh: metalId === 'Pb' && solutionId === 'cuso4' ? '鉛與硫酸銅反應生成微溶於水的白色硫酸鉛(II)固體，阻礙內層金屬與銅離子繼續接觸。' : '置換反應：較活潑金屬可置換溶液中較不活潑金屬的離子。',
        en: metalId === 'Pb' && solutionId === 'cuso4' ? 'Lead reacts with copper(II) sulphate to form insoluble white lead(II) sulphate, which covers the metal and blocks further contact with copper(II) ions.' : 'Displacement reaction: a more reactive metal displaces a less reactive metal from its compound solution.'
      },
      visualEffects: addExplosiveFx(metalId, visualFx, 'solution'),
      note: customNote
    };
  }

  function getResult(params) {
    var mode = params.mode;
    var metalId = params.metalId;
    var solutionId = params.solutionId;
    var options = params.options || {};

    if (mode === 'oxygen') {
      return getOxygenResult(metalId);
    }

    if (!solutionId || !SOLUTIONS[solutionId]) {
      return makeNoReaction(metalId, solutionId, { zh: '請選擇溶液。', en: 'Please select a solution.' });
    }

    var cat = SOLUTIONS[solutionId].category;
    var result;
    if (cat === 'water') {
      if (solutionId === 'cold_water') result = getColdWaterResult(metalId);
      else if (solutionId === 'hot_water') result = getHotWaterResult(metalId);
      else if (solutionId === 'steam') result = getSteamResult(metalId, options);
    } else if (cat === 'acid') {
      result = getAcidResult(metalId, solutionId, options);
    } else if (cat === 'displacement') {
      result = getDisplacementResult(metalId, solutionId, options);
    } else {
      result = makeNoReaction(metalId, solutionId, { zh: '未知溶液類型。', en: 'Unknown solution type.' });
    }

    // Apply the "metal dissolve" effect if the reaction is not displacement,
    // it actually reacts, and an aqueous product (aq) is formed.
    if (result && result.reacts && cat !== 'displacement') {
      var eq = result.equation;
      if (eq && eq.indexOf('→') >= 0) {
        var products = eq.split('→')[1];
        if (products && products.indexOf('(aq)') >= 0) {
          if (!result.visualEffects) {
            result.visualEffects = {};
          }
          result.visualEffects.metalDissolve = true;
          
          // Set appropriate dissolve duration based on metal and reaction type
          if (!result.visualEffects.dissolveMs) {
            var ms = 2500; // default fallback
            if (cat === 'water') {
              if (metalId === 'K') ms = 4000;
              else if (metalId === 'Na') ms = 4500;
              else if (metalId === 'Ca') ms = 5000;
              else if (metalId === 'Mg') ms = 6000; // Mg in hot water reacts slowly
            } else if (cat === 'acid') {
              if (metalId === 'K') ms = 1500;
              else if (metalId === 'Na') ms = 1800;
              else if (metalId === 'Ca') ms = 2000;
              else if (metalId === 'Mg') ms = 2000;
              else if (metalId === 'Al') ms = 2800;
              else if (metalId === 'Zn') ms = 2400;
              else if (metalId === 'Fe') ms = 3500;
              else if (metalId === 'Pb') ms = 8000; // Pb reacts very slowly
            }
            result.visualEffects.dissolveMs = ms;
          }
        }
      }
    }

    return result;
  }

  return {
    getResult: getResult,
    getOxygenResult: getOxygenResult
  };
})();
