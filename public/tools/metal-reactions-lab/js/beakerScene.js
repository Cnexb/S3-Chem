/* HKDSE Metal Reactions Lab — Beaker / solution 3D scene */
var BeakerScene = (function () {
  // NS and some original constants kept for compatibility
  var currentMetal = 'Zn';
  var currentSolution = 'cold_water';
  
  // 3D Scene Variables
  var container = null;
  var scene = null;
  var camera = null;
  var renderer = null;
  var controls = null;
  var animationFrameId = null;
  
  // 3D Objects
  var beakerGroup = null;
  var liquidMesh = null;
  var metalMesh = null; // idle preview above beaker
  var metalGeom = null; // shared geometry for preview + dropped pieces
  var pointLight = null; // For chemical reaction glow/explosion flash
  var activeFlameMesh = null; // Single persistent flame on the metal

  // Multi-piece drop system
  var activePieces = [];
  var MAX_ACTIVE_PIECES = 10;
  var onCanvasClick = null;
  var pointerDownPos = null;
  
  // Materials
  var glassMaterial = null;
  var liquidMaterial = null;
  var metalMaterial = null;
  
  // Particles System
  var particles = [];
  
  // Exact flame geometries from Oxygen tab
  var flameOuterGeom = null;
  var flameMidGeom = null;
  var flameInnerGeom = null;
  
  function checkFlameGeometries() {
    if (flameOuterGeom) return;
    
    // Outer shape (M 260 267 C 242 245 245 210 260 180 C 275 210 278 245 260 267 Z)
    var outerShape = new THREE.Shape();
    outerShape.moveTo(0, 0);
    outerShape.bezierCurveTo(-18/87, 22/87, -15/87, 57/87, 0, 1.0);
    outerShape.bezierCurveTo(15/87, 57/87, 18/87, 22/87, 0, 0);
    flameOuterGeom = new THREE.ShapeGeometry(outerShape);
    
    // Mid shape (M 260 267 C 248 250 250 220 260 198 C 270 220 272 250 260 267 Z)
    var midShape = new THREE.Shape();
    midShape.moveTo(0, 0);
    midShape.bezierCurveTo(-12/87, 17/87, -10/87, 47/87, 0, 69/87);
    midShape.bezierCurveTo(10/87, 47/87, 12/87, 17/87, 0, 0);
    flameMidGeom = new THREE.ShapeGeometry(midShape);
    
    // Inner shape (M 260 267 C 253 255 254 235 260 218 C 266 235 267 255 260 267 Z)
    var innerShape = new THREE.Shape();
    innerShape.moveTo(0, 0);
    innerShape.bezierCurveTo(-7/87, 12/87, -6/87, 32/87, 0, 49/87);
    innerShape.bezierCurveTo(6/87, 32/87, 7/87, 12/87, 0, 0);
    flameInnerGeom = new THREE.ShapeGeometry(innerShape);
  }
  
  function createPersistentFlame(color, metalId) {
    checkFlameGeometries();
    
    var group = new THREE.Group();
    var mid = metalId || currentMetal;
    
    // Outer flame envelope
    var outerColor = color.clone();
    if (mid === 'Na') {
      outerColor.set('#f97316');
    } else if (mid === 'K') {
      outerColor.set('#a855f7');
    } else if (mid === 'Mg') {
      outerColor.set('#06b6d4');
    } else {
      outerColor.multiplyScalar(0.7);
    }
    
    var outerMat = new THREE.MeshBasicMaterial({
      color: outerColor,
      transparent: true,
      opacity: 0.0, // start at 0 and fade in
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var outerMesh = new THREE.Mesh(flameOuterGeom, outerMat);
    group.add(outerMesh);
    
    // Mid flame core
    var midMat = new THREE.MeshBasicMaterial({
      color: color.clone(),
      transparent: true,
      opacity: 0.0, // start at 0 and fade in
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var midMesh = new THREE.Mesh(flameMidGeom, midMat);
    group.add(midMesh);
    
    // Inner core
    var innerColor = new THREE.Color('#ffffff');
    if (mid === 'Na') {
      innerColor.set('#fef08a');
    } else if (mid === 'K') {
      innerColor.set('#fae8ff');
    }
    var innerMat = new THREE.MeshBasicMaterial({
      color: innerColor,
      transparent: true,
      opacity: 0.0, // start at 0 and fade in
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var innerMesh = new THREE.Mesh(flameInnerGeom, innerMat);
    group.add(innerMesh);
    
    group.userData = {
      targetOpacity: 1.0,
      currentOpacity: 0.0,
      baseOpacities: [0.35, 0.65, 0.95],
      metalId: mid
    };
    
    scene.add(group);
    return group;
  }
  
  // Timing & State variables
  var dropTimer = null;
  var explosionTimer = null;
  var dissolveTimer = null;
  var flameTimer = null;
  
  var state = {
    animationState: 'ready', // 'ready' | 'dropping' | 'sinking' | 'reacting' | 'reset'
    busy: false,
    time: 0,
    metalPos: new THREE.Vector3(0, 3.5, 0),
    metalRot: new THREE.Vector3(0, 0, 0),
    metalScale: new THREE.Vector3(1, 1, 1),
    
    // Smooth transition for liquid color
    currentLiquidColor: new THREE.Color(),
    targetLiquidColor: new THREE.Color(),
    currentLiquidOpacity: 0.55,
    targetLiquidOpacity: 0.55,
    
    // Reaction params
    bubbleRate: 0,
    flameOnWater: false,
    flameColor: null,
    explosive: false,
    depositColor: null,
    metalDissolve: false,
    dissolveMs: 2500,
    dissolveElapsed: 0,
    
    // Spark & splash helpers
    lastBubbleSpawnTime: 0,
    lastSmokeSpawnTime: 0,
    lastFlameSpawnTime: 0
  };

  var CONTACT_SURFACE_Y = 0.75;
  var CONTACT_SUNK_Y = -2.1;
  var DROP_MS = 650;
  var SINK_MS = 600;
  var EXPLOSION_DELAY_MS = 100;

  function $(id) { return document.getElementById(id); }

  // Parse CSS Color (e.g. rgba(37,99,235,0.55)) to Three.js Color and Alpha
  function parseRgba(rgbaStr) {
    var matches = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (matches) {
      var r = parseInt(matches[1]) / 255;
      var g = parseInt(matches[2]) / 255;
      var b = parseInt(matches[3]) / 255;
      var a = matches[4] !== undefined ? parseFloat(matches[4]) : 1.0;
      return { color: new THREE.Color(r, g, b), opacity: a };
    }
    return { color: new THREE.Color(0x2563eb), opacity: 0.55 };
  }

  // Create High-Res Beaker Markings Canvas Texture
  function createMarkingsTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    var ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 512, 512);
    
    // Draw tick marks and text with nice styling
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 4;
    ctx.font = 'bold 32px "Segoe UI", "Microsoft JhengHei", sans-serif';
    ctx.textBaseline = 'middle';
    
    // Map vertical ticks on canvas
    var marks = [
      { y: 120, txt: '125 ml' },
      { y: 220, txt: '100' },
      { y: 320, txt: '75' },
      { y: 420, txt: '50' }
    ];
    
    marks.forEach(function (m) {
      ctx.beginPath();
      ctx.moveTo(340, m.y);
      ctx.lineTo(400, m.y);
      ctx.stroke();
      
      if (m.txt) {
        ctx.textAlign = 'right';
        ctx.fillText(m.txt, 320, m.y);
      }
    });
    
    var texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Particle Spawning Helper
  function spawnParticle(type, pos, vel, color, life, size) {
    var geom, mat, mesh;
    
    if (type === 'ripple') {
      geom = new THREE.RingGeometry(0.01, size || 0.1, 32);
      mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = -Math.PI / 2;
    } else if (type === 'bubble') {
      geom = new THREE.SphereGeometry(size || 0.04, 6, 6);
      mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.0,
        transmission: 0.9,
        depthWrite: false
      });
      mesh = new THREE.Mesh(geom, mat);
    } else if (type === 'smoke') {
      geom = new THREE.SphereGeometry(size || 0.12, 8, 8);
      mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        depthWrite: false
      });
      mesh = new THREE.Mesh(geom, mat);
    } else if (type === 'flame') {
      checkFlameGeometries();
      mesh = new THREE.Group();
      
      // Outer flame envelope (broader, softer, secondary burning color)
      var outerColor = color.clone();
      if (currentMetal === 'Na') {
        outerColor.set('#f97316'); // sodium golden yellow has a red-orange outer envelope
      } else if (currentMetal === 'K') {
        outerColor.set('#a855f7'); // potassium lilac has a vibrant purple/violet outer envelope
      } else if (currentMetal === 'Mg') {
        outerColor.set('#06b6d4'); // magnesium white has a bright cyan outer envelope
      } else {
        outerColor.multiplyScalar(0.7);
      }
      
      var outerMat = new THREE.MeshBasicMaterial({
        color: outerColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      var outerMesh = new THREE.Mesh(flameOuterGeom, outerMat);
      mesh.add(outerMesh);
      
      // Mid flame core (vibrant main characteristic flame color)
      var midMat = new THREE.MeshBasicMaterial({
        color: color.clone(),
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      var midMesh = new THREE.Mesh(flameMidGeom, midMat);
      mesh.add(midMesh);
      
      // Inner core (very hot white/bright interior)
      var innerColor = new THREE.Color('#ffffff');
      if (currentMetal === 'Na') {
        innerColor.set('#fef08a'); // bright pale yellow core for Sodium
      } else if (currentMetal === 'K') {
        innerColor.set('#fae8ff'); // bright lilac-white core for Potassium
      }
      var innerMat = new THREE.MeshBasicMaterial({
        color: innerColor,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      var innerMesh = new THREE.Mesh(flameInnerGeom, innerMat);
      mesh.add(innerMesh);
    } else if (type === 'spark') {
      geom = new THREE.SphereGeometry(size || 0.03, 4, 4);
      mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      mesh = new THREE.Mesh(geom, mat);
    } else { // debris
      geom = new THREE.DodecahedronGeometry(size || 0.08, 0);
      mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.2
      });
      mesh = new THREE.Mesh(geom, mat);
    }
    
    mesh.position.copy(pos);
    scene.add(mesh);
    
    particles.push({
      mesh: mesh,
      velocity: vel.clone(),
      life: life,
      maxLife: life,
      type: type,
      baseScale: size || 1.0,
      behavior: function (p, dt) {
        p.life -= dt;
        var ratio = Math.max(0, p.life / p.maxLife);
        
        if (p.type === 'ripple') {
          var scale = (1.0 - ratio) * 7.5;
          p.mesh.scale.set(scale, scale, 1);
          p.mesh.material.opacity = ratio * 0.8;
        } else if (p.type === 'bubble') {
          p.mesh.position.addScaledVector(p.velocity, dt);
          // add wiggle
          p.mesh.position.x += Math.sin(state.time * 15.0 + p.life * 10) * 0.15 * dt;
          p.mesh.position.z += Math.cos(state.time * 12.0 + p.life * 10) * 0.15 * dt;
          
          // pop if reaches surface
          if (p.mesh.position.y >= CONTACT_SURFACE_Y) {
            p.life = 0;
          }
        } else if (p.type === 'smoke') {
          p.mesh.position.addScaledVector(p.velocity, dt);
          var sc = 1.0 + (1.0 - ratio) * 3.0;
          p.mesh.scale.set(sc, sc, sc);
          p.mesh.material.opacity = ratio * 0.18;
        } else if (p.type === 'flame') {
          p.mesh.position.addScaledVector(p.velocity, dt);
          // Billboarding: make the flat 2D shape face the camera perfectly
          if (camera) {
            p.mesh.quaternion.copy(camera.quaternion);
            // Organic flame flicker tilt & micro-wiggle (fluttering in 3D space)
            p.mesh.rotateZ(Math.sin(state.time * 22.0 + p.life * 5.0) * 0.22);
          }
          
          // Organic flame tapering (stretch vertically as it rises)
          var sc = Math.pow(ratio, 0.75);
          var sizeFactor = (p.baseScale || 0.08) * 3.5;
          p.mesh.scale.set(sc * sizeFactor, sc * (1.0 + (1.0 - ratio) * 0.6) * sizeFactor, sc * sizeFactor);
          
          // Update nested materials opacity
          if (p.mesh.children && p.mesh.children.length > 0) {
            p.mesh.children.forEach(function (child, index) {
              if (child.material) {
                var baseOpacity = 0.65; // default fallback
                if (index === 0) baseOpacity = 0.35; // outer
                else if (index === 1) baseOpacity = 0.65; // mid
                else if (index === 2) baseOpacity = 0.95; // inner
                child.material.opacity = ratio * baseOpacity;
              }
            });
          } else if (p.mesh.material) {
            p.mesh.material.opacity = ratio * 0.9;
          }
        } else if (p.type === 'spark') {
          p.mesh.position.addScaledVector(p.velocity, dt);
          p.velocity.y -= 4.0 * dt; // gravity
          p.mesh.material.opacity = ratio;
        } else if (p.type === 'debris') {
          p.mesh.position.addScaledVector(p.velocity, dt);
          p.velocity.y -= 9.8 * dt; // gravity
          p.mesh.rotation.x += p.velocity.y * dt * 2.0;
          p.mesh.rotation.y += p.velocity.x * dt * 2.0;
          p.mesh.material.opacity = ratio;
        }

        // Prevent leaking/clipping through the beaker's cylindrical glass walls (radius = 1.92, height <= 2.3)
        if (p.type !== 'ripple') {
          var r = Math.sqrt(p.mesh.position.x * p.mesh.position.x + p.mesh.position.z * p.mesh.position.z);
          var maxR = 1.92;
          if (r > maxR && p.mesh.position.y < 2.3) {
            p.mesh.position.x = (p.mesh.position.x / r) * maxR;
            p.mesh.position.z = (p.mesh.position.z / r) * maxR;
            
            // Reflect/bounce velocity to stay inside
            var nx = p.mesh.position.x / maxR;
            var nz = p.mesh.position.z / maxR;
            var dot = p.velocity.x * nx + p.velocity.z * nz;
            if (dot > 0) {
              var restitution = 0.3; // glass wall bounce damping
              p.velocity.x -= (1.0 + restitution) * dot * nx;
              p.velocity.z -= (1.0 + restitution) * dot * nz;
            }
          }
        }
      }
    });
  }

  function clearExplosionTimer() {
    if (explosionTimer) {
      clearTimeout(explosionTimer);
      explosionTimer = null;
    }
  }

  function clearDropTimer() {
    if (dropTimer) {
      clearTimeout(dropTimer);
      dropTimer = null;
    }
  }

  function clearDissolveTimer() {
    if (dissolveTimer) {
      clearTimeout(dissolveTimer);
      dissolveTimer = null;
    }
  }

  function clearFlameTimer() {
    if (flameTimer) {
      clearTimeout(flameTimer);
      flameTimer = null;
    }
  }

  function getFinalDropState(metalId) {
    if (metalId === 'K' || metalId === 'Na') return 'immersed'; // float on water
    return 'sunk';
  }

  // Trigger 3D Water Surface Splash Effects
  function triggerSplash(atPos) {
    var pos = atPos ? atPos.clone() : new THREE.Vector3(0, CONTACT_SURFACE_Y, 0);
    pos.y = CONTACT_SURFACE_Y;
    
    // Spawn Ripples
    spawnParticle('ripple', pos, new THREE.Vector3(), state.currentLiquidColor, 0.4, 0.25);
    
    // Spawn upward splash droplets
    var dropletCount = 18;
    for (var i = 0; i < dropletCount; i++) {
      var angle = (i / dropletCount) * Math.PI * 2 + Math.random() * 0.3;
      var speed = 1.0 + Math.random() * 1.5;
      var vel = new THREE.Vector3(
        Math.cos(angle) * speed * 0.4,
        2.5 + Math.random() * 2.5,
        Math.sin(angle) * speed * 0.4
      );
      spawnParticle('spark', pos, vel, state.currentLiquidColor, 0.5 + Math.random() * 0.3, 0.03 + Math.random() * 0.04);
    }
  }

  function disposeMeshTree(root) {
    if (!root) return;
    scene.remove(root);
    root.traverse(function (child) {
      // Never dispose shared geometries (metalGeom / flame ShapeGeometries)
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(function (mat) { if (mat.dispose) mat.dispose(); });
        } else if (child.material.dispose) {
          child.material.dispose();
        }
      }
    });
  }

  function disposePiece(piece) {
    if (!piece) return;
    if (piece.landTimer) {
      clearTimeout(piece.landTimer);
      piece.landTimer = null;
    }
    if (piece.explosionTimer) {
      clearTimeout(piece.explosionTimer);
      piece.explosionTimer = null;
    }
    if (piece.flameDelayTimer) {
      clearTimeout(piece.flameDelayTimer);
      piece.flameDelayTimer = null;
    }
    if (piece.mesh) {
      scene.remove(piece.mesh);
      if (piece.material && piece.material.dispose) piece.material.dispose();
    }
    piece.mesh = null;
    piece.material = null;
  }

  function clearActivePieces() {
    for (var i = 0; i < activePieces.length; i++) {
      disposePiece(activePieces[i]);
    }
    activePieces = [];
  }

  function removeOldestFinishedPiece() {
    for (var i = 0; i < activePieces.length; i++) {
      var p = activePieces[i];
      if (p.phase === 'reacting' || p.phase === 'done' || !p.mesh || !p.mesh.visible) {
        disposePiece(p);
        activePieces.splice(i, 1);
        return true;
      }
    }
    if (activePieces.length > 0) {
      disposePiece(activePieces[0]);
      activePieces.shift();
      return true;
    }
    return false;
  }

  // Trigger 3D Chemical Explosion Burst for one piece
  function triggerExplosion(piece) {
    if (!piece || !piece.mesh) return;
    var pos = piece.pos.clone();
    var mid = piece.metalId;
    
    piece.mesh.visible = false;
    piece.phase = 'done';
    piece.exploded = true;
    
    // Flash light
    if (pointLight) {
      pointLight.color.copy(state.flameColor ? new THREE.Color(state.flameColor) : new THREE.Color('#ffaa00'));
      pointLight.intensity = mid === 'K' ? 4.0 : 1.5;
      state.targetPointLightIntensity = 0;
      pointLight.position.copy(pos);
    }
    
    var isK = mid === 'K';
    var sparkCount = isK ? 110 : 45;
    var col = state.flameColor || '#fde047';
    for (var i = 0; i < sparkCount; i++) {
      var phi = Math.acos(Math.random() * 2 - 1);
      var theta = Math.random() * Math.PI * 2;
      var speed = isK ? (3.5 + Math.random() * 12.0) : (2.0 + Math.random() * 7.0);
      
      var vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed + (isK ? 3.0 : 1.5),
        Math.cos(phi) * speed
      );
      
      spawnParticle('spark', pos, vel, new THREE.Color(col), 0.4 + Math.random() * 0.4, isK ? (0.01 + Math.random() * 0.02) : (0.02 + Math.random() * 0.03));
    }
    
    var debrisCount = isK ? 35 : 15;
    var debCol = new THREE.Color(METALS[mid] ? METALS[mid].stripColor : '#f8fafc');
    for (var j = 0; j < debrisCount; j++) {
      var phi2 = Math.acos(Math.random() * 2 - 1);
      var theta2 = Math.random() * Math.PI * 2;
      var speed2 = isK ? (2.5 + Math.random() * 7.0) : (1.5 + Math.random() * 4.0);
      
      var vel2 = new THREE.Vector3(
        Math.sin(phi2) * Math.cos(theta2) * speed2,
        Math.abs(Math.sin(phi2) * Math.sin(theta2) * speed2) + (isK ? 4.0 : 2.0),
        Math.cos(phi2) * speed2
      );
      
      spawnParticle('debris', pos, vel2, debCol, 0.6 + Math.random() * 0.4, 0.05 + Math.random() * 0.06);
    }
    
    var smokeCount = isK ? 25 : 10;
    for (var k = 0; k < smokeCount; k++) {
      var vel3 = new THREE.Vector3(
        (Math.random() * 2 - 1) * (isK ? 1.2 : 0.6),
        0.5 + Math.random() * (isK ? 2.0 : 1.0),
        (Math.random() * 2 - 1) * (isK ? 1.2 : 0.6)
      );
      spawnParticle('smoke', pos, vel3, new THREE.Color('#cbd5e1'), (isK ? 1.2 : 0.8) + Math.random() * 0.5, isK ? (0.07 + Math.random() * 0.08) : (0.12 + Math.random() * 0.1));
    }
  }

  function setMetal(metalId) {
    currentMetal = metalId;
    if (METALS[metalId]) {
      var mColor = new THREE.Color(METALS[metalId].stripColor);
      state.metalColor = mColor.clone();
      if (metalMaterial) {
        metalMaterial.color.copy(mColor);
      }
    }
    resetAnimation();
  }

  function setSolution(solutionId) {
    currentSolution = solutionId;
    var sol = SOLUTIONS[solutionId];
    if (sol) {
      var parsed = parseRgba(sol.color);
      state.targetLiquidColor.copy(parsed.color);
      state.targetLiquidOpacity = parsed.opacity;
      
      // If ready/reset state, change immediately, otherwise smoothly morph
      if (state.animationState === 'ready' || state.animationState === 'reset') {
        state.currentLiquidColor.copy(parsed.color);
        state.currentLiquidOpacity = parsed.opacity;
        if (liquidMaterial) {
          liquidMaterial.color.copy(parsed.color);
          liquidMaterial.opacity = parsed.opacity;
          
          // Visual customisation for Steam category (non-liquid, gaseous chamber)
          if (solutionId === 'steam') {
            liquidMesh.visible = false; // Hide the water liquid body cylinder
            // Soften glass reflection to represent fogged/steamy chamber
            if (glassMaterial) {
              glassMaterial.opacity = 0.45;
              glassMaterial.roughness = 0.55; // frosted fogged steam glass
            }
          } else {
            liquidMesh.visible = true;
            if (glassMaterial) {
              glassMaterial.opacity = 0.25;
              glassMaterial.roughness = 0.08; // back to shiny clear glass
            }
          }
        }
      }
    }
    resetAnimation();
  }

  function clearBubbles() {
    state.bubbleRate = 0;
    state.flameOnWater = false;
    clearFlameTimer();
    // Keep bubbles/smoke particles but let them fade out naturally
  }

  function resetAnimation() {
    clearBubbles();
    clearExplosionTimer();
    clearDropTimer();
    clearDissolveTimer();
    clearFlameTimer();
    clearActivePieces();
    
    if (activeFlameMesh) {
      disposeMeshTree(activeFlameMesh);
      activeFlameMesh = null;
    }
    
    state.animationState = 'ready';
    state.stateTime = 0;
    state.targetPointLightIntensity = 0;
    state.busy = false;
    state.time = 0;
    state.lastBubbleSpawnTime = 0;
    state.lastSmokeSpawnTime = 0;
    state.lastFlameSpawnTime = 0;
    state.metalPos.set(0, 3.5, 0);
    state.metalRot.set(0, 0, 0);
    state.metalScale.set(1, 1, 1);
    state.dissolveElapsed = 0;
    state.explosive = false;
    state.flameOnWater = false;
    state.depositColor = null;
    state.metalDissolve = false;
    
    if (metalMaterial && METALS[currentMetal]) {
      metalMaterial.color.copy(new THREE.Color(METALS[currentMetal].stripColor));
    }
    
    // No idle preview sphere above the beaker — only appear when dropping
    if (metalMesh) {
      metalMesh.visible = false;
      metalMesh.position.set(0, 3.5, 0);
      metalMesh.rotation.set(0, 0, 0);
      metalMesh.scale.set(1, 1, 1);
    }
    
    if (pointLight) {
      pointLight.intensity = 0;
    }
    
    var sol = SOLUTIONS[currentSolution];
    if (sol && liquidMaterial) {
      var parsed = parseRgba(sol.color);
      state.currentLiquidColor.copy(parsed.color);
      state.currentLiquidOpacity = parsed.opacity;
      state.targetLiquidColor.copy(parsed.color);
      state.targetLiquidOpacity = parsed.opacity;
      liquidMaterial.color.copy(parsed.color);
      liquidMaterial.opacity = parsed.opacity;
      
      if (currentSolution === 'steam') {
        liquidMesh.visible = false;
        if (glassMaterial) {
          glassMaterial.opacity = 0.45;
          glassMaterial.roughness = 0.55;
        }
      } else {
        liquidMesh.visible = true;
        if (glassMaterial) {
          glassMaterial.opacity = 0.25;
          glassMaterial.roughness = 0.08;
        }
      }
    }
  }

  function applyEffects(fx, reacts, piece) {
    if (fx.solutionColorAfter) {
      var parsed = parseRgba(fx.solutionColorAfter);
      state.targetLiquidColor.copy(parsed.color);
      state.targetLiquidOpacity = parsed.opacity;
    }

    if (!reacts) {
      state.busy = false;
      return true;
    }

    state.bubbleRate = Math.max(state.bubbleRate || 0, fx.bubbleRate || 0);
    if (fx.flameColor) state.flameColor = fx.flameColor;
    state.explosive = !!fx.explosive;
    if (fx.depositColor) state.depositColor = fx.depositColor;

    if (piece) {
      piece.metalDissolve = !!fx.metalDissolve;
      piece.dissolveMs = fx.dissolveMs || 2500;
      piece.dissolveElapsed = 0;
      piece.depositColor = fx.depositColor || null;
      piece.flameOnWater = !!fx.flameOnWater;
      piece.explosive = !!fx.explosive;
    }

    state.metalDissolve = !!fx.metalDissolve;
    state.dissolveMs = fx.dissolveMs || 2500;

    if (fx.flameOnWater && piece) {
      if (piece.metalId === 'K' || piece.metalId === 'Na') {
        piece.flameOnWater = false;
        piece.flameDelayTimer = setTimeout(function () {
          piece.flameDelayTimer = null;
          if (piece.phase === 'reacting') {
            piece.flameOnWater = true;
            state.flameOnWater = true;
          }
        }, 1000);
      } else {
        piece.flameOnWater = true;
        state.flameOnWater = true;
      }
    } else if (fx.flameOnWater) {
      state.flameOnWater = true;
    }

    if (piece && piece.explosive) {
      var isAcid = SOLUTIONS[currentSolution] && SOLUTIONS[currentSolution].category === 'acid';
      var delay = (piece.metalId === 'K' && !isAcid) ? 3200 : EXPLOSION_DELAY_MS;
      piece.explosionTimer = setTimeout(function () {
        piece.explosionTimer = null;
        triggerExplosion(piece);
        // Keep bubbles if other pieces still reacting
        var anyFlame = false;
        for (var i = 0; i < activePieces.length; i++) {
          if (activePieces[i].flameOnWater && activePieces[i].phase === 'reacting') {
            anyFlame = true;
            break;
          }
        }
        if (!anyFlame) state.flameOnWater = false;
        state.busy = false;
      }, delay);
    } else {
      state.busy = false;
    }
    
    return true;
  }

  function onPieceLand(piece) {
    triggerSplash(piece.pos);
    
    var finalState = getFinalDropState(piece.metalId);
    if (finalState === 'sunk') {
      piece.phase = 'sinking';
      piece.elapsed = 0;
      piece.landTimer = setTimeout(function () {
        piece.landTimer = null;
        piece.phase = 'reacting';
        piece.elapsed = 0;
        applyEffects(piece.result.visualEffects, piece.result.reacts, piece);
      }, SINK_MS);
    } else {
      piece.phase = 'reacting';
      piece.elapsed = 0;
      applyEffects(piece.result.visualEffects, piece.result.reacts, piece);
    }
  }

  function createDroppedPiece(metalId, result) {
    if (!scene || !metalGeom) return null;

    var mesh;
    var mat;
    var ox = (Math.random() * 2 - 1) * 0.45;
    var oz = (Math.random() * 2 - 1) * 0.45;

    // If a preview sphere is showing, that exact ball drops (no leftover above)
    if (metalMesh) {
      mesh = metalMesh;
      mat = metalMaterial;
      metalMesh = null;
      metalMaterial = null;
    } else {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(METALS[metalId] ? METALS[metalId].stripColor : '#a0a8b0'),
        roughness: 0.45,
        metalness: 0.75
      });
      mesh = new THREE.Mesh(metalGeom, mat);
      scene.add(mesh);
    }

    mesh.position.set(ox, 3.5, oz);
    mesh.visible = true;

    return {
      mesh: mesh,
      material: mat,
      metalId: metalId,
      result: result,
      phase: 'dropping',
      elapsed: 0,
      pos: new THREE.Vector3(ox, 3.5, oz),
      rot: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
      floatPhase: Math.random() * Math.PI * 2,
      dissolveElapsed: 0,
      dissolveMs: 2500,
      metalDissolve: false,
      depositColor: null,
      flameOnWater: false,
      explosive: false,
      exploded: false,
      landTimer: null,
      explosionTimer: null,
      flameDelayTimer: null
    };
  }

  function addMetal(result) {
    if (!scene || !metalGeom) return false;

    while (activePieces.length >= MAX_ACTIVE_PIECES) {
      if (!removeOldestFinishedPiece()) break;
    }
    if (activePieces.length >= MAX_ACTIVE_PIECES) return false;

    var piece = createDroppedPiece(currentMetal, result);
    if (!piece) return false;
    activePieces.push(piece);

    piece.landTimer = setTimeout(function () {
      piece.landTimer = null;
      if (piece.phase === 'dropping') {
        onPieceLand(piece);
      }
    }, DROP_MS);

    return true;
  }

  function play(result) {
    // Legacy entry: clear scene then drop one (kept for compatibility)
    resetAnimation();
    return addMetal(result);
  }

  function isBusy() {
    // Allow continuous click-to-add; only block when at capacity
    return activePieces.length >= MAX_ACTIVE_PIECES;
  }

  function setOnCanvasClick(fn) {
    onCanvasClick = typeof fn === 'function' ? fn : null;
  }

  function bindCanvasClick() {
    if (!renderer || !renderer.domElement) return;
    var el = renderer.domElement;
    el.style.cursor = 'pointer';

    el.addEventListener('pointerdown', function (e) {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    el.addEventListener('pointerup', function (e) {
      if (!pointerDownPos) return;
      var dx = e.clientX - pointerDownPos.x;
      var dy = e.clientY - pointerDownPos.y;
      pointerDownPos = null;
      if (dx * dx + dy * dy > 25) return; // drag — ignore
      if (onCanvasClick) onCanvasClick();
    });

    el.addEventListener('pointerleave', function () {
      pointerDownPos = null;
    });
  }

  // Dynamic animation updates
  function update(dt) {
    state.time += dt;

    // No idle preview sphere left hanging above the beaker
    if (metalMesh) {
      metalMesh.visible = false;
    }

    var dropDurationSec = DROP_MS / 1000;
    var sinkDurationSec = SINK_MS / 1000;
    var flameAnchor = null;
    var anyReacting = false;

    for (var i = 0; i < activePieces.length; i++) {
      var piece = activePieces[i];
      if (!piece.mesh) continue;
      piece.elapsed += dt;

      if (piece.phase === 'dropping') {
        var progress = Math.min(1.0, piece.elapsed / dropDurationSec);
        var t = progress * progress;
        piece.pos.y = 3.5 - t * (3.5 - CONTACT_SURFACE_Y);
        piece.rot.x += dt * 3;
        piece.rot.y += dt * 5;
      } else if (piece.phase === 'sinking') {
        var sp = Math.min(1.0, piece.elapsed / sinkDurationSec);
        var st = sp * (2 - sp);
        piece.pos.y = CONTACT_SURFACE_Y - st * (CONTACT_SURFACE_Y - CONTACT_SUNK_Y);
        piece.rot.x += dt * 1;
        piece.rot.z += dt * 1.5;
      } else if (piece.phase === 'reacting' && piece.mesh.visible) {
        anyReacting = true;
        if (piece.metalId === 'K' || piece.metalId === 'Na') {
          var angle = state.time * 6.5 + piece.floatPhase;
          var radius = 0.55 + Math.sin(state.time * 2.5 + piece.floatPhase) * 0.35;
          piece.pos.x = Math.cos(angle) * radius;
          piece.pos.z = Math.sin(angle) * radius;
          piece.pos.y = CONTACT_SURFACE_Y + 0.05 + Math.abs(Math.sin(state.time * 18.0 + piece.floatPhase)) * 0.04;
          piece.rot.y += dt * 15;
          if (piece.flameOnWater) flameAnchor = piece;
        } else {
          piece.pos.y = CONTACT_SUNK_Y;
          piece.rot.y += dt * 0.4;
        }

        if (piece.depositColor && piece.material) {
          piece.material.color.lerp(new THREE.Color(piece.depositColor), dt * 1.2);
        }

        if (piece.metalDissolve) {
          piece.dissolveElapsed += dt * 1000;
          var scaleRatio = Math.max(0, 1.0 - (piece.dissolveElapsed / piece.dissolveMs));
          piece.scale.set(scaleRatio, scaleRatio, scaleRatio);
          if (scaleRatio <= 0.01) {
            piece.mesh.visible = false;
            piece.phase = 'done';
          }
        }

        if (state.bubbleRate > 0 && piece.mesh.visible) {
          var spawnInterval = 0.4 / state.bubbleRate;
          if (state.time - state.lastBubbleSpawnTime >= spawnInterval) {
            state.lastBubbleSpawnTime = state.time;
            var bubblePos = piece.pos.clone().add(new THREE.Vector3(
              (Math.random() * 2 - 1) * 0.22,
              (Math.random() * 2 - 1) * 0.15,
              (Math.random() * 2 - 1) * 0.22
            ));
            var bubbleVel = new THREE.Vector3(
              (Math.random() * 2 - 1) * 0.15,
              1.2 + Math.random() * 0.8,
              (Math.random() * 2 - 1) * 0.15
            );
            spawnParticle('bubble', bubblePos, bubbleVel, null, 1.8, 0.035 + Math.random() * 0.045);
          }

          var smokeInterval = 0.55 / state.bubbleRate;
          if (state.time - state.lastSmokeSpawnTime >= smokeInterval) {
            state.lastSmokeSpawnTime = state.time;
            var smokePos = new THREE.Vector3(
              piece.pos.x + (Math.random() * 2 - 1) * 0.3,
              CONTACT_SURFACE_Y + 0.05,
              piece.pos.z + (Math.random() * 2 - 1) * 0.3
            );
            var smokeVel = new THREE.Vector3(
              (Math.random() * 2 - 1) * 0.2,
              0.8 + Math.random() * 0.8,
              (Math.random() * 2 - 1) * 0.2
            );
            spawnParticle('smoke', smokePos, smokeVel, null, 1.4 + Math.random() * 0.6, 0.1 + Math.random() * 0.12);
          }
        }
      }

      if (piece.mesh) {
        piece.mesh.position.copy(piece.pos);
        piece.mesh.rotation.set(piece.rot.x, piece.rot.y, piece.rot.z);
        piece.mesh.scale.copy(piece.scale);
      }
    }

    // Liquid color always eases toward target once reactions have set it
    if (liquidMaterial && (anyReacting || activePieces.length > 0)) {
      state.currentLiquidColor.lerp(state.targetLiquidColor, dt * 1.5);
      state.currentLiquidOpacity += (state.targetLiquidOpacity - state.currentLiquidOpacity) * dt * 1.5;
      liquidMaterial.color.copy(state.currentLiquidColor);
      liquidMaterial.opacity = state.currentLiquidOpacity;
    }

    // Flame follows the latest floating reactive piece
    if (flameAnchor && flameAnchor.mesh && flameAnchor.mesh.visible) {
      var fCol = state.flameColor || '#f97316';
      var isHighlyReactive = flameAnchor.metalId === 'K' || flameAnchor.metalId === 'Na';

      if (!activeFlameMesh) {
        activeFlameMesh = createPersistentFlame(new THREE.Color(fCol), flameAnchor.metalId);
      }

      activeFlameMesh.userData.targetOpacity = 1.0;
      activeFlameMesh.userData.currentOpacity += (activeFlameMesh.userData.targetOpacity - activeFlameMesh.userData.currentOpacity) * dt * 8.0;
      if (activeFlameMesh.userData.currentOpacity > 1.0) activeFlameMesh.userData.currentOpacity = 1.0;

      var targetPos = flameAnchor.pos.clone();
      targetPos.y -= 0.25;
      activeFlameMesh.position.lerp(targetPos, dt * 25.0);

      if (camera) {
        activeFlameMesh.quaternion.copy(camera.quaternion);
      }

      var flickerSpeed = isHighlyReactive ? 28.0 : 16.0;
      var scaleWiggleY = 1.0 + Math.sin(state.time * flickerSpeed) * 0.15 + Math.cos(state.time * (flickerSpeed * 0.7)) * 0.1;
      var scaleWiggleXZ = 0.95 + Math.cos(state.time * (flickerSpeed * 1.1)) * 0.08;
      var baseScale = isHighlyReactive ? 1.70 : 1.10;
      activeFlameMesh.scale.set(
        scaleWiggleXZ * baseScale,
        scaleWiggleY * baseScale,
        scaleWiggleXZ * baseScale
      );
      activeFlameMesh.rotateZ(Math.sin(state.time * (flickerSpeed * 0.8)) * 0.15);

      activeFlameMesh.children.forEach(function (child, index) {
        if (child.material) {
          var baseOp = activeFlameMesh.userData.baseOpacities[index] || 0.7;
          child.material.opacity = activeFlameMesh.userData.currentOpacity * baseOp;
        }
      });

      if (pointLight) {
        pointLight.color.copy(new THREE.Color(fCol));
        state.targetPointLightIntensity = isHighlyReactive ? (1.5 + Math.random() * 0.8) : (0.5 + Math.random() * 0.25);
        pointLight.position.copy(flameAnchor.pos);
      }

      var sparkInterval = isHighlyReactive ? 0.04 : 0.12;
      if (state.time - state.lastFlameSpawnTime >= sparkInterval) {
        state.lastFlameSpawnTime = state.time;
        var sparkPos = flameAnchor.pos.clone().add(new THREE.Vector3(
          (Math.random() * 2 - 1) * 0.1,
          0.1,
          (Math.random() * 2 - 1) * 0.1
        ));
        var sparkVel = new THREE.Vector3(
          (Math.random() * 2 - 1) * (isHighlyReactive ? 1.5 : 0.8),
          isHighlyReactive ? (2.0 + Math.random() * 2.5) : (1.0 + Math.random() * 1.5),
          (Math.random() * 2 - 1) * (isHighlyReactive ? 1.5 : 0.8)
        );
        spawnParticle('spark', sparkPos, sparkVel, new THREE.Color(fCol), 0.3 + Math.random() * 0.25, 0.02 + Math.random() * 0.02);
      }
    } else if (activeFlameMesh) {
      activeFlameMesh.userData.targetOpacity = 0.0;
      activeFlameMesh.userData.currentOpacity += (activeFlameMesh.userData.targetOpacity - activeFlameMesh.userData.currentOpacity) * dt * 10.0;

      if (activeFlameMesh.userData.currentOpacity <= 0.02) {
        disposeMeshTree(activeFlameMesh);
        activeFlameMesh = null;
      } else {
        if (camera) activeFlameMesh.quaternion.copy(camera.quaternion);
        activeFlameMesh.children.forEach(function (child, index) {
          if (child.material) {
            var baseOp2 = activeFlameMesh.userData.baseOpacities[index] || 0.7;
            child.material.opacity = activeFlameMesh.userData.currentOpacity * baseOp2;
          }
        });
      }
      state.targetPointLightIntensity = 0;
    } else {
      state.targetPointLightIntensity = 0;
    }

    if (pointLight) {
      var targetInt = state.targetPointLightIntensity || 0;
      pointLight.intensity += (targetInt - pointLight.intensity) * dt * 5.0;
    }

    // Update and clean up active particles
    for (var pi = particles.length - 1; pi >= 0; pi--) {
      var p = particles[pi];
      p.behavior(p, dt);

      if (p.life <= 0) {
        scene.remove(p.mesh);
        if (p.mesh.traverse) {
          p.mesh.traverse(function (child) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(function (mat) { if (mat.dispose) mat.dispose(); });
              } else {
                if (child.material.dispose) child.material.dispose();
              }
            }
          });
        } else {
          if (p.mesh.geometry) p.mesh.geometry.dispose();
          if (p.mesh.material && p.mesh.material.dispose) {
            p.mesh.material.dispose();
          }
        }
        particles.splice(pi, 1);
      }
    }
  }

  // Main Render Loop
  var clock = new THREE.Clock();
  function renderLoop() {
    animationFrameId = requestAnimationFrame(renderLoop);
    
    var dt = clock.getDelta();
    // Cap delta time to prevent massive jumps when tab loses focus
    if (dt > 0.1) dt = 0.1;
    
    update(dt);
    
    if (controls) {
      controls.update();
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function init() {
    container = $('beaker-scene-3d-container');
    if (!container) return;
    
    // Prevent multiple initializations
    if (renderer) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      renderer.dispose();
      container.innerHTML = '';
      particles = [];
    }
    
    var width = container.clientWidth || 520;
    var height = container.clientHeight || 560;
    
    // 1. Initialize Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 12.0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // 2. Initialize Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.12; // Allow slightly below-eye-level viewing
    controls.target.set(0, 0.6, 0); // focus higher to push beaker down
    
    // 3. Initialize Lighting
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);
    
    var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight1.position.set(5, 9, 4);
    dirLight1.castShadow = true;
    scene.add(dirLight1);
    
    var dirLight2 = new THREE.DirectionalLight(0x90b0ff, 0.3); // soft blue back highlight
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);
    
    pointLight = new THREE.PointLight(0xffaa44, 0, 8.0);
    scene.add(pointLight);
    
    // 4. Lab Bench / Floor removed per user request
    
    // 5. Beaker Assembly Modeling
    beakerGroup = new THREE.Group();
    scene.add(beakerGroup);
    
    glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.95,
      ior: 1.48,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    // Beaker body (open cylinder)
    var beakerBodyGeom = new THREE.CylinderGeometry(2, 2, 4.8, 48, 1, true);
    var beakerBody = new THREE.Mesh(beakerBodyGeom, glassMaterial);
    beakerGroup.add(beakerBody);
    
    // Beaker thick flat bottom
    var beakerBottomGeom = new THREE.CylinderGeometry(2, 2, 0.16, 32);
    var beakerBottom = new THREE.Mesh(beakerBottomGeom, glassMaterial);
    beakerBottom.position.y = -2.32;
    beakerGroup.add(beakerBottom);
    
    // Beaker rim torus
    var beakerRimGeom = new THREE.TorusGeometry(2, 0.04, 10, 48);
    var beakerRim = new THREE.Mesh(beakerRimGeom, glassMaterial);
    beakerRim.position.y = 2.4;
    beakerRim.rotation.x = Math.PI / 2;
    beakerGroup.add(beakerRim);
    
    // Spout (flared cylinder sector)
    var spoutGeom = new THREE.CylinderGeometry(2, 2.3, 0.4, 32, 1, true, Math.PI * 0.85, 0.55);
    var spout = new THREE.Mesh(spoutGeom, glassMaterial);
    spout.position.set(0, 2.22, 0);
    beakerGroup.add(spout);
    
    // High-Res Dynamic Scale Markings
    var markingsGeom = new THREE.CylinderGeometry(2.015, 2.015, 3.8, 32, 1, true, -Math.PI / 6, Math.PI / 3);
    var markingsMat = new THREE.MeshBasicMaterial({
      map: createMarkingsTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var markingsMesh = new THREE.Mesh(markingsGeom, markingsMat);
    markingsMesh.position.y = -0.3; // Center markings on container wall
    beakerGroup.add(markingsMesh);
    
    // 6. Dynamic Liquid Mesh Setup
    liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.65,
      depthWrite: false
    });
    var liquidGeom = new THREE.CylinderGeometry(1.97, 1.97, 3.12, 48);
    liquidMesh = new THREE.Mesh(liquidGeom, liquidMaterial);
    liquidMesh.position.y = -0.8; // top surface will be at y = 0.76
    beakerGroup.add(liquidMesh);
    
    // 7. Metal Lump Setup (Organic, rugged mesh chunk) — preview above beaker
    metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0a8b0,
      roughness: 0.45,
      metalness: 0.75
    });
    metalGeom = new THREE.DodecahedronGeometry(0.28, 1);
    metalMesh = new THREE.Mesh(metalGeom, metalMaterial);
    metalMesh.position.copy(state.metalPos);
    metalMesh.visible = false; // only appear when dropping into the beaker
    scene.add(metalMesh);
    
    // Sync current values immediately
    setMetal(currentMetal);
    setSolution(currentSolution);
    resetAnimation();
    
    bindCanvasClick();
    
    // Trigger initial resize after elements are added
    setTimeout(resize, 0);

    // Resize Observer to handle tab switching and responsive container resizing
    if (typeof ResizeObserver !== 'undefined') {
      var resizeObserver = new ResizeObserver(function () {
        resize();
      });
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', resize);
    
    // Trigger render loop
    clock.getDelta(); // reset clock
    renderLoop();
  }

  function resize() {
    if (!container || !renderer || !camera) return;
    var width = container.clientWidth;
    var height = container.clientHeight;
    if (width === 0 || height === 0) return;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  return {
    init: init,
    setMetal: setMetal,
    setSolution: setSolution,
    resetAnimation: resetAnimation,
    play: play,
    addMetal: addMetal,
    setOnCanvasClick: setOnCanvasClick,
    isBusy: isBusy,
    resize: resize
  };
})();
