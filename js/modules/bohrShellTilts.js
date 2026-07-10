/** Per-shell orbit tilt presets (degrees) for crossed 3D Bohr rings. */
export const SHELL_ORBIT_TILT_DEG = [
  { x: 72, y: 0 },
  { x: 58, y: 55 },
  { x: 65, y: -48 },
  { x: 70, y: 35 },
  { x: 52, y: -62 },
  { x: 68, y: -30 },
  { x: 60, y: 48 },
];

/**
 * @param {number} shellIndex
 * @returns {{ x: number, y: number }}
 */
export function getShellOrbitTiltRad(shellIndex) {
  const tilt = SHELL_ORBIT_TILT_DEG[shellIndex % SHELL_ORBIT_TILT_DEG.length];
  return {
    x: (tilt.x * Math.PI) / 180,
    y: (tilt.y * Math.PI) / 180,
  };
}

/**
 * @param {number} shellIndex
 * @returns {{ x: number, y: number }}
 */
export function getShellOrbitTiltDeg(shellIndex) {
  return SHELL_ORBIT_TILT_DEG[shellIndex % SHELL_ORBIT_TILT_DEG.length];
}
