/* HKDSE Metal Reactions Lab — SVG smoke particle engine */
var SmokeParticles = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var MAX_PARTICLES = 24;
  var particles = [];
  var rafId = null;
  var spawnTimer = null;
  var running = false;
  var pausedByVisibility = false;
  var lastTickTime = null;
  var visibilityBound = false;
  var config = {};

  function $(id) { return document.getElementById(id); }

  function resetConfig() {
    config = {
      containerId: 'oxygen-smoke-particles',
      originX: 200,
      originY: 172,
      filterId: 'smokeBlur',
      fillRgb: '235,235,235',
      opacityPeak: 0.38,
      spawnIntervalMin: 140,
      spawnIntervalRange: 60
    };
  }

  function getSpawnDelay() {
    return config.spawnIntervalMin + Math.random() * config.spawnIntervalRange;
  }

  function applyContainerFilter(container) {
    if (!container) return;
    container.setAttribute('filter', 'url(#' + config.filterId + ')');
  }

  function clearContainerFilter(container) {
    if (!container) return;
    container.removeAttribute('filter');
  }

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
        if (running && !pausedByVisibility) spawnParticle();
      }, getSpawnDelay());
    }
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function spawnParticle() {
    if (particles.length >= MAX_PARTICLES) return;
    var container = $(config.containerId);
    if (!container || !running || pausedByVisibility) return;

    var rx = 4 + Math.random() * 5;
    var ry = 3 + Math.random() * 6;
    var el = document.createElementNS(NS, 'ellipse');
    el.setAttribute('cx', '0');
    el.setAttribute('cy', '0');
    el.setAttribute('rx', String(rx));
    el.setAttribute('ry', String(ry));
    el.setAttribute('fill', 'rgba(' + config.fillRgb + ',' + (config.opacityPeak * 0.9) + ')');

    var p = {
      el: el,
      x: config.originX + (Math.random() - 0.5) * 12,
      y: config.originY,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.45 - Math.random() * 0.35,
      rx: rx,
      ry: ry,
      age: 0,
      life: 2200 + Math.random() * 1200,
      drift: (Math.random() - 0.5) * 0.02
    };
    particles.push(p);
    container.appendChild(el);
  }

  function tick(now) {
    if (!running || pausedByVisibility) return;
    if (lastTickTime == null) lastTickTime = now;
    var dt = Math.min(50, now - lastTickTime);
    lastTickTime = now;

    var i;
    for (i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.age += dt;
      p.vx += p.drift * (dt / 16);
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      var t = p.age / p.life;
      var opacity = Math.max(0, config.opacityPeak * (1 - t * t));
      var scale = 1 + t * 2.2;
      var ryScale = scale * (1 + t * 0.4);
      p.el.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ') scale(' + scale + ',' + ryScale + ')');
      p.el.setAttribute('fill', 'rgba(' + config.fillRgb + ',' + opacity + ')');
      if (p.age >= p.life) {
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
        particles.splice(i, 1);
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (spawnTimer) return;
    spawnParticle();
    spawnTimer = setInterval(function () {
      if (running && !pausedByVisibility) spawnParticle();
    }, getSpawnDelay());
    if (!rafId && !pausedByVisibility) {
      lastTickTime = null;
      rafId = requestAnimationFrame(tick);
    }
  }

  function start(opts) {
    bindVisibility();
    resetConfig();
    if (opts) {
      if (opts.containerId) config.containerId = opts.containerId;
      if (opts.originX != null) config.originX = opts.originX;
      if (opts.originY != null) config.originY = opts.originY;
      if (opts.filterId) config.filterId = opts.filterId;
      if (opts.fillRgb) config.fillRgb = opts.fillRgb;
      if (opts.opacityPeak != null) config.opacityPeak = opts.opacityPeak;
      if (opts.spawnIntervalMin != null) config.spawnIntervalMin = opts.spawnIntervalMin;
      if (opts.spawnIntervalRange != null) config.spawnIntervalRange = opts.spawnIntervalRange;
    }
    var container = $(config.containerId);
    applyContainerFilter(container);
    if (running) return;
    running = true;
    pausedByVisibility = document.hidden;
    startLoop();
  }

  function stop() {
    running = false;
    pausedByVisibility = false;
    lastTickTime = null;
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function clear() {
    stop();
    var i;
    for (i = particles.length - 1; i >= 0; i--) {
      if (particles[i].el.parentNode) {
        particles[i].el.parentNode.removeChild(particles[i].el);
      }
    }
    particles = [];
    var container = $(config.containerId);
    if (container) {
      container.innerHTML = '';
      clearContainerFilter(container);
    }
  }

  resetConfig();
  return { start: start, stop: stop, clear: clear };
})();
