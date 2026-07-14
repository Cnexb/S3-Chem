/* HKDSE Titration Lab — Internationalisation */
var I18n = (function () {
  var STORAGE_KEY = 'hkdse-titration-lang';
  var currentLang = 'zh';
  var listeners = [];

  var strings = {
    zh: {
      'page.title': 'HKDSE 化學滴定模擬器',
      'header.title': 'HKDSE 化學滴定模擬器',
      'header.subtitle': '酸鹼滴定實驗互動工具',
      'panel.setup': '實驗裝置',
      'panel.controls': '控制面板',
      'controls.hide': '隱藏設定',
      'controls.show': '顯示設定',
      'banner.nearEq': '接近當量點 — 留意指示劑顏色變化',
      'label.supportStand': '滴定管架',
      'label.buretteHolder': '蝴蝶夾',
      'label.burette': '滴定管',
      'label.flask': '錐形瓶',
      'label.whiteTile': '白瓷磚',
      'slider.drag': '拖曳加液',
      'reading.title': '滴定管讀數',
      'reading.added': '已加體積',
      'reading.final': '最終讀數',
      'preset.label': '預設實驗',
      'preset.custom': '— 自訂 —',
      'flask.chem': '錐形瓶試液',
      'flask.conc': '錐形瓶濃度',
      'flask.vol': '溶液體積 (cm³)',
      'burette.chem': '滴定管試液',
      'burette.conc': '滴定管濃度',
      'indicator.label': '指示劑',
      'indicator.methylOrange': '甲基橙',
      'indicator.phenolphthalein': '酚酞',
      'btn.step': '+0.05 cm³ 單步加液',
      'btn.resetVol': '重置體積',
      'btn.resetAll': '重置實驗',
      'data.title': '即時數據',
      'data.ph': 'pH（估算）',
      'data.veq': '當量點體積 V',
      'data.eqPh': '當量點 pH',
      'data.indColor': '指示劑顏色',
      'badge.eqReached': '已達當量點',
      'guide.title': '指示劑選擇指南',
      'guide.note1': '指示劑並不顯示溶液的 pH 值，只顯示酸鹼範圍的顏色變化。量度 pH 應使用萬用指示劑或 pH 計（更準確）。',
      'guide.table.titration': '滴定',
      'guide.table.indicator': '適用指示劑',
      'guide.row.sa_sb': '強酸 + 強鹼',
      'guide.row.sa_sb.ind': '甲基橙 / 酚酞',
      'guide.row.sa_wb': '強酸 + 弱鹼',
      'guide.row.sa_wb.ind': '僅甲基橙',
      'guide.row.wa_sb': '弱酸 + 強鹼',
      'guide.row.wa_sb.ind': '僅酚酞',
      'guide.row.wa_wb': '弱酸 + 弱鹼',
      'guide.row.wa_wb.ind': '無適合指示劑',
      'guide.mo': '甲基橙：pH < 3.1 紅 · 3.1–4.4 橙 · > 4.4 黃',
      'guide.ph': '酚酞：pH < 8.3 無色 · 8.3–10 淡粉紅 · > 10 粉紅',
      'footer': 'HKDSE 化學 課題四 酸與鹼 · 適用於 Google Chrome',
      'tap.aria': '滴定管活塞 — 點擊或按住加液',
      'slider.aria': '滴定管體積',
      'hint.stopcock': '點擊或按住活塞，溶液會從滴定管流出',
      'hint.stopcockSub': '亦可拖曳右側滑桿控制加液體積',
      'hint.dismiss': '知道了',
      'target.label': '滴定目標',
      'target.equivalence': '當量點',
      'target.endpoint': '終點',
      'target.eqNote': '當量點：酸與鹼剛好完全反應的理論點。',
      'target.epNote': '終點：指示劑顏色開始明顯變化的體積點。',
      'banner.nearEnd': '接近終點 — 留意指示劑顏色變化',
      'badge.endReached': '已達終點',
      'data.targetVol.eq': '當量點體積 V',
      'data.targetVol.ep': '終點體積 V',
      'warn.noEndPoint': '此組合下指示劑於滴定過程中無明顯變色，無法確定終點體積。',
      'error.selectChem': '請選擇試液。',
      'error.acidBasePair': '錐形瓶與滴定管必須為酸鹼對（一酸一鹼）。',
      'suit.sa_sb': '強酸 + 強鹼：甲基橙及酚酞均可。',
      'suit.sa_wb.mo': '強酸 + 弱鹼：適合使用甲基橙。',
      'suit.sa_wb.ph': '強酸 + 弱鹼：酚酞不適合（當量點 pH < 7）。',
      'suit.wa_sb.ph': '弱酸 + 強鹼：適合使用酚酞。',
      'suit.wa_sb.mo': '弱酸 + 強鹼：甲基橙不適合（當量點 pH > 7）。',
      'suit.wa_wb': '弱酸 + 弱鹼：沒有適合的指示劑。',
      'endpoint.mo.acid': '終點顏色變化：紅 → 橙',
      'endpoint.mo.base': '終點顏色變化：黃 → 橙',
      'endpoint.ph.base': '終點顏色變化：粉紅 → 極淡粉紅',
      'endpoint.ph.acid': '終點顏色變化：無色 → 淡粉紅',
      'color.red': '紅色',
      'color.orange': '橙色',
      'color.yellow': '黃色',
      'color.colorless': '無色',
      'color.palePink': '淡粉紅',
      'color.pink': '粉紅',
      'curve.title': '滴定曲線 (Titration Curve)',
      'preset.sa_sb': '強酸滴定強鹼',
      'preset.sa_wb': '強酸滴定弱鹼',
      'preset.wa_sb': '弱酸滴定強鹼',
      'preset.na2co3_hcl': '標準溶液滴定 HCl',
      'preset.compare_alkali': '比較強鹼',
      'note.sa_sb': '酚酞於鹼性溶液呈粉紅，達當量點時變為無色。',
      'note.sa_wb': 'NH₃ 為弱鹼，當量點 pH < 7，只能使用甲基橙。',
      'note.wa_sb': 'CH₃COOH 為弱酸，當量點 pH > 7，應使用酚酞。',
      'note.na2co3_hcl': 'Na₂CO₃ 為弱鹼性鹽，與 HCl 反應需 2 mol HCl；甲基橙由黃變橙。',
      'note.compare_alkali': '比較 NaOH 與 KOH 的滴定曲線。可切換錐形瓶試液為 NaOH 或 KOH。'
    },
    en: {
      'page.title': 'HKDSE Chemistry Titration Simulator',
      'header.title': 'HKDSE Chemistry Titration Simulator',
      'header.subtitle': 'Interactive Acid-Base Titration Laboratory',
      'panel.setup': 'Titration Set-up',
      'panel.controls': 'Controls',
      'controls.hide': 'Hide settings',
      'controls.show': 'Show settings',
      'banner.nearEq': 'Near equivalence point — watch for indicator colour change',
      'label.supportStand': 'Support Stand',
      'label.buretteHolder': 'Burette Holder',
      'label.burette': 'Burette',
      'label.flask': 'Conical Flask',
      'label.whiteTile': 'White tile',
      'slider.drag': 'Drag to add',
      'reading.title': 'Burette reading',
      'reading.added': 'Added',
      'reading.final': 'Final',
      'preset.label': 'Preset experiment',
      'preset.custom': '— Custom —',
      'flask.chem': 'Solution in conical flask',
      'flask.conc': 'Conical flask concentration',
      'flask.vol': 'Solution volume (cm³)',
      'burette.chem': 'Solution in burette',
      'burette.conc': 'Burette concentration',
      'indicator.label': 'Indicator',
      'indicator.methylOrange': 'Methyl orange',
      'indicator.phenolphthalein': 'Phenolphthalein',
      'btn.step': '+0.05 cm³ Step add',
      'btn.resetVol': 'Reset volume',
      'btn.resetAll': 'Reset experiment',
      'data.title': 'Live readings',
      'data.ph': 'pH (estimated)',
      'data.veq': 'Equivalence volume V',
      'data.eqPh': 'Equivalence pH',
      'data.indColor': 'Indicator colour',
      'badge.eqReached': 'Equivalence reached',
      'guide.title': 'Indicator Selection Guide',
      'guide.note1': 'Indicators show colour ranges, not exact pH. Use universal indicator or a pH meter for accurate measurement.',
      'guide.table.titration': 'Titration',
      'guide.table.indicator': 'Suitable indicator',
      'guide.row.sa_sb': 'Strong acid + Strong base',
      'guide.row.sa_sb.ind': 'Methyl orange / Phenolphthalein',
      'guide.row.sa_wb': 'Strong acid + Weak base',
      'guide.row.sa_wb.ind': 'Methyl orange only',
      'guide.row.wa_sb': 'Weak acid + Strong base',
      'guide.row.wa_sb.ind': 'Phenolphthalein only',
      'guide.row.wa_wb': 'Weak acid + Weak base',
      'guide.row.wa_wb.ind': 'None suitable',
      'guide.mo': 'Methyl orange: pH < 3.1 red · 3.1–4.4 orange · > 4.4 yellow',
      'guide.ph': 'Phenolphthalein: pH < 8.3 colourless · 8.3–10 pale pink · > 10 pink',
      'footer': 'HKDSE Chemistry Topic 4 — Acids and Bases · Works in Google Chrome',
      'tap.aria': 'Burette tap — click or hold to add solution',
      'slider.aria': 'Burette volume',
      'hint.stopcock': 'Click or hold the stopcock to release solution from the burette',
      'hint.stopcockSub': 'You can also drag the slider on the right to control volume',
      'hint.dismiss': 'Got it',
      'target.label': 'Titration target',
      'target.equivalence': 'Equivalence point',
      'target.endpoint': 'End point',
      'target.eqNote': 'Equivalence point: theoretical point of complete acid-base reaction.',
      'target.epNote': 'End point: volume where the indicator colour changes noticeably.',
      'banner.nearEnd': 'Near end point — watch for indicator colour change',
      'badge.endReached': 'End point reached',
      'data.targetVol.eq': 'Equivalence volume V',
      'data.targetVol.ep': 'End point volume V',
      'warn.noEndPoint': 'No clear colour change for this indicator during titration; end point volume unavailable.',
      'error.selectChem': 'Please select chemicals.',
      'error.acidBasePair': 'Conical flask and burette must be an acid-base pair.',
      'suit.sa_sb': 'Strong acid + strong base: both indicators are suitable.',
      'suit.sa_wb.mo': 'Strong acid + weak base: methyl orange is suitable.',
      'suit.sa_wb.ph': 'Strong acid + weak base: phenolphthalein is NOT suitable (end point pH < 8.3).',
      'suit.wa_sb.ph': 'Weak acid + strong base: phenolphthalein is suitable.',
      'suit.wa_sb.mo': 'Weak acid + strong base: methyl orange is NOT suitable (end point pH > 4.4).',
      'suit.wa_wb': 'Weak acid + weak base: no suitable indicator.',
      'endpoint.mo.acid': 'End point colour change: red → orange',
      'endpoint.mo.base': 'End point colour change: yellow → orange',
      'endpoint.ph.base': 'End point colour change: pink → very pale pink',
      'endpoint.ph.acid': 'End point colour change: colourless → pale pink',
      'color.red': 'Red',
      'color.orange': 'Orange',
      'color.yellow': 'Yellow',
      'color.colorless': 'Colourless',
      'color.palePink': 'Pale pink',
      'color.pink': 'Pink',
      'curve.title': 'Titration Curve',
      'preset.sa_sb': 'Strong acid vs strong base',
      'preset.sa_wb': 'Strong acid vs weak base',
      'preset.wa_sb': 'Weak acid vs strong base',
      'preset.na2co3_hcl': 'Standard Na₂CO₃ vs HCl',
      'preset.compare_alkali': 'Compare strong alkalis',
      'note.sa_sb': 'Phenolphthalein turns pink in alkali and colourless at the end point.',
      'note.sa_wb': 'NH₃ is a weak base; end point pH < 7 — only methyl orange is suitable.',
      'note.wa_sb': 'CH₃COOH is a weak acid; end point pH > 7 — use phenolphthalein.',
      'note.na2co3_hcl': 'Na₂CO₃ is a weakly basic salt; 2 mol HCl per mole. Methyl orange: yellow → orange.',
      'note.compare_alkali': 'Compare titration of NaOH and KOH. Switch flask solution as needed.'
    }
  };

  function loadLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) { /* ignore */ }
    return 'zh';
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
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* ignore */ }
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
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
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });
    document.title = t('page.title');
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function init() {
    currentLang = loadLang();
    document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
    apply();
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  return {
    getLang: getLang,
    setLang: setLang,
    t: t,
    apply: apply,
    onChange: onChange,
    init: init
  };
})();
