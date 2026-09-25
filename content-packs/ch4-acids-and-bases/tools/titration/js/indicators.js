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

  function parseColor(colorStr) {
    if (colorStr.indexOf('rgba') === 0) {
      var m = colorStr.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
      if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4])];
    } else if (colorStr.indexOf('rgb') === 0) {
      var m = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1.0];
    } else if (colorStr.indexOf('#') === 0) {
      var hex = colorStr.substring(1);
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b, 1.0];
    }
    return [255, 255, 255, 1.0];
  }

  function lerpColor(color1, color2, t) {
    var r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
    var g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
    var b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
    var a = color1[3] + (color2[3] - color1[3]) * t;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
  }

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
    if (indicatorId === 'methylOrange') {
      if (pH <= 3.1) {
        return {
          color: '#e74c3c',
          label: typeof I18n !== 'undefined' ? I18n.t('color.red') : '紅',
          rangeIndex: 0
        };
      } else if (pH >= 4.4) {
        return {
          color: '#f1c40f',
          label: typeof I18n !== 'undefined' ? I18n.t('color.yellow') : '黃',
          rangeIndex: 2
        };
      } else {
        var tVal = (pH - 3.1) / (4.4 - 3.1);
        var c1 = parseColor('#e74c3c');
        var c2 = parseColor('#f1c40f');
        var color = lerpColor(c1, c2, tVal);
        return {
          color: color,
          label: typeof I18n !== 'undefined' ? I18n.t('color.orange') : '橙',
          rangeIndex: 1
        };
      }
    } else if (indicatorId === 'phenolphthalein') {
      if (pH <= 8.3) {
        return {
          color: 'rgba(255,255,255,0.15)',
          label: typeof I18n !== 'undefined' ? I18n.t('color.colorless') : '無色',
          rangeIndex: 0
        };
      } else if (pH >= 10.0) {
        return {
          color: 'rgba(255,105,180,0.85)',
          label: typeof I18n !== 'undefined' ? I18n.t('color.pink') : '粉紅',
          rangeIndex: 2
        };
      } else {
        var tVal = (pH - 8.3) / (10.0 - 8.3);
        var c1 = parseColor('rgba(255,255,255,0.15)');
        var c2 = parseColor('rgba(255,105,180,0.85)');
        var color = lerpColor(c1, c2, tVal);
        var labelKey = tVal < 0.35 ? 'color.palePink' : 'color.pink';
        var rangeIdx = tVal < 0.35 ? 1 : 2;
        return {
          color: color,
          label: typeof I18n !== 'undefined' ? I18n.t(labelKey) : (tVal < 0.35 ? '淡粉紅' : '粉紅'),
          rangeIndex: rangeIdx
        };
      }
    }

    var ind = getIndicator(indicatorId);
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
