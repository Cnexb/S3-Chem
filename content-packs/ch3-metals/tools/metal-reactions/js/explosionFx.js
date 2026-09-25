/* HKDSE Metal Reactions Lab — SVG explosion burst engine (BEAKER-style) */
var ExplosionFx = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var active = null;
  var rafId = null;
  var pausedByVisibility = false;
  var lastTickTime = null;
  var visibilityBound = false;

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
    if (!active) return;
    pausedByVisibility = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastTickTime = null;
  }

  function resumeFromVisibility() {
    if (!active || !pausedByVisibility) return;
    pausedByVisibility = false;
    if (!rafId) {
      lastTickTime = null;
      rafId = requestAnimationFrame(tick);
    }
  }

  function burst(opts) {
    bindVisibility();
    clear();
    var container = $(opts.containerId || 'oxygen-explosion-layer');
    if (!container) return;

    var x = opts.x != null ? opts.x : 200;
    var y = opts.y != null ? opts.y : 200;
    var intensity = opts.intensity != null ? opts.intensity : 0.9;
    var flameColor = opts.flameColor || '#fde047';
    var debrisColor = opts.debrisColor || '#f8fafc';
    var onComplete = opts.onComplete || null;
    var duration = 700 + intensity * 200;

    var flash = document.createElementNS(NS, 'circle');
    flash.setAttribute('cx', String(x));
    flash.setAttribute('cy', String(y));
    flash.setAttribute('r', String(8 + intensity * 12));
    flash.setAttribute('fill', '#ffffff');
    flash.setAttribute('opacity', '0.95');
    flash.setAttribute('filter', 'url(#smokeBlur)');
    container.appendChild(flash);

    var shock = document.createElementNS(NS, 'circle');
    shock.setAttribute('cx', String(x));
    shock.setAttribute('cy', String(y));
    shock.setAttribute('r', '4');
    shock.setAttribute('fill', 'none');
    shock.setAttribute('stroke', 'rgba(255,255,255,0.7)');
    shock.setAttribute('stroke-width', String(2 + intensity));
    shock.setAttribute('opacity', '0.8');
    container.appendChild(shock);

    var sparks = [];
    var sparkCount = Math.round(8 + intensity * 10);
    var i;
    for (i = 0; i < sparkCount; i++) {
      var angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
      var speed = (2.5 + Math.random() * 3.5) * intensity;
      var len = 4 + Math.random() * 8 * intensity;
      var x2 = x + Math.cos(angle) * len;
      var y2 = y + Math.sin(angle) * len;
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(x));
      line.setAttribute('y1', String(y));
      line.setAttribute('x2', String(x2));
      line.setAttribute('y2', String(y2));
      line.setAttribute('stroke', Math.random() > 0.4 ? flameColor : '#ffffff');
      line.setAttribute('stroke-width', String(1.5 + Math.random() * 2));
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0.9');
      container.appendChild(line);
      sparks.push({
        el: line,
        x1: x,
        y1: y,
        x2: x2,
        y2: y2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    }

    var debris = [];
    var debrisCount = Math.round(6 + intensity * 8);
    for (i = 0; i < debrisCount; i++) {
      var dAngle = Math.random() * Math.PI * 2;
      var dSpeed = (1.5 + Math.random() * 2.5) * intensity;
      var w = 2 + Math.random() * 4;
      var h = 2 + Math.random() * 5;
      var rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', String(x - w / 2));
      rect.setAttribute('y', String(y - h / 2));
      rect.setAttribute('width', String(w));
      rect.setAttribute('height', String(h));
      rect.setAttribute('fill', Math.random() > 0.5 ? debrisColor : flameColor);
      rect.setAttribute('opacity', '0.85');
      rect.setAttribute('rx', '1');
      container.appendChild(rect);
      debris.push({
        el: rect,
        x: x,
        y: y,
        vx: Math.cos(dAngle) * dSpeed,
        vy: Math.sin(dAngle) * dSpeed - 1.5 * intensity,
        w: w,
        h: h,
        rot: Math.random() * 360
      });
    }

    active = {
      container: container,
      flash: flash,
      shock: shock,
      sparks: sparks,
      debris: debris,
      age: 0,
      duration: duration,
      intensity: intensity,
      flashBaseR: 8 + intensity * 12,
      onComplete: onComplete,
      done: false
    };
    pausedByVisibility = document.hidden;
    lastTickTime = null;
    if (!pausedByVisibility) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    if (!active || pausedByVisibility) return;
    if (lastTickTime == null) lastTickTime = now;
    var dt = Math.min(50, now - lastTickTime);
    lastTickTime = now;
    active.age += dt;
    var t = active.age / active.duration;
    var flashT = Math.min(1, active.age / 80);
    var flashScale = 1 + flashT * (2.5 + active.intensity * 2);
    active.flash.setAttribute('r', String(active.flashBaseR * flashScale));
    active.flash.setAttribute('opacity', String(Math.max(0, 0.95 * (1 - flashT))));

    var shockR = 4 + t * (40 + active.intensity * 35);
    active.shock.setAttribute('r', String(shockR));
    active.shock.setAttribute('opacity', String(Math.max(0, 0.8 * (1 - t * 1.2))));

    var dtFactor = dt / 16;
    var i;
    for (i = 0; i < active.sparks.length; i++) {
      var s = active.sparks[i];
      s.vx *= Math.pow(0.96, dtFactor);
      s.vy *= Math.pow(0.96, dtFactor);
      s.vy += 0.08 * dtFactor;
      s.x1 += s.vx * dtFactor;
      s.y1 += s.vy * dtFactor;
      s.x2 += s.vx * dtFactor;
      s.y2 += s.vy * dtFactor;
      s.el.setAttribute('x1', String(s.x1));
      s.el.setAttribute('y1', String(s.y1));
      s.el.setAttribute('x2', String(s.x2));
      s.el.setAttribute('y2', String(s.y2));
      s.el.setAttribute('opacity', String(Math.max(0, 0.9 * (1 - t))));
    }

    for (i = 0; i < active.debris.length; i++) {
      var d = active.debris[i];
      d.vx *= Math.pow(0.97, dtFactor);
      d.vy += 0.12 * dtFactor;
      d.x += d.vx * dtFactor;
      d.y += d.vy * dtFactor;
      d.rot += d.vx * 2 * dtFactor;
      d.el.setAttribute('x', String(d.x - d.w / 2));
      d.el.setAttribute('y', String(d.y - d.h / 2));
      d.el.setAttribute('transform', 'rotate(' + d.rot + ' ' + d.x + ' ' + d.y + ')');
      d.el.setAttribute('opacity', String(Math.max(0, 0.85 * (1 - t * 0.9))));
    }

    if (active.age >= active.duration) {
      finishBurst();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function finishBurst() {
    if (!active || active.done) return;
    active.done = true;
    var cb = active.onComplete;
    clear();
    if (cb) cb();
  }

  function clear() {
    pausedByVisibility = false;
    lastTickTime = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (active && active.container) {
      active.container.innerHTML = '';
    }
    active = null;
  }

  function isActive() {
    return active !== null;
  }

  return { burst: burst, clear: clear, isActive: isActive };
})();
