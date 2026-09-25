/* HKDSE Metal Reactions Lab — Steam / Figure 3.3 setup 2D SVG scene */
var SteamScene = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  
  // Animation state
  var currentMetal = 'Mg';
  var currentStatusKey = 'ready';
  var isPlaying = false;
  var busy = false;
  
  // Timers
  var heatTimer = null;
  var reactTimer = null;
  var bubbleTimer = null;
  var doneTimer = null;
  var coolTimer = null;
  
  // Animation loop variables
  var steamParticles = [];
  var hydrogenBubbles = [];
  var rafId = null;
  var lastTickTime = null;

  function $(id) { return document.getElementById(id); }

  function updateLabel(statusKey) {
    currentStatusKey = statusKey;
    var nameEl = $('steam-label-name');
    var statusEl = $('steam-label-status');
    var bgEl = $('steam-status-bg');
    if (!nameEl || !statusEl || !bgEl) return;

    var lang = I18n.getLang();
    
    // Set metal name label
    if (METALS[currentMetal]) {
      nameEl.textContent = METALS[currentMetal].name[lang] || currentMetal;
    } else {
      nameEl.textContent = currentMetal;
    }

    // Translate status key
    var statusText = '';
    if (statusKey === 'ready') {
      statusText = lang === 'zh' ? '準備加熱' : 'Ready to heat';
    } else if (statusKey === 'heating') {
      statusText = lang === 'zh' ? '產生蒸汽中...' : 'Generating steam...';
    } else if (statusKey === 'reacting') {
      statusText = lang === 'zh' ? '與水蒸氣反應中' : 'Reacting with steam';
    } else if (statusKey === 'collecting') {
      statusText = lang === 'zh' ? '排水集氣中' : 'Collecting H₂ gas';
    } else if (statusKey === 'finished') {
      statusText = lang === 'zh' ? '實驗完成' : 'Finished';
    } else if (statusKey === 'noReaction') {
      statusText = lang === 'zh' ? '無反應' : 'No reaction';
    } else {
      statusText = statusKey;
    }
    statusEl.textContent = statusText;

    // Adjust container box width to fit the translated texts nicely
    adjustLabelWidth();
  }

  function adjustLabelWidth() {
    var nameEl = $('steam-label-name');
    var statusEl = $('steam-label-status');
    var bgEl = $('steam-status-bg');
    if (nameEl && statusEl && bgEl) {
      var nameWidth = nameEl.getComputedTextLength ? nameEl.getComputedTextLength() : 0;
      var statusWidth = statusEl.getComputedTextLength ? statusEl.getComputedTextLength() : 0;
      var maxTextWidth = Math.max(nameWidth, statusWidth);
      
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
      
      var rightAnchor = 480;
      var newX = rightAnchor - newWidth;
      
      bgEl.setAttribute('x', String(newX));
      bgEl.setAttribute('width', String(newWidth));
      
      nameEl.setAttribute('x', String(newX + padding));
      statusEl.setAttribute('x', String(newX + padding));
    }
  }

  function refreshLabel() {
    updateLabel(currentStatusKey);
    // Also translate labels inside the SVG
    var lang = I18n.getLang();
    var labels = {
      'steam-label-text-wool': { zh: '浸透水的玻璃棉', en: 'Glass-wool soaked in water' },
      'steam-label-text-sample': { zh: '金屬樣品', en: 'Metal sample' },
      'steam-label-text-burner': { zh: '本生燈', en: 'Burner' },
      'steam-label-text-stand': { zh: '鐵架台', en: 'Stand' },
      'steam-label-text-cork': { zh: '軟木塞', en: 'Cork' },
      'steam-label-text-tube': { zh: '導氣管', en: 'Delivery tube' },
      'steam-label-text-h2': { zh: '氫氣', en: 'Hydrogen' },
      'steam-label-text-water': { zh: '水', en: 'Water' }
    };
    for (var id in labels) {
      var el = $(id);
      if (el) el.textContent = labels[id][lang] || labels[id].zh;
    }
  }

  function setMetal(metalId) {
    currentMetal = metalId;
    resetAnimation();
  }

  function setBunsenFlame(state, color) {
    var outer = $('steam-bunsen-flame-outer');
    var mid = $('steam-bunsen-flame-mid');
    var inner = $('steam-bunsen-flame-inner');
    if (!outer || !mid || !inner) return;

    if (state === 'off') {
      outer.setAttribute('opacity', '0');
      mid.setAttribute('opacity', '0');
      inner.setAttribute('opacity', '0');
    } else {
      outer.setAttribute('opacity', '0.85');
      mid.setAttribute('opacity', '0.6');
      inner.setAttribute('opacity', '0.95');
      
      if (color) {
        outer.setAttribute('fill', color);
        mid.setAttribute('fill', color);
      } else {
        outer.setAttribute('fill', '#3b82f6');
        mid.setAttribute('fill', '#60a5fa');
      }
    }
  }

  function setReactionEffects(reacts, isVigorous, flameColor, glowing) {
    var glow = $('steam-reaction-glow');
    var reactionFlame = $('steam-reaction-flame');
    var metal = $('steam-metal-sample');
    
    if (glowing && reacts) {
      if (glow) glow.setAttribute('opacity', '0.8');
      if (metal && currentMetal === 'Mg') {
        metal.setAttribute('fill', '#ffffff'); // blinding hot Mg
      }
    } else {
      if (glow) glow.setAttribute('opacity', '0');
    }

    if (reactionFlame && reacts && flameColor) {
      reactionFlame.setAttribute('opacity', '0.85');
      reactionFlame.querySelectorAll('.reaction-flame-wisp').forEach(function (wisp) {
        wisp.setAttribute('fill', flameColor);
      });
    } else {
      if (reactionFlame) reactionFlame.setAttribute('opacity', '0');
    }
  }

  function spawnSteamParticle() {
    if (steamParticles.length > 20) return;
    steamParticles.push({
      x: 70,
      y: 170 + (Math.random() - 0.5) * 12,
      vx: 1.5 + Math.random() * 1.5,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3,
      alpha: 0.7 + Math.random() * 0.3
    });
  }

  function spawnBubble() {
    if (hydrogenBubbles.length > 30) return;
    hydrogenBubbles.push({
      x: 380 + (Math.random() - 0.5) * 6,
      y: 338,
      vy: -(1.0 + Math.random() * 1.2),
      r: 1.5 + Math.random() * 2,
      alpha: 0.9
    });
  }

  function tick(timestamp) {
    if (!lastTickTime) lastTickTime = timestamp;
    var dt = timestamp - lastTickTime;
    lastTickTime = timestamp;

    var container = $('steam-particle-layer');
    var bubbleContainer = $('steam-bubble-layer');
    if (!container || !bubbleContainer) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    // 1. Update steam particles inside test tube (glass-wool -> metal)
    container.innerHTML = '';
    // Only spawn steam if heating is active
    if (isPlaying && (currentStatusKey === 'heating' || currentStatusKey === 'reacting' || currentStatusKey === 'collecting')) {
      if (Math.random() < 0.35) {
        spawnSteamParticle();
      }
    }

    for (var i = steamParticles.length - 1; i >= 0; i--) {
      var p = steamParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.015;
      
      // Stop steam particles at metal sample or cork
      if (p.x > 140 && currentStatusKey === 'heating') {
        p.alpha -= 0.04; // Consume / fade at the metal sample before reaction starts
      }
      if (p.x > 225) {
        p.alpha = 0; // stop at cork
      }

      if (p.alpha <= 0) {
        steamParticles.splice(i, 1);
      } else {
        var circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('cx', String(p.x));
        circle.setAttribute('cy', String(p.y));
        circle.setAttribute('r', String(p.r));
        circle.setAttribute('fill', '#f1f5f9');
        circle.setAttribute('opacity', String(p.alpha * 0.4));
        container.appendChild(circle);
      }
    }

    // 2. Update hydrogen bubbles in water displacement
    bubbleContainer.innerHTML = '';
    for (var j = hydrogenBubbles.length - 1; j >= 0; j--) {
      var b = hydrogenBubbles[j];
      b.y += b.vy;
      
      // Stop bubbles when they hit the dynamic water column height inside inverted tube
      var waterColumnY = Number($('steam-water-column').getAttribute('y') || 145);
      if (b.y <= waterColumnY + 5) {
        b.alpha = 0; // Merges into gas
      }

      if (b.alpha <= 0) {
        hydrogenBubbles.splice(j, 1);
      } else {
        var bubble = document.createElementNS(NS, 'circle');
        bubble.setAttribute('cx', String(b.x));
        bubble.setAttribute('cy', String(b.y));
        bubble.setAttribute('r', String(b.r));
        bubble.setAttribute('fill', 'none');
        bubble.setAttribute('stroke', 'rgba(255, 255, 255, 0.75)');
        bubble.setAttribute('stroke-width', '0.5');
        bubble.setAttribute('opacity', String(b.alpha));
        bubbleContainer.appendChild(bubble);
      }
    }

    if (isPlaying) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function clearTimers() {
    if (heatTimer) { clearTimeout(heatTimer); heatTimer = null; }
    if (reactTimer) { clearTimeout(reactTimer); reactTimer = null; }
    if (bubbleTimer) { clearInterval(bubbleTimer); bubbleTimer = null; }
    if (doneTimer) { clearTimeout(doneTimer); doneTimer = null; }
    if (coolTimer) { clearTimeout(coolTimer); coolTimer = null; }
  }

  function resetAnimation() {
    clearTimers();
    isPlaying = false;
    busy = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastTickTime = null;
    steamParticles = [];
    hydrogenBubbles = [];

    // Reset SVG elements
    var waterColumn = $('steam-water-column');
    if (waterColumn) {
      waterColumn.setAttribute('y', '145');
      waterColumn.setAttribute('height', '198');
    }

    var metal = $('steam-metal-sample');
    if (metal) {
      metal.setAttribute('opacity', '1');
      if (METALS[currentMetal]) {
        metal.setAttribute('fill', METALS[currentMetal].stripColor || '#cbd5e1');
      } else {
        metal.setAttribute('fill', '#cbd5e1');
      }
    }

    var oxide = $('steam-oxide-layer');
    if (oxide) {
      oxide.setAttribute('opacity', '0');
    }

    var bubbleContainer = $('steam-bubble-layer');
    if (bubbleContainer) bubbleContainer.innerHTML = '';
    var particleContainer = $('steam-particle-layer');
    if (particleContainer) particleContainer.innerHTML = '';

    setBunsenFlame('off');
    setReactionEffects(false, false, null, false);
    
    var flashGlow = $('steam-reaction-glow');
    if (flashGlow) {
      flashGlow.removeAttribute('transform');
    }
    
    // Stop any general smoke particles
    if (typeof SmokeParticles !== 'undefined') {
      SmokeParticles.stop();
    }

    updateLabel('ready');
  }

  function play(result) {
    if (busy) return false;
    resetAnimation();
    
    isPlaying = true;
    busy = true;
    lastTickTime = null;
    rafId = requestAnimationFrame(tick);

    // Step 1: Start heating the glass-wool (representing water boiling)
    updateLabel('heating');
    setBunsenFlame('on', '#f59e0b'); // standard orange/blue roaring flame for steam gen

    var isReactive = result.reacts;
    var bubbleRate = result.visualEffects ? result.visualEffects.bubbleRate || 0 : 0;
    var flameOnWater = result.visualEffects ? result.visualEffects.flameOnWater : false;
    var flameColor = result.visualEffects ? result.visualEffects.flameColor : null;
    var whiteFlash = result.visualEffects ? result.visualEffects.whiteFlash : false;
    var depositColor = result.visualEffects ? result.visualEffects.depositColor : null;

    // Step 2: After 2 seconds of steam generation, it flows to the metal, reaction begins
    heatTimer = setTimeout(function () {
      heatTimer = null;
      
      if (isReactive) {
        updateLabel('reacting');
        
        // Show glowing/flame reaction effects on the metal
        setReactionEffects(true, flameOnWater, flameColor, true);

        if (whiteFlash) {
          // Magnesium blinding flash animation
          var flashGlow = $('steam-reaction-glow');
          if (flashGlow) {
            flashGlow.setAttribute('opacity', '1');
            flashGlow.setAttribute('transform', 'scale(1.5) translate(-45, -60)');
          }
        }

        // Start smoke at the metal sample region
        if (typeof SmokeParticles !== 'undefined') {
          SmokeParticles.start({
            containerId: 'steam-smoke-particles',
            originX: 135,
            originY: 180,
            filterId: 'smokeBlur',
            fillRgb: currentMetal === 'Mg' ? '255,255,255' : (currentMetal === 'Fe' ? '30,30,30' : '230,230,230'),
            opacityPeak: 0.4
          });
        }

        // Step 3: Start bubbling in the water trough and pushing water down (water displacement)
        reactTimer = setTimeout(function () {
          reactTimer = null;
          updateLabel('collecting');
          
          var maxDisplacementY = 245; // Water pushed down to this level
          var currentY = 145;
          var totalSteps = 100;
          var step = 0;
          
          // Bubble generator
          var intervalMs = Math.max(30, 200 - bubbleRate * 150);
          bubbleTimer = setInterval(function () {
            spawnBubble();
            
            // Push water down gradually
            if (step < totalSteps) {
              step++;
              var newY = 145 + (maxDisplacementY - 145) * (step / totalSteps);
              var waterColumn = $('steam-water-column');
              if (waterColumn) {
                waterColumn.setAttribute('y', String(newY));
                waterColumn.setAttribute('height', String(198 - (newY - 145)));
              }
            }
          }, intervalMs);

          // Step 4: Complete the reaction, transition metal to oxide, turn off flame and cool down
          doneTimer = setTimeout(function () {
            doneTimer = null;
            clearInterval(bubbleTimer);
            bubbleTimer = null;
            
            // Transition metal to oxide
            var oxide = $('steam-oxide-layer');
            var metal = $('steam-metal-sample');
            if (oxide) {
              oxide.setAttribute('opacity', '0.9');
              if (depositColor) {
                oxide.setAttribute('fill', depositColor);
              } else {
                oxide.setAttribute('fill', '#f8fafc'); // Default white oxide
              }
            }
            
            setBunsenFlame('off');
            setReactionEffects(false, false, null, false);
            if (typeof SmokeParticles !== 'undefined') {
              SmokeParticles.stop();
            }

            // Custom cool down step (Zinc oxide: yellow hot -> white cold)
            if (currentMetal === 'Zn') {
              coolTimer = setTimeout(function () {
                coolTimer = null;
                if (oxide) oxide.setAttribute('fill', '#f8fafc'); // white oxide
                updateLabel('finished');
                busy = false;
              }, 1500);
            } else {
              updateLabel('finished');
              busy = false;
            }

          }, 4500); // Collecting duration

        }, 1500); // Reacting duration before gas reaches trough

      } else {
        // No reaction (e.g. Copper or lower reactivity metals)
        updateLabel('noReaction');
        
        // Let burner heat for a total of 5s then turn off with no bubbles or gas collection
        reactTimer = setTimeout(function () {
          reactTimer = null;
          setBunsenFlame('off');
          updateLabel('finished');
          busy = false;
        }, 3000);
      }

    }, 2000); // 2 seconds steam gen delay

    return true;
  }

  function isBusy() {
    return busy;
  }

  function init() {
    refreshLabel();
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
