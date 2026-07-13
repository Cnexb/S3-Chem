/* HKDSE Titration Lab — Main application */
var TitrationApp = (function () {
  var BANNER_DISPLAY_MS = 5000;
  var BANNER_FADE_MS = 500;

  var state = {
    presetId: '',
    flaskId: 'NaOH',
    buretteId: 'HCl',
    flaskConc: 0.1,
    buretteConc: 0.1,
    flaskVol: 25,
    indicatorId: 'phenolphthalein',
    targetMode: 'equivalence'
  };

  var previewOnly = false;
  var wasNearTarget = false;
  var bannerTimer = null;
  var bannerShownThisVisit = false;

  function $(id) {
    return document.getElementById(id);
  }

  function populateSelects() {
    var flaskSel = $('flask-chem');
    var buretteSel = $('burette-chem');
    if (!flaskSel || !buretteSel) return;
    var lang = I18n.getLang();

    flaskSel.innerHTML = '';
    buretteSel.innerHTML = '';

    var all = ACID_IDS.concat(BASE_IDS);
    all.forEach(function (id) {
      var chem = CHEMICALS[id];
      var label = formatChemicalLabel(chem, lang);

      var opt1 = document.createElement('option');
      opt1.value = id;
      opt1.textContent = label;
      flaskSel.appendChild(opt1);

      var opt2 = document.createElement('option');
      opt2.value = id;
      opt2.textContent = label;
      buretteSel.appendChild(opt2);
    });

    flaskSel.value = state.flaskId;
    buretteSel.value = state.buretteId;
  }

  function populatePresets() {
    var sel = $('preset-select');
    if (!sel) return;

    var current = sel.value || state.presetId;
    sel.innerHTML = '';
    var custom = document.createElement('option');
    custom.value = '';
    custom.textContent = I18n.t('preset.custom');
    sel.appendChild(custom);

    PRESETS.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = getPresetLabel(p.id);
      sel.appendChild(opt);
    });
    sel.value = current;
  }

  function readStateFromUI() {
    state.flaskId = $('flask-chem').value;
    state.buretteId = $('burette-chem').value;
    state.flaskConc = parseFloat($('flask-conc').value) || 0.1;
    state.buretteConc = parseFloat($('burette-conc').value) || 0.1;
    state.flaskVol = parseFloat($('flask-vol').value) || 25;
    state.indicatorId = document.querySelector('input[name="indicator"]:checked').value;
    state.presetId = $('preset-select').value;
    var modeRadio = document.querySelector('input[name="targetMode"]:checked');
    state.targetMode = modeRadio ? modeRadio.value : 'equivalence';
  }

  function getTargetVolumes(flaskChem, buretteChem) {
    var vEq = Chemistry.getEquivalenceVolume(
      flaskChem, buretteChem, state.flaskConc, state.flaskVol, state.buretteConc
    );
    var vEnd = Indicators.getEndPointVolume(
      flaskChem, buretteChem, state.flaskConc, state.flaskVol, state.buretteConc, state.indicatorId
    );
    return { vEq: vEq, vEnd: vEnd };
  }

  function getActiveTarget(volumes) {
    if (state.targetMode === 'endpoint') {
      return volumes.vEnd;
    }
    return volumes.vEq;
  }

  function hideNearBanner(immediate) {
    var nearBanner = $('near-eq-banner');
    if (!nearBanner) return;

    if (bannerTimer) {
      clearTimeout(bannerTimer);
      bannerTimer = null;
    }

    nearBanner.classList.remove('is-visible', 'is-fading');
    if (!immediate) {
      nearBanner.classList.add('is-fading');
    }
  }

  function showNearBanner() {
    var nearBanner = $('near-eq-banner');
    if (!nearBanner) return;

    if (bannerTimer) {
      clearTimeout(bannerTimer);
      bannerTimer = null;
    }

    nearBanner.classList.remove('is-fading');
    nearBanner.classList.add('is-visible');

    bannerTimer = setTimeout(function () {
      bannerTimer = null;
      nearBanner.classList.remove('is-visible');
      nearBanner.classList.add('is-fading');
      setTimeout(function () {
        nearBanner.classList.remove('is-fading');
      }, BANNER_FADE_MS);
    }, BANNER_DISPLAY_MS);
  }

  function updateNearBanner(nearTarget, isEndpoint) {
    var nearBanner = $('near-eq-banner');
    if (!nearBanner) return;

    nearBanner.textContent = isEndpoint
      ? I18n.t('banner.nearEnd')
      : I18n.t('banner.nearEq');

    if (!nearTarget) {
      wasNearTarget = false;
      bannerShownThisVisit = false;
      hideNearBanner(true);
      return;
    }

    if (!wasNearTarget && !bannerShownThisVisit) {
      bannerShownThisVisit = true;
      showNearBanner();
    }

    wasNearTarget = true;
  }

  function updateToggleButton() {
    var btn = $('toggle-controls-btn');
    if (!btn) return;

    btn.textContent = previewOnly ? I18n.t('controls.show') : I18n.t('controls.hide');
    btn.setAttribute('aria-pressed', previewOnly ? 'true' : 'false');
  }

  function setPreviewOnly(enabled) {
    previewOnly = !!enabled;
    var main = document.querySelector('main');
    if (main) {
      main.classList.toggle('preview-only', previewOnly);
    }
    updateToggleButton();

    if (typeof Burette.positionStopcockHint === 'function') {
      requestAnimationFrame(function () {
        Burette.positionStopcockHint();
      });
    }
  }

  function initPreviewOnly() {
    setPreviewOnly(false);
  }

  function updateTargetUI(volumes, vAdd) {
    var isEndpoint = state.targetMode === 'endpoint';
    var vTarget = getActiveTarget(volumes);

    $('target-vol-label').textContent = isEndpoint
      ? I18n.t('data.targetVol.ep')
      : I18n.t('data.targetVol.eq');

    if (vTarget === null || !isFinite(vTarget)) {
      $('target-vol-value').textContent = '—';
      if (isEndpoint) {
        $('target-mode-note').textContent = I18n.t('warn.noEndPoint');
        $('target-mode-note').className = 'target-mode-note warn';
      } else {
        $('target-mode-note').textContent = I18n.t('target.eqNote');
        $('target-mode-note').className = 'target-mode-note';
      }
    } else {
      $('target-vol-value').textContent = vTarget.toFixed(2);
      $('target-mode-note').textContent = isEndpoint
        ? I18n.t('target.epNote')
        : I18n.t('target.eqNote');
      $('target-mode-note').className = 'target-mode-note';
    }

    var badge = $('target-reached-badge');    if (badge) {
      badge.textContent = isEndpoint
        ? I18n.t('badge.endReached')
        : I18n.t('badge.eqReached');
    }

    var nearTarget = isFinite(vTarget) && Math.abs(vAdd - vTarget) <= 0.5;
    Burette.setNearEquivalence(nearTarget);
    updateNearBanner(nearTarget, isEndpoint);

    var reached = isFinite(vTarget) && Math.abs(vAdd - vTarget) < 0.1;
    $('target-reached').hidden = !reached;
  }

  function applyPreset(presetId) {
    var preset = PRESETS.find(function (p) { return p.id === presetId; });
    if (!preset) return;

    state.presetId = presetId;
    state.flaskId = preset.flaskId;
    state.buretteId = preset.buretteId;
    state.flaskConc = preset.flaskConc;
    state.buretteConc = preset.buretteConc;
    state.flaskVol = preset.flaskVol;
    state.indicatorId = preset.indicator;

    $('flask-chem').value = state.flaskId;
    $('burette-chem').value = state.buretteId;
    $('flask-conc').value = state.flaskConc;
    $('flask-conc-val').textContent = state.flaskConc.toFixed(2) + ' M';
    $('burette-conc').value = state.buretteConc;
    $('burette-conc-val').textContent = state.buretteConc.toFixed(2) + ' M';
    $('flask-vol').value = state.flaskVol;
    $('flask-vol-val').textContent = state.flaskVol.toFixed(1) + ' cm³';

    var indRadio = document.querySelector('input[name="indicator"][value="' + state.indicatorId + '"]');
    if (indRadio) indRadio.checked = true;

    $('preset-note').textContent = getPresetNote(presetId);
    $('preset-note').hidden = false;
    $('preset-select').value = presetId;

    Burette.reset();
    update();
  }

  function updateFlaskColor(colorInfo, pH) {
    var liquid = $('flask-liquid');
    var glow = $('flask-glow');
    if (liquid) {
      liquid.setAttribute('fill', colorInfo.color);
      liquid.style.fill = colorInfo.color;
    }
    if (glow) {
      glow.setAttribute('fill', colorInfo.color);
      glow.style.fill = colorInfo.color;
    }
    $('indicator-color-label').textContent = colorInfo.label;
    $('ph-value').textContent = pH.toFixed(2);
  }

  function updateBuretteLabel() {
    var label = $('burette-label');
    var chem = getChemical(state.buretteId);
    if (label && chem) {
      label.textContent = chem.formula + ' ' + state.buretteConc.toFixed(2) + ' M';
    }
  }

  function update() {
    readStateFromUI();

    var flaskChem = getChemical(state.flaskId);
    var buretteChem = getChemical(state.buretteId);
    var vAdd = Burette.getVolume();

    var error = Chemistry.validateSetup(flaskChem, buretteChem);
    $('setup-error').hidden = !error;
    if (error) {
      $('setup-error').textContent = error;
      return;
    }

    var volumes = getTargetVolumes(flaskChem, buretteChem);
    var eqPH = Chemistry.getEquivalencePH(flaskChem, buretteChem);
    var pH = Chemistry.calculatePH(
      flaskChem, buretteChem, state.flaskConc, state.flaskVol, state.buretteConc, vAdd
    );

    var colorInfo = Indicators.getColor(state.indicatorId, pH);
    var suitability = Indicators.getSuitability(flaskChem, buretteChem, state.indicatorId);
    var endpoint = Indicators.getEndpointDescription(flaskChem, state.indicatorId);

    updateFlaskColor(colorInfo, pH);
    updateBuretteLabel();
    updateTargetUI(volumes, vAdd);

    $('eq-ph-value').textContent = eqPH.toFixed(1);
    $('endpoint-desc').textContent = endpoint;

    var suitEl = $('suitability-msg');
    suitEl.textContent = suitability.message;
    suitEl.className = 'suitability-msg ' + (suitability.suitable ? 'ok' : 'warn');
  }

  function onLanguageChange() {
    populatePresets();
    populateSelects();
    I18n.apply();
    if (state.presetId) {
      $('preset-note').textContent = getPresetNote(state.presetId);
    }
    if (typeof Burette.positionStopcockHint === 'function') {
      Burette.positionStopcockHint();
    }
    updateToggleButton();
    update();
  }

  function bindUI() {
    $('preset-select').addEventListener('change', function () {
      if (this.value) {
        applyPreset(this.value);
      } else {
        state.presetId = '';
        $('preset-note').hidden = true;
        Burette.reset();
        update();
      }
    });

    ['flask-chem', 'burette-chem', 'flask-vol'].forEach(function (id) {
      $(id).addEventListener('change', function () {
        state.presetId = '';
        $('preset-select').value = '';
        $('preset-note').hidden = true;
        Burette.reset();
        update();
      });
    });

    $('flask-conc').addEventListener('input', function () {
      $('flask-conc-val').textContent = parseFloat(this.value).toFixed(2) + ' M';
      state.presetId = '';
      $('preset-select').value = '';
      update();
    });

    $('burette-conc').addEventListener('input', function () {
      $('burette-conc-val').textContent = parseFloat(this.value).toFixed(2) + ' M';
      state.presetId = '';
      $('preset-select').value = '';
      update();
    });

    $('flask-vol').addEventListener('input', function () {
      $('flask-vol-val').textContent = parseFloat(this.value).toFixed(1) + ' cm³';
      update();
    });

    document.querySelectorAll('input[name="indicator"]').forEach(function (radio) {
      radio.addEventListener('change', update);
    });

    document.querySelectorAll('input[name="targetMode"]').forEach(function (radio) {
      radio.addEventListener('change', update);
    });

    $('btn-reset-all').addEventListener('click', function () {
      Burette.reset();
      update();
    });

    $('guide-toggle').addEventListener('click', function () {
      var body = $('guide-body');
      var open = body.hidden;
      body.hidden = !open;
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var toggleBtn = $('toggle-controls-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        setPreviewOnly(!previewOnly);
      });
    }

    window.addEventListener('resize', function () {
      if (typeof Burette.positionStopcockHint === 'function') {
        Burette.positionStopcockHint();
      }
    });
  }

  function init() {
    I18n.init();
    I18n.onChange(onLanguageChange);

    populatePresets();
    populateSelects();

    $('flask-conc').value = state.flaskConc;
    $('burette-conc').value = state.buretteConc;
    $('flask-vol').value = state.flaskVol;
    $('flask-conc-val').textContent = state.flaskConc.toFixed(2) + ' M';
    $('burette-conc-val').textContent = state.buretteConc.toFixed(2) + ' M';
    $('flask-vol-val').textContent = state.flaskVol.toFixed(1) + ' cm³';

    Burette.init(function () {
      update();
    });

    initPreviewOnly();
    bindUI();
    update();
  }

  return { init: init };
})();

document.addEventListener('DOMContentLoaded', function () {
  TitrationApp.init();
});
