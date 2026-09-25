/* HKDSE Metal Reactions Lab — Oxygen / Bunsen burner scene */

/* HKDSE Metal Reactions Lab — Oxygen / Bunsen burner scene sparks */
var OxygenSparks = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var MAX_PARTICLES = 250;
  var particles = [];
  var rafId = null;
  var spawnTimer = null;
  var running = false;
  var pausedByVisibility = false;
  var lastTickTime = null;
  var visibilityBound = false;
  var containerId = 'oxygen-sparks';

  function $(id) { return document.getElementById(id); }

  function bindVisibility() {
    if (visibilityBound) return;
    visibilityBound = true;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        pauseForVisibility();
      } else {
        resumeFromVisibility();
      }
    });
  }

  function pauseForVisibility() {
    if (!running) return;
    pausedByVisibility = true;
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastTickTime = null;
  }

  function resumeFromVisibility() {
    if (!running || !pausedByVisibility) return;
    pausedByVisibility = false;
    if (!spawnTimer) {
      spawnTimer = setInterval(function () {
        if (running && !pausedByVisibility) {
          var count = Math.floor(Math.random() * 3) + 2; // 2 to 4 main sparks per interval
          for (var i = 0; i < count; i++) {
            spawnMainParticle();
          }
        }
      }, 25); // Faster spawn interval (25ms) for highly vigorous rate
    }
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function createLineElement(color, strokeWidth, opacity) {
    var el = document.createElementNS(NS, 'line');
    el.setAttribute('stroke', color);
    el.setAttribute('stroke-width', String(strokeWidth));
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('opacity', String(opacity));
    return el;
  }

  function spawnStreak(x, y, vx, vy, life, canBranch) {
    if (particles.length >= MAX_PARTICLES) return;
    var container = $(containerId);
    if (!container || !running || pausedByVisibility) return;

    var glowColor = ['#fbbf24', '#f59e0b', '#f97316'][Math.floor(Math.random() * 3)];
    var coreColor = '#ffffff';

    var glowWidth = 2.5 + Math.random() * 1.5;
    var coreWidth = 0.8 + Math.random() * 0.4;

    var elGlow = createLineElement(glowColor, glowWidth, 0.75);
    var elCore = createLineElement(coreColor, coreWidth, 1.0);

    container.appendChild(elGlow);
    container.appendChild(elCore);

    var p = {
      type: 'streak',
      x: x,
      y: y,
      xPrev: x,
      yPrev: y,
      vx: vx,
      vy: vy,
      age: 0,
      life: life,
      gravity: 0.012 + Math.random() * 0.012, // slightly lighter gravity for further reach
      decay: 0.965 + Math.random() * 0.015, // less speed decay so they fly extremely fast
      canBranch: canBranch,
      elGlow: elGlow,
      elCore: elCore
    };

    particles.push(p);
  }

  function spawnStreakBranch(x, y, vx, vy, life) {
    if (particles.length >= MAX_PARTICLES) return;
    var container = $(containerId);
    if (!container || !running || pausedByVisibility) return;

    var glowColor = Math.random() < 0.65 ? '#f97316' : '#ef4444';
    var coreColor = '#fbbf24';

    var glowWidth = 1.8 + Math.random() * 1.0;
    var coreWidth = 0.6 + Math.random() * 0.3;

    var elGlow = createLineElement(glowColor, glowWidth, 0.85);
    var elCore = createLineElement(coreColor, coreWidth, 1.0);

    container.appendChild(elGlow);
    container.appendChild(elCore);

    var p = {
      type: 'branch',
      x: x,
      y: y,
      xPrev: x,
      yPrev: y,
      vx: vx,
      vy: vy,
      age: 0,
      life: life,
      gravity: 0.02 + Math.random() * 0.02,
      decay: 0.94 + Math.random() * 0.02,
      elGlow: elGlow,
      elCore: elCore
    };

    particles.push(p);
  }

  function spawnPuff(x, y, vx, vy, rStart, rEnd, life) {
    if (particles.length >= MAX_PARTICLES) return;
    var container = $(containerId);
    if (!container || !running || pausedByVisibility) return;

    var el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', String(x));
    el.setAttribute('cy', String(y));
    el.setAttribute('r', String(rStart));
    el.setAttribute('fill', 'url(#burnGlow)');
    el.setAttribute('opacity', '0.8');

    container.appendChild(el);

    var p = {
      type: 'puff',
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      age: 0,
      life: life,
      rStart: rStart,
      rEnd: rEnd,
      el: el
    };

    particles.push(p);
  }

  function spawnMainParticle() {
    var px = 7 + (Math.random() - 0.5) * 6;
    var py = -2 + (Math.random() - 0.5) * 4;

    var angle = Math.random() * Math.PI * 2;
    var speed = 2.4 + Math.random() * 4.2; // Shoots out faster (was 1.8 to 3.2)

    var vx = Math.cos(angle) * speed;
    var vy = Math.sin(angle) * speed - 0.6; // slightly stronger vertical draft bias
    var life = 400 + Math.random() * 450; // Lives longer to extend the bursts (was 350 to 350)

    var canBranch = Math.random() < 0.7; // slightly higher branching probability for density

    spawnStreak(px, py, vx, vy, life, canBranch);

    if (Math.random() < 0.55) { // more frequent core puffs
      spawnPuff(px, py, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2 - 0.1, 2.0, 7.0, 450 + Math.random() * 200);
    }
  }

  function spawnBranchBurst(x, y, parentVx, parentVy) {
    // Larger fluffy burst explosion puff
    spawnPuff(x, y, parentVx * 0.1, parentVy * 0.1, 2.0, 8.0, 350 + Math.random() * 150);

    var count = 4 + Math.floor(Math.random() * 4); // Spawns 4 to 7 branches for extremely full burst (was 3 to 5)
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 1.2 + Math.random() * 1.8; // Shoots out faster from the burst point (was 0.8 to 1.4)

      var vx = parentVx * 0.25 + Math.cos(angle) * speed;
      var vy = parentVy * 0.25 + Math.sin(angle) * speed;

      var life = 220 + Math.random() * 220; // branch life slightly extended
      spawnStreakBranch(x, y, vx, vy, life);
    }
  }

  function tick(now) {
    if (!running || pausedByVisibility) return;
    if (lastTickTime == null) lastTickTime = now;
    var dt = Math.min(50, now - lastTickTime);
    lastTickTime = now;

    var dtFactor = dt / 16;
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.age += dt;

      var t = p.age / p.life;
      if (t >= 1) {
        if (p.type === 'puff') {
          if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
        } else {
          if (p.elGlow && p.elGlow.parentNode) p.elGlow.parentNode.removeChild(p.elGlow);
          if (p.elCore && p.elCore.parentNode) p.elCore.parentNode.removeChild(p.elCore);
        }

        if (p.type === 'streak' && p.canBranch) {
          spawnBranchBurst(p.x, p.y, p.vx, p.vy);
        }

        particles.splice(i, 1);
        continue;
      }

      if (p.type === 'puff') {
        p.x += p.vx * dtFactor;
        p.y += p.vy * dtFactor;

        var currentRadius = p.rStart + (p.rEnd - p.rStart) * t;
        p.el.setAttribute('cx', String(p.x));
        p.el.setAttribute('cy', String(p.y));
        p.el.setAttribute('r', String(currentRadius));
        p.el.setAttribute('opacity', String(0.8 * (1 - t)));
      } else {
        p.xPrev = p.x;
        p.yPrev = p.y;

        p.vx *= Math.pow(p.decay, dtFactor);
        p.vy *= Math.pow(p.decay, dtFactor);
        p.vy += p.gravity * dtFactor;

        p.x += p.vx * dtFactor;
        p.y += p.vy * dtFactor;

        p.elGlow.setAttribute('x1', String(p.xPrev));
        p.elGlow.setAttribute('y1', String(p.yPrev));
        p.elGlow.setAttribute('x2', String(p.x));
        p.elGlow.setAttribute('y2', String(p.y));
        p.elGlow.setAttribute('opacity', String(0.8 * (1 - t)));

        p.elCore.setAttribute('x1', String(p.xPrev));
        p.elCore.setAttribute('y1', String(p.yPrev));
        p.elCore.setAttribute('x2', String(p.x));
        p.elCore.setAttribute('y2', String(p.y));
        p.elCore.setAttribute('opacity', String(1.0 - t));
      }
    }

    if (particles.length === 0 && !spawnTimer) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    bindVisibility();
    clear();
    running = true;
    pausedByVisibility = document.hidden;
    lastTickTime = null;

    var container = $(containerId);
    if (container) {
      container.setAttribute('opacity', '1');
      container.innerHTML = '';
    }

    for (var i = 0; i < 15; i++) {
      spawnMainParticle();
    }

    spawnTimer = setInterval(function () {
      if (running && !pausedByVisibility) {
        var count = Math.floor(Math.random() * 3) + 2;
        for (var i = 0; i < count; i++) {
          spawnMainParticle();
        }
      }
    }, 25);

    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
  }

  function clear() {
    stop();
    running = false;
    pausedByVisibility = false;
    lastTickTime = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    var container = $(containerId);
    if (container) {
      container.setAttribute('opacity', '0');
      container.innerHTML = '';
    }
    particles = [];
  }

  return {
    start: start,
    stop: stop,
    clear: clear
  };
})();

var OxygenScene = (function () {
  var isHeating = false;
  var currentMetal = 'Mg';
  var currentStatusKey = 'ready';
  var flameLabelExtra = null;
  var oxideTimer = null;
  var approachTimer = null;
  var explosionTimer = null;
  var effects = {};
  var TONGS_HEATING = { x: 248, y: 118 };
  var SAMPLE_OFFSET = { x: 0, y: 55 };
  var APPROACH_MS = 900;
  var EXPLOSION_FLASH_MS = 350;

  function $(id) { return document.getElementById(id); }

  function getMetalNameText(metalId) {
    var lang = I18n.getLang();
    return getMetalLabel(metalId, lang);
  }

  function getStatusText(statusKey) {
    var base = I18n.t('oxygen.status.' + statusKey);
    if (statusKey === 'burning' && flameLabelExtra) {
      var lang = I18n.getLang();
      var extra = flameLabelExtra[lang] || flameLabelExtra.en || '';
      if (extra) {
        return base + ' — ' + extra;
      }
    }
    if (statusKey === 'formingOxide' && currentMetal === 'Zn') {
      var lang = I18n.getLang();
      if (lang === 'zh' || lang === 'zh-HK') {
        return '形成氧化物（熱時呈黃色）';
      } else {
        return 'Forming oxide in yellow when hot';
      }
    }
    if (statusKey === 'formingOxide' && currentMetal === 'Pb') {
      var lang = I18n.getLang();
      if (lang === 'zh' || lang === 'zh-HK') {
        return '形成氧化物（熱時呈橙色）';
      } else {
        return 'Forming oxide in orange when hot';
      }
    }
    return base;
  }

  function updateLabel(statusKey) {
    if (statusKey) currentStatusKey = statusKey;
    var nameEl = $('oxygen-label-name');
    var statusEl = $('oxygen-label-status');
    if (nameEl) nameEl.textContent = getMetalNameText(currentMetal);
    if (statusEl) statusEl.textContent = getStatusText(currentStatusKey);
    
    // Dynamic width and position adjustment to prevent text clipping/overflow
    var bgEl = document.querySelector('#oxygen-status-label rect');
    if (bgEl && nameEl && statusEl) {
      // Measure actual text widths
      var nameWidth = nameEl.getComputedTextLength ? nameEl.getComputedTextLength() : 0;
      var statusWidth = statusEl.getComputedTextLength ? statusEl.getComputedTextLength() : 0;
      var maxTextWidth = Math.max(nameWidth, statusWidth);
      
      // Fallback for browsers/environments where text rendering sizes aren't immediately available
      if (maxTextWidth === 0) {
        var nameText = nameEl.textContent || '';
        var statusText = statusEl.textContent || '';
        var estimateLen = function(str) {
          var w = 0;
          for (var i = 0; i < str.length; i++) {
            w += str.charCodeAt(i) > 255 ? 13 : 7.2;
          }
          return w;
        };
        maxTextWidth = Math.max(estimateLen(nameText), estimateLen(statusText));
      }
      
      var padding = 12;
      var newWidth = maxTextWidth + padding * 2;
      newWidth = Math.max(140, newWidth);
      
      // Keep the right edge of the status box anchored at x = 460
      var rightAnchor = 460;
      var newX = rightAnchor - newWidth;
      
      bgEl.setAttribute('x', String(newX));
      bgEl.setAttribute('width', String(newWidth));
      
      nameEl.setAttribute('x', String(newX + padding));
      statusEl.setAttribute('x', String(newX + padding));
    }
  }

  function refreshLabel() {
    updateLabel(currentStatusKey);
  }

  function clearOxideTimer() {
    if (oxideTimer) {
      clearTimeout(oxideTimer);
      oxideTimer = null;
    }
  }

  function clearApproachTimer() {
    if (approachTimer) {
      clearTimeout(approachTimer);
      approachTimer = null;
    }
  }

  function clearExplosionTimer() {
    if (explosionTimer) {
      clearTimeout(explosionTimer);
      explosionTimer = null;
    }
  }

  function setTongsPosition(mode) {
    var assembly = $('oxygen-tongs-assembly');
    if (!assembly) return;
    assembly.classList.remove('tongs-ready', 'tongs-heating');
    assembly.classList.add(mode === 'heating' ? 'tongs-heating' : 'tongs-ready');
  }

  function getMetalCenter() {
    return {
      x: TONGS_HEATING.x + SAMPLE_OFFSET.x + 7,
      y: TONGS_HEATING.y + SAMPLE_OFFSET.y - 2
    };
  }

  function getSmokeOrigin() {
    return {
      x: TONGS_HEATING.x + SAMPLE_OFFSET.x + 7,
      y: TONGS_HEATING.y + SAMPLE_OFFSET.y - 5
    };
  }

  function hideMetalStrip() {
    var strip = $('oxygen-metal-strip');
    var powder = $('oxygen-powder-layer');
    if (strip) strip.setAttribute('opacity', '0');
    if (powder) powder.setAttribute('opacity', '0');
  }

  function showMetalStrip() {
    var strip = $('oxygen-metal-strip');
    var powder = $('oxygen-powder-layer');
    if (strip) {
      strip.setAttribute('opacity', '1');
      if (METALS[currentMetal]) strip.setAttribute('fill', METALS[currentMetal].stripColor);
    }
    if (powder) powder.setAttribute('opacity', '0');
  }

  function setReactionFlameColor(color) {
    var group = $('oxygen-reaction-flame');
    if (!group) return;
    var fill = color || '#fbbf24';
    group.querySelectorAll('.reaction-flame-wisp').forEach(function (path) {
      path.setAttribute('fill', fill);
    });
  }

  // Dynamic extension of Bunsen flame to connect with the metal piece on fire
  function setBunsenFlameState(isStretched, color) {
    var outer = $('bunsen-flame-outer');
    var mid = $('bunsen-flame-mid');
    var inner = $('bunsen-flame-inner');
    if (!outer || !mid || !inner) return;

    if (isStretched === 'off') {
      // Turn off/hide the Bunsen burner flame completely
      outer.setAttribute('opacity', '0');
      mid.setAttribute('opacity', '0');
      inner.setAttribute('opacity', '0');
    } else if (isStretched) {
      // 1. Morph to curved, asymmetric paths that sweep left and completely engulf the metal strip (centered at x=255, y=173~245)
      // Height extends straight up to y = 90, above the metal's top (y=173)
      outer.setAttribute('d', 'M 260 267 C 236 250 232 180 255 90 C 278 180 274 250 260 267 Z');
      mid.setAttribute('d', 'M 260 267 C 242 250 238 190 255 120 C 272 190 268 250 260 267 Z');
      inner.setAttribute('d', 'M 260 267 C 248 255 244 200 255 150 C 266 200 262 255 260 267 Z');
      
      // 2. Set dynamic colors inside the transition gradient
      var stop0 = $('stretched-stop-0');
      var stop1 = $('stretched-stop-1');
      var stop2 = $('stretched-stop-2');
      var stop3 = $('stretched-stop-3');
      if (stop0 && stop1 && stop2 && stop3) {
        if (color) {
          stop0.setAttribute('stop-color', color);
          stop1.setAttribute('stop-color', color);
          stop2.setAttribute('stop-color', color);
          stop3.setAttribute('stop-color', color);
        } else {
          // No characteristic flame color (blue Bunsen flame):
          stop0.setAttribute('stop-color', '#1d4ed8');
          stop1.setAttribute('stop-color', '#2563eb');
          stop2.setAttribute('stop-color', '#60a5fa');
          stop3.setAttribute('stop-color', '#93c5fd');
        }
      }
      
      // Apply the connected dynamic gradient to outer and mid layers
      outer.setAttribute('fill', 'url(#stretchedFlameGrad)');
      mid.setAttribute('fill', 'url(#stretchedFlameGrad)');
      
      if (color) {
        inner.setAttribute('fill', '#ffffff'); // high-temperature white inner core at the very bottom
      } else {
        inner.setAttribute('fill', 'url(#flameInner)'); // use standard inner blue flame
      }
      
      outer.setAttribute('opacity', '0.85');
      mid.setAttribute('opacity', '0.65');
      inner.setAttribute('opacity', '0.95');
    } else {
      // Revert to default non-luminous high temperature blue flame
      outer.setAttribute('d', 'M 260 267 C 242 245 245 210 260 180 C 275 210 278 245 260 267 Z');
      mid.setAttribute('d', 'M 260 267 C 248 250 250 220 260 198 C 270 220 272 250 260 267 Z');
      inner.setAttribute('d', 'M 260 267 C 253 255 254 235 260 218 C 266 235 267 255 260 267 Z');
      
      outer.setAttribute('fill', 'url(#flameOuter)');
      mid.setAttribute('fill', '#60a5fa');
      inner.setAttribute('fill', 'url(#flameInner)');
      
      outer.setAttribute('opacity', '0.85');
      mid.setAttribute('opacity', '0.6');
      inner.setAttribute('opacity', '0.95');
    }
  }

  function hideReactionEffects() {
    var glow = $('oxygen-reaction-glow');
    var flame = $('oxygen-reaction-flame');
    if (glow) glow.setAttribute('opacity', '0');
    if (flame) flame.setAttribute('opacity', '0');
    SmokeParticles.clear();
    OxygenSparks.clear();
  }

  function triggerExplosion(fx, onDone) {
    var center = getMetalCenter();
    hideMetalStrip();
    ExplosionFx.burst({
      containerId: 'oxygen-explosion-layer',
      x: center.x,
      y: center.y,
      intensity: fx.explosionIntensity || 0.9,
      flameColor: fx.explosionColor || fx.flameColor || '#fde047',
      debrisColor: fx.debrisColor || '#f8fafc',
      onComplete: onDone || null
    });
  }

  function setMetal(metalId) {
    currentMetal = metalId;
    flameLabelExtra = null;
    var strip = $('oxygen-metal-strip');
    if (strip && METALS[metalId]) {
      strip.setAttribute('fill', METALS[metalId].stripColor);
    }
    resetAnimation();
  }

  function resetAnimation() {
    isHeating = false;
    effects = {};
    flameLabelExtra = null;
    clearOxideTimer();
    clearApproachTimer();
    clearExplosionTimer();
    hideReactionEffects();
    ExplosionFx.clear();
    setTongsPosition('ready');
    showMetalStrip();
    var sparks = $('oxygen-sparks');
    if (sparks) sparks.setAttribute('opacity', '0');
    setBunsenFlameState(false); // Reset Bunsen burner to standard blue flame
    updateLabel('ready');
  }

  function applyEffects(fx, reacts) {
    effects = fx || {};
    isHeating = !!reacts;
    clearOxideTimer();
    clearExplosionTimer();

    var sparks = $('oxygen-sparks');
    var glow = $('oxygen-reaction-glow');
    var flame = $('oxygen-reaction-flame');
    var strip = $('oxygen-metal-strip');
    var powder = $('oxygen-powder-layer');

    if (!isHeating) {
      hideReactionEffects();
      if (sparks) sparks.setAttribute('opacity', '0');
      updateLabel('noReaction');
      return;
    }

    flameLabelExtra = effects.flameLabel || null;
    updateLabel('burning');

    var flameColor = effects.flameColor || null;
    // We rely entirely on the morphed and color-graduated Bunsen burner flame to engulf the metal piece
    setBunsenFlameState(true, flameColor); 

    if (glow) {
      glow.setAttribute('opacity', String(0.45 + (effects.glowIntensity || 0) * 0.25));
    }
    // oxygen-reaction-flame remains at opacity 0 to prevent dual overlapping weird flames

    if (effects.explosive) {
      // Show the realistic flame first (label: burning) for about 2.5 seconds
      updateLabel('burning');
      explosionTimer = setTimeout(function () {
        explosionTimer = null;
        updateLabel('exploded');
        setBunsenFlameState(false); // Reset Bunsen flame to blue during explosion
        triggerExplosion(effects, function () {
          var origin = getSmokeOrigin();
          SmokeParticles.start({ originX: origin.x, originY: origin.y, filterId: 'smokeBlur' });
          updateLabel('formingOxide');
        });
        if (glow) glow.setAttribute('opacity', '0');
        if (flame) flame.setAttribute('opacity', '0');
      }, 2500); // 2.5 seconds burning delay before explosion
      return;
    }

    var origin = getSmokeOrigin();
    SmokeParticles.start({ originX: origin.x, originY: origin.y, filterId: 'smokeBlur' });

    if (effects.spark) {
      OxygenSparks.start();
    } else {
      OxygenSparks.clear();
    }

    if (strip) {
      if (effects.powderHotColor) {
        strip.setAttribute('fill', effects.powderHotColor);
      }
      var oxideDelay = (currentMetal === 'K' || currentMetal === 'Na' || currentMetal === 'Ca') ? 2500 : 1200;
      oxideTimer = setTimeout(function () {
        OxygenSparks.stop();
        // High-temperature Phase (First oxide appearance)
        var hotColor = effects.powderHotColor || effects.powderColor;
        if (strip) {
          strip.setAttribute('fill', hotColor);
        }
        if (powder) {
          powder.setAttribute('fill', hotColor);
          powder.setAttribute('opacity', '0.85');
        }
        
        // Custom animation step for Zinc and Lead:
        // After oxides are formed for 1.5s, turn off Bunsen flame and cool down oxides (Zinc: yellow -> white; Lead: orange -> yellow)
        if (currentMetal === 'Zn' || currentMetal === 'Pb') {
          setBunsenFlameState(false); // First revert Bunsen burner flame to blue
          updateLabel('formingOxide');
          
          // Set a second timer after 1.5 seconds of forming hot oxide
          oxideTimer = setTimeout(function () {
            oxideTimer = null;
            setBunsenFlameState('off'); // Turn off/disappear the Bunsen burner flame completely
            
            // Cool down transition:
            // Zinc oxide: hot yellow (#ffea00) -> cold white (#f8fafc)
            // Lead oxide: hot orange (#ff8c00) -> cold yellow (#ffff00)
            var finalCoolColor = currentMetal === 'Zn' ? '#f8fafc' : '#ffff00';
            
            if (strip) {
              strip.setAttribute('fill', finalCoolColor);
            }
            if (powder) {
              powder.setAttribute('fill', finalCoolColor);
            }
            
            // Clear glowing reaction effects
            hideReactionEffects();
            if (sparks) sparks.setAttribute('opacity', '0');
            
            // Optional: update label to show cooling/cooled status
            var lang = I18n.getLang();
            var statusEl = $('oxygen-label-status');
            if (statusEl) {
              if (currentMetal === 'Zn') {
                statusEl.textContent = (lang === 'zh' || lang === 'zh-HK') ? '氧化物冷卻：變為白色' : 'Oxide cooled: turns white';
              } else {
                statusEl.textContent = (lang === 'zh' || lang === 'zh-HK') ? '氧化物冷卻：變為黃色' : 'Oxide cooled: turns yellow';
              }
            }
          }, 1500);
        } else {
          // Normal flow for other metals
          setBunsenFlameState(false); // Revert Bunsen burner flame to blue
          updateLabel('formingOxide');
        }
      }, oxideDelay);
    }
  }

  function play(result) {
    clearApproachTimer();
    hideReactionEffects();
    setTongsPosition('heating');
    approachTimer = setTimeout(function () {
      approachTimer = null;
      applyEffects(result.visualEffects, result.reacts);
    }, APPROACH_MS);
    return true;
  }

  function isBusy() {
    return !!(approachTimer || explosionTimer || ExplosionFx.isActive());
  }

  function init() {
    setMetal(currentMetal);
  }

  return {
    init: init,
    setMetal: setMetal,
    resetAnimation: resetAnimation,
    play: play,
    refreshLabel: refreshLabel,
    isBusy: isBusy
  };
})();
