(() => {
  "use strict";

  const KNOWN_ISOTOPE_RANGES = {
    H: [1, 7], He: [2, 10], Li: [3, 13], Be: [5, 16], B: [6, 21], C: [8, 23],
    N: [10, 25], O: [11, 28], F: [13, 31], Ne: [15, 34], Na: [17, 39], Mg: [18, 41],
    Al: [21, 43], Si: [22, 45], P: [24, 47], S: [26, 49], Cl: [28, 51], Ar: [29, 54],
    K: [31, 59], Ca: [34, 61], Sc: [36, 61], Ti: [38, 64], V: [40, 67], Cr: [42, 70],
    Mn: [44, 73], Fe: [45, 76], Co: [47, 77], Ni: [48, 82], Cu: [52, 84], Zn: [54, 85],
    Ga: [56, 87], Ge: [58, 90], As: [60, 92], Se: [64, 95], Br: [67, 98], Kr: [69, 101],
    Rb: [71, 103], Sr: [73, 107], Y: [76, 109], Zr: [78, 112], Nb: [81, 115], Mo: [83, 118],
    Tc: [85, 120], Ru: [87, 124], Rh: [89, 126], Pd: [91, 129], Ag: [93, 130], Cd: [95, 132],
    In: [97, 135], Sn: [99, 139], Sb: [103, 140], Te: [105, 142], I: [108, 144], Xe: [108, 147],
    Cs: [112, 151], Ba: [114, 153], La: [116, 155], Ce: [119, 157], Pr: [121, 159], Nd: [124, 161],
    Pm: [126, 163], Sm: [128, 165], Eu: [130, 170], Gd: [134, 169], Tb: [135, 171], Dy: [138, 173],
    Ho: [140, 175], Er: [142, 177], Tm: [144, 179], Yb: [148, 182], Lu: [150, 184], Hf: [153, 186],
    Ta: [155, 190], W: [158, 192], Re: [160, 194], Os: [161, 197], Ir: [164, 202], Pt: [166, 204],
    Au: [169, 210], Hg: [171, 216], Tl: [176, 218], Pb: [178, 220], Bi: [184, 224], Po: [186, 227],
    At: [191, 229], Rn: [193, 231], Fr: [199, 232], Ra: [202, 234], Ac: [206, 236], Th: [208, 238],
    Pa: [212, 240], U: [215, 242], Np: [219, 244], Pu: [228, 247], Am: [229, 249], Cm: [233, 252],
    Bk: [233, 254], Cf: [237, 256], Es: [240, 257], Fm: [241, 260], Md: [245, 262], No: [248, 264],
    Lr: [251, 266], Rf: [253, 268], Db: [255, 270], Sg: [258, 273], Bh: [260, 275], Hs: [263, 277],
    Mt: [265, 279], Ds: [267, 281], Rg: [272, 283], Cn: [277, 285], Nh: [278, 286], Fl: [285, 289],
    Mc: [287, 290], Lv: [290, 293], Ts: [291, 294], Og: [293, 295]
  };

  function getKnownMassNumbers(symbol) {
    const range = KNOWN_ISOTOPE_RANGES[symbol];
    if (!range) return [];
    const masses = [];
    for (let mass = range[0]; mass <= range[1]; mass += 1) masses.push(mass);
    return masses;
  }

  function mergeKnownIsotopes(symbol, naturalRows = []) {
    const naturalMap = new Map(naturalRows.map(row => [row.mass, row.abundance]));
    const masses = new Set(getKnownMassNumbers(symbol));
    naturalRows.forEach(row => masses.add(row.mass));
    return [...masses]
      .sort((a, b) => a - b)
      .map(mass => {
        const abundance = naturalMap.has(mass) ? naturalMap.get(mass) : 0;
        return {
          mass,
          abundance,
          natural: naturalMap.has(mass)
        };
      });
  }

  window.IsotopeCatalog = {
    KNOWN_ISOTOPE_RANGES,
    getKnownMassNumbers,
    mergeKnownIsotopes
  };
})();
