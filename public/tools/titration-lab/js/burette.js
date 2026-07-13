/* HKDSE Titration Lab — Interactive burette with smooth animation */
var Burette = (function () {
  var MAX_VOL = 50;
  var STEP = 0.05;
  var LERP_DRAG = 0.42;
  var LERP_NORMAL = 0.16;

  /* Aligned to SVG graduation marks: 0 at y=60, 50 at y=290 */
  var SCALE_ZERO_Y = 60;
  var SCALE_SPAN = 230;
  var LIQUID_BOTTOM_Y = 296;
  var LIQUID_X = 128;
  var LIQUID_W = 18;

  var targetVol = 0;
  var displayVol = 0;
  var initialReading = 0;
  var onChange = null;
  var holdTimer = null;
  var holdInterval = null;
  var animFrame = null;
  var isDragging = false;
  var dropToggle = false;
  var lastDropTime = 0;
  var lastOnChangeVol = -1;

  function roundVol(v) {
    return Math.round(v / STEP) * STEP;
  }

  function clampVol(v) {
    return Math.max(0, Math.min(MAX_VOL, roundVol(v)));
  }

  function getVolume() {
    return targetVol;
  }

  function volumeToMeniscusY(vol) {
    return SCALE_ZERO_Y + (vol / MAX_VOL) * SCALE_SPAN;
  }

  function applyLiquidVisual(vol) {
    var meniscusY = volumeToMeniscusY(vol);
    var liquidH = Math.max(0, LIQUID_BOTTOM_Y - meniscusY);
    var liquidEl = document.getElementById('burette-liquid');
    var meniscusEl = document.getElementById('burette-meniscus');

    if (liquidEl) {
      liquidEl.setAttribute('y', meniscusY);
      liquidEl.setAttribute('height', liquidH);
      liquidEl.setAttribute('x', LIQUID_X);
      liquidEl.setAttribute('width', LIQUID_W);
    }
    if (meniscusEl) {
      meniscusEl.setAttribute('cy', meniscusY);
      meniscusEl.setAttribute('cx', LIQUID_X + LIQUID_W / 2);
    }
  }

  function updateDisplays(vol) {
    var addedDisplay = document.getElementById('vol-added');
    var finalDisplay = document.getElementById('vol-final');
    var sliderVal = document.getElementById('slider-val');
    var sliderEl = document.getElementById('burette-slider');

    if (sliderEl && !isDragging) {
      sliderEl.value = vol;
    }
    if (addedDisplay) addedDisplay.textContent = vol.toFixed(2);
    if (finalDisplay) finalDisplay.textContent = (initialReading + vol).toFixed(2);
    if (sliderVal) sliderVal.textContent = vol.toFixed(2) + ' cm³';
  }

  function notifyChange(vol) {
    var rounded = clampVol(vol);
    if (rounded !== lastOnChangeVol) {
      lastOnChangeVol = rounded;
      if (onChange) onChange(rounded);
    }
  }

  function stopRenderLoop() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  function startRenderLoop() {
    if (animFrame) return;

    function loop() {
      var diff = targetVol - displayVol;
      var rate = isDragging ? LERP_DRAG : LERP_NORMAL;

      if (Math.abs(diff) < 0.002) {
        displayVol = targetVol;
      } else {
        displayVol += diff * rate;
      }

      applyLiquidVisual(displayVol);
      updateDisplays(displayVol);
      notifyChange(displayVol);

      if (Math.abs(targetVol - displayVol) >= 0.002 || isDragging) {
        animFrame = requestAnimationFrame(loop);
      } else {
        displayVol = targetVol;
        applyLiquidVisual(displayVol);
        updateDisplays(displayVol);
        notifyChange(displayVol);
        animFrame = null;
      }
    }
    animFrame = requestAnimationFrame(loop);
  }

  function setAddedVolume(vol, silent) {
    targetVol = clampVol(vol);
    startRenderLoop();
    if (!silent) notifyChange(targetVol);
  }

  function addVolume(delta) {
    setAddedVolume(targetVol + delta);
  }

  function reset() {
    stopRenderLoop();
    targetVol = 0;
    displayVol = 0;
    lastOnChangeVol = -1;
    applyLiquidVisual(0);
    updateDisplays(0);
    if (onChange) onChange(0);
  }

  function triggerDrop() {
    var now = Date.now();
    if (now - lastDropTime < 100) return;
    lastDropTime = now;

    dropToggle = !dropToggle;
    var id = dropToggle ? 'burette-drop-2' : 'burette-drop';
    var drop = document.getElementById(id);
    if (!drop) drop = document.getElementById('burette-drop');
    if (!drop) return;
    drop.classList.remove('falling');
    void drop.offsetWidth;
    drop.classList.add('falling');
  }

  function dismissHint() {
    var hint = document.getElementById('stopcock-hint');
    var pulse = document.getElementById('tap-hint-pulse');
    var guideLine = document.getElementById('hint-guide-line');
    if (hint) {
      hint.hidden = true;
      hint.style.display = 'none';
      hint.style.visibility = '';
    }
    if (pulse) pulse.setAttribute('visibility', 'hidden');
    if (guideLine) guideLine.setAttribute('visibility', 'hidden');
    try {
      localStorage.setItem('hkdse-titration-hint-dismissed', '1');
    } catch (e) { /* ignore */ }
  }

  function positionStopcockHint() {
    var scene = document.querySelector('.lab-scene');
    var tap = document.getElementById('burette-tap');
    var hint = document.getElementById('stopcock-hint');
    var guideLine = document.getElementById('hint-guide-line');
    if (!scene || !tap || !hint || hint.hidden) {
      if (guideLine) guideLine.setAttribute('visibility', 'hidden');
      return;
    }

    var sceneRect = scene.getBoundingClientRect();
    var tapRect = tap.getBoundingClientRect();
    var tapCenterX = tapRect.left + tapRect.width / 2 - sceneRect.left;
    var tapCenterY = tapRect.top + tapRect.height / 2 - sceneRect.top;

    hint.style.visibility = 'hidden';
    hint.style.display = 'block';
    var hintH = hint.offsetHeight || 90;
    hint.style.visibility = '';
    hint.style.display = '';

    if (hint.hidden) {
      if (guideLine) guideLine.setAttribute('visibility', 'hidden');
      return;
    }

    var gap = 14;
    var left = tapCenterX + gap + 12;
    var top = tapCenterY - hintH / 2;

    var sceneW = sceneRect.width;
    if (left + 200 > sceneW - 60) {
      left = Math.max(tapCenterX + gap + 12, sceneW * 0.38);
    }

    hint.style.left = left + 'px';
    hint.style.top = Math.max(8, top) + 'px';

    if (hint.hidden) {
      if (guideLine) guideLine.setAttribute('visibility', 'hidden');
      return;
    }

    if (guideLine) {
      var hintLeft = left;
      var hintMidY = top + hintH / 2;
      guideLine.setAttribute('x1', hintLeft);
      guideLine.setAttribute('y1', hintMidY);
      guideLine.setAttribute('x2', tapCenterX + 2);
      guideLine.setAttribute('y2', tapCenterY);
      guideLine.setAttribute('visibility', 'visible');
    }

    var pulse = document.getElementById('tap-hint-pulse');
    if (pulse && pulse.getAttribute('visibility') !== 'hidden') {
      var svg = document.querySelector('.lab-svg');
      if (svg) {
        var svgRect = svg.getBoundingClientRect();
        var vb = svg.viewBox.baseVal;
        var scaleX = vb.width / svgRect.width;
        var scaleY = vb.height / svgRect.height;
        var svgX = (tapCenterX - (svgRect.left - sceneRect.left)) * scaleX;
        var svgY = (tapCenterY - (svgRect.top - sceneRect.top)) * scaleY;
        pulse.setAttribute('cx', svgX);
        pulse.setAttribute('cy', svgY);
      }
    }
  }

  function initHint() {
    var dismissed = false;
    try {
      dismissed = localStorage.getItem('hkdse-titration-hint-dismissed') === '1';
    } catch (e) { /* ignore */ }

    var hint = document.getElementById('stopcock-hint');
    var pulse = document.getElementById('tap-hint-pulse');
    var dismissBtn = document.getElementById('hint-dismiss');

    if (dismissed) {
      if (hint) hint.hidden = true;
      if (pulse) pulse.setAttribute('visibility', 'hidden');
    } else {
      if (hint) hint.hidden = false;
      if (pulse) pulse.setAttribute('visibility', 'hidden');
      requestAnimationFrame(positionStopcockHint);
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', dismissHint);
    }

    window.addEventListener('resize', positionStopcockHint);
    requestAnimationFrame(function () {
      requestAnimationFrame(positionStopcockHint);
    });
  }

  function hideHintOnInteraction() {
    dismissHint();
  }

  function startHold() {
    stopHold();
    holdInterval = setInterval(function () {
      if (targetVol >= MAX_VOL) {
        stopHold();
        return;
      }
      targetVol = clampVol(targetVol + STEP * 3);
      startRenderLoop();
      triggerDrop();
    }, 45);
  }

  function stopHold() {
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }

  function bindEvents() {
    var tap = document.getElementById('burette-tap');
    var slider = document.getElementById('burette-slider');
    var stepBtn = document.getElementById('btn-step');
    var resetBtn = document.getElementById('btn-reset-vol');

    if (tap) {
      tap.addEventListener('click', function () {
        hideHintOnInteraction();
        if (targetVol < MAX_VOL) {
          addVolume(STEP);
          triggerDrop();
        }
      });
      tap.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        tap.setPointerCapture(e.pointerId);
        holdTimer = setTimeout(startHold, 280);
      });
      tap.addEventListener('pointerup', function () {
        clearTimeout(holdTimer);
        stopHold();
      });
      tap.addEventListener('pointerleave', function () {
        clearTimeout(holdTimer);
        stopHold();
      });
    }

    if (slider) {
      slider.addEventListener('pointerdown', function () {
        isDragging = true;
        startRenderLoop();
      });
      slider.addEventListener('input', function () {
        targetVol = clampVol(parseFloat(slider.value));
        startRenderLoop();
      });
      slider.addEventListener('pointerup', function () {
        isDragging = false;
        targetVol = clampVol(parseFloat(slider.value));
        startRenderLoop();
      });
      slider.addEventListener('pointercancel', function () {
        isDragging = false;
      });
    }

    if (stepBtn) {
      stepBtn.addEventListener('click', function () {
        if (targetVol < MAX_VOL) {
          addVolume(STEP);
          triggerDrop();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', reset);
    }
  }

  function init(callback) {
    onChange = callback;
    bindEvents();
    initHint();
    applyLiquidVisual(0);
    updateDisplays(0);
    requestAnimationFrame(positionStopcockHint);
  }

  function setNearEquivalence(isNear) {
    var tap = document.getElementById('burette-tap');
    if (tap) tap.classList.toggle('near-eq', isNear);
  }

  return {
    MAX_VOL: MAX_VOL,
    STEP: STEP,
    init: init,
    getVolume: getVolume,
    setAddedVolume: setAddedVolume,
    reset: reset,
    setNearEquivalence: setNearEquivalence,
    positionStopcockHint: positionStopcockHint
  };
})();
