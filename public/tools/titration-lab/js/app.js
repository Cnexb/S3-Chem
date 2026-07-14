/* HKDSE Titration Lab — Main application */
var TitrationApp = (function () {
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

  var PREVIEW_STORAGE_KEY = 'hkdse-titration-preview-only';
  var previewOnly = false;

  var curveCanvas = null;
  var curveCtx = null;

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

    var nearBanner = $('near-eq-banner');
    if (nearBanner) {
      nearBanner.textContent = isEndpoint
        ? I18n.t('banner.nearEnd')
        : I18n.t('banner.nearEq');
    }

    var badge = $('target-reached-badge');
    if (badge) {
      badge.textContent = isEndpoint
        ? I18n.t('badge.endReached')
        : I18n.t('badge.eqReached');
    }

    var nearTarget = isFinite(vTarget) && Math.abs(vAdd - vTarget) <= 0.5;
    Burette.setNearEquivalence(nearTarget);
    if (nearBanner) nearBanner.hidden = !nearTarget;

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
    var chem = getChemical(state.buretteId);
    if (chem) {
      $('burette-label').textContent = chem.formula + ' ' + state.buretteConc.toFixed(2) + ' M';
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

    drawTitrationCurve(flaskChem, buretteChem, vAdd);

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

    try {
      localStorage.setItem(PREVIEW_STORAGE_KEY, previewOnly ? '1' : '0');
    } catch (e) { /* ignore */ }

    if (typeof Burette.positionStopcockHint === 'function') {
      requestAnimationFrame(function () {
        Burette.positionStopcockHint();
      });
    }

    // Trigger curve redraw since width might have changed
    update();
  }

  function initPreviewOnly() {
    var stored = false;
    try {
      stored = localStorage.getItem(PREVIEW_STORAGE_KEY) === '1';
    } catch (e) { /* ignore */ }
    setPreviewOnly(stored);
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
      update();
    });
  }

  function drawTitrationCurve(flaskChem, buretteChem, vAdd) {
    if (!curveCanvas || !curveCtx) return;

    var rect = curveCanvas.getBoundingClientRect();
    var width = rect.width * 2;
    var height = rect.height * 2;
    if (curveCanvas.width !== width || curveCanvas.height !== height) {
      curveCanvas.width = width;
      curveCanvas.height = height;
    }

    var ctx = curveCtx;
    ctx.clearRect(0, 0, width, height);

    var paddingLeft = 50;
    var paddingRight = 20;
    var paddingTop = 20;
    var paddingBottom = 40;

    var graphWidth = width - paddingLeft - paddingRight;
    var graphHeight = height - paddingTop - paddingBottom;

    function toX(vol) {
      return paddingLeft + (vol / 50) * graphWidth;
    }
    function toY(ph) {
      return paddingTop + (1 - ph / 14) * graphHeight;
    }

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.5;
    for (var ph = 2; ph <= 12; ph += 2) {
      var y = toY(ph);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();
    }
    for (var v = 10; v <= 40; v += 10) {
      var x = toX(v);
      ctx.beginPath();
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, height - paddingBottom);
      ctx.stroke();
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(paddingLeft, height - paddingBottom);
    ctx.lineTo(width - paddingRight, height - paddingBottom);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (var ph = 0; ph <= 14; ph += 2) {
      ctx.fillText(ph, paddingLeft - 10, toY(ph));
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var v = 0; v <= 50; v += 10) {
      ctx.fillText(v, toX(v), height - paddingBottom + 8);
    }

    ctx.save();
    ctx.translate(15, paddingTop + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('pH', 0, 0);
    ctx.restore();

    ctx.fillText(I18n.getLang() === 'en' ? 'Volume added (cm³)' : '已加體積 (cm³)', paddingLeft + graphWidth / 2, height - 18);

    if (state.indicatorId === 'phenolphthalein') {
      ctx.fillStyle = 'rgba(255, 182, 193, 0.15)';
      var y1 = toY(10.0);
      var y2 = toY(8.3);
      ctx.fillRect(paddingLeft, y1, graphWidth, y2 - y1);

      ctx.fillStyle = 'rgba(219, 39, 119, 0.7)';
      ctx.font = 'italic 16px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(I18n.getLang() === 'en' ? 'Phenolphthalein range (pH 8.3-10)' : '酚酞變色範圍 (pH 8.3-10)', width - paddingRight - 10, y1 + (y2 - y1) / 2);
    } else if (state.indicatorId === 'methylOrange') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      var y1 = toY(4.4);
      var y2 = toY(3.1);
      ctx.fillRect(paddingLeft, y1, graphWidth, y2 - y1);

      ctx.fillStyle = 'rgba(180, 83, 9, 0.7)';
      ctx.font = 'italic 16px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(I18n.getLang() === 'en' ? 'Methyl orange range (pH 3.1-4.4)' : '甲基橙變色範圍 (pH 3.1-4.4)', width - paddingRight - 10, y1 + (y2 - y1) / 2);
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    var first = true;
    for (var v = 0; v <= 50; v += 0.2) {
      var phVal = Chemistry.calculatePH(flaskChem, buretteChem, state.flaskConc, state.flaskVol, state.buretteConc, v);
      var x = toX(v);
      var y = toY(phVal);
      if (first) {
        ctx.moveTo(x, y);
        first = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    var vEq = Chemistry.getEquivalenceVolume(flaskChem, buretteChem, state.flaskConc, state.flaskVol, state.buretteConc);
    var eqPH = Chemistry.getEquivalencePH(flaskChem, buretteChem);
    if (isFinite(vEq) && vEq <= 50) {
      var eqX = toX(vEq);
      var eqY = toY(eqPH);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(eqX, height - paddingBottom);
      ctx.lineTo(eqX, eqY);
      ctx.lineTo(paddingLeft, eqY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(eqX, eqY, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Eq Point (' + vEq.toFixed(2) + ' cm³, pH ' + eqPH.toFixed(1) + ')', eqX + 10, eqY - 10);
    }

    var currentPH = Chemistry.calculatePH(flaskChem, buretteChem, state.flaskConc, state.flaskVol, state.buretteConc, vAdd);
    var curX = toX(vAdd);
    var curY = toY(currentPH);

    ctx.strokeStyle = '#ef4848';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    ctx.lineTo(paddingLeft, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.arc(curX, curY, 11, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  function init() {
    I18n.init();
    I18n.onChange(onLanguageChange);

    var params = new URLSearchParams(window.location.search);
    if (params.get('embed') === '1') {
      document.documentElement.classList.add('embed-mode');
    }

    curveCanvas = $('titration-curve-canvas');
    if (curveCanvas) {
      curveCtx = curveCanvas.getContext('2d');
    }

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
