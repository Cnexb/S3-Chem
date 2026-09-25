/* HKDSE Rates of Reaction Lab — Main Application Controller */
document.addEventListener('DOMContentLoaded', function () {

  // 1. Initialize bilingual system
  I18n.init();
  I18n.onChange(function () {
    // Redraw graphs and update text when language changes
    updateUIReadings();
    updateGraphs();
  });

  // 2. DOM Elements Reference Dictionary
  var UI = {
    // Sliders & Controls
    thioConc: document.getElementById('slider-thiosulphate-conc'),
    thioVol: document.getElementById('slider-thiosulphate-vol'),
    waterVol: document.getElementById('slider-water-vol'),
    acidType: document.getElementById('select-acid-type'),
    acidConc: document.getElementById('slider-acid-conc'),
    acidVol: document.getElementById('slider-acid-vol'),
    temperature: document.getElementById('slider-temperature'),

    // Inputs (Type-in)
    inputThioConc: document.getElementById('input-thiosulphate-conc'),
    inputThioVol: document.getElementById('input-thiosulphate-vol'),
    inputWaterVol: document.getElementById('input-water-vol'),
    inputAcidConc: document.getElementById('input-acid-conc'),
    inputAcidVol: document.getElementById('input-acid-vol'),
    inputTemperature: document.getElementById('input-temperature'),

    // Buttons
    btnStart: document.getElementById('btn-start'),
    btnPause: document.getElementById('btn-pause'),
    btnReset: document.getElementById('btn-reset'),
    btnClearTrials: document.getElementById('btn-clear-trials'),
    btnLangToggle: document.getElementById('lang-toggle-btn'),
    toggleSettingsBtn: document.getElementById('toggle-settings-btn'),
    btnSkip: document.getElementById('btn-skip'),

    // Speed Control
    sliderSpeed: document.getElementById('slider-speed'),
    valSpeed: document.getElementById('val-speed'),
    gridLayout: document.querySelector('.lab-grid'),

    // Readings Displays
    readTime: document.getElementById('read-time'),
    readStatus: document.getElementById('read-status'),
    readRate: document.getElementById('read-rate'),
    readTotalVol: document.getElementById('read-total-vol'),
    transmissionDisplay: document.getElementById('transmission-display'),

    // Visual Elements
    paperCross: document.getElementById('paper-cross'),
    beakerLiquidTd: document.getElementById('beaker-liquid-td'),
    envEffect: document.getElementById('heating-cooling-effect'),
    burnerFlame: document.getElementById('burner-flame'),
    iceBath: document.getElementById('ice-bath'),

    // Table
    trialsTableBody: document.getElementById('trials-table-body')
  };

  // 3. Instantiate Engines and Charts
  var kinetics = new Chemistry.KineticsEngine();
  var particles = new Simulation.ParticleEngine(document.getElementById('canvas-side-simulation'));

  var charts = {
    transmission: new Graphs.TransmissionChart(
      document.getElementById('canvas-graph-transmission'),
      'Time (s)', 'Transmission (%)'
    ),
    rateTemp: new Graphs.RateTempChart(
      document.getElementById('canvas-graph-rate-temp'),
      'Temperature (°C)', 'Rate 1/t (s⁻¹)'
    ),
    rateConc: new Graphs.RateConcChart(
      document.getElementById('canvas-graph-rate-conc'),
      'Na₂S₂O₃ Concentration (M)', 'Rate 1/t (s⁻¹)'
    )
  };

  // 4. Application State
  var loopIntervalId = null;
  var isPaused = false;
  var realTimeData = []; // Array of {t, trans} for current trial
  var recordedTrials = []; // Array of trial objects
  var dt = 0.05; // Simulation step size (seconds)

  // Load recorded trials from localStorage
  var storedTrials = localStorage.getItem('hkdse-rates-trials');
  if (storedTrials) {
    try {
      recordedTrials = JSON.parse(storedTrials);
      updateTrialsTable();
    } catch (e) {
      recordedTrials = [];
    }
  }

  // 5. Setup Interactive Event Listeners
  function setupEvents() {
    // Language toggle
    UI.btnLangToggle.addEventListener('click', function () {
      I18n.toggle();
    });

    // Slider and Type-in Input synchronization
    var controlPairs = [
      { slider: UI.thioConc, input: UI.inputThioConc, decimals: 2 },
      { slider: UI.thioVol, input: UI.inputThioVol, decimals: 0 },
      { slider: UI.waterVol, input: UI.inputWaterVol, decimals: 0 },
      { slider: UI.acidConc, input: UI.inputAcidConc, decimals: 1 },
      { slider: UI.acidVol, input: UI.inputAcidVol, decimals: 0 },
      { slider: UI.temperature, input: UI.inputTemperature, decimals: 0 }
    ];

    controlPairs.forEach(function (pair) {
      // Sync slider change to input
      pair.slider.addEventListener('input', function () {
        pair.input.value = parseFloat(pair.slider.value).toFixed(pair.decimals);
        onParametersChanged();
      });

      // Sync input change to slider
      pair.input.addEventListener('input', function () {
        var val = parseFloat(pair.input.value);
        var min = parseFloat(pair.input.min);
        var max = parseFloat(pair.input.max);
        
        if (!isNaN(val)) {
          // Clamp value between min and max
          if (val < min) val = min;
          if (val > max) val = max;
          
          pair.slider.value = val;
          onParametersChanged();
        }
      });

      // Handle blur to reset empty or invalid inputs to slider's current value
      pair.input.addEventListener('blur', function () {
        var val = parseFloat(pair.input.value);
        if (isNaN(val)) {
          pair.input.value = parseFloat(pair.slider.value).toFixed(pair.decimals);
        } else {
          var min = parseFloat(pair.input.min);
          var max = parseFloat(pair.input.max);
          if (val < min) val = min;
          if (val > max) val = max;
          pair.input.value = val.toFixed(pair.decimals);
          pair.slider.value = val;
        }
        onParametersChanged();
      });
    });

    UI.acidType.addEventListener('change', onParametersChanged);

    // Hide Settings toggle
    if (UI.toggleSettingsBtn && UI.gridLayout) {
      UI.toggleSettingsBtn.addEventListener('click', function () {
        var isHidden = UI.gridLayout.classList.toggle('settings-hidden');
        if (isHidden) {
          UI.toggleSettingsBtn.setAttribute('data-i18n', 'btn.showSettings');
          UI.toggleSettingsBtn.textContent = I18n.t('btn.showSettings');
        } else {
          UI.toggleSettingsBtn.setAttribute('data-i18n', 'btn.hideSettings');
          UI.toggleSettingsBtn.textContent = I18n.t('btn.hideSettings');
        }
      });
    }

    // Speed slider control
    if (UI.sliderSpeed) {
      UI.sliderSpeed.addEventListener('input', function () {
        var speed = parseInt(UI.sliderSpeed.value);
        if (UI.valSpeed) {
          UI.valSpeed.textContent = speed;
        }
        particles.speedMultiplier = speed;
      });
    }

    // Skip experiment button
    if (UI.btnSkip) {
      UI.btnSkip.addEventListener('click', skipExperiment);
    }

    // Action buttons
    UI.btnStart.addEventListener('click', startSimulation);
    UI.btnPause.addEventListener('click', togglePause);
    UI.btnReset.addEventListener('click', resetSimulation);
    UI.btnClearTrials.addEventListener('click', clearAllTrials);
  }

  /**
   * Triggered whenever any slider or parameter is adjusted by the user
   */
  function onParametersChanged() {
    if (loopIntervalId) return; // Ignore changes during active reaction

    var tVol = parseFloat(UI.thioVol.value) + parseFloat(UI.waterVol.value) + parseFloat(UI.acidVol.value);
    UI.readTotalVol.textContent = tVol;

    // Update particle engine liquid level
    particles.setLiquidLevel(tVol);
    particles.setTemperature(parseFloat(UI.temperature.value));

    // Update environmental visual effects (Bunsen burner or ice bath)
    updateEnvironmentVisuals(parseFloat(UI.temperature.value));

    // Update theoretical curves on the graphs
    updateGraphs();

    // Redraw the side-view beaker canvas in real-time to reflect the new liquid level
    if (!particles.isRunning) {
      particles.ctx.clearRect(0, 0, particles.canvas.width, particles.canvas.height);
      particles.drawBeakerOutline();
    }
  }

  /**
   * Updates the heating/cooling visual overlays based on temperature
   */
  function updateEnvironmentVisuals(temp) {
    UI.envEffect.className = 'environment-effect';
    UI.burnerFlame.style.opacity = '0';
    UI.iceBath.style.opacity = '0';

    if (temp > 30) {
      UI.envEffect.classList.add('effect-heating');
      UI.burnerFlame.style.opacity = '0.9';
    } else if (temp < 20) {
      UI.envEffect.classList.add('effect-cooling');
      UI.iceBath.style.opacity = '0.7';
    }
  }

  /**
   * Linearly interpolates liquid color from clear blue to cloudy yellow based on transmission
   */
  function getLiquidColor(transmission) {
    var tPct = transmission / 100.0; // 0.0 to 1.0

    // Clear blue: rgba(224, 242, 254, 0.3)
    // Cloudy yellow: rgba(253, 224, 71, 0.95)
    var r = Math.round(253 - 29 * tPct);
    var g = Math.round(224 + 18 * tPct);
    var b = Math.round(71 + 183 * tPct);
    var a = 0.95 - 0.65 * tPct;

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  }

  /**
   * Starts the simulation loop
   */
  function startSimulation() {
    if (loopIntervalId) return;

    // Lock sliders during simulation
    setSlidersDisabled(true);
    UI.btnStart.disabled = true;
    UI.btnPause.disabled = false;
    UI.btnReset.disabled = false;
    if (UI.btnSkip) {
      UI.btnSkip.disabled = false;
    }

    // Initialize kinetics engine
    kinetics.initializeReaction(
      UI.thioConc.value,
      UI.thioVol.value,
      UI.waterVol.value,
      UI.acidType.value,
      UI.acidConc.value,
      UI.acidVol.value,
      UI.temperature.value
    );

    // Populate particle engine with reactant ions
    particles.populateReactants(kinetics.initThio, kinetics.initH);
    particles.transmission = 100.0;
    particles.start(1.0); // Start particle animation loop

    isPaused = false;
    realTimeData = [{ t: 0.0, trans: 100.0 }];
    charts.transmission.updateData(realTimeData);

    UI.readStatus.className = 'reading-val status-reacting';
    UI.readStatus.textContent = I18n.t('status.reacting');
    UI.readStatus.setAttribute('data-i18n', 'status.reacting');

    // Main simulation loop
    loopIntervalId = setInterval(simulationStep, dt * 1000);
  }

  /**
   * Executes a single integration step in the simulation loop
   */
  function simulationStep() {
    if (isPaused) return;

    // Advance chemistry kinetics with speed multiplier
    var speed = parseInt(UI.sliderSpeed ? UI.sliderSpeed.value : 1);
    kinetics.step(dt * speed);

    // Update real-time readings
    UI.readTime.textContent = kinetics.time.toFixed(1);
    UI.transmissionDisplay.textContent = kinetics.transmission.toFixed(1) + '%';

    // Update top-down beaker visuals
    UI.paperCross.style.opacity = (kinetics.transmission / 100.0);
    UI.beakerLiquidTd.style.backgroundColor = getLiquidColor(kinetics.transmission);

    // Update particle engine reaction rate factor (fraction of remaining reactants) and transmission
    var remainingReactantsPct = (kinetics.currentThio * kinetics.currentH) / (kinetics.initThio * kinetics.initH || 1.0);
    particles.reactionRateFactor = remainingReactantsPct;
    particles.transmission = kinetics.transmission;

    // Record and plot real-time graph point
    realTimeData.push({ t: kinetics.time, trans: kinetics.transmission });
    charts.transmission.updateData(realTimeData);

    // Check if cross is blotted out
    if (kinetics.isBlotOut && UI.readStatus.getAttribute('data-i18n') === 'status.reacting') {
      UI.readStatus.className = 'reading-val status-blotout';
      UI.readStatus.textContent = I18n.t('status.blotout');
      UI.readStatus.setAttribute('data-i18n', 'status.blotout');
      if (UI.readRate) {
        UI.readRate.textContent = (1.0 / kinetics.blotOutTime).toFixed(4);
      }

      // Trigger a brief flash effect on the cross card
      var card = document.querySelector('.top-down-card');
      card.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.4)';
      setTimeout(function () {
        card.style.boxShadow = '';
      }, 500);

      // Stop simulation and record trial instantly on blot-out
      stopSimulationLoop();
      particles.stop();
      setSlidersDisabled(false);
      UI.btnStart.disabled = false;
      UI.btnPause.disabled = true;
      UI.btnReset.disabled = false;
      if (UI.btnSkip) {
        UI.btnSkip.disabled = true;
      }

      recordTrial();
      return;
    }

    // Check if reaction is completed (reactants fully depleted)
    if (kinetics.isCompleted) {
      stopSimulationLoop();
      particles.stop();
      setSlidersDisabled(false);
      UI.btnStart.disabled = false;
      UI.btnPause.disabled = true;
      UI.btnReset.disabled = false;
      if (UI.btnSkip) {
        UI.btnSkip.disabled = true;
      }

      UI.readStatus.className = 'reading-val status-completed';
      UI.readStatus.textContent = I18n.t('status.completed');
      UI.readStatus.setAttribute('data-i18n', 'status.completed');

      // Only record trial if it wasn't already recorded by blot-out
      var alreadyRecorded = recordedTrials.some(function (t) {
        return Math.abs(t.id - Date.now()) < 1000; // simple check
      });
      if (!alreadyRecorded) {
        recordTrial();
      }
    }
  }

  /**
   * Pauses or resumes the simulation loop
   */
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      UI.btnPause.textContent = I18n.t('btn.resume');
      UI.btnPause.setAttribute('data-i18n', 'btn.resume');
      particles.stop();
    } else {
      UI.btnPause.textContent = I18n.t('btn.pause');
      UI.btnPause.setAttribute('data-i18n', 'btn.pause');
      particles.start();
    }
  }

  /**
   * Skips the whole experiment and shows the final results instantly
   */
  function skipExperiment() {
    try {
      if (!loopIntervalId) return; // Only operate on an active experiment
      stopSimulationLoop();

      // Fast-forward kinetics to blot-out point (or completion if it can't blot out)
      var maxSafetyTicks = 10000;
      var ticks = 0;
      while (!kinetics.isBlotOut && !kinetics.isCompleted && ticks < maxSafetyTicks) {
        kinetics.step(0.05);
        ticks++;
      }

      // If it didn't blot out but completed, handle gracefully
      if (!kinetics.isBlotOut) {
        kinetics.isBlotOut = true;
        kinetics.blotOutTime = kinetics.time;
      }

      // Update UI readings with the exact blot-out time
      UI.readTime.textContent = kinetics.blotOutTime.toFixed(1);
      UI.transmissionDisplay.textContent = kinetics.transmission.toFixed(1) + '%';
      UI.readStatus.className = 'reading-val status-blotout';
      UI.readStatus.textContent = I18n.t('status.blotout');
      UI.readStatus.setAttribute('data-i18n', 'status.blotout');
      if (UI.readRate) {
        UI.readRate.textContent = (1.0 / kinetics.blotOutTime).toFixed(4);
      }

      // Update top-down beaker visuals to match the blot-out transmission
      UI.paperCross.style.opacity = (kinetics.transmission / 100.0);
      UI.beakerLiquidTd.style.backgroundColor = getLiquidColor(kinetics.transmission);

      // Populate side-view beaker with settled yellow precipitate particles corresponding to blot-out state
      particles.stop();
      particles.particles = [];
      particles.transmission = kinetics.transmission;
      var count = 35;
      for (var i = 0; i < count; i++) {
        var x = particles.beakerLeft + 10 + Math.random() * (particles.beakerRight - particles.beakerLeft - 20);
        var y = particles.beakerBottom - 4 - Math.random() * 6;
        var p = new Simulation.Particle(x, y, 0, 0, 'S', 5, '#facc15');
        p.isSettled = true;
        particles.particles.push(p);
      }
      particles.ctx.clearRect(0, 0, particles.canvas.width, particles.canvas.height);
      particles.drawBeakerOutline();
      particles.particles.forEach(function (p) { p.draw(particles.ctx); });

      // Record trial data
      recordTrial();

      // Unlock sliders and reset buttons
      setSlidersDisabled(false);
      UI.btnStart.disabled = false;
      UI.btnPause.disabled = true;
      UI.btnReset.disabled = false;
      if (UI.btnSkip) {
        UI.btnSkip.disabled = true;
      }
    } catch (err) {
      console.error('Error in skipExperiment:', err);
    }
  }

  /**
   * Resets the simulation to the initial state
   */
  function resetSimulation() {
    stopSimulationLoop();
    kinetics.reset();
    particles.stop();
    particles.particles = [];
    particles.transmission = 100.0;
    particles.reactionRateFactor = 1.0;
    particles.ctx.clearRect(0, 0, particles.canvas.width, particles.canvas.height);
    particles.drawBeakerOutline();

    // Reset UI readings
    UI.readTime.textContent = '0.0';
    if (UI.readRate) {
      UI.readRate.textContent = '--';
    }
    UI.transmissionDisplay.textContent = '100.0%';
    UI.readStatus.className = 'reading-val status-ready';
    UI.readStatus.textContent = I18n.t('status.ready');
    UI.readStatus.setAttribute('data-i18n', 'status.ready');

    // Reset visuals
    UI.paperCross.style.opacity = '1.0';
    UI.beakerLiquidTd.style.backgroundColor = 'rgba(224, 242, 254, 0.3)';

    // Reset buttons and unlock sliders
    setSlidersDisabled(false);
    UI.btnStart.disabled = false;
    UI.btnPause.disabled = true;
    UI.btnPause.textContent = I18n.t('btn.pause');
    UI.btnPause.setAttribute('data-i18n', 'btn.pause');
    UI.btnReset.disabled = true;
    if (UI.btnSkip) {
      UI.btnSkip.disabled = true;
    }

    // Clear real-time graph
    realTimeData = [];
    charts.transmission.updateData([]);
    
    onParametersChanged();
  }

  function stopSimulationLoop() {
    if (loopIntervalId) {
      clearInterval(loopIntervalId);
      loopIntervalId = null;
    }
  }

  function setSlidersDisabled(disabled) {
    UI.thioConc.disabled = disabled;
    UI.thioVol.disabled = disabled;
    UI.waterVol.disabled = disabled;
    UI.acidType.disabled = disabled;
    UI.acidConc.disabled = disabled;
    UI.acidVol.disabled = disabled;
    UI.temperature.disabled = disabled;

    // Also disable/enable type-in inputs
    UI.inputThioConc.disabled = disabled;
    UI.inputThioVol.disabled = disabled;
    UI.inputWaterVol.disabled = disabled;
    UI.inputAcidConc.disabled = disabled;
    UI.inputAcidVol.disabled = disabled;
    UI.inputTemperature.disabled = disabled;
  }

  /**
   * Records the completed trial data
   */
  function recordTrial() {
    try {
      // Prevent duplicate records within 1 second
      var now = Date.now();
      var isDuplicate = recordedTrials.some(function (t) {
        return Math.abs(t.id - now) < 1000;
      });
      if (isDuplicate) return;

      var trial = {
        id: now,
        trialNum: recordedTrials.length + 1,
        temp: parseFloat(UI.temperature.value) || 25,
        thioConc: typeof kinetics.initThio === 'number' ? kinetics.initThio : 0.0,
        acidConc: typeof kinetics.initH === 'number' ? kinetics.initH : 0.0,
        acidType: UI.acidType.value || 'HCl',
        totalVol: typeof kinetics.totalVol === 'number' ? kinetics.totalVol : 60,
        time: kinetics.isBlotOut ? kinetics.blotOutTime : null,
        rate: kinetics.isBlotOut ? (1.0 / kinetics.blotOutTime) : 0.0
      };

      recordedTrials.push(trial);
      localStorage.setItem('hkdse-rates-trials', JSON.stringify(recordedTrials));

      updateTrialsTable();
      updateGraphs();
    } catch (err) {
      console.error('Error recording trial:', err);
    }
  }

  /**
   * Updates the historical trials table DOM
   */
  function updateTrialsTable() {
    try {
      UI.trialsTableBody.innerHTML = '';

      if (recordedTrials.length === 0) {
        var row = document.createElement('tr');
        row.className = 'empty-row';
        var cell = document.createElement('td');
        cell.colSpan = 7;
        cell.setAttribute('data-i18n', 'table.empty');
        cell.textContent = I18n.t('table.empty');
        row.appendChild(cell);
        UI.trialsTableBody.appendChild(row);
        return;
      }

      recordedTrials.forEach(function (trial) {
        var row = document.createElement('tr');

        var cTrial = document.createElement('td');
        cTrial.textContent = trial.trialNum || '';
        row.appendChild(cTrial);

        var cTemp = document.createElement('td');
        var tempVal = typeof trial.temp === 'number' ? trial.temp : parseFloat(trial.temp);
        cTemp.textContent = !isNaN(tempVal) ? tempVal + ' °C' : '--';
        row.appendChild(cTemp);

        var cThio = document.createElement('td');
        var thioVal = typeof trial.thioConc === 'number' ? trial.thioConc : parseFloat(trial.thioConc);
        cThio.textContent = !isNaN(thioVal) ? thioVal.toFixed(3) + ' M' : '--';
        row.appendChild(cThio);

        var cAcid = document.createElement('td');
        var acidVal = typeof trial.acidConc === 'number' ? trial.acidConc : parseFloat(trial.acidConc);
        var acidType = trial.acidType || 'HCl';
        var divisor = acidType === 'H2SO4' ? 2 : 1;
        cAcid.textContent = !isNaN(acidVal) ? (acidVal / divisor).toFixed(2) + ' M (' + acidType + ')' : '--';
        row.appendChild(cAcid);

        var cVol = document.createElement('td');
        var volVal = typeof trial.totalVol === 'number' ? trial.totalVol : parseFloat(trial.totalVol);
        cVol.textContent = !isNaN(volVal) ? volVal + ' mL' : '--';
        row.appendChild(cVol);

        var cTime = document.createElement('td');
        var timeVal = typeof trial.time === 'number' ? trial.time : parseFloat(trial.time);
        cTime.textContent = !isNaN(timeVal) ? timeVal.toFixed(1) + ' s' : '--';
        row.appendChild(cTime);

        var cRate = document.createElement('td');
        var rateVal = typeof trial.rate === 'number' ? trial.rate : parseFloat(trial.rate);
        cRate.textContent = !isNaN(rateVal) ? rateVal.toFixed(4) : '0.0000';
        row.appendChild(cRate);

        UI.trialsTableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Error updating trials table:', err);
    }
  }

  /**
   * Clears all recorded trials
   */
  function clearAllTrials() {
    recordedTrials = [];
    localStorage.removeItem('hkdse-rates-trials');
    updateTrialsTable();
    updateGraphs();
  }

  /**
   * Redraws all graphs with current data and theoretical curves
   */
  function updateGraphs() {
    // 1. Real-time transmission graph
    charts.transmission.draw();

    // 2. Rate vs. Temperature graph
    var tempPoints = recordedTrials.map(function (t) {
      return { temp: t.temp, rate: t.rate };
    });
    // Temporarily configure kinetics engine to match current slider settings for theoretical curve
    var dummyEngine = new Chemistry.KineticsEngine();
    dummyEngine.initializeReaction(
      UI.thioConc.value,
      UI.thioVol.value,
      UI.waterVol.value,
      UI.acidType.value,
      UI.acidConc.value,
      UI.acidVol.value,
      UI.temperature.value
    );
    charts.rateTemp.updatePoints(tempPoints, dummyEngine);

    // 3. Rate vs. Concentration graph
    var concPoints = recordedTrials.map(function (t) {
      return { conc: t.thioConc, rate: t.rate };
    });
    charts.rateConc.updatePoints(concPoints, dummyEngine);
  }

  function updateUIReadings() {
    // Translate static text elements
    var totalVol = parseFloat(UI.thioVol.value) + parseFloat(UI.waterVol.value) + parseFloat(UI.acidVol.value);
    UI.readTotalVol.textContent = totalVol;
  }

  // 6. Initialize Application
  setupEvents();
  onParametersChanged();
  resetSimulation();
});