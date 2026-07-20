// =============================================================================
// Periodic-table cell Bohr diagram (2D animated / CSS 3D via parent classes)
// =============================================================================

import { bohrShellElectronAngleRad } from "./threeRenderer.js";
import { getShellOrbitTiltDeg } from "./bohrShellTilts.js";

const DEFAULT_SIZE_PX = 44;
const MIN_INNER_RADIUS = 5;
const MAX_OUTER_RADIUS = 19;

/**
 * @param {number} shellCount
 * @param {number} [maxRadius]
 * @param {number} [minRadius]
 * @returns {number[]}
 */
export function fitShellRadii(shellCount, maxRadius = MAX_OUTER_RADIUS, minRadius = MIN_INNER_RADIUS) {
  if (!Number.isFinite(shellCount) || shellCount <= 0) return [];
  if (shellCount === 1) return [Math.min(maxRadius, minRadius + 4)];
  const gap = (maxRadius - minRadius) / (shellCount - 1);
  return Array.from({ length: shellCount }, (_, i) => minRadius + i * gap);
}

/**
 * @param {number} shellIndex
 * @param {number} electronIndex
 * @param {number} count
 * @returns {number} degrees
 */
function electronAngleDeg(shellIndex, electronIndex, count) {
  return (bohrShellElectronAngleRad(shellIndex, electronIndex, count) * 180) / Math.PI;
}

/**
 * @param {HTMLElement} orbit
 * @param {number} shellIndex
 * @param {number} count
 * @param {number} radiusPx
 */
function appendElectronsToOrbit(orbit, shellIndex, count, radiusPx) {
  const n = Math.max(0, Math.floor(count || 0));
  if (n <= 0) return;

  if (shellIndex === 0) {
    for (let i = 0; i < n; i++) {
      const dot = document.createElement("span");
      dot.className = "electron-bohr-dot";
      const deg = electronAngleDeg(shellIndex, i, n);
      dot.style.setProperty("--dot-angle", `${deg}deg`);
      dot.style.setProperty("--orbit-r", `${radiusPx}px`);
      orbit.appendChild(dot);
    }
    return;
  }

  const pairSpreadDeg = 8;
  const pairCount = Math.ceil(n / 2);
  for (let p = 0; p < pairCount; p++) {
    const baseDeg = electronAngleDeg(shellIndex, p * 2, n);
    const remaining = n - p * 2;
    const dotsInPair = remaining >= 2 ? 2 : 1;
    for (let k = 0; k < dotsInPair; k++) {
      const dot = document.createElement("span");
      dot.className = "electron-bohr-dot";
      const offset =
        dotsInPair === 2 ? (k === 0 ? -pairSpreadDeg / 2 : pairSpreadDeg / 2) : 0;
      dot.style.setProperty("--dot-angle", `${baseDeg + offset}deg`);
      dot.style.setProperty("--orbit-r", `${radiusPx}px`);
      orbit.appendChild(dot);
    }
  }
}

/**
 * @param {HTMLElement | null} container
 * @param {number[]} shells
 * @param {{ sizePx?: number, maxRadius?: number, minRadius?: number }} [options]
 */
export function renderCellBohr(container, shells, options = {}) {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(shells) || shells.length === 0) return;

  const sizePx = options.sizePx ?? DEFAULT_SIZE_PX;
  const maxRadius = options.maxRadius ?? MAX_OUTER_RADIUS;
  const minRadius = options.minRadius ?? MIN_INNER_RADIUS;
  const radii = fitShellRadii(shells.length, maxRadius, minRadius);

  container.style.width = `${sizePx}px`;
  container.style.height = `${sizePx}px`;
  container.dataset.shells = shells.join(",");

  const nucleus = document.createElement("span");
  nucleus.className = "electron-bohr-nucleus";
  nucleus.setAttribute("aria-hidden", "true");
  container.appendChild(nucleus);

    shells.forEach((count, idx) => {
    const r = radii[idx] ?? minRadius;
    const tilt = getShellOrbitTiltDeg(idx);
    const durationSec = 4 + idx * 1.4;
    const direction = idx % 2 === 0 ? "normal" : "reverse";

    const orbit = document.createElement("span");
    orbit.className = "electron-bohr-orbit";
    // 只有當不帶 no-outer-color 屬性時，才為最外層加上 outermost-shell 樣式進行高亮顏色區分
    if (idx === shells.length - 1 && !container.classList.contains("no-outer-color")) {
      orbit.classList.add("outermost-shell");
    }
    orbit.dataset.shell = String(idx);
    orbit.style.setProperty("--orbit-r", `${r}px`);
    orbit.style.setProperty("--tilt-x", `${tilt.x}deg`);
    orbit.style.setProperty("--tilt-y", `${tilt.y}deg`);
    orbit.style.setProperty("--orbit-duration", `${durationSec}s`);
    orbit.style.setProperty("--orbit-direction", direction);

    const ring = document.createElement("span");
    ring.className = "electron-bohr-ring";
    orbit.appendChild(ring);

    appendElectronsToOrbit(orbit, idx, count, r);
    container.appendChild(orbit);
  });
}

/**
 * @param {ParentNode | null} root
 */
export function hydrateCellBohrModels(root) {
  if (!root) return;
  root.querySelectorAll(".electron-bohr[data-shells]").forEach((node) => {
    const shells = String(node.dataset.shells || "")
      .split(",")
      .map((n) => Number.parseInt(n, 10))
      .filter((n) => Number.isFinite(n) && n >= 0);
    if (shells.length === 0) return;

    const inTeachCard = node.closest(".teach-element-card");
    if (inTeachCard) {
      // 傳遞一個自定義的 classList 給渲染器
      const noOuterColor = node.classList.contains("no-outer-color");
      
      // Calculate dynamic sizes based on shells.length to show increasing atomic size
      const shellCount = shells.length;
      let sizePx = 130;
      let maxRadius = 60;
      let minRadius = 14;
      
      if (shellCount === 1) {
        sizePx = 76;
        maxRadius = 32;
        minRadius = 12;
      } else if (shellCount === 2) {
        sizePx = 94;
        maxRadius = 41;
        minRadius = 13;
      } else if (shellCount === 3) {
        sizePx = 110;
        maxRadius = 50;
        minRadius = 14;
      } else if (shellCount === 4) {
        sizePx = 124;
        maxRadius = 57;
        minRadius = 14;
      } else if (shellCount === 5) {
        sizePx = 134;
        maxRadius = 62;
        minRadius = 14;
      } else if (shellCount === 6) {
        sizePx = 144;
        maxRadius = 67;
        minRadius = 14;
      } else if (shellCount === 7) {
        sizePx = 154;
        maxRadius = 72;
        minRadius = 14;
      }

      const wrap = node.closest(".electron-bohr-wrap");
      if (wrap) {
        wrap.style.width = `${sizePx}px`;
        wrap.style.height = `${sizePx}px`;
      }

      const tempElement = renderCellBohr(node, shells, { sizePx, maxRadius, minRadius });
      if (noOuterColor) {
        node.classList.add("no-outer-color");
      }
    } else {
      renderCellBohr(node, shells);
    }
  });
}
