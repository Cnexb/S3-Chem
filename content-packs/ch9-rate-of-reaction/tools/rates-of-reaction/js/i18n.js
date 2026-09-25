/* HKDSE Rates of Reaction Lab — Internationalisation */
var I18n = (function () {
  var STORAGE_KEY = 'hkdse-rates-of-reaction-lang';
  var currentLang = 'zh';
  var listeners = [];
  var isEmbed = false;

  var strings = {
    zh: {
      'page.title': 'HKDSE 化學反應速率模擬器 | Rates of Reaction Simulator',
      'header.title': 'HKDSE 硫代硫酸鈉與酸的反應速率實驗室',
      'header.subtitle': '探究濃度、溫度及稀釋對反應速率的影響 (消失的十字實驗)',
      'panel.visual': '微觀粒子與宏觀現象模擬',
      'btn.hideSettings': '隱藏實驗控制',
      'btn.showSettings': '顯示實驗控制',
      'label.speed': '模擬速度 (Speed):',
      'btn.skip': '跳過實驗 (Skip)',
      'view.topdown': '俯視圖：消失的十字 (Macroscopic View)',
      'view.side': '側視圖：微觀離子碰撞 (Microscopic View)',
      'caption.light': '透光度 (Light Transmission): ',
      'panel.controls': '實驗控制與即時數據',
      'group.reactants': '1. 配製反應溶液 (Reactants Setup)',
      'label.thiosulphate-conc': '硫代硫酸鈉濃度 [Na₂S₂O₃]:',
      'label.thiosulphate-vol': '硫代硫酸鈉體積 (Volume):',
      'label.water-vol': '加入蒸餾水體積 (Distilled Water):',
      'label.acid-type': '選擇酸液種類 (Acid Type):',
      'acid.hcl': '鹽酸 HCl (強單質子酸)',
      'acid.h2so4': '硫酸 H₂SO₄ (強雙質子酸)',
      'label.acid-conc': '酸液濃度 (Acid Conc.):',
      'label.acid-vol': '酸液體積 (Acid Volume):',
      'group.environment': '2. 環境因素 (Environmental Factors)',
      'label.temperature': '反應溫度 (Temperature):',
      'btn.start': '開始反應 (Start)',
      'btn.pause': '暫停 (Pause)',
      'btn.resume': '繼續 (Resume)',
      'btn.reset': '重設 (Reset)',
      'group.readings': '3. 即時儀表面板 (Live Readings)',
      'reading.time': '流逝時間 (Time)',
      'reading.status': '實驗狀態 (Status)',
      'reading.rate': '平均速率 (1/t)',
      'reading.mixture-vol': '混合物總體積 (Total Vol)',
      'status.ready': '就緒 (Ready)',
      'status.reacting': '反應中 (Reacting...)',
      'status.blotout': '十字消失 (Blot Out!)',
      'status.completed': '已完成 (Completed)',
      'panel.analysis': '數據分析與速率曲線圖',
      'graph.transmission': '即時透光度變化曲線 (Transmission vs. Time)',
      'graph.rate-temp': '速率與溫度關係圖 (Rate 1/t vs. Temperature)',
      'graph.rate-conc': '速率與濃度關係圖 (Rate 1/t vs. Concentration)',
      'table.title': '已記錄的實驗數據 (Recorded Trials)',
      'btn.clear-trials': '清除所有記錄',
      'th.trial': '試次 (Trial)',
      'th.temp': '溫度 (°C)',
      'th.thiosulphate': 'Na₂S₂O₃ 濃度 (M)',
      'th.acid': '酸濃度 (M) / 種類',
      'th.total-vol': '總體積 (mL)',
      'th.time': '消失時間 (s)',
      'th.rate': '速率 1/t (s⁻¹)',
      'table.empty': '尚無實驗記錄，請點擊「開始反應」進行測試。',
      'footer.text': 'HKDSE 化學 課題九 反應速率 — 適用於 Google Chrome · 薈進教育中心 Unit Education'
    },
    en: {
      'page.title': 'HKDSE Chemistry Rates of Reaction Simulator',
      'header.title': 'HKDSE Sodium Thiosulphate & Acid Rates of Reaction Lab',
      'header.subtitle': 'Investigate the Effects of Concentration, Temperature, and Dilution on Reaction Rate',
      'panel.visual': 'Microscopic Particles & Macroscopic Phenomenon Simulation',
      'btn.hideSettings': 'Hide Settings',
      'btn.showSettings': 'Show Settings',
      'label.speed': 'Simulation Speed:',
      'btn.skip': 'Skip Experiment',
      'view.topdown': 'Top-Down View: Disappearing Cross (Macroscopic View)',
      'view.side': 'Side View: Microscopic Ion Collisions (Microscopic View)',
      'caption.light': 'Light Transmission: ',
      'panel.controls': 'Experiment Controls & Live Readings',
      'group.reactants': '1. Reactants Setup',
      'label.thiosulphate-conc': 'Na₂S₂O₃ Concentration [Na₂S₂O₃]:',
      'label.thiosulphate-vol': 'Na₂S₂O₃ Volume:',
      'label.water-vol': 'Distilled Water Volume (H₂O):',
      'label.acid-type': 'Select Acid Type:',
      'acid.hcl': 'Hydrochloric Acid HCl (Strong Monobasic)',
      'acid.h2so4': 'Sulphuric Acid H₂SO₄ (Strong Dibasic)',
      'label.acid-conc': 'Acid Concentration:',
      'label.acid-vol': 'Acid Volume:',
      'group.environment': '2. Environmental Factors',
      'label.temperature': 'Reaction Temperature:',
      'btn.start': 'Start Reaction',
      'btn.pause': 'Pause',
      'btn.resume': 'Resume',
      'btn.reset': 'Reset',
      'group.readings': '3. Live Readings Dashboard',
      'reading.time': 'Elapsed Time',
      'reading.status': 'Experiment Status',
      'reading.rate': 'Average Rate (1/t)',
      'reading.mixture-vol': 'Total Mixture Volume',
      'status.ready': 'Ready',
      'status.reacting': 'Reacting...',
      'status.blotout': 'Cross Blot Out!',
      'status.completed': 'Completed',
      'panel.analysis': 'Data Analysis & Rate Curves',
      'graph.transmission': 'Real-time Light Transmission (%) vs. Time (s)',
      'graph.rate-temp': 'Rate (1/t) vs. Temperature (T)',
      'graph.rate-conc': 'Rate (1/t) vs. Thiosulphate Concentration',
      'table.title': 'Recorded Trials',
      'btn.clear-trials': 'Clear All Records',
      'th.trial': 'Trial',
      'th.temp': 'Temp (°C)',
      'th.thiosulphate': 'Na₂S₂O₃ Conc (M)',
      'th.acid': 'Acid Conc / Type',
      'th.total-vol': 'Total Vol (mL)',
      'th.time': 'Blot-out Time (s)',
      'th.rate': 'Rate 1/t (s⁻¹)',
      'table.empty': 'No trials recorded yet. Click "Start Reaction" to perform a test.',
      'footer.text': 'HKDSE Chemistry Topic 9 Rates of Reactions — Works in Google Chrome · Unit Education'
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
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'en' || stored === 'zh') currentLang = stored;
      } catch (e) { /* ignore */ }
    }
  }

  function t(key) {
    var bucket = strings[currentLang] || strings.zh;
    return bucket[key] || strings.zh[key] || key;
  }

  function updateDOM() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
    document.title = t('page.title');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (el.tagName === 'INPUT' && el.type === 'button') {
        el.value = val;
      } else if (el.tagName === 'SELECT') {
        Array.from(el.options).forEach(function (opt) {
          var optKey = opt.getAttribute('data-i18n');
          if (optKey) opt.textContent = t(optKey);
        });
      } else {
        el.textContent = val;
      }
    });

    var btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.textContent = currentLang === 'zh' ? 'EN' : '繁';
    }
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    if (!isEmbed) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    }
    applyEmbedClass();
    updateDOM();
    listeners.forEach(function (cb) { cb(currentLang); });
  }

  function init() {
    loadLang();
    applyEmbedClass();
    updateDOM();
  }

  function toggle() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
  }

  function onChange(cb) {
    listeners.push(cb);
  }

  function getLang() {
    return currentLang;
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

  loadLang();
  initHostLangBridge();

  return {
    init: init,
    toggle: toggle,
    t: t,
    setLang: setLang,
    onChange: onChange,
    getLang: getLang
  };
})();
