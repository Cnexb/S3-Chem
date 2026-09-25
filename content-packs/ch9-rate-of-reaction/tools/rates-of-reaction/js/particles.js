/* HKDSE Rates of Reaction Lab — Particle Physics Simulation */
var Simulation = (function () {

  // Particle class representing ions, atoms, and bubbles
  function Particle(x, y, vx, vy, type, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type; // 'thio' (S2O3^2-), 'H' (H+), 'S' (S precipitate), 'SO2' (gas bubble)
    this.size = size;
    this.color = color;
    this.alpha = 1.0;
    this.isSettled = false;
  }

  Particle.prototype.update = function (width, height, liquidTop, liquidBottom, liquidLeft, liquidRight, dt) {
    if (this.isSettled) return;

    // Apply physics based on particle type
    if (this.type === 'S') {
      // Sulphur precipitate: drifts down with gravity and fluid resistance
      this.vy += 2.0 * dt; // gravity
      this.vx *= 0.98; // horizontal drag
      this.vy *= 0.95; // vertical drag
      
      this.x += this.vx;
      this.y += this.vy;

      // Settlement at the bottom of the beaker
      if (this.y >= liquidBottom - this.size) {
        this.y = liquidBottom - this.size;
        this.vx = 0;
        this.vy = 0;
        this.isSettled = true;
      }
    } else if (this.type === 'SO2') {
      // Gas bubble: rises up with buoyancy and wobbles
      this.vy -= 4.0 * dt; // buoyancy
      this.vx += (Math.random() - 0.5) * 15.0 * dt; // wobble
      this.vx *= 0.95; // horizontal drag
      this.vy *= 0.95; // vertical drag

      this.x += this.vx;
      this.y += this.vy;

      // Fade out near the surface
      if (this.y <= liquidTop + 10) {
        this.alpha -= 5.0 * dt;
        if (this.alpha <= 0) {
          this.alpha = 0;
          this.isSettled = true; // Mark for removal
        }
      }
    } else {
      // Ions: random thermal motion (bouncing)
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off liquid boundaries
      if (this.x <= liquidLeft + this.size) {
        this.x = liquidLeft + this.size;
        this.vx = -this.vx;
      }
      if (this.x >= liquidRight - this.size) {
        this.x = liquidRight - this.size;
        this.vx = -this.vx;
      }
      if (this.y <= liquidTop + this.size) {
        this.y = liquidTop + this.size;
        this.vy = -this.vy;
      }
      if (this.y >= liquidBottom - this.size) {
        this.y = liquidBottom - this.size;
        this.vy = -this.vy;
      }
    }
  };

  Particle.prototype.draw = function (ctx) {
    var needsSave = (this.alpha < 1.0 || this.type === 'SO2');
    if (needsSave) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Add highlighted shine for 3D effect
    if (this.type !== 'SO2') {
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    } else {
      // Bubble ring outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (needsSave) {
      ctx.restore();
    }
  };


  // Simulation Engine class
  function ParticleEngine(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.animationId = null;

    // Beaker dimensions in canvas coordinates
    this.beakerLeft = 60;
    this.beakerRight = 300;
    this.beakerBottom = 240;
    this.beakerTop = 30;
    this.liquidTop = 140; // Default liquid level

    // Environment state
    this.temperature = 25;
    this.speedMultiplier = 1.0;
    this.reactionRateFactor = 1.0;
    this.transmission = 100.0;
  }

  ParticleEngine.prototype.setTemperature = function (temp) {
    this.temperature = temp;
  };

  ParticleEngine.prototype.setLiquidLevel = function (totalVol) {
    // Map total volume to liquid height in canvas using a precise linear scale:
    // 0 mL corresponds to beakerBottom (240).
    // Each 50 mL corresponds to 40 pixels of height (0.8 pixels per mL).
    this.liquidTop = this.beakerBottom - totalVol * 0.8;
  };

  ParticleEngine.prototype.getLiquidColor = function (opacity) {
    var transmission = (this.transmission !== undefined) ? this.transmission : 100.0;
    var tPct = transmission / 100.0; // 0.0 to 1.0

    // Clear blue: rgba(224, 242, 254, opacity)
    // Cloudy yellow: rgba(253, 224, 71, opacity_cloudy)
    var r = Math.round(253 - 29 * tPct);
    var g = Math.round(224 + 18 * tPct);
    var b = Math.round(71 + 183 * tPct);
    
    // We want the alpha (opacity) to be adjusted based on the passed base opacity.
    // For liquid volume, clear is 0.45, cloudy is 0.95.
    // For meniscus, clear is 0.6, cloudy is 0.95.
    var maxAlpha = 0.95;
    var minAlpha = opacity;
    var a = minAlpha + (maxAlpha - minAlpha) * (1.0 - tPct);

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  };

  /**
   * Spawns reactant ions proportional to initial concentrations and volumes
   */
  ParticleEngine.prototype.populateReactants = function (initThio, initH) {
    this.particles = [];

    // Scale particle counts so they are visually clear but represent concentrations
    var baseThioCount = Math.round(initThio * 120);
    var baseHCount = Math.round(initH * 100);

    // Enforce reasonable visual limits
    var thioCount = Math.max(5, Math.min(50, baseThioCount));
    var hCount = Math.max(5, Math.min(60, baseHCount));

    // Temperature affects particle speed (thermal velocity v ~ sqrt(T))
    var speedMultiplier = Math.sqrt((this.temperature + 273.15) / 298.15);

    // Spawn S2O3^2- (Thiosulphate) - Blue spheres
    for (var i = 0; i < thioCount; i++) {
      var x = this.beakerLeft + 15 + Math.random() * (this.beakerRight - this.beakerLeft - 30);
      var y = this.liquidTop + 15 + Math.random() * (this.beakerBottom - this.liquidTop - 30);
      var speed = (1.5 + Math.random() * 2.0) * speedMultiplier;
      var angle = Math.random() * Math.PI * 2;
      this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 'thio', 7, '#3b82f6'));
    }

    // Spawn H+ (Hydrogen) - Red spheres
    for (var j = 0; j < hCount; j++) {
      var x = this.beakerLeft + 10 + Math.random() * (this.beakerRight - this.beakerLeft - 20);
      var y = this.liquidTop + 10 + Math.random() * (this.beakerBottom - this.liquidTop - 20);
      var speed = (2.5 + Math.random() * 3.0) * speedMultiplier; // H+ is smaller and moves faster
      var angle = Math.random() * Math.PI * 2;
      this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 'H', 4, '#ef4444'));
    }
  };

  /**
   * Simulates active collisions and triggers reactions
   */
  ParticleEngine.prototype.simulateCollisions = function (reactionRateFactor, dt) {
    // Check collisions between Thio (blue) and H+ (red)
    var thios = this.particles.filter(function (p) { return p.type === 'thio'; });
    var hs = this.particles.filter(function (p) { return p.type === 'H'; });

    var reactChance = 0.15 * reactionRateFactor; // Probability of reaction on collision

    for (var i = 0; i < thios.length; i++) {
      var pThio = thios[i];
      for (var j = 0; j < hs.length; j++) {
        var pH = hs[j];

        var dx = pThio.x - pH.x;
        var dy = pThio.y - pH.y;
        var distSq = dx * dx + dy * dy;
        var minDist = pThio.size + pH.size;

        if (distSq < minDist * minDist) {
          // Collision occurred! Bounce them off each other
          var tempVx = pThio.vx;
          var tempVy = pThio.vy;
          pThio.vx = pH.vx * 0.8;
          pThio.vy = pH.vy * 0.8;
          pH.vx = tempVx * 1.2;
          pH.vy = tempVy * 1.2;

          // Trigger reaction with a certain probability
          if (Math.random() < reactChance) {
            // Remove reactant ions
            this.removeParticle(pThio);
            this.removeParticle(pH);

            // Spawn yellow Sulphur precipitate atom
            var midX = (pThio.x + pH.x) / 2;
            var midY = (pThio.y + pH.y) / 2;
            this.particles.push(new Particle(midX, midY, (Math.random() - 0.5) * 1.0, 0.5, 'S', 5, '#facc15'));

            // Spawn rising SO2 gas bubble
            this.particles.push(new Particle(midX, midY, (Math.random() - 0.5) * 2.0, -1.0, 'SO2', 3 + Math.random() * 4, 'rgba(255,255,255,0.4)'));
            break;
          }
        }
      }
    }
  };

  ParticleEngine.prototype.removeParticle = function (p) {
    var idx = this.particles.indexOf(p);
    if (idx !== -1) {
      this.particles.splice(idx, 1);
    }
  };

  ParticleEngine.prototype.drawBeakerOutline = function () {
    var ctx = this.ctx;
    ctx.save();
    
    // Draw table surface line
    ctx.beginPath();
    ctx.moveTo(10, this.beakerBottom + 10);
    ctx.lineTo(this.canvas.width - 10, this.beakerBottom + 10);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw liquid volume
    ctx.beginPath();
    ctx.rect(this.beakerLeft, this.liquidTop, this.beakerRight - this.beakerLeft, this.beakerBottom - this.liquidTop);
    ctx.fillStyle = this.getLiquidColor(0.45); // Dynamic water color
    ctx.fill();

    // Draw glass beaker walls
    ctx.beginPath();
    ctx.moveTo(this.beakerLeft, this.beakerTop);
    ctx.lineTo(this.beakerLeft, this.beakerBottom);
    ctx.quadraticCurveTo(this.beakerLeft, this.beakerBottom + 8, this.beakerLeft + 8, this.beakerBottom + 8);
    ctx.lineTo(this.beakerRight - 8, this.beakerBottom + 8);
    ctx.quadraticCurveTo(this.beakerRight, this.beakerBottom + 8, this.beakerRight, this.beakerBottom);
    ctx.lineTo(this.beakerRight, this.beakerTop);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw beaker rim lip
    ctx.beginPath();
    ctx.ellipse((this.beakerLeft + this.beakerRight) / 2, this.beakerTop, (this.beakerRight - this.beakerLeft) / 2 + 4, 6, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw liquid surface meniscus
    ctx.beginPath();
    ctx.ellipse((this.beakerLeft + this.beakerRight) / 2, this.liquidTop, (this.beakerRight - this.beakerLeft) / 2, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.getLiquidColor(0.6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.stroke();

    // Draw graduation marks on the beaker
    ctx.fillStyle = 'rgba(71, 85, 105, 0.6)';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'right';
    var marks = [
      { y: 200, label: '50 mL' },
      { y: 160, label: '100 mL' },
      { y: 120, label: '150 mL' },
      { y: 80, label: '200 mL' },
      { y: 40, label: '250 mL' }
    ];
    marks.forEach(function (mark) {
      ctx.beginPath();
      ctx.moveTo(this.beakerRight - 15, mark.y);
      ctx.lineTo(this.beakerRight - 4, mark.y);
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillText(mark.label, this.beakerRight - 18, mark.y + 3);
    }, this);

    ctx.restore();
  };

  ParticleEngine.prototype.start = function (reactionRateFactor) {
    if (reactionRateFactor !== undefined) {
      this.reactionRateFactor = reactionRateFactor;
    }
    if (this.isRunning) return;
    this.isRunning = true;

    var self = this;
    var lastTime = performance.now();

    function loop(now) {
      if (!self.isRunning) return;

      var dt = (now - lastTime) / 1000.0;
      lastTime = now;

      // Limit dt to prevent massive jumps during lag spikes
      if (dt > 0.1) dt = 0.1;

      // Apply speed multiplier to physics simulation
      dt *= self.speedMultiplier;

      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

      // 1. Draw beaker background & liquid
      self.drawBeakerOutline();

      // 2. Simulate active collisions
      if (self.reactionRateFactor > 0) {
        self.simulateCollisions(self.reactionRateFactor, dt);
      }

      // 3. Update and draw all particles
      for (var i = self.particles.length - 1; i >= 0; i--) {
        var p = self.particles[i];
        p.update(self.canvas.width, self.canvas.height, self.liquidTop, self.beakerBottom, self.beakerLeft, self.beakerRight, dt);
        p.draw(self.ctx);

        // Remove SO2 bubbles that popped at the surface
        if (p.type === 'SO2' && p.isSettled) {
          self.particles.splice(i, 1);
        }
      }

      self.animationId = requestAnimationFrame(loop);
    }

    this.animationId = requestAnimationFrame(loop);
  };

  ParticleEngine.prototype.stop = function () {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  };

  return {
    ParticleEngine: ParticleEngine,
    Particle: Particle
  };
})();