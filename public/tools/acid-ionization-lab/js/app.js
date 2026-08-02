/* HKDSE Chemistry Ionization Lab — Main Application Controller */
document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Initialize bilingual system
  I18n.init();
  I18n.onChange(function () {
    // Redraw and update everything when language changes
    updateSingleSolution();
    updateCompareSetup();
  });

  // 2. Active elements reference dictionary
  var UI = {
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Single solution components
    chemSelectSingle: document.getElementById('chem-select-single'),
    concSliderSingle: document.getElementById('conc-slider-single'),
    concValSingle: document.getElementById('conc-val-single'),
    volSliderSingle: document.getElementById('vol-slider-single'),
    volValSingle: document.getElementById('vol-val-single'),
    quickBtnsSingle: document.querySelectorAll('.btn-quick'),
    liquidSingle: document.getElementById('liquid-single'),
    phDisplaySingle: document.getElementById('ph-display-single'),
    readPhSingle: document.getElementById('read-ph-single'),
    readAlphaSingle: document.getElementById('read-alpha-single'),
    readHConcSingle: document.getElementById('read-h-conc-single'),
    readIonsSingle: document.getElementById('read-ions-single'),
    chemExplanationSingle: document.getElementById('chem-explanation-single'),
    beakerGlassSvgGroup: document.getElementById('beaker-glass-svg-group'),
    
    // Compare components
    comparePresetSelect: document.getElementById('compare-preset-select'),
    comparePresetDesc: document.getElementById('compare-preset-desc'),
    beakerTitleA: document.getElementById('beaker-title-a'),
    beakerTitleB: document.getElementById('beaker-title-b'),
    liquidCompareA: document.getElementById('liquid-compare-a'),
    liquidCompareB: document.getElementById('liquid-compare-b'),
    bulbGlowCompareA: document.getElementById('bulb-glow-compare-a'),
    bulbGlowCompareB: document.getElementById('bulb-glow-compare-b'),
    bulbRaysCompareA: document.getElementById('bulb-rays-compare-a'),
    bulbRaysCompareB: document.getElementById('bulb-rays-compare-b'),
    phDisplayCompareA: document.getElementById('ph-display-compare-a'),
    phDisplayCompareB: document.getElementById('ph-display-compare-b'),
    sliderCompareA: document.getElementById('slider-compare-a'),
    sliderCompareB: document.getElementById('slider-compare-b'),
    labelCompareA: document.getElementById('label-compare-a'),
    labelCompareB: document.getElementById('label-compare-b'),
    valCompareA: document.getElementById('val-compare-a'),
    valCompareB: document.getElementById('val-compare-b'),
    btnResetCompare: document.getElementById('btn-reset-compare'),
    compareExplanation: document.getElementById('compare-explanation'),
    readChemA: document.getElementById('read-chem-a'),
    readMolarityA: document.getElementById('read-molarity-a'),
    readAlphaA: document.getElementById('read-alpha-a'),
    readIonsA: document.getElementById('read-ions-a'),
    readChemB: document.getElementById('read-chem-b'),
    readMolarityB: document.getElementById('read-molarity-b'),
    readAlphaB: document.getElementById('read-alpha-b'),
    readIonsB: document.getElementById('read-ions-b')
  };

  // 3. Initialize Particle Engines
  var engines = {
    single: new ParticleEngine(document.getElementById('canvas-single')),
    compareA: new ParticleEngine(document.getElementById('canvas-compare-a')),
    compareB: new ParticleEngine(document.getElementById('canvas-compare-b'))
  };

  // Set 3D Orbit View as default
  engines.single.is3D = true;

  // Set water background configurations and start engines that are active
  engines.single.start();
  
  // 4. Tab Navigation Controller
  UI.tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = btn.getAttribute('data-tab');
      
      // Stop all engines to save CPU
      engines.single.stop();
      engines.compareA.stop();
      engines.compareB.stop();

      // UI classes
      UI.tabBtns.forEach(function (b) { btn === b ? b.classList.add('active') : b.classList.remove('active'); });
      UI.tabContents.forEach(function (content) {
        if (content.id === 'tab-content-' + tabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      // Restart appropriate engines
      if (tabId === 'single') {
        engines.single.start();
        updateSingleSolution();
      } else if (tabId === 'compare') {
        engines.compareA.start();
        engines.compareB.start();
        updateCompareSetup();
      }
    });
  });


  // =========================================================================
  // ======================== SINGLE SOLUTION MODULE =========================
  // =========================================================================

  // Populate chemical selects dynamically
  function populateChemicalSelects() {
    UI.chemSelectSingle.innerHTML = '';
    
    // Group acids and bases
    var acidsGroup = document.createElement('optgroup');
    acidsGroup.label = I18n.getLang() === 'zh' ? '酸性溶液 (Acids)' : 'Acidic Solutions';
    
    var alkalisGroup = document.createElement('optgroup');
    alkalisGroup.label = I18n.getLang() === 'zh' ? '鹼性溶液 (Alkalis)' : 'Alkaline Solutions';

    Object.keys(Chemistry.chemicals).forEach(function (key) {
      var chem = Chemistry.chemicals[key];
      var option = document.createElement('option');
      option.value = chem.id;
      option.textContent = I18n.t(chem.nameKey);
      
      if (chem.type === 'acid') {
        acidsGroup.appendChild(option);
      } else {
        alkalisGroup.appendChild(option);
      }
    });

    UI.chemSelectSingle.appendChild(acidsGroup);
    UI.chemSelectSingle.appendChild(alkalisGroup);
  }

  // Indicator coloring engine
  function getIndicatorColor(indicatorName, pH) {
    if (indicatorName === 'none') {
      return 'rgba(56, 189, 248, 0.45)'; // vibrant translucent highlighted sky-blue
    }
    
    if (indicatorName === 'phenolphthalein') {
      if (pH < 8.3) return 'rgba(56, 189, 248, 0.35)'; // highlighted colorless state
      if (pH < 10.0) return 'rgba(244, 114, 182, 0.55)'; // light pink
      return 'rgba(219, 39, 119, 0.75)'; // deep pink/magenta
    }
    
    if (indicatorName === 'methylOrange') {
      if (pH < 3.1) return 'rgba(239, 68, 68, 0.7)'; // red
      if (pH < 4.4) return 'rgba(245, 158, 11, 0.7)'; // orange
      return 'rgba(250, 204, 21, 0.65)'; // yellow
    }
    
    if (indicatorName === 'litmus') {
      if (pH < 5.0) return 'rgba(239, 68, 68, 0.7)'; // red
      if (pH < 8.0) return 'rgba(168, 85, 247, 0.65)'; // purple
      return 'rgba(59, 130, 246, 0.7)'; // blue
    }
    
    if (indicatorName === 'universal') {
      if (pH < 3.0) return 'rgba(220, 38, 38, 0.75)'; // deep red
      if (pH < 5.0) return 'rgba(249, 115, 22, 0.7)'; // orange-red
      if (pH < 6.0) return 'rgba(234, 179, 8, 0.7)'; // orange-yellow
      if (pH < 7.6) return 'rgba(16, 185, 129, 0.7)'; // neutral green
      if (pH < 9.0) return 'rgba(14, 165, 233, 0.7)'; // blue-green
      if (pH < 11.0) return 'rgba(59, 130, 246, 0.7)'; // deep blue
      return 'rgba(109, 40, 217, 0.75)'; // deep purple
    }

    return 'rgba(224, 242, 254, 0.55)';
  }

  // Bulb Glow Opacity modeling (based on mobile ion concentration)
  function updateBulb(element, glowElement, raysElement, mobileIonConc) {
    var intensity = 0;
    if (mobileIonConc > 0) {
      // Scale logarithmic/square-root curve so weak acids are dimly lit but visible, and 1M HCl is blindingly bright
      intensity = Math.min(1.0, Math.sqrt(mobileIonConc / 1.5));
    }
    
    if (glowElement) {
      glowElement.style.opacity = intensity;
    }
    
    if (raysElement) {
      raysElement.style.opacity = intensity > 0.05 ? intensity : 0;
    }
    
    if (element) {
      if (intensity > 0.05) {
        element.style.boxShadow = `0 0 ${Math.round(intensity * 35)}px #facc15, inset -4px -4px 10px rgba(0,0,0,0.05)`;
      } else {
        element.style.boxShadow = 'inset -4px -4px 10px rgba(0,0,0,0.05)';
      }
    }
  }

  // Update Single solution view
  function updateSingleSolution() {
    var chemId = UI.chemSelectSingle.value;
    var conc = parseFloat(UI.concSliderSingle.value);
    var vol = parseFloat(UI.volSliderSingle.value);
    
    // Update numerical value labels
    UI.concValSingle.textContent = conc.toFixed(3) + ' M';
    UI.volValSingle.textContent = vol.toFixed(1) + ' cm³';
    
    // Execute chemistry math solver
    var props = Chemistry.calculateProperties(chemId, conc);
    if (!props) return;
    
    // Update live readings (null-safe)
    if (UI.readPhSingle) UI.readPhSingle.textContent = props.pH.toFixed(2);
    if (UI.phDisplaySingle) UI.phDisplaySingle.textContent = props.pH.toFixed(2);
    if (UI.readAlphaSingle) UI.readAlphaSingle.textContent = (props.alpha * 100).toFixed(2) + '%';
    
    var hLabel = props.type === 'acid' ? '[H⁺]' : '[OH⁻]';
    var ionsToShow = props.type === 'acid' ? props.h : props.oh;
    if (UI.readHConcSingle) UI.readHConcSingle.textContent = ionsToShow.toFixed(4) + ' M';
    if (UI.readIonsSingle) UI.readIonsSingle.textContent = props.mobileIonsConc.toFixed(4) + ' M';
    
    // Update visual beaker liquid level and color (SVG coordinates)
    var activeHeight = Math.round((vol / 100) * 149);
    var activeY = 259 - activeHeight;
    
    if (UI.liquidSingle) {
      UI.liquidSingle.setAttribute('y', activeY);
      UI.liquidSingle.setAttribute('height', activeHeight);
    }
    
    // Dye the liquid with default highlighted colorless state
    var liquidColor = getIndicatorColor('none', props.pH);
    if (UI.liquidSingle) {
      UI.liquidSingle.style.fill = liquidColor;
      // Hide flat SVG liquid when 3D is active
      UI.liquidSingle.style.display = 'none';
    }

    // Forward the liquid indicator color to the engine for 3D volumetric cylinder rendering
    engines.single.liquidColor = liquidColor;
    
    if (UI.beakerGlassSvgGroup) {
      // Hide static 2D glass; canvas draws the dark 3D beaker
      UI.beakerGlassSvgGroup.style.display = 'none';
    }
    
    
    // Update explanation box HTML text
    UI.chemExplanationSingle.innerHTML = props.explanation;
    
    // Update under-beaker captions
    var formulaElement = document.getElementById('setup-formula-single');
    if (formulaElement) {
      var chemObj = Chemistry.chemicals[chemId];
      formulaElement.textContent = (chemObj ? chemObj.formula : '') + '(aq)';
    }
    var titleElement = document.getElementById('setup-title-single');
    if (titleElement) {
      titleElement.textContent = I18n.getLang() === 'zh' ? '實驗裝置' : 'Experimental Set-up';
    }
    
    // Set custom liquid boundary for Single Solution Beaker (particles strictly stay below dynamic water level)
    engines.single.setLiquidBoundary(61, 259, activeY, 259);
    
    // Push properties to canvas engine
    engines.single.setState(props);
  }

  // Wire Single solution event listeners
  populateChemicalSelects();
  UI.chemSelectSingle.addEventListener('change', updateSingleSolution);
  UI.concSliderSingle.addEventListener('input', updateSingleSolution);
  UI.volSliderSingle.addEventListener('input', updateSingleSolution);
  
  UI.quickBtnsSingle.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-val');
      UI.concSliderSingle.value = val;
      updateSingleSolution();
    });
  });



  // =========================================================================
  // ======================= COMPARATIVE MODULE ==============================
  // =========================================================================

  var compareAState = { chemId: 'hcl', conc: 0.1 };
  var compareBState = { chemId: 'ch3cooh', conc: 0.1 };

  function updateCompareSetup() {
    var preset = UI.comparePresetSelect.value;
    var lang = I18n.getLang();
    
    // Set preset details
    var descText = I18n.t('desc.' + preset);
    if (UI.comparePresetDesc) {
      UI.comparePresetDesc.textContent = descText;
      UI.comparePresetDesc.style.display = descText ? 'block' : 'none';
    }
    
    if (preset === 'preset-conduct') {
      // 0.1M HCl vs 0.1M CH3COOH
      compareAState = { chemId: 'hcl', conc: 0.1 };
      compareBState = { chemId: 'ch3cooh', conc: 0.1 };
      
      UI.sliderCompareA.min = 0.001; UI.sliderCompareA.max = 2.0; UI.sliderCompareA.step = 0.001;
      UI.sliderCompareB.min = 0.001; UI.sliderCompareB.max = 2.0; UI.sliderCompareB.step = 0.001;
      
      UI.labelCompareA.textContent = lang === 'zh' ? '燒杯 A [HCl] 濃度：' : 'Beaker A [HCl] Molarity:';
      UI.labelCompareB.textContent = lang === 'zh' ? '燒杯 B [CH₃COOH] 濃度：' : 'Beaker B [CH₃COOH] Molarity:';
    } 
    else if (preset === 'preset-dibasic') {
      // 0.05M HA (strong) vs 0.005M H2B (weak)
      compareAState = { chemId: 'hcl', conc: 0.05 }; // HCl representing HA strong
      compareBState = { chemId: 'ch3cooh', conc: 0.005 }; // CH3COOH representing H2B weak (since CH3COOH is weak, basicity=1 or we can treat CH3COOH mathematically or write custom solver)
      // Wait, for Dibasic experiment 2:
      // "HA is a monobasic acid, 0.05 M of HA(aq) has pH 1.30 -> strong"
      // "H2B is a dibasic acid, 0.005 M of H2B(aq) has pH 4.10 -> weak"
      // To simulate HA strong vs H2B weak:
      // We will let Beaker A run HA (fully ionized HCl) and Beaker B run a special weak dibasic acid (we can simulate this in chemistry.js or map to a custom solver)
      // Actually, let's treat Beaker A as a strong acid (HCl 0.05M -> pH 1.30) and Beaker B as a custom weak dibasic acid with Kb / Ka.
      // Let's implement H2B weak as: C=0.005, Ka=1.5e-5, [H+]=0.000079 -> pH 4.10. That's exactly correct!
      compareAState = { chemId: 'hcl', conc: 0.05 };
      compareBState = { chemId: 'ch3cooh', conc: 0.005 }; // we can force Beaker B properties to match H2B weak
      
      UI.sliderCompareA.min = 0.001; UI.sliderCompareA.max = 0.5; UI.sliderCompareA.step = 0.001;
      UI.sliderCompareB.min = 0.001; UI.sliderCompareB.max = 0.5; UI.sliderCompareB.step = 0.001;
      
      UI.labelCompareA.textContent = lang === 'zh' ? '燒杯 A [HA 強] 濃度：' : 'Beaker A [HA Strong] Molarity:';
      UI.labelCompareB.textContent = lang === 'zh' ? '燒杯 B [H₂B 弱] 濃度：' : 'Beaker B [H₂B Weak] Molarity:';
    } 
    else if (preset === 'preset-alkali') {
      // 0.1M NaOH vs 0.1M NH3
      compareAState = { chemId: 'naoh', conc: 0.1 };
      compareBState = { chemId: 'nh3', conc: 0.1 };
      
      UI.sliderCompareA.min = 0.001; UI.sliderCompareA.max = 2.0; UI.sliderCompareA.step = 0.001;
      UI.sliderCompareB.min = 0.001; UI.sliderCompareB.max = 2.0; UI.sliderCompareB.step = 0.001;
      
      UI.labelCompareA.textContent = lang === 'zh' ? '燒杯 A [NaOH] 濃度：' : 'Beaker A [NaOH] Molarity:';
      UI.labelCompareB.textContent = lang === 'zh' ? '燒杯 B [NH₃] 濃度：' : 'Beaker B [NH₃] Molarity:';
    } 
    else if (preset === 'preset-same-ph') {
      // HCl (0.001M) vs CH3COOH (0.056M) both at pH 3.0
      compareAState = { chemId: 'hcl', conc: 0.001 };
      compareBState = { chemId: 'ch3cooh', conc: 0.056 };
      
      UI.sliderCompareA.min = 0.0001; UI.sliderCompareA.max = 0.01; UI.sliderCompareA.step = 0.0001;
      UI.sliderCompareB.min = 0.001; UI.sliderCompareB.max = 0.2; UI.sliderCompareB.step = 0.001;
      
      UI.labelCompareA.textContent = lang === 'zh' ? '燒杯 A [HCl] 濃度：' : 'Beaker A [HCl] Molarity:';
      UI.labelCompareB.textContent = lang === 'zh' ? '燒杯 B [CH₃COOH] 濃度：' : 'Beaker B [CH₃COOH] Molarity:';
    }

    UI.sliderCompareA.value = compareAState.conc;
    UI.sliderCompareB.value = compareBState.conc;
    
    updateCompareBeakers();
  }

  function updateCompareBeakers() {
    compareAState.conc = parseFloat(UI.sliderCompareA.value);
    compareBState.conc = parseFloat(UI.sliderCompareB.value);
    
    UI.valCompareA.textContent = compareAState.conc.toFixed(compareAState.conc < 0.01 ? 4 : 3) + ' M';
    UI.valCompareB.textContent = compareBState.conc.toFixed(compareBState.conc < 0.01 ? 4 : 3) + ' M';
    
    var propsA = Chemistry.calculateProperties(compareAState.chemId, compareAState.conc);
    var propsB = Chemistry.calculateProperties(compareBState.chemId, compareBState.conc);
    
    // Specially adjust Beaker B in Experiment 2 (H2B dibasic weak case)
    var preset = UI.comparePresetSelect.value;
    if (preset === 'preset-dibasic') {
      // Force Beaker B to be a weak dibasic acid of pH 4.10 at 0.005M
      // We use a proper weak acid equilibrium calculation where Ka = 1.2825e-6
      // solved from [H+] = 10^-4.10 at C = 0.005M.
      var Ka_h2b = 1.2825e-6;
      var h_h2b = 1e-7;
      if (compareBState.conc > 0) {
        h_h2b = (-Ka_h2b + Math.sqrt(Ka_h2b * Ka_h2b + 4 * Ka_h2b * compareBState.conc)) / 2;
      }
      var pH_h2b = -log10(h_h2b);
      // Clamp to standard scale bounds
      if (pH_h2b < 0.0) pH_h2b = 0.0;
      if (pH_h2b > 14.0) pH_h2b = 14.0;
      
      var alpha_h2b = compareBState.conc > 0 ? h_h2b / (compareBState.conc * 2) : 0;
      if (alpha_h2b > 1) alpha_h2b = 1;
      
      propsB = {
        id: 'h2b_weak',
        name: 'H₂B',
        type: 'acid',
        strength: 'weak',
        basicity: 2,
        molarity: compareBState.conc,
        dissolvedMolarity: compareBState.conc,
        pH: pH_h2b,
        alpha: alpha_h2b,
        h: h_h2b,
        oh: 1e-14 / h_h2b,
        mobileIonsConc: h_h2b + h_h2b / 2, // H+ + B2-
        explanation: 'Custom Weak Dibasic Acid'
      };
      
      UI.beakerTitleA.textContent = I18n.getLang() === 'zh' ? '強單質子酸 HA' : 'Strong Monobasic HA';
      UI.beakerTitleB.textContent = I18n.getLang() === 'zh' ? '弱雙質子酸 H₂B' : 'Weak Dibasic H₂B';
    } else {
      UI.beakerTitleA.textContent = I18n.getLang() === 'zh' ? '燒杯 A (Beaker A)' : 'Beaker A';
      UI.beakerTitleB.textContent = I18n.getLang() === 'zh' ? '燒杯 B (Beaker B)' : 'Beaker B';
    }
    
    // Update readings card A
    if (UI.readChemA) UI.readChemA.textContent = propsA.name;
    if (UI.readMolarityA) UI.readMolarityA.textContent = propsA.molarity.toFixed(propsA.molarity < 0.01 ? 4 : 3) + ' M';
    if (UI.readAlphaA) UI.readAlphaA.textContent = (propsA.alpha * 100).toFixed(2) + '%';
    if (UI.readIonsA) UI.readIonsA.textContent = propsA.mobileIonsConc.toFixed(4) + ' M';
    if (UI.phDisplayCompareA) UI.phDisplayCompareA.textContent = propsA.pH.toFixed(2);
    
    // Dye beaker A liquid with Universal Indicator
    if (UI.liquidCompareA) {
      UI.liquidCompareA.style.fill = getIndicatorColor('universal', propsA.pH);
    }
    updateBulb(null, UI.bulbGlowCompareA, UI.bulbRaysCompareA, propsA.mobileIonsConc);
    
    // Set custom liquid boundary for Beaker A
    engines.compareA.setLiquidBoundary(43, 177, 92, 172);
    engines.compareA.setState(propsA);
    
    // Update readings card B
    if (UI.readChemB) UI.readChemB.textContent = propsB.name;
    if (UI.readMolarityB) UI.readMolarityB.textContent = propsB.molarity.toFixed(propsB.molarity < 0.01 ? 4 : 3) + ' M';
    if (UI.readAlphaB) UI.readAlphaB.textContent = (propsB.alpha * 100).toFixed(2) + '%';
    if (UI.readIonsB) UI.readIonsB.textContent = propsB.mobileIonsConc.toFixed(4) + ' M';
    if (UI.phDisplayCompareB) UI.phDisplayCompareB.textContent = propsB.pH.toFixed(2);
    
    // Dye beaker B liquid with Universal Indicator
    if (UI.liquidCompareB) {
      UI.liquidCompareB.style.fill = getIndicatorColor('universal', propsB.pH);
    }
    updateBulb(null, UI.bulbGlowCompareB, UI.bulbRaysCompareB, propsB.mobileIonsConc);
    
    // Set custom liquid boundary for Beaker B
    engines.compareB.setLiquidBoundary(43, 177, 92, 172);
    engines.compareB.setState(propsB);

    // Update captions and formulas dynamically under comparison beakers
    var titleA_el = document.getElementById('setup-title-compare-a');
    var formulaA_el = document.getElementById('setup-formula-compare-a');
    var titleB_el = document.getElementById('setup-title-compare-b');
    var formulaB_el = document.getElementById('setup-formula-compare-b');

    var lang = I18n.getLang();
    if (titleA_el) {
      titleA_el.textContent = lang === 'zh' ? '裝置 I' : 'Set-up I';
    }
    if (titleB_el) {
      titleB_el.textContent = lang === 'zh' ? '裝置 II' : 'Set-up II';
    }
    if (formulaA_el) {
      formulaA_el.textContent = (compareAState.chemId === 'hcl' ? (preset === 'preset-dibasic' ? 'HA' : 'HCl') : compareAState.chemId.toUpperCase()) + '(aq)';
    }
    if (formulaB_el) {
      var bFormula = 'CH₃COOH';
      if (preset === 'preset-dibasic') bFormula = 'H₂B';
      else if (compareBState.chemId === 'nh3') bFormula = 'NH₃';
      else if (compareBState.chemId === 'naoh') bFormula = 'NaOH';
      formulaB_el.textContent = bFormula + '(aq)';
    }
    
    // Setup dynamic comparative explanations based on current adjusted sliders!
    var lang = I18n.getLang();
    var expText = '';
    
    if (preset === 'preset-conduct') {
      if (lang === 'zh') {
        expText = `<strong>結果解析：</strong><br>燒杯 A (HCl) 完全電離，其 pH (${propsA.pH.toFixed(2)}) 遠低於燒杯 B 的 pH (${propsB.pH.toFixed(2)})。同時，HCl 釋出的流動離子總濃度為 <strong>${propsA.mobileIonsConc.toFixed(3)}M</strong>，而醋酸僅有 <strong>${propsB.mobileIonsConc.toFixed(4)}M</strong>，使得燒杯 A 的導電燈泡比燒杯 B 亮得多！這直接對比了強酸和弱酸的粒子分布差異。`;
      } else {
        expText = `<strong>Analysis:</strong><br>Beaker A (HCl) is fully ionized, so its pH (${propsA.pH.toFixed(2)}) is much lower than Beaker B\'s pH (${propsB.pH.toFixed(2)}). Also, HCl releases a total mobile ion concentration of <strong>${propsA.mobileIonsConc.toFixed(3)}M</strong> vs. only <strong>${propsB.mobileIonsConc.toFixed(4)}M</strong> for ethanoic acid, making bulb A glow much brighter than bulb B!`;
      }
    } 
    else if (preset === 'preset-dibasic') {
      if (lang === 'zh') {
        expText = `<strong>結果解析：</strong><br>HA 是強單質子酸，完全電離，pH 為 ${propsA.pH.toFixed(2)}。若 H₂B 也是強酸（即完全電離），其 2 倍氫離子 [H⁺] 應為 ${ (propsB.molarity * 2).toFixed(3) }M，理論 pH 應為 ${ (-log10(propsB.molarity * 2)).toFixed(2) }。但實際測得 pH 卻高達 <strong>${propsB.pH.toFixed(2)}</strong>，[H⁺] 僅為 ${propsB.h.toFixed(5)}M。由於實際 pH 高於理論值，我們便能自信地判定 H₂B 並未完全電離，因而是<strong>弱酸</strong>。這是 DSE 的经典實驗思考題！`;
      } else {
        expText = `<strong>Analysis:</strong><br>HA is strong and fully ionizes to give pH ${propsA.pH.toFixed(2)}. If H₂B were a strong dibasic acid (100% ionized), its [H⁺] would be ${ (propsB.molarity * 2).toFixed(3) }M, matching a theoretical pH of ${ (-log10(propsB.molarity * 2)).toFixed(2) }. However, the measured pH is much higher at <strong>${propsB.pH.toFixed(2)}</strong> ([H⁺] = ${propsB.h.toFixed(5)}M). Since the measured pH exceeds the theoretical completely-ionized value, H₂B is proven to be a <strong>weak acid</strong>!`;
      }
    } 
    else if (preset === 'preset-alkali') {
      if (lang === 'zh') {
        expText = `<strong>結果解析：</strong><br>強鹼 NaOH 在水中完全離解，pH 達到 ${propsA.pH.toFixed(2)}，燈泡十分明亮。弱鹼 NH₃ 僅輕微電離，pH 只有 ${propsB.pH.toFixed(2)}，導電燈泡較暗。強鹼的氫氧根離子濃度和導電性均顯著高於同濃度的弱鹼。`;
      } else {
        expText = `<strong>Analysis:</strong><br>The strong base NaOH fully dissociates, giving pH ${propsA.pH.toFixed(2)} and a bright bulb. The weak base NH₃ ionizes only slightly, giving pH ${propsB.pH.toFixed(2)} and a dim bulb. The strong base has a much higher hydroxide concentration and conductivity.`;
      }
    } 
    else if (preset === 'preset-same-ph') {
      if (lang === 'zh') {
        expText = `<strong>結果解析：</strong><br>當前兩杯的 pH 值分別為 <strong>${propsA.pH.toFixed(2)}</strong> 和 <strong>${propsB.pH.toFixed(2)}</strong>。你可以看到，為了產生大約相同的 H⁺ 離子濃度，弱酸 CH₃COOH 必須以 <strong>${propsB.molarity.toFixed(3)}M</strong> 的高濃度存在，而強酸 HCl 僅需 <strong>${propsA.molarity.toFixed(4)}M</strong>！這證明了相同 pH 下，弱酸的濃度遠遠大於強酸！`;
      } else {
        expText = `<strong>Analysis:</strong><br>The current pH values are <strong>${propsA.pH.toFixed(2)}</strong> and <strong>${propsB.pH.toFixed(2)}</strong>. Notice that to yield approximately the same [H⁺] (and pH), the weak acid CH₃COOH must be present at a much higher concentration of <strong>${propsB.molarity.toFixed(3)}M</strong>, while the strong acid HCl only needs <strong>${propsA.molarity.toFixed(4)}M</strong>!`;
      }
    }

    if (UI.compareExplanation) {
      UI.compareExplanation.innerHTML = expText;
    }
  }

  // Helper: log10
  function log10(x) {
    return Math.log(x) / Math.LN10;
  }

  UI.comparePresetSelect.addEventListener('change', updateCompareSetup);
  UI.sliderCompareA.addEventListener('input', updateCompareBeakers);
  UI.sliderCompareB.addEventListener('input', updateCompareBeakers);
  UI.btnResetCompare.addEventListener('click', updateCompareSetup);



  // =========================================================================
  // ======================== APP INITIALIZATION =============================
  // =========================================================================
  
  function initApp() {
    updateSingleSolution();
    updateCompareSetup();

    // Drag Tip Dismissal Logic
    var dragTip = document.getElementById('drag-tip');
    var closeDragTipBtn = document.getElementById('close-drag-tip');
    if (dragTip && closeDragTipBtn) {
      if (localStorage.getItem('hkdse-drag-tip-dismissed') === 'true') {
        dragTip.classList.add('hidden');
      } else {
        closeDragTipBtn.addEventListener('click', function () {
          dragTip.classList.add('hidden');
          try {
            localStorage.setItem('hkdse-drag-tip-dismissed', 'true');
          } catch (e) { /* ignore */ }
        });
      }
    }
  }

  initApp();
});
