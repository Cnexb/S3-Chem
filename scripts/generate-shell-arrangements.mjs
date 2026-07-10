import { getShellArrangementByZ } from "../js/utils/electronArrangement.js";

const ptableChecks = {
  1: [1],
  24: [2, 8, 13, 1],
  26: [2, 8, 14, 2],
  29: [2, 8, 18, 1],
  48: [2, 8, 18, 18, 2],
  55: [2, 8, 18, 18, 8, 1],
  62: [2, 8, 18, 24, 8, 2],
  86: [2, 8, 18, 32, 18, 8],
  92: [2, 8, 18, 32, 21, 9, 2],
};

let failures = 0;

for (let z = 1; z <= 118; z++) {
  const shells = getShellArrangementByZ(z);
  const sum = shells.reduce((total, count) => total + count, 0);
  if (sum !== z) {
    console.log(`Z=${z}: sum mismatch [${shells.join(", ")}] = ${sum}, expected ${z} FAIL`);
    failures++;
  }
}

for (const [z, expected] of Object.entries(ptableChecks)) {
  const shells = getShellArrangementByZ(+z);
  const ok = expected.every((value, index) => shells[index] === value);
  console.log(`Z=${z}: [${shells.join(", ")}] ${ok ? "ok" : "FAIL"}`);
  if (!ok) failures++;
}

process.exit(failures ? 1 : 0);
