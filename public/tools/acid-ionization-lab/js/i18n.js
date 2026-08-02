/* HKDSE Ionization Lab — Internationalisation */
var I18n = (function () {
  var STORAGE_KEY = 'hkdse-ionization-lang';
  var currentLang = 'zh';
  var isEmbed = false;
  var listeners = [];

  var strings = {
    zh: {
      'page.title': 'HKDSE 酸與鹼的電離模擬器 | HKDSE Acid Ionization Simulator',
      'header.title': 'HKDSE 酸與鹼的電離模擬器',
      'header.subtitle': '酸鹼電離度、濃度、強度與導電性互動探究實驗室',
      'tab.single': '單一溶液探究',
      'tab.compare': '強弱對比實驗',
      'panel.visual': '微觀電離粒子模擬',
      'panel.controls': '實驗控制',
      'tip.drag': '拖動以旋轉 3D 視角',
      'bulb.status': '導電性 (燈泡亮度)',
      'select.chemical': '選擇溶液',
      'label.molarity': '溶液濃度 (Molarity)',
      'label.volume': '溶液體積 (Volume)',
      'indicator.label': '加入酸鹼指示劑',
      'indicator.none': '無指示劑',
      'indicator.methylOrange': '甲基橙 (Methyl Orange)',
      'indicator.phenolphthalein': '酚酞 (Phenolphthalein)',
      'indicator.litmus': '石蕊溶液 (Litmus)',
      'indicator.universal': '萬用指示劑 (Universal Indicator)',
      'data.title': '即時數據',
      'data.ph': 'pH 值',
      'data.ionization': '電離度 (Ionization Degree α)',
      'data.h-conc': '[H⁺] 或 [OH⁻] 離子濃度',
      'data.ions': '流動離子總濃度 (Total Mobile Ions)',
      'compare.selectPreset': '選擇對比實驗：',
      'btn.resetCompare': '還原預設實驗參數',
      'footer': 'HKDSE 化學 課題四 酸與鹼 — 適用於 Google Chrome · 薈進教育中心',
      'circuit.graphite': '石墨棒',
      'setup.single': '實驗裝置',
      'setup.one': '裝置 I',
      'setup.two': '裝置 II',
      
      // Chemicals Names
      'chem.hcl': 'HCl — 氫氯酸 (強酸)',
      'chem.hno3': 'HNO₃ — 硝酸 (強酸)',
      'chem.h2so4': 'H₂SO₄ — 硫酸 (強雙質子酸)',
      'chem.ch3cooh': 'CH₃COOH — 乙酸 (弱酸)',
      'chem.hno2': 'HNO₂ — 亞硝酸 (較強弱酸)',
      'chem.naoh': 'NaOH — 氫氧化鈉 (強鹼)',
      'chem.koh': 'KOH — 氫氧化鉀 (強鹼)',
      'chem.caoh2': 'Ca(OH)₂ — 氫氧化鈣 (強鹼/微溶)',
      'chem.nh3': 'NH₃ — 氨水 (弱鹼)',
      
      // Preset explanations in Chinese
      'preset.conduct': '導電性對比 (Conduction)',
      'preset.dibasic': '電離完整度判斷 (Dibasic)',
      'preset.alkali': '強弱鹼 pH 對比 (Alkali)',
      'preset.samePh': '相同 pH 對比 (Same pH)',
      'desc.preset-conduct': '',
      'desc.preset-dibasic': '',
      'desc.preset-alkali': '',
      'desc.preset-same-ph': ''
    },
    en: {
      'page.title': 'HKDSE Chemistry Acid Ionization Simulator',
      'header.title': 'HKDSE Acid Ionization Simulator',
      'header.subtitle': 'Explore Acid-Base Strength, Molarity, Basicity, and Conductivity',
      'tab.single': 'Single Solution Investigation',
      'tab.compare': 'Side-by-Side Comparison',
      'panel.visual': 'Microscopic Particle Simulation',
      'panel.controls': 'Experiment Controls',
      'tip.drag': 'Drag to rotate 3D view',
      'bulb.status': 'Conductivity (Bulb Brightness)',
      'select.chemical': 'Select Solution',
      'label.molarity': 'Solution Molarity (Concentration)',
      'label.volume': 'Solution Volume',
      'indicator.label': 'Add Indicator Dye',
      'indicator.none': 'No Indicator',
      'indicator.methylOrange': 'Methyl Orange',
      'indicator.phenolphthalein': 'Phenolphthalein',
      'indicator.litmus': 'Litmus Solution',
      'indicator.universal': 'Universal Indicator',
      'data.title': 'Live Readings',
      'data.ph': 'pH value',
      'data.ionization': 'Ionization Degree (α)',
      'data.h-conc': '[H⁺] or [OH⁻] Ion Concentration',
      'data.ions': 'Total Mobile Ion Concentration',
      'compare.selectPreset': 'Select Comparative Experiment:',
      'btn.resetCompare': 'Restore Default Parameters',
      'footer': 'HKDSE Chemistry Topic 4 — Acids and Bases · Works in Google Chrome · Unit Education',
      'circuit.graphite': 'Graphite rod',
      'setup.single': 'Experimental Set-up',
      'setup.one': 'Set-up I',
      'setup.two': 'Set-up II',
      
      // Chemicals Names
      'chem.hcl': 'HCl — Hydrochloric Acid (Strong)',
      'chem.hno3': 'HNO₃ — Nitric Acid (Strong)',
      'chem.h2so4': 'H₂SO₄ — Sulphuric Acid (Strong Dibasic)',
      'chem.ch3cooh': 'CH₃COOH — Ethanoic Acid (Weak)',
      'chem.hno2': 'HNO₂ — Nitrous Acid (Weak)',
      'chem.naoh': 'NaOH — Sodium Hydroxide (Strong Base)',
      'chem.koh': 'KOH — Potassium Hydroxide (Strong Base)',
      'chem.caoh2': 'Ca(OH)₂ — Calcium Hydroxide (Strong, slightly soluble)',
      'chem.nh3': 'NH₃ — Ammonia Solution (Weak Base)',
      
      // Preset explanations in English
      'preset.conduct': 'Conduction',
      'preset.dibasic': 'Dibasic',
      'preset.alkali': 'Alkali',
      'preset.samePh': 'Same pH',
      'desc.preset-conduct': '',
      'desc.preset-dibasic': '',
      'desc.preset-alkali': '',
      'desc.preset-same-ph': ''
    }
  };

  function readUrlParams() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (e) {
      return null;
    }
  }

  function applyEmbedClass() {
    if (!isEmbed) return;
    if (document.body) document.body.classList.add('embed-mode');
    else document.documentElement.classList.add('embed-mode');
  }

  function loadLang() {
    var params = readUrlParams();
    if (params && params.get('embed') === '1') {
      isEmbed = true;
      applyEmbedClass();
    }

    var urlLang = params && params.get('lang');
    if (urlLang === 'en' || urlLang === 'zh') {
      currentLang = urlLang;
      return;
    }

    if (!isEmbed) {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'zh' || saved === 'en') currentLang = saved;
      } catch (e) { /* ignore */ }
    }
  }

  function getLang() {
    return currentLang;
  }

  function t(key) {
    var pack = strings[currentLang] || strings.zh;
    return pack[key] !== undefined ? pack[key] : (strings.en[key] || key);
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    if (!isEmbed) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) { /* ignore */ }
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
    applyEmbedClass();
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });
    document.title = t('page.title');
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function initHostLangBridge() {
    applyEmbedClass();
    window.addEventListener('message', function (event) {
      var data = event.data;
      if (data && data.type === 'uniplus:setLang' && (data.lang === 'en' || data.lang === 'zh')) {
        setLang(data.lang);
      }
    });
  }

  function init() {
    loadLang();
    applyEmbedClass();
    document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
    apply();
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  loadLang();
  initHostLangBridge();

  return {
    getLang: getLang,
    setLang: setLang,
    t: t,
    apply: apply,
    onChange: onChange,
    init: init
  };
})();
