/* HKDSE Titration Lab — pH and titration calculations */
var Chemistry = (function () {
  function hEquivMoles(chem, conc, volMl) {
    if (chem.type === 'acid') {
      return conc * (volMl / 1000) * chem.equivalents;
    }
    return 0;
  }

  function ohEquivMoles(chem, conc, volMl) {
    if (chem.type === 'base') {
      return conc * (volMl / 1000) * chem.equivalents;
    }
    return 0;
  }

  function getEquivalenceVolume(flaskChem, buretteChem, flaskConc, flaskVol, buretteConc) {
    var hInFlask = hEquivMoles(flaskChem, flaskConc, flaskVol);
    var ohInFlask = ohEquivMoles(flaskChem, flaskConc, flaskVol);
    var hPerMl = hEquivMoles(buretteChem, buretteConc, 1);
    var ohPerMl = ohEquivMoles(buretteChem, buretteConc, 1);

    if (flaskChem.type === 'acid' && buretteChem.type === 'base') {
      if (ohPerMl <= 0) return Infinity;
      return hInFlask / ohPerMl;
    }
    if (flaskChem.type === 'base' && buretteChem.type === 'acid') {
      if (hPerMl <= 0) return Infinity;
      return ohInFlask / hPerMl;
    }
    return Infinity;
  }

  function getEquivalencePH(flaskChem, buretteChem) {
    var acid = flaskChem.type === 'acid' ? flaskChem : buretteChem;
    var base = flaskChem.type === 'base' ? flaskChem : buretteChem;

    if (acid.strength === 'strong' && base.strength === 'strong') return 7.0;
    if (acid.strength === 'strong' && base.strength === 'weak') {
      if (base.id === 'Na2CO3') return 4.5;
      return 5.5;
    }
    if (acid.strength === 'weak' && base.strength === 'strong') return 8.7;
    return 7.0;
  }

  function log10(x) {
    return Math.log(Math.max(x, 1e-14)) / Math.LN10;
  }

  function clampPH(pH) {
    return Math.max(0.5, Math.min(13.5, pH));
  }

  function strongAcidPH(hMoles, totalVolL) {
    if (hMoles <= 1e-11 || totalVolL <= 0) return 7;
    return clampPH(-log10(hMoles / totalVolL));
  }

  function strongBasePH(ohMoles, totalVolL) {
    if (ohMoles <= 1e-11 || totalVolL <= 0) return 7;
    return clampPH(14 - (-log10(ohMoles / totalVolL)));
  }

  function weakAcidPH(haMoles, totalVolL, Ka) {
    if (haMoles <= 1e-11 || totalVolL <= 0) return 7;
    return clampPH(-log10(Math.sqrt(Ka * haMoles / totalVolL)));
  }

  function weakBasePH(bMoles, totalVolL, Kb) {
    if (bMoles <= 1e-11 || totalVolL <= 0) return 7;
    return clampPH(14 - (-log10(Math.sqrt(Kb * bMoles / totalVolL))));
  }

  function bufferAcidPH(haMoles, aMoles, Ka) {
    return clampPH(-log10(Ka) + log10(aMoles / haMoles));
  }

  function bufferBasePH(bMoles, bhMoles, Kb) {
    var pOH = -log10(Kb) + log10(bhMoles / bMoles);
    return clampPH(14 - pOH);
  }

  function acidRegionPH(excessH, totalVolL, acidChem, saltMoles) {
    if (acidChem.strength === 'strong') {
      return strongAcidPH(excessH, totalVolL);
    }
    var haMoles = excessH / acidChem.equivalents;
    if (saltMoles > 1e-12 && haMoles > 1e-12) {
      return bufferAcidPH(haMoles, saltMoles, acidChem.Ka);
    }
    return weakAcidPH(haMoles, totalVolL, acidChem.Ka);
  }

  function baseRegionPH(excessOH, totalVolL, baseChem, saltMoles) {
    if (baseChem.strength === 'strong') {
      return strongBasePH(excessOH, totalVolL);
    }
    var bMoles = excessOH / baseChem.equivalents;
    if (saltMoles > 1e-12 && bMoles > 1e-12) {
      return bufferBasePH(bMoles, saltMoles, baseChem.Kb);
    }
    return weakBasePH(bMoles, totalVolL, baseChem.Kb);
  }

  function blendNearEq(vAdd, vEq, fromPH, toPH) {
    var w = 0.12;
    if (Math.abs(vAdd - vEq) >= w) return null;
    var t = (vAdd - (vEq - w)) / (2 * w);
    t = Math.max(0, Math.min(1, t));
    var s = t * t * (3 - 2 * t);
    return fromPH + (toPH - fromPH) * s;
  }

  function calculatePH(flaskChem, buretteChem, flaskConc, flaskVol, buretteConc, vAdd) {
    var totalVolL = (flaskVol + vAdd) / 1000;
    var vEq = getEquivalenceVolume(flaskChem, buretteChem, flaskConc, flaskVol, buretteConc);
    var eqPH = getEquivalencePH(flaskChem, buretteChem);

    var totalH = hEquivMoles(flaskChem, flaskConc, flaskVol) + hEquivMoles(buretteChem, buretteConc, vAdd);
    var totalOH = ohEquivMoles(flaskChem, flaskConc, flaskVol) + ohEquivMoles(buretteChem, buretteConc, vAdd);
    var reacted = Math.min(totalH, totalOH);
    var excessH = totalH - reacted;
    var excessOH = totalOH - reacted;

    var acid = flaskChem.type === 'acid' ? flaskChem : buretteChem;
    var base = flaskChem.type === 'base' ? flaskChem : buretteChem;
    var titratingBaseWithAcid = flaskChem.type === 'base' && buretteChem.type === 'acid';

    if (excessH > 1e-9) {
      var acidPH = acidRegionPH(excessH, totalVolL, acid, reacted);
      if (titratingBaseWithAcid && isFinite(vEq)) {
        if (vAdd > vEq + 0.12) return acidPH;
        if (vAdd >= vEq - 0.12) {
          var vPriorBase = Math.max(0, vEq - 0.15);
          var priorBasePH = baseRegionPH(
            ohEquivMoles(base, flaskConc, flaskVol) - hEquivMoles(buretteChem, buretteConc, vPriorBase),
            (flaskVol + vPriorBase) / 1000,
            base,
            hEquivMoles(buretteChem, buretteConc, vPriorBase)
          );
          var blended = blendNearEq(vAdd, vEq, priorBasePH, eqPH);
          if (blended !== null && vAdd <= vEq) return blended;
          blended = blendNearEq(vAdd, vEq, eqPH, acidPH);
          if (blended !== null) return blended;
        }
      }
      return acidPH;
    }

    if (excessOH > 1e-9) {
      var basePH = baseRegionPH(excessOH, totalVolL, base, reacted);
      var titratingAcidWithBase = flaskChem.type === 'acid' && buretteChem.type === 'base';
      if (titratingAcidWithBase && isFinite(vEq)) {
        if (vAdd > vEq + 0.12) return basePH;
        if (vAdd >= vEq - 0.12) {
          var vPriorAcid = Math.max(0, vEq - 0.15);
          var priorAcidPH = acidRegionPH(
            hEquivMoles(acid, flaskConc, flaskVol) - ohEquivMoles(buretteChem, buretteConc, vPriorAcid),
            (flaskVol + vPriorAcid) / 1000,
            acid,
            ohEquivMoles(buretteChem, buretteConc, vPriorAcid)
          );
          var blended2 = blendNearEq(vAdd, vEq, priorAcidPH, eqPH);
          if (blended2 !== null && vAdd <= vEq) return blended2;
          blended2 = blendNearEq(vAdd, vEq, eqPH, basePH);
          if (blended2 !== null) return blended2;
        }
      }
      if (titratingBaseWithAcid && isFinite(vEq) && vAdd < vEq - 0.12) {
        return basePH;
      }
      if (titratingBaseWithAcid && isFinite(vEq) && vAdd < vEq + 0.12) {
        var blend3 = blendNearEq(vAdd, vEq, basePH, eqPH);
        if (blend3 !== null) return blend3;
      }
      return basePH;
    }

    return eqPH;
  }

  function validateSetup(flaskChem, buretteChem) {
    if (!flaskChem || !buretteChem) {
      return typeof I18n !== 'undefined' ? I18n.t('error.selectChem') : 'Please select chemicals.';
    }
    if (flaskChem.type === buretteChem.type) {
      return typeof I18n !== 'undefined' ? I18n.t('error.acidBasePair') : 'Flask and burette must be an acid-base pair.';
    }
    return null;
  }

  return {
    getEquivalenceVolume: getEquivalenceVolume,
    getEquivalencePH: getEquivalencePH,
    calculatePH: calculatePH,
    validateSetup: validateSetup
  };
})();
