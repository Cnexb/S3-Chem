/* HKDSE Metal Reactions Lab — SVG splash on liquid contact */
var SplashFx = (function () {
  var NS = 'http://www.w3.org/2000/svg';

  function $(id) { return document.getElementById(id); }

  function play(opts) {
    var container = $(opts.containerId || 'beaker-splash-layer');
    if (!container) return;

    var x = opts.x != null ? opts.x : 210;
    var y = opts.y != null ? opts.y : 265;
    var i;
    var rings = [
      { rx: 14, ry: 5, delay: 0 },
      { rx: 20, ry: 7, delay: 40 },
      { rx: 10, ry: 4, delay: 20 }
    ];

    for (i = 0; i < rings.length; i++) {
      (function (ring, idx) {
        setTimeout(function () {
          var el = document.createElementNS(NS, 'ellipse');
          el.setAttribute('cx', String(x));
          el.setAttribute('cy', String(y));
          el.setAttribute('rx', String(ring.rx));
          el.setAttribute('ry', String(ring.ry));
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke', 'rgba(255,255,255,0.75)');
          el.setAttribute('stroke-width', '2');
          el.setAttribute('class', 'splash-ring');
          el.style.transformOrigin = x + 'px ' + y + 'px';
          container.appendChild(el);
          setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          }, 380);
        }, ring.delay);
      })(rings[i], i);
    }
  }

  function clear() {
    var container = $('beaker-splash-layer');
    if (container) container.innerHTML = '';
  }

  return { play: play, clear: clear };
})();
