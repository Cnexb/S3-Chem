/* HKDSE Chemistry Ionization Lab — Particle Physics Engine */
var ParticleEngine = (function () {
  
  // Particle Class Definition
  function Particle(x, y, vx, vy, type, label, size, color) {
    this.x = x;
    this.y = y;
    this.z = (Math.random() - 0.5) * 120; // 3D depth, default center around 0
    this.vx = vx;
    this.vy = vy;
    this.vz = (Math.random() - 0.5) * (Math.sqrt(vx*vx + vy*vy) || 1); // 3D velocity
    this.type = type; // 'HA' (bonded), 'H+', 'A-', 'OH-', 'M+', 'H2O'
    this.label = label || ''; // '+', '-', '2-', etc.
    this.size = size || 8;
    this.color = color || '#cbd5e1';
    
    // For HA bonded pairs, track rotation angle and bond distance
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.bondLength = 12;

    // Projected 3D screen coordinates
    this.px = x;
    this.py = y;
    this.pz = 0;
  }

  Particle.prototype.update = function (width, height, speedMultiplier, bounds, is3D) {
    this.angle += this.rotationSpeed * speedMultiplier;

    var margin = this.size + (this.type === 'HA' ? this.bondLength : 0);
    var left = bounds ? bounds.left : 0;
    var right = bounds ? bounds.right : width;
    var top = bounds ? bounds.top : 0;
    var bottom = bounds ? bounds.bottom : height;

    if (is3D) {
      // 3D physics updates inside a cylindrical beaker container
      this.x += this.vx * speedMultiplier;
      this.y += this.vy * speedMultiplier;
      this.z += this.vz * speedMultiplier;

      // Vertical bounce
      var minY = top + margin;
      var maxY = bottom - margin;
      if (this.y < minY) {
        this.y = minY;
        this.vy = -this.vy;
      } else if (this.y > maxY) {
        this.y = maxY;
        this.vy = -this.vy;
      }

      // Cylinder wall bounce: (x - centerX)^2 + z^2 <= maxRadius^2
      var centerX = (left + right) / 2;
      var maxRadius = (right - left) / 2 - margin;
      if (maxRadius < 5) maxRadius = 5;

      var lx = this.x - centerX;
      var lz = this.z;
      var dist = Math.sqrt(lx * lx + lz * lz);
      if (dist > maxRadius) {
        var nx = lx / dist;
        var nz = lz / dist;
        // Clamp to boundary
        this.x = centerX + nx * maxRadius;
        this.z = nz * maxRadius;

        // Reflect velocity in X-Z plane
        var vRadial = this.vx * nx + this.vz * nz;
        if (vRadial > 0) {
          this.vx = this.vx - 2 * vRadial * nx;
          this.vz = this.vz - 2 * vRadial * nz;
        }
      }
    } else {
      // Classic 2D physics updates
      this.x += this.vx * speedMultiplier;
      this.y += this.vy * speedMultiplier;
      this.z = 0; // reset depth
      
      var minX = left + margin;
      var maxX = right - margin;
      var minY = top + margin;
      var maxY = bottom - margin;

      if (this.x < minX) {
        this.x = minX;
        this.vx = -this.vx;
      } else if (this.x > maxX) {
        this.x = maxX;
        this.vx = -this.vx;
      }

      if (this.y < minY) {
        this.y = minY;
        this.vy = -this.vy;
      } else if (this.y > maxY) {
        this.y = maxY;
        this.vy = -this.vy;
      }
    }
  };

  Particle.prototype.project3D = function (cosPitch, sinPitch, cosYaw, sinYaw, centerX, bottomY) {
    // Local cylinder coords: X right, Y up from beaker floor, Z depth
    var lx = this.x - centerX;
    var ly = bottomY - this.y;
    var lz = this.z;

    var rotX = lx * cosYaw - lz * sinYaw;
    var rotZ = lx * sinYaw + lz * cosYaw;

    var rotY = ly * cosPitch - rotZ * sinPitch;
    var depthZ = ly * sinPitch + rotZ * cosPitch;

    this.px = centerX + rotX;
    this.py = bottomY - rotY;
    this.pz = depthZ;
    return this;
  };

  Particle.prototype.draw = function (ctx, is3D, cosPitch, sinPitch, cosYaw, sinYaw, centerX, bottomY) {
    var floorY = (typeof bottomY === 'number') ? bottomY : 259;
    // Projection-only dry run (used for depth sorting) — must not touch ctx
    if (!ctx) {
      if (is3D) {
        this.project3D(cosPitch, sinPitch, cosYaw, sinYaw, centerX, floorY);
      } else {
        this.px = this.x;
        this.py = this.y;
        this.pz = 0;
      }
      return;
    }

    ctx.save();
    
    // Coordinates used for drawing
    var drawX = this.x;
    var drawY = this.y;
    var drawSize = this.size;
    var opacityMultiplier = 1.0;

    if (is3D) {
      // Use pre-projected coordinates from depth-sorting dry run
      drawX = this.px;
      drawY = this.py;

      // Perspective size scaling: farther particles are smaller, closer are larger
      var scale = 1.0 + (this.pz / 260.0);
      drawSize = this.size * scale;
      if (drawSize < 1.5) drawSize = 1.5;

      opacityMultiplier = Math.max(0.45, Math.min(1.0, 0.85 + (this.pz / 260.0)));
    } else {
      this.px = this.x;
      this.py = this.y;
      this.pz = 0;
    }
    
    if (this.type === 'HA') {
      // Draw Bonded Acid/Base Molecule (e.g., CH3COOH or undissociated NH3)
      // Large body (Anion/Base Core)
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 163, 184, ' + opacityMultiplier + ')'; // neutral grey core
      ctx.fill();
      ctx.strokeStyle = 'rgba(71, 85, 105, ' + opacityMultiplier + ')';
      ctx.lineWidth = is3D ? 1.0 : 1.5;
      ctx.stroke();
      
      // Bond connector stick
      var bondX = drawX + Math.cos(this.angle) * this.bondLength * (is3D ? (1.0 + this.pz/260.0) : 1.0);
      var bondY = drawY + Math.sin(this.angle) * this.bondLength * (is3D ? (1.0 + this.pz/260.0) : 1.0);
      ctx.beginPath();
      ctx.moveTo(drawX, drawY);
      ctx.lineTo(bondX, bondY);
      ctx.strokeStyle = 'rgba(71, 85, 105, ' + opacityMultiplier + ')';
      ctx.lineWidth = is3D ? 1.5 : 2.5;
      ctx.stroke();
      
      // Attached Hydrogen (small red sphere)
      ctx.beginPath();
      ctx.arc(bondX, bondY, 4.5 * (is3D ? (1.0 + this.pz/260.0) : 1.0), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(248, 113, 113, ' + opacityMultiplier + ')'; // pale red
      ctx.fill();
      ctx.stroke();
      
    } else if (this.type === 'H2O') {
      // Draw Faint Water Molecule in background (Drifting mickey-mouse shape)
      var h2oOpacity = 0.25 * opacityMultiplier;
      ctx.beginPath();
      ctx.arc(drawX, drawY, 3 * (is3D ? (1.0 + this.pz/260.0) : 1.0), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(186, 230, 253, ' + h2oOpacity + ')'; // very translucent oxygen
      ctx.fill();
      
      // Two small hydrogens
      var dxVal = 2.5 * (is3D ? (1.0 + this.pz/260.0) : 1.0);
      var dyVal = 1.5 * (is3D ? (1.0 + this.pz/260.0) : 1.0);
      var hRad = 1.2 * (is3D ? (1.0 + this.pz/260.0) : 1.0);
      ctx.beginPath();
      ctx.arc(drawX - dxVal, drawY - dyVal, hRad, 0, Math.PI * 2);
      ctx.arc(drawX + dxVal, drawY - dyVal, hRad, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.35 * opacityMultiplier) + ')';
      ctx.fill();
      
    } else {
      // Draw free dissociated ions
      ctx.beginPath();
      ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
      
      // Handle translucent CSS coloring
      if (this.color.indexOf('rgba') === 0) {
        ctx.fillStyle = this.color;
      } else {
        // Hex to translucent rgb
        var hex = this.color.replace('#', '');
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);
        ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacityMultiplier + ')';
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(51, 65, 85, ' + opacityMultiplier + ')';
      ctx.lineWidth = is3D ? 1.0 : 1.5;
      ctx.stroke();

      // Add a subtle glow for H+ (active hydrogen)
      if (this.type === 'H+') {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = is3D ? 4 : 6;
        ctx.fillStyle = ctx.fillStyle; // re-assert
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Render Label (+ or -) in center of ion
      if (this.label) {
        var labelFontSize = drawSize * 1.1;
        ctx.font = 'bold ' + labelFontSize + 'px sans-serif';
        ctx.fillStyle = 'rgba(30, 41, 59, ' + opacityMultiplier + ')';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, drawX, drawY + (this.label === '+' ? 0 : -0.5));
      }
    }
    
    ctx.restore();
  };


  // Main Engine Class
  function Engine(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.particles = [];
    this.showH2O = true;
    this.speedMultiplier = 0.8;
    this.animationId = null;
    this.liquidBoundary = null; // custom boundary for liquid level
    
    // Target counts based on active chemical state
    this.targetMolecules = 0; // undissociated
    this.targetCations = 0;   // free positive ions
    this.targetAnions = 0;    // free negative ions
    
    this.chemType = 'acid'; // 'acid' or 'alkali'
    this.chemId = 'hcl';
    
    // Dynamic equilibrium parameters
    this.splitProbability = 0.005;
    this.combineProbability = 0.02;

    // 3D Orbital properties
    this.is3D = false;
    this.pitch = 0.42; // default looking slightly down (clear elliptical rim)
    this.yaw = 0.35;   // slight side angle so cylinder reads in 3D
    this.yawVelocity = 0;
    this.pitchVelocity = 0;
    this.liquidColor = 'rgba(56, 189, 248, 0.45)';
    
    this.initWaterBackground();
    this.initInteractions();
  }

  Engine.prototype.initInteractions = function () {
    var self = this;
    self.isDragging = false;
    var lastMouseX = 0;
    var lastMouseY = 0;

    var onStart = function (clientX, clientY) {
      if (!self.is3D) return;
      self.isDragging = true;
      self.yawVelocity = 0;
      self.pitchVelocity = 0;
      lastMouseX = clientX;
      lastMouseY = clientY;
      self.canvas.style.cursor = 'grabbing';
    };

    var onMove = function (clientX, clientY) {
      if (!self.isDragging || !self.is3D) return;
      var dx = clientX - lastMouseX;
      var dy = clientY - lastMouseY;

      var dyaw = dx * 0.008;
      var dpitch = dy * 0.008;

      self.yaw += dyaw;
      // Keep pitch in a range where the rim ellipse always stays readable
      self.pitch = Math.max(0.18, Math.min(0.85, self.pitch + dpitch));

      // Track dragging velocity for momentum/inertia
      self.yawVelocity = dyaw;
      self.pitchVelocity = dpitch;

      lastMouseX = clientX;
      lastMouseY = clientY;
    };

    var onEnd = function () {
      self.isDragging = false;
      if (self.is3D) self.canvas.style.cursor = 'grab';
    };

    this.canvas.addEventListener('mousedown', function (e) {
      onStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', function (e) {
      onMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', onEnd);

    // Touch support
    this.canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length > 0) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    window.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    window.addEventListener('touchend', onEnd);
  };

  Engine.prototype.setShowH2O = function (show) {
    this.showH2O = show;
  };

  Engine.prototype.setLiquidBoundary = function (left, right, top, bottom) {
    this.liquidBoundary = { left: left, right: right, top: top, bottom: bottom };
    
    // Immediately clamp any existing particles and water particles to be within these bounds
    var self = this;
    var clampParticles = function (p) {
      var margin = p.size + (p.type === 'HA' ? p.bondLength : 0);
      var minX = left + margin;
      var maxX = right - margin;
      var minY = top + margin;
      var maxY = bottom - margin;
      
      if (p.x < minX) { p.x = minX; p.vx = Math.abs(p.vx); }
      else if (p.x > maxX) { p.x = maxX; p.vx = -Math.abs(p.vx); }
      
      if (p.y < minY) { p.y = minY; p.vy = Math.abs(p.vy); }
      else if (p.y > maxY) { p.y = maxY; p.vy = -Math.abs(p.vy); }
    };
    
    this.particles.forEach(clampParticles);
    if (this.waterParticles) {
      this.waterParticles.forEach(clampParticles);
    }
  };

  Engine.prototype.initWaterBackground = function () {
    this.waterParticles = [];
    var bounds = this.liquidBoundary;
    for (var i = 0; i < 25; i++) {
      var x = bounds ? bounds.left + Math.random() * (bounds.right - bounds.left) : Math.random() * this.width;
      var y = bounds ? bounds.top + Math.random() * (bounds.bottom - bounds.top) : Math.random() * this.height;
      var vx = (Math.random() - 0.5) * 0.25;
      var vy = (Math.random() - 0.5) * 0.25;
      this.waterParticles.push(new Particle(x, y, vx, vy, 'H2O', '', 3, ''));
    }
  };

  /**
   * Set target state of the beaker simulation
   * @param {object} props - Properties solved by chemistry engine
   */
  Engine.prototype.setState = function (props) {
    this.chemType = props.type;
    this.chemId = props.id;
    
    // Base standard particle count mapping for visualization
    var baseCapacity = 16;
    if (this.width < 150) baseCapacity = 6; // mini cups
    else if (this.width < 250) baseCapacity = 12; // medium compare cups
    
    var conc = props.dissolvedMolarity;
    
    // Map concentration dynamically to particle density on screen
    var densityFactor = 0.4; // 0.1M standard
    if (conc <= 0.0011) densityFactor = 0.15;
    else if (conc <= 0.011) densityFactor = 0.25;
    else if (conc <= 0.11) densityFactor = 0.4;
    else if (conc <= 1.1) densityFactor = 0.7;
    else densityFactor = 1.0; // high conc
    
    var activeTotalParticles = Math.round(baseCapacity * densityFactor);
    if (activeTotalParticles < 2 && conc > 0) activeTotalParticles = 2;
    
    var alpha = props.alpha;
    
    if (props.type === 'acid') {
      if (props.id === 'h2so4') {
        // H2SO4: H2SO4 -> 2H+ + SO42-
        this.targetCations = Math.round(activeTotalParticles * 2); // Double H+
        this.targetAnions = activeTotalParticles; // Single SO42-
        this.targetMolecules = 0; // Fully dissociated
      } else if (props.strength === 'strong') {
        this.targetCations = activeTotalParticles;
        this.targetAnions = activeTotalParticles;
        this.targetMolecules = 0;
      } else {
        // Weak acid HA ⇌ H+ + A-
        this.targetCations = Math.round(activeTotalParticles * alpha);
        this.targetAnions = this.targetCations;
        this.targetMolecules = activeTotalParticles - this.targetCations;
      }
    } else {
      // Alkalis
      if (props.id === 'caoh2') {
        // Ca(OH)2 -> Ca2+ + 2OH-
        this.targetCations = activeTotalParticles; // Ca2+
        this.targetAnions = Math.round(activeTotalParticles * 2); // 2OH-
        this.targetMolecules = 0;
      } else if (props.strength === 'strong') {
        this.targetCations = activeTotalParticles; // Na+, K+
        this.targetAnions = activeTotalParticles;  // OH-
        this.targetMolecules = 0;
      } else {
        // Weak alkali NH3 + H2O ⇌ NH4+ + OH-
        this.targetCations = Math.round(activeTotalParticles * alpha); // NH4+
        this.targetAnions = this.targetCations; // OH-
        this.targetMolecules = activeTotalParticles - this.targetCations;
      }
    }
    
    this.synchronizeParticles();
  };

  /**
   * Re-seed particles or gently adjust to reach target counts
   */
  Engine.prototype.synchronizeParticles = function () {
    // Filter out previous acid particles, keep water
    var activeAcidBaseParticles = this.particles.filter(function (p) {
      return p.type !== 'H2O';
    });
    
    var currentMolecules = activeAcidBaseParticles.filter(function (p) { return p.type === 'HA'; });
    var currentCations = activeAcidBaseParticles.filter(function (p) { return p.type === 'H+' || (p.type === 'M+' && p.label === '+') || (p.type === 'M+' && p.label === '2+'); });
    var currentAnions = activeAcidBaseParticles.filter(function (p) { return p.type === 'A-' || p.type === 'OH-'; });
    
    // Helper to spawn a new particle
    var self = this;
    function spawnParticle(type, label, size, color) {
      var margin = size + 15;
      var bounds = self.liquidBoundary;
      var x, y;
      if (bounds) {
        x = bounds.left + margin + Math.random() * (bounds.right - bounds.left - margin * 2);
        y = bounds.top + margin + Math.random() * (bounds.bottom - bounds.top - margin * 2);
      } else {
        x = margin + Math.random() * (self.width - margin * 2);
        y = margin + Math.random() * (self.height - margin * 2);
      }
      var angle = Math.random() * Math.PI * 2;
      var speed = 0.5 + Math.random() * 0.8;
      var vx = Math.cos(angle) * speed;
      var vy = Math.sin(angle) * speed;
      
      return new Particle(x, y, vx, vy, type, label, size, color);
    }
    
    // Handle Cations adjustment
    while (currentCations.length < this.targetCations) {
      var isH = this.chemType === 'acid';
      var label = (this.chemId === 'caoh2') ? '2+' : '+';
      var size = isH ? 5.5 : 8.5; // H+ is tiny, metal cations / NH4+ are larger
      var color = isH ? '#f87171' : '#f59e0b'; // Red for H+, Orange/Yellow for Na+/Ca2+
      var pType = isH ? 'H+' : 'M+';
      var p = spawnParticle(pType, label, size, color);
      this.particles.push(p);
      currentCations.push(p);
    }
    while (currentCations.length > this.targetCations) {
      var idx = this.particles.findIndex(function (p) { return p.type === 'H+' || p.type === 'M+'; });
      if (idx !== -1) {
        this.particles.splice(idx, 1);
        currentCations.pop();
      }
    }
    
    // Handle Anions adjustment
    while (currentAnions.length < this.targetAnions) {
      var isOH = this.chemType === 'alkali';
      var label = (this.chemId === 'h2so4') ? '2-' : '-';
      var size = isOH ? 5.5 : 9; // OH- is smaller, acid anions Cl-/SO42- are large
      var color = isOH ? '#c084fc' : '#38bdf8'; // Purple for OH-, Cyan/Blue for anions
      var pType = isOH ? 'OH-' : 'A-';
      var p = spawnParticle(pType, label, size, color);
      this.particles.push(p);
      currentAnions.push(p);
    }
    while (currentAnions.length > this.targetAnions) {
      var idx = this.particles.findIndex(function (p) { return p.type === 'OH-' || p.type === 'A-'; });
      if (idx !== -1) {
        this.particles.splice(idx, 1);
        currentAnions.pop();
      }
    }
    
    // Handle intact Undissociated Molecules adjustment
    while (currentMolecules.length < this.targetMolecules) {
      var p = spawnParticle('HA', '', 8, '#94a3b8');
      this.particles.push(p);
      currentMolecules.push(p);
    }
    while (currentMolecules.length > this.targetMolecules) {
      var idx = this.particles.findIndex(function (p) { return p.type === 'HA'; });
      if (idx !== -1) {
        this.particles.splice(idx, 1);
        currentMolecules.pop();
      }
    }
  };

  /**
   * Simulate spontaneous weak ionization dynamic equilibrium
   */
  Engine.prototype.simulateEquilibrium = function () {
    // Only weak acids / alkalis undergo dynamic split & recombination
    if (this.targetMolecules === 0) return;
    
    var activeMolecules = this.particles.filter(function (p) { return p.type === 'HA'; });
    var activeCations = this.particles.filter(function (p) { return p.type === 'H+' || (p.type === 'M+' && p.label === '+'); });
    var activeAnions = this.particles.filter(function (p) { return p.type === 'A-' || p.type === 'OH-'; });
    
    // Dynamic feedback logic:
    // If we have excess molecules, increase split chance.
    // If we have excess ions, increase combination chance.
    var currentIonized = activeCations.length;
    var targetIonized = this.targetCations;
    
    var adjustedSplitProb = this.splitProbability;
    var adjustedCombineProb = this.combineProbability;
    
    // Enforce weak ionization limitation:
    // If half or more of the compound is ionized (cations / (cations + molecules) >= 0.5),
    // then the compound molecules will not dissociate further on their own
    // until some of the ions react back and reform molecules (lowering the ionized fraction below 50%).
    var totalCompoundCount = activeMolecules.length + activeCations.length;
    var ionizedFraction = totalCompoundCount > 0 ? (activeCations.length / totalCompoundCount) : 0;
    if (ionizedFraction >= 0.5) {
      adjustedSplitProb = 0; // stop spontaneous dissociation completely
    }

    if (currentIonized < targetIonized) {
      adjustedSplitProb *= 2.0; // split faster
      adjustedCombineProb *= 0.5; // combine slower
    } else if (currentIonized > targetIonized) {
      adjustedSplitProb *= 0.5; // split slower
      adjustedCombineProb *= 2.0; // combine faster
    }
    
    // 1. Spontaneous Dissociation (HA -> H+ + A-)
    // Double check split probability isn't zero due to the 50% limit
    if (adjustedSplitProb > 0) {
      for (var i = this.particles.length - 1; i >= 0; i--) {
        var p = this.particles[i];
        if (p.type === 'HA' && Math.random() < adjustedSplitProb) {
          // Remove molecule
          this.particles.splice(i, 1);
          
          // Spawn pair in its place
          var isAcid = this.chemType === 'acid';
          
          // Cation
          var catSize = isAcid ? 5.5 : 8.5;
          var catColor = isAcid ? '#f87171' : '#f59e0b';
          var catType = isAcid ? 'H+' : 'M+';
          var catLabel = '+';
          var catPart = new Particle(p.x - 5, p.y, -1, (Math.random() - 0.5), catType, catLabel, catSize, catColor);
          
          // Anion
          var aniSize = isAcid ? 9 : 5.5;
          var aniColor = isAcid ? '#38bdf8' : '#c084fc';
          var aniType = isAcid ? 'A-' : 'OH-';
          var aniLabel = '-';
          var aniPart = new Particle(p.x + 5, p.y, 1, (Math.random() - 0.5), aniType, aniLabel, aniSize, aniColor);
          
          this.particles.push(catPart, aniPart);
          break; // one split per frame is plenty
        }
      }
    }
    
    // 2. Physical Collision-Based Recombination (Cation + Anion physically overlap -> HA)
    var catIdx = -1;
    var aniIdx = -1;
    
    // Check all pairs of particles to detect an actual physical overlap/collision
    for (var i = 0; i < this.particles.length; i++) {
      var pCat = this.particles[i];
      if (pCat.type === 'H+' || (pCat.type === 'M+' && pCat.label === '+')) {
        for (var j = 0; j < this.particles.length; j++) {
          var pAni = this.particles[j];
          if (pAni.type === 'A-' || pAni.type === 'OH-') {
            var dx = pCat.x - pAni.x;
            var dy = pCat.y - pAni.y;
            var distSq = dx * dx + dy * dy;
            
            // Recombine if they physically collide/overlap (with 4px contact tolerance buffer)
            var collisionDist = pCat.size + pAni.size + 4.0;
            if (distSq < collisionDist * collisionDist) {
              catIdx = i;
              aniIdx = j;
              break;
            }
          }
        }
      }
      if (catIdx !== -1) break;
    }
    
    if (catIdx !== -1 && aniIdx !== -1) {
      var pCat = this.particles[catIdx];
      var pAni = this.particles[aniIdx];
      
      if (Math.random() < adjustedCombineProb) {
        // Combine them at their exact midpoint
        var midX = (pCat.x + pAni.x) / 2;
        var midY = (pCat.y + pAni.y) / 2;
        
        // Remove both ions (remove larger index first to keep indices stable)
        if (catIdx > aniIdx) {
          this.particles.splice(catIdx, 1);
          this.particles.splice(aniIdx, 1);
        } else {
          this.particles.splice(aniIdx, 1);
          this.particles.splice(catIdx, 1);
        }
        
        // Spawn original un-dissociated compound molecule
        var speed = 0.5 + Math.random() * 0.8;
        var angle = Math.random() * Math.PI * 2;
        var molPart = new Particle(midX, midY, Math.cos(angle) * speed, Math.sin(angle) * speed, 'HA', '', 8, '#94a3b8');
        this.particles.push(molPart);
      }
    }
  };

  Engine.prototype.start = function () {
    if (this.animationId) return;
    
    var self = this;

    var cosPitch = Math.cos(self.pitch);
    var sinPitch = Math.sin(self.pitch);
    var cosYaw = Math.cos(self.yaw);
    var sinYaw = Math.sin(self.yaw);
    
    // Project local cylinder coords (x right, y up from floor, z depth) to screen
    function project3D(lx, ly, lz, centerX, bottomY) {
      var rx = lx * cosYaw - lz * sinYaw;
      var rz = lx * sinYaw + lz * cosYaw;
      var ry = ly * cosPitch - rz * sinPitch;
      var rdepth = ly * sinPitch + rz * cosPitch;
      return { x: centerX + rx, y: bottomY - ry, z: rdepth };
    }

    function ellipseRadii(radius) {
      // Horizontal circles foreshorten with pitch; keep a readable minimum
      var rY = Math.max(8, radius * sinPitch);
      return { rX: radius, rY: rY };
    }

    function drawDarkGlassBeaker(ctx, centerX, bottomY, topY, radius, liquidTopY, liquidColor) {
      var er = ellipseRadii(radius);
      var rimR = radius * 1.06;
      var rimEr = ellipseRadii(rimR);
      var left = centerX - radius;
      var right = centerX + radius;

      // Soft floor glow / tabletop shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, bottomY + 6, radius * 1.15, Math.max(6, er.rY * 0.55), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
      ctx.fill();
      ctx.restore();

      // Back glass wall (translucent light gray body)
      var glassBody = ctx.createLinearGradient(left, topY, right, bottomY);
      glassBody.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
      glassBody.addColorStop(0.5, 'rgba(203, 213, 225, 0.12)');
      glassBody.addColorStop(1, 'rgba(226, 232, 240, 0.18)');

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, topY, er.rX, er.rY, 0, Math.PI, 0, true); // back half of top
      ctx.lineTo(right, bottomY);
      ctx.ellipse(centerX, bottomY, er.rX, er.rY, 0, 0, Math.PI, false);
      ctx.closePath();
      ctx.fillStyle = glassBody;
      ctx.fill();
      ctx.restore();

      // Liquid volume
      if (liquidTopY < bottomY - 2) {
        var liqEr = ellipseRadii(radius * 0.96);
        var liqLeft = centerX - radius * 0.96;
        var liqRight = centerX + radius * 0.96;

        ctx.save();
        // Bottom disk
        ctx.beginPath();
        ctx.ellipse(centerX, bottomY - 2, liqEr.rX, liqEr.rY, 0, 0, Math.PI * 2);
        ctx.fillStyle = liquidColor;
        ctx.fill();

        // Side body
        ctx.beginPath();
        ctx.ellipse(centerX, liquidTopY, liqEr.rX, liqEr.rY, 0, Math.PI, 0, true);
        ctx.lineTo(liqRight, bottomY - 2);
        ctx.ellipse(centerX, bottomY - 2, liqEr.rX, liqEr.rY, 0, 0, Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = liquidColor;
        ctx.fill();

        // Meniscus / surface
        var meniscus = ctx.createRadialGradient(
          centerX - liqEr.rX * 0.2, liquidTopY - liqEr.rY * 0.3, 4,
          centerX, liquidTopY, liqEr.rX
        );
        meniscus.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        meniscus.addColorStop(0.35, liquidColor);
        meniscus.addColorStop(1, 'rgba(71, 85, 105, 0.35)');
        ctx.beginPath();
        ctx.ellipse(centerX, liquidTopY, liqEr.rX, liqEr.rY, 0, 0, Math.PI * 2);
        ctx.fillStyle = meniscus;
        ctx.fill();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Front glass silhouette + rim (refined light glass outlines)
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(left, topY);
      ctx.lineTo(left, bottomY);
      ctx.moveTo(right, topY);
      ctx.lineTo(right, bottomY);
      ctx.stroke();

      // Bottom front arc
      ctx.beginPath();
      ctx.ellipse(centerX, bottomY, er.rX, er.rY, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.stroke();

      // Thick top rim ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, topY, rimEr.rX, rimEr.rY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Inner rim edge for glass thickness
      ctx.beginPath();
      ctx.ellipse(centerX, topY + 1, er.rX * 0.97, er.rY * 0.97, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Specular glares on glass
      ctx.save();
      var glare = ctx.createLinearGradient(left, topY, left + radius * 0.35, topY);
      glare.addColorStop(0, 'rgba(255,255,255,0.28)');
      glare.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glare;
      ctx.fillRect(left + 3, topY + 4, radius * 0.28, bottomY - topY - 8);

      var glareR = ctx.createLinearGradient(right - radius * 0.2, topY, right, topY);
      glareR.addColorStop(0, 'rgba(255,255,255,0)');
      glareR.addColorStop(1, 'rgba(255,255,255,0.18)');
      ctx.fillStyle = glareR;
      ctx.fillRect(right - radius * 0.2 - 2, topY + 4, radius * 0.2, bottomY - topY - 8);
      ctx.restore();

      // Slate-gray graduation marks on the curved glass (rotate with yaw)
      var ticks = [
        { label: '100 ml', h: 149 },
        { label: '80 ml', h: 119 },
        { label: '60 ml', h: 89 },
        { label: '40 ml', h: 60 },
        { label: '20 ml', h: 30 }
      ];
      var markAngle = Math.PI - 0.55 + self.yaw * 0; // fixed on local glass face; yaw rotates via project3D
      // Keep marks on a fixed local angle of the cylinder; camera yaw rotates them
      markAngle = Math.PI - 0.55;

      ctx.save();
      ctx.font = 'bold 10px "Segoe UI", sans-serif';
      ctx.textAlign = 'left';
      ticks.forEach(function (tick) {
        var ox = radius * 0.92 * Math.cos(markAngle);
        var oz = radius * 0.92 * Math.sin(markAngle);
        var pOuter = project3D(ox, tick.h, oz, centerX, bottomY);
        var ix = radius * 0.78 * Math.cos(markAngle);
        var iz = radius * 0.78 * Math.sin(markAngle);
        var pInner = project3D(ix, tick.h, iz, centerX, bottomY);

        // Fade marks when rotated to the back
        var alpha = Math.max(0, Math.min(1, (pOuter.z + 40) / 80));
        if (alpha < 0.12) return;

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.8)';
        ctx.fillStyle = 'rgba(71, 85, 105, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(pOuter.x, pOuter.y);
        ctx.lineTo(pInner.x, pInner.y);
        ctx.stroke();
        ctx.fillText(tick.label, pInner.x + 4, pInner.y + 3);
      });
      ctx.restore();
    }

    function renderLoop() {
      self.ctx.clearRect(0, 0, self.width, self.height);
      
      var centerX = 160;
      var bottomY = 255;
      var topY = 78;
      var radius = 96;
      if (self.liquidBoundary) {
        centerX = (self.liquidBoundary.left + self.liquidBoundary.right) / 2;
        bottomY = self.liquidBoundary.bottom;
        radius = (self.liquidBoundary.right - self.liquidBoundary.left) / 2;
      }
      var liquidTopY = self.liquidBoundary ? self.liquidBoundary.top : 180;

      // Apply momentum/inertia on 3D rotation when not dragging
      if (self.is3D && !self.isDragging) {
        if (Math.abs(self.yawVelocity) > 0.0001) {
          self.yaw += self.yawVelocity;
          self.yawVelocity *= 0.95; // decay factor
        } else {
          self.yawVelocity = 0;
        }
        if (Math.abs(self.pitchVelocity) > 0.0001) {
          self.pitch = Math.max(0.18, Math.min(0.85, self.pitch + self.pitchVelocity));
          self.pitchVelocity *= 0.95; // decay factor
        } else {
          self.pitchVelocity = 0;
        }
      }

      // 1. Update water and compound particles
      if (self.showH2O) {
        self.waterParticles.forEach(function (wp) {
          wp.update(self.width, self.height, self.speedMultiplier, self.liquidBoundary, self.is3D);
        });
      }

      self.simulateEquilibrium();

      self.particles.forEach(function (p) {
        p.update(self.width, self.height, self.speedMultiplier, self.liquidBoundary, self.is3D);
      });

      if (self.is3D) {
        cosPitch = Math.cos(self.pitch);
        sinPitch = Math.sin(self.pitch);
        cosYaw = Math.cos(self.yaw);
        sinYaw = Math.sin(self.yaw);

        var renderList = [];
        if (self.showH2O) {
          self.waterParticles.forEach(function (wp) {
            wp.draw(null, true, cosPitch, sinPitch, cosYaw, sinYaw, centerX, bottomY);
            renderList.push(wp);
          });
        }
        self.particles.forEach(function (p) {
          p.draw(null, true, cosPitch, sinPitch, cosYaw, sinYaw, centerX, bottomY);
          renderList.push(p);
        });

        renderList.sort(function (a, b) { return a.pz - b.pz; });

        // Sort background and foreground lists
        var backgroundParticles = [];
        var foregroundParticles = [];
        renderList.forEach(function (p) {
          if (p.pz < 0) backgroundParticles.push(p);
          else foregroundParticles.push(p);
        });

        // Back particles (behind liquid / glass)
        backgroundParticles.forEach(function (p) {
          p.draw(self.ctx, true, null, null, null, null, centerX, bottomY);
        });

        // Full dark translucent 3D beaker + liquid
        drawDarkGlassBeaker(
          self.ctx, centerX, bottomY, topY, radius,
          liquidTopY, self.liquidColor || 'rgba(100, 160, 200, 0.45)'
        );

        // Front particles
        foregroundParticles.forEach(function (p) {
          p.draw(self.ctx, true, null, null, null, null, centerX, bottomY);
        });

        // Drag hint removed, handled via HTML tip

        self.canvas.style.pointerEvents = 'auto';
        if (self.isDragging) {
          self.canvas.style.cursor = 'grabbing';
        } else {
          self.canvas.style.cursor = 'grab';
        }
      } else {
        self.canvas.style.pointerEvents = 'none';
        self.canvas.style.cursor = 'default';
        if (self.showH2O) {
          self.waterParticles.forEach(function (wp) {
            wp.draw(self.ctx, false);
          });
        }
        self.particles.forEach(function (p) {
          p.draw(self.ctx, false);
        });
      }
      
      self.animationId = requestAnimationFrame(renderLoop);
    }
    
    this.animationId = requestAnimationFrame(renderLoop);
  };

  Engine.prototype.stop = function () {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  };

  Engine.prototype.clearAll = function () {
    this.particles = [];
  };

  return Engine;
})();
