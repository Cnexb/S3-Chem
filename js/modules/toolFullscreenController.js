// =============================================================================
// Tool Fullscreen Controller - Games & Interactive Labs projection mode
// =============================================================================

import { LAB_TOOL_TYPES } from "./labLangBridge.js";

const OVERLAY_Z = 100000;

export const EMBED_FULLSCREEN_TOOL_TYPES = new Set([
  "atomic-arcade",
  "chem-catch",
  "lab-hazard-match",
  "flame-test-fireworks",
  ...LAB_TOOL_TYPES,
]);

export function isEmbedFullscreenToolType(toolType) {
  return EMBED_FULLSCREEN_TOOL_TYPES.has(toolType);
}

function supportsFullscreen() {
  const el = document.createElement("div");
  return Boolean(
    el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled,
  );
}

function isFullscreenActive(stage) {
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  return fsEl === stage;
}

function notifyIframeResize(stage) {
  window.dispatchEvent(new Event("resize"));
  stage?.querySelectorAll("iframe").forEach((frame) => {
    try {
      frame.contentWindow?.dispatchEvent(new Event("resize"));
    } catch {
      /* cross-origin */
    }
  });
}

export function createToolFullscreenController({ stage, modal, button, getLabel }) {
  let overlayMode = false;
  let overlayBackdrop = null;
  let destroyed = false;

  const enterIcon = button?.querySelector(".modal-fullscreen-icon--enter");
  const exitIcon = button?.querySelector(".modal-fullscreen-icon--exit");

  const setToolFullscreenClass = (active) => {
    modal?.classList.toggle("feature-modal--tool-fullscreen", active);
  };

  const updateButton = (active) => {
    if (!button) return;
    button.setAttribute("aria-pressed", active ? "true" : "false");
    const labelKey = active ? "toolModal.exitFullscreen" : "toolModal.enterFullscreen";
    const label = getLabel(labelKey);
    button.title = label;
    button.setAttribute("aria-label", label);
    if (enterIcon) enterIcon.hidden = active;
    if (exitIcon) exitIcon.hidden = !active;
  };

  const clearOverlay = () => {
    if (overlayBackdrop) {
      overlayBackdrop.remove();
      overlayBackdrop = null;
    }
    stage?.classList.remove("feature-modal-content--overlay-fullscreen");
    document.body.style.overflow = "";
    overlayMode = false;
    setToolFullscreenClass(false);
  };

  const clearStageStyles = () => {
    if (!stage) return;
    stage.classList.remove("feature-modal-content--fullscreen");
    stage.style.position = "";
    stage.style.inset = "";
    stage.style.zIndex = "";
    stage.style.width = "";
    stage.style.height = "";
    stage.style.margin = "";
  };

  const exitFullscreen = async () => {
    if (overlayMode) {
      clearOverlay();
      clearStageStyles();
      updateButton(false);
      requestAnimationFrame(() => notifyIframeResize(stage));
      return;
    }

    if (isFullscreenActive(stage)) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } catch {
        /* ignore */
      }
    }
  };

  const enterOverlay = () => {
    if (!stage) return;
    stage.classList.add("feature-modal-content--fullscreen");
    stage.classList.add("feature-modal-content--overlay-fullscreen");

    overlayBackdrop = document.createElement("div");
    overlayBackdrop.className = "tool-modal-fullscreen-backdrop";
    document.body.appendChild(overlayBackdrop);
    document.body.style.overflow = "hidden";

    stage.style.position = "fixed";
    stage.style.inset = "0";
    stage.style.zIndex = String(OVERLAY_Z + 1);
    stage.style.width = "100dvw";
    stage.style.height = "100dvh";
    stage.style.margin = "0";

    overlayMode = true;
    setToolFullscreenClass(true);
    updateButton(true);
    requestAnimationFrame(() => notifyIframeResize(stage));

    overlayBackdrop.addEventListener("click", () => {
      exitFullscreen();
    });
  };

  const enterFullscreen = async () => {
    if (!stage) return;
    stage.classList.add("feature-modal-content--fullscreen");

    if (!supportsFullscreen()) {
      enterOverlay();
      return;
    }

    try {
      if (stage.requestFullscreen) await stage.requestFullscreen();
      else if (stage.webkitRequestFullscreen) await stage.webkitRequestFullscreen();
      else {
        enterOverlay();
        return;
      }
      updateButton(true);
      setToolFullscreenClass(true);
      requestAnimationFrame(() => notifyIframeResize(stage));
    } catch {
      stage.classList.remove("feature-modal-content--fullscreen");
      enterOverlay();
    }
  };

  const onFullscreenChange = () => {
    const active = isFullscreenActive(stage) || overlayMode;
    if (!active) {
      clearOverlay();
      clearStageStyles();
    }
    setToolFullscreenClass(active);
    updateButton(active);
    if (active) {
      requestAnimationFrame(() => notifyIframeResize(stage));
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape" && overlayMode) {
      exitFullscreen();
    }
  };

  const toggle = () => {
    if (isFullscreenActive(stage) || overlayMode) exitFullscreen();
    else enterFullscreen();
  };

  if (button) {
    button.addEventListener("click", toggle);
  }

  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  document.addEventListener("keydown", onKeyDown);

  updateButton(false);

  return {
    exitFullscreen,
    notifyResize: () => notifyIframeResize(stage),
    isActive: () => isFullscreenActive(stage) || overlayMode,
    updateLabels: () => updateButton(isFullscreenActive(stage) || overlayMode),
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
      void exitFullscreen();
    },
  };
}
