/* HKDSE Metal Reactions Lab — Main application */
var MetalLabApp = (function () {
  var state = {
    mode: 'oxygen',
    metalId: 'Mg',
    solutionId: 'cold_water',
    lastResult: null,
    focusMode: false
  };

  function $(id) { return document.getElementById(id); }

  function populateSolutions() {
    var sel = $('solution-select');
    if (!sel) return;
    var lang = I18n.getLang();
    sel.innerHTML = '';
    SOLUTION_GROUPS.forEach(function (group) {
      var og = document.createElement('optgroup');
      og.label = group.label[lang];
      group.ids.forEach(function (sid) {
        var opt = document.createElement('option');
        opt.value = sid;
        opt.textContent = getSolutionLabel(sid, lang);
        og.appendChild(opt);
      });
      sel.appendChild(og);
    });
    sel.value = state.solutionId;
  }

  function updateModeUI() {
    var isOxygen = state.mode === 'oxygen';
    $('oxygen-scene-wrap').hidden = !isOxygen;
    
    var isSteam = !isOxygen && state.solutionId === 'steam';
    var isBeaker = !isOxygen && !isSteam;
    $('beaker-scene-wrap').hidden = !isBeaker;
    $('steam-scene-wrap').hidden = isOxygen || !isSteam;
    
    $('solution-field').hidden = isOxygen;

    // Beaker uses click-to-add; hide Start. Oxygen / Steam keep Start.
    var btnRun = $('btn-run');
    var btnRunScene = $('btn-run-scene');
    if (btnRun) btnRun.hidden = isBeaker;
    if (btnRunScene) btnRunScene.hidden = isBeaker;

    var beakerHint = $('beaker-click-hint');
    if (beakerHint) beakerHint.hidden = !isBeaker;

    document.querySelectorAll('.mode-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-mode') === state.mode);
      tab.setAttribute('aria-selected', tab.getAttribute('data-mode') === state.mode ? 'true' : 'false');
    });
  }

  function updateFocusButton() {
    var btn = $('btn-focus-mode');
    if (!btn) return;
    btn.textContent = state.focusMode ? I18n.t('btn.showSettings') : I18n.t('btn.focusMode');
  }

  function toggleFocusMode() {
    state.focusMode = !state.focusMode;
    document.body.classList.toggle('focus-mode', state.focusMode);
    updateFocusButton();
  }

  function chipTierClass(id) {
    if (getReactivityIndex(id) <= 2) return 'high';
    if (getReactivityIndex(id) <= 6) return 'mid';
    if (getReactivityIndex(id) <= 9) return 'low';
    return 'none';
  }

  function buildReactivityBar() {
    var bar = $('reactivity-bar');
    if (!bar) return;
    if (bar.children.length !== REACTIVITY_ORDER.length) {
      bar.innerHTML = '';
      REACTIVITY_ORDER.forEach(function (id) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'reactivity-chip ' + chipTierClass(id);
        btn.textContent = id;
        btn.title = METALS[id].name[I18n.getLang()];
        btn.setAttribute('data-metal', id);
        bar.appendChild(btn);
      });
    }
    updateReactivityBarActive();
  }

  function updateReactivityBarActive() {
    var bar = $('reactivity-bar');
    if (!bar) return;
    bar.querySelectorAll('.reactivity-chip').forEach(function (btn) {
      var id = btn.getAttribute('data-metal');
      var isActive = id === state.metalId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function updateReactivityBarTitles() {
    var lang = I18n.getLang();
    var bar = $('reactivity-bar');
    if (!bar) return;
    bar.querySelectorAll('.reactivity-chip').forEach(function (btn) {
      var id = btn.getAttribute('data-metal');
      if (METALS[id]) btn.title = METALS[id].name[lang];
    });
  }

  function onReactivityBarClick(e) {
    var btn = e.target.closest('.reactivity-chip');
    if (!btn) return;
    var metalId = btn.getAttribute('data-metal');
    if (metalId) selectMetal(metalId);
  }

  function renderResults(result) {
    state.lastResult = result;
    var lang = I18n.getLang();
    var eqEls = document.querySelectorAll('.scene-equation-val');
    var wordEl = $('result-word');
    var obsEl = $('result-observation');
    var expEl = $('result-explanation');
    var noteEl = $('result-note');
    var noteWrap = $('result-note-wrap');

    var equationText = '—';
    if (!result) {
      equationText = '—';
      if (wordEl) wordEl.textContent = '—';
      if (obsEl) obsEl.textContent = I18n.t('result.selectRun');
      if (expEl) expEl.textContent = '—';
      if (noteWrap) noteWrap.hidden = true;
    } else {
      if (result.reacts && result.equation) {
        equationText = result.equation;
      } else if (!result.reacts) {
        equationText = I18n.t('result.noReaction');
      } else {
        equationText = result.equation || '—';
      }

      if (wordEl) wordEl.textContent = result.wordEquation ? result.wordEquation[lang] : '—';
      if (obsEl) obsEl.textContent = result.observation ? result.observation[lang] : '—';
      if (expEl) expEl.textContent = result.explanation ? result.explanation[lang] : '—';

      if (result.note) {
        if (noteEl) noteEl.textContent = result.note[lang];
        if (noteWrap) noteWrap.hidden = false;
      } else {
        if (noteWrap) noteWrap.hidden = true;
      }
    }

    eqEls.forEach(function (el) {
      el.textContent = equationText;
    });
  }

  function previewResult() {
    var result = ReactionEngine.getResult({
      mode: state.mode,
      metalId: state.metalId,
      solutionId: state.solutionId
    });
    renderResults(result);
  }

  function dropBeakerMetal() {
    if (state.mode === 'oxygen' || state.solutionId === 'steam') return;
    if (BeakerScene.isBusy()) return;

    var result = ReactionEngine.getResult({
      mode: state.mode,
      metalId: state.metalId,
      solutionId: state.solutionId
    });

    if (BeakerScene.addMetal(result)) {
      renderResults(result);
    }
  }

  function runExperiment() {
    if (state.mode === 'oxygen' && OxygenScene.isBusy()) return;
    if (state.mode !== 'oxygen') {
      if (state.solutionId === 'steam' && SteamScene.isBusy()) return;
      // Beaker: click-to-add instead of Start
      if (state.solutionId !== 'steam') {
        dropBeakerMetal();
        return;
      }
    }

    var result = ReactionEngine.getResult({
      mode: state.mode,
      metalId: state.metalId,
      solutionId: state.solutionId
    });

    if (state.mode === 'oxygen') {
      OxygenScene.play(result);
    } else if (state.solutionId === 'steam') {
      SteamScene.play(result);
    }

    renderResults(result);
  }

  function resetAll() {
    if (state.mode === 'oxygen') {
      OxygenScene.resetAnimation();
    } else {
      BeakerScene.resetAnimation();
      SteamScene.resetAnimation();
    }
    renderResults(null);
  }

  function selectMetal(metalId) {
    if (!METALS[metalId]) return;
    state.metalId = metalId;
    OxygenScene.setMetal(metalId);
    BeakerScene.setMetal(metalId);
    SteamScene.setMetal(metalId);
    updateReactivityBarActive();
    resetAll();
    previewResult();
  }

  function onSolutionChange() {
    state.solutionId = $('solution-select').value;
    BeakerScene.setSolution(state.solutionId);
    updateModeUI();
    resetAll();
    previewResult();
  }

  function onModeChange(mode) {
    state.mode = mode;
    updateModeUI();
    if (mode !== 'oxygen') {
      setTimeout(function() {
        if (BeakerScene && BeakerScene.resize) {
          BeakerScene.resize();
        }
      }, 50);
    }
    resetAll();
    previewResult();
  }

  function bindEvents() {
    $('solution-select').addEventListener('change', onSolutionChange);
    $('btn-run').addEventListener('click', runExperiment);
    $('btn-reset').addEventListener('click', resetAll);
    $('btn-run-scene').addEventListener('click', runExperiment);
    $('btn-reset-scene').addEventListener('click', resetAll);
    var btnFocus = $('btn-focus-mode');
    if (btnFocus) {
      btnFocus.addEventListener('click', toggleFocusMode);
    }
    var reactivityBar = $('reactivity-bar');
    if (reactivityBar) reactivityBar.addEventListener('click', onReactivityBarClick);

    document.querySelectorAll('.mode-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        onModeChange(tab.getAttribute('data-mode'));
      });
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        I18n.setLang(btn.getAttribute('data-lang'));
      });
    });

    I18n.onChange(function () {
      populateSolutions();
      updateModeUI();
      updateFocusButton();
      updateReactivityBarTitles();
      updateReactivityBarActive();
      OxygenScene.refreshLabel();
      SteamScene.refreshLabel();
      if (state.lastResult) renderResults(state.lastResult);
      else previewResult();
    });
  }

  function init() {
    I18n.setLang(I18n.getLang());
    populateSolutions();
    updateModeUI();
    updateFocusButton();
    OxygenScene.init();
    BeakerScene.init();
    SteamScene.init();
    OxygenScene.setMetal(state.metalId);
    BeakerScene.setMetal(state.metalId);
    SteamScene.setMetal(state.metalId);
    BeakerScene.setSolution(state.solutionId);
    buildReactivityBar();
    bindEvents();
    if (BeakerScene.setOnCanvasClick) {
      BeakerScene.setOnCanvasClick(dropBeakerMetal);
    }
    previewResult();
  }

  return { init: init };
})();

document.addEventListener('DOMContentLoaded', function () {
  MetalLabApp.init();
});
