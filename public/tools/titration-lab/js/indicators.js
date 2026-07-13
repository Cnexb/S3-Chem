/* HKDSE Titration Lab — Indicator colours and suitability */
var Indicators = (function () {
  var INDICATORS = {
    methylOrange: {
      id: 'methylOrange',
      name: 'Methyl orange',
      nameZh: '甲基橙',
      ranges: [
        { maxPH: 3.1, color: '#e74c3c', labelKey: 'color.red' },
        { maxPH: 4.4, color: '#e67e22', labelKey: 'color.orange' },
        { maxPH: 14, color: '#f1c40f', labelKey: 'color.yellow' }
      ]
    },
    phenolphthalein: {
      id: 'phenolphthalein',
      name: 'Phenolphthalein',
      nameZh: '酚酞',
      ranges: [
        { maxPH: 8.3, color: 'rgba(255,255,255,0.15)', labelKey: 'color.colorless' },
        { maxPH: 10.0, color: 'rgba(255,182,193,0.75)', labelKey: 'color.palePink' },
        { maxPH: 14, color: 'rgba(255,105,180,0.85)', labelKey: 'color.pink' }
      ]
    }
  };

  function getIndicator(id) {
    return INDICATORS[id] || INDICATORS.phenolphthalein;
  }

  function getColorRangeIndex(indicatorId, pH) {
    var ind = getIndicator(indicatorId);
    for (var i = 0; i < ind.ranges.length; i++) {
      if (pH <= ind.ranges[i].maxPH) return i;
    }
    return ind.ranges.length - 1;
  }

  function getColor(indicatorId, pH) {
    var ind = getIndicator(indicatorId);
    for (var i = 0; i < ind.ranges.length; i++) {
      if (pH <= ind.ranges[i].maxPH) {
        var r = ind.ranges[i];
        return {
          color: r.color,
          label: typeof I18n !== 'undefined' ? I18n.t(r.labelKey) : r.labelKey,
          rangeIndex: i
        };
      }
    }
    var last = ind.ranges[ind.ranges.length - 1];
    return {
      color: last.color,
      label: typeof I18n !== 'undefined' ? I18n.t(last.labelKey) : last.labelKey,
      rangeIndex: ind.ranges.length - 1
    };
  }

  function getEndPointVolume(flaskChem, buretteChem, flaskConc, flaskVol, buretteConc, indicatorId) {
    var pH0 = Chemistry.calculatePH(flaskChem, buretteChem, flaskConc, flaskVol, buretteConc, 0);
    var startIdx = getColorRangeIndex(indicatorId, pH0);
    var step = 0.05;
    var maxV = 50;

    for (var v = step; v <= maxV + step; v += step) {
      var pH = Chemistry.calculatePH(flaskChem, buretteChem, flaskConc, flaskVol, buretteConc, v);
      var idx = getColorRangeIndex(indicatorId, pH);
      if (idx !== startIdx) {
        return Math.round(v / step) * step;
      }
    }
    return null;
  }

  function getSuitability(flaskChem, buretteChem, indicatorId) {
    var acid = flaskChem.type === 'acid' ? flaskChem : buretteChem;
    var base = flaskChem.type === 'base' ? flaskChem : buretteChem;

    if (acid.strength === 'strong' && base.strength === 'strong') {
      return { suitable: true, message: I18n.t('suit.sa_sb') };
    }
    if (acid.strength === 'strong' && base.strength === 'weak') {
      if (indicatorId === 'methylOrange') {
        return { suitable: true, message: I18n.t('suit.sa_wb.mo') };
      }
      return { suitable: false, message: I18n.t('suit.sa_wb.ph') };
    }
    if (acid.strength === 'weak' && base.strength === 'strong') {
      if (indicatorId === 'phenolphthalein') {
        return { suitable: true, message: I18n.t('suit.wa_sb.ph') };
      }
      return { suitable: false, message: I18n.t('suit.wa_sb.mo') };
    }
    return { suitable: false, message: I18n.t('suit.wa_wb') };
  }

  function getEndpointDescription(flaskChem, indicatorId) {
    if (indicatorId === 'methylOrange') {
      if (flaskChem.type === 'acid') {
        return I18n.t('endpoint.mo.acid');
      }
      return I18n.t('endpoint.mo.base');
    }
    if (flaskChem.type === 'base') {
      return I18n.t('endpoint.ph.base');
    }
    return I18n.t('endpoint.ph.acid');
  }

  return {
    INDICATORS: INDICATORS,
    getIndicator: getIndicator,
    getColor: getColor,
    getColorRangeIndex: getColorRangeIndex,
    getEndPointVolume: getEndPointVolume,
    getSuitability: getSuitability,
    getEndpointDescription: getEndpointDescription
  };
})();
