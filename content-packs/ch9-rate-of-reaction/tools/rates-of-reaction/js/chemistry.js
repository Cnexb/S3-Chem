/* HKDSE Rates of Reaction Lab — Chemistry Kinetics Engine */
var Chemistry = (function () {
  // Constants
  var R = 8.314; // Gas constant (J / (mol * K))
  var Ea = 56000; // Activation energy (J/mol) - calibrated for doubling every 10°C
  var A = 4.28e6; // Frequency factor (M^-1 s^-1) - calibrated for the PDF data

  function KineticsEngine() {
    this.reset();
  }

  KineticsEngine.prototype.reset = function () {
    // Initial user inputs
    this.thioConc = 0.10; // M
    this.thioVol = 40;    // mL
    this.waterVol = 10;   // mL
    this.acidType = 'HCl'; // 'HCl' or 'H2SO4'
    this.acidConc = 1.0;  // M
    this.acidVol = 10;    // mL
    this.temperature = 25; // °C

    // Calculated initial state in mixture
    this.totalVol = 60; // mL
    this.initThio = 0.0; // M
    this.initH = 0.0;    // M

    // Real-time integration state
    this.time = 0.0; // s
    this.currentThio = 0.0; // M
    this.currentH = 0.0;    // M
    this.currentS = 0.0;    // M (sulphur precipitate concentration)
    this.currentSO2 = 0.0;  // M (dissolved/gaseous SO2)
    this.transmission = 100.0; // %
    this.isBlotOut = false;
    this.blotOutTime = null;
    this.isCompleted = false;
  };

  KineticsEngine.prototype.initializeReaction = function (thioConc, thioVol, waterVol, acidType, acidConc, acidVol, temp) {
    this.thioConc = parseFloat(thioConc);
    this.thioVol = parseFloat(thioVol);
    this.waterVol = parseFloat(waterVol);
    this.acidType = acidType;
    this.acidConc = parseFloat(acidConc);
    this.acidVol = parseFloat(acidVol);
    this.temperature = parseFloat(temp);

    // Total volume of the mixture
    this.totalVol = this.thioVol + this.waterVol + this.acidVol;

    // Diluted initial concentrations in the mixture
    this.initThio = (this.thioConc * this.thioVol) / this.totalVol;
    
    // HCl is monobasic, H2SO4 is dibasic (fully ionized in dilute solution)
    var basicity = (this.acidType === 'H2SO4') ? 2.0 : 1.0;
    this.initH = (this.acidConc * this.acidVol * basicity) / this.totalVol;

    // Reset real-time state
    this.time = 0.0;
    this.currentThio = this.initThio;
    this.currentH = this.initH;
    this.currentS = 0.0;
    this.currentSO2 = 0.0;
    this.transmission = 100.0;
    this.isBlotOut = false;
    this.blotOutTime = null;
    this.isCompleted = false;
  };

  /**
   * Calculates the rate constant k based on temperature using the Arrhenius Equation
   */
  KineticsEngine.prototype.getRateConstant = function () {
    var kelvin = this.temperature + 273.15;
    return A * Math.exp(-Ea / (R * kelvin));
  };

  /**
   * Advances the simulation by dt seconds using Euler integration
   */
  KineticsEngine.prototype.step = function (dt) {
    if (this.isCompleted) return;

    var k = this.getRateConstant();
    
    // Rate law: r = k * [S2O3^2-] * [H+]
    // In acidic solution, the reaction rate depends on both thiosulphate and acid concentration.
    var rate = k * this.currentThio * this.currentH;

    // Euler integration step
    var dS = rate * dt;

    // Check if reactants are depleted
    if (this.currentThio - dS <= 0 || this.currentH - 2 * dS <= 0) {
      // Limit dS to the maximum possible reaction extent
      var limitByThio = this.currentThio;
      var limitByH = this.currentH / 2.0;
      dS = Math.min(limitByThio, limitByH);
      this.isCompleted = true;
    }

    this.time += dt;
    this.currentThio -= dS;
    this.currentH -= 2.0 * dS; // 2 moles of H+ are consumed per mole of S2O3^2-
    this.currentS += dS;
    this.currentSO2 += dS;

    // Calculate light transmission based on Beer-Lambert-like exponential decay of sulphur turbidity
    // Calibrated so that at [S] = 0.0015 M, transmission drops below 1.0% (blot out)
    this.transmission = 100.0 * Math.exp(-3100.0 * this.currentS);
    if (this.transmission < 0.0) this.transmission = 0.0;

    // Check for "blot out" condition (transmission drops below 1%)
    if (!this.isBlotOut && this.transmission < 1.0) {
      this.isBlotOut = true;
      this.blotOutTime = this.time;
    }
  };

  /**
   * Predicts the theoretical blot out time (s) using analytical approximation
   * useful for plotting curves without running full simulations
   */
  KineticsEngine.prototype.predictBlotOutTime = function (thioConc, thioVol, waterVol, acidType, acidConc, acidVol, temp) {
    var totalVol = parseFloat(thioVol) + parseFloat(waterVol) + parseFloat(acidVol);
    var initThio = (parseFloat(thioConc) * parseFloat(thioVol)) / totalVol;
    var basicity = (acidType === 'H2SO4') ? 2.0 : 1.0;
    var initH = (parseFloat(acidConc) * parseFloat(acidVol) * basicity) / totalVol;
    
    var kelvin = parseFloat(temp) + 273.15;
    var k = A * Math.exp(-Ea / (R * kelvin));

    // The threshold sulphur concentration for blot out is [S]_blot = -ln(0.01) / 3100 = 0.001485 M
    var sBlot = -Math.log(0.01) / 3100.0;

    // If reactants are insufficient to even reach sBlot, it will never blot out
    if (initThio < sBlot || initH < 2.0 * sBlot) {
      return Infinity;
    }

    // Since sBlot is very small relative to typical initial concentrations,
    // we can approximate the rate as constant initially:
    // sBlot = k * [S2O3^2-]_0 * [H+]_0 * t
    // So t = sBlot / (k * [S2O3^2-]_0 * [H+]_0)
    var rateInitial = k * initThio * initH;
    return sBlot / rateInitial;
  };

  return {
    KineticsEngine: KineticsEngine
  };
})();