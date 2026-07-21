/* HKDSE Metal Reactions Lab — Internationalisation */
var I18n = (function () {
  var STORAGE_KEY = 'hkdse-metal-reactions-lang';
  var currentLang = 'zh';
  var listeners = [];
  var isEmbed = false;

  var strings = {
    zh: {
      'page.title': 'HKDSE 金屬反應模擬器',
      'header.title': 'HKDSE 金屬反應模擬器',
      'header.subtitle': 'Topic 3 金屬反應互動實驗',
      'mode.oxygen': '金屬與氧氣',
      'mode.solution': '金屬與溶液',
      'panel.setup': '實驗裝置',
      'panel.controls': '控制面板',
      'panel.results': '反應結果',
      'label.metal': '選擇金屬',
      'label.solution': '選擇溶液 / 環境',
      'label.position': '位置',
      'label.position.flame': '靠近火焰',
      'label.position.dip': '浸入深度',
      'label.oxide': '刮除鋁的氧化膜',
      'btn.run': '開始實驗',
      'btn.reset': '重置',
      'btn.focusMode': '全屏預覽',
      'btn.showSettings': '顯示設定',
      'result.equation': '化學方程式',
      'result.wordEq': '字方程式',
      'result.observation': '觀察',
      'result.explanation': '背景說明',
      'result.note': '備註',
      'result.noReaction': '無反應',
      'result.selectRun': '選擇金屬與溶液，按「開始實驗」查看結果。',
      'reactivity.title': '金屬活性序',
      'reactivity.most': '最活潑',
      'reactivity.least': '最不活潑',
      'reactivity.hint': '（上：最活潑 → 下：最不活潑）',
      'footer': 'HKDSE 化學 Topic 3 金屬 · 適用於 Google Chrome',
      'oxygen.hint': '選擇金屬後按「開始實驗」，觀察鎳鉻絲將金屬移入本生燈火焰中與氧的反應。',
      'steam.hint': '選擇金屬後按「開始實驗」，觀察加熱浸水玻璃棉產生蒸汽，經試管中部加熱的金屬，並用排水集氣法收集氫氣。',
      'beaker.hint': '選擇金屬與溶液後按「開始實驗」，觀察金屬落入溶液中的反應。',
      'beaker.clickHint': '點擊燒杯加入金屬',
      'oxygen.status.ready': '準備加熱',
      'oxygen.status.burning': '燃燒中',
      'oxygen.status.noReaction': '無反應',
      'oxygen.status.formingOxide': '形成氧化物',
      'oxygen.status.exploded': '劇烈反應',
      'scene.oxygen': '本生燈加熱金屬',
      'scene.beaker': '燒杯置換 / 酸 / 水反應',
      'tip.removeOxide': '提示：請勾選「刮除鋁的氧化膜」以開始反應！'
    },
    en: {
      'page.title': 'HKDSE Metal Reactions Simulator',
      'header.title': 'HKDSE Metal Reactions Simulator',
      'header.subtitle': 'Topic 3 Interactive Metal Reaction Lab',
      'mode.oxygen': 'Metal + Oxygen',
      'mode.solution': 'Metal + Solution',
      'panel.setup': 'Apparatus',
      'panel.controls': 'Controls',
      'panel.results': 'Results',
      'label.metal': 'Select metal',
      'label.solution': 'Select solution / medium',
      'label.position': 'Position',
      'label.position.flame': 'Near flame',
      'label.position.dip': 'Immersion depth',
      'label.oxide': 'Remove aluminium oxide layer',
      'btn.run': 'Start experiment',
      'btn.reset': 'Reset',
      'btn.focusMode': 'Full screen preview',
      'btn.showSettings': 'Show settings',
      'result.equation': 'Chemical equation',
      'result.wordEq': 'Word equation',
      'result.observation': 'Observation',
      'result.explanation': 'Background',
      'result.note': 'Note',
      'result.noReaction': 'No reaction',
      'result.selectRun': 'Select metal and solution, then click Start to view results.',
      'reactivity.title': 'Reactivity series',
      'reactivity.most': 'most reactive',
      'reactivity.least': 'least reactive',
      'reactivity.hint': '(Top: most reactive → Bottom: least reactive)',
      'footer': 'HKDSE Chemistry Topic 3 Metals · Works in Google Chrome',
      'oxygen.hint': 'Select a metal and click Start to move it into the Bunsen flame with a nichrome wire.',
      'steam.hint': 'Select a metal and click Start to heat the glass-wool to generate steam, which passes over the heated metal to release hydrogen collected by water displacement.',
      'beaker.hint': 'Select metal and solution, then click Start to drop the metal into the beaker and observe the reaction.',
      'beaker.clickHint': 'Click the beaker to add metal',
      'oxygen.status.ready': 'Ready to heat',
      'oxygen.status.burning': 'Burning',
      'oxygen.status.noReaction': 'No reaction',
      'oxygen.status.formingOxide': 'Forming oxide',
      'oxygen.status.exploded': 'Violent reaction',
      'scene.oxygen': 'Heating metal in Bunsen flame',
      'scene.beaker': 'Beaker displacement / acid / water reaction',
      'tip.removeOxide': 'Tip: Tick "Remove aluminium oxide layer" to start reaction!'
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

    // Host dashboard passes ?lang=en|zh — follow it when present
    var urlLang = params && params.get('lang');
    if (urlLang === 'en' || urlLang === 'zh') {
      currentLang = urlLang;
      return;
    }

    // Standalone only: remember last choice
    if (!isEmbed) {
      try {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'en' || stored === 'zh') currentLang = stored;
      } catch (e) { /* ignore */ }
    }
  }

  function getLang() {
    return currentLang;
  }

  function t(key) {
    var bucket = strings[currentLang] || strings.zh;
    return bucket[key] || strings.zh[key] || key;
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    if (!isEmbed) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    }
    applyEmbedClass();
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
    document.title = t('page.title');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    listeners.forEach(function (fn) { fn(lang); });
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

  loadLang();
  initHostLangBridge();
  return { getLang: getLang, t: t, setLang: setLang, onChange: onChange };
})();
