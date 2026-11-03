(function () {
  const RB = window.G10RoomBooking;
  const LOG = "[G10 Library]";

  if (window.__G10_BOOTSTRAP_DONE) return;
  window.__G10_BOOTSTRAP_DONE = true;

  function markReady() {
    document.documentElement.dataset.g10Extension =
      RB.CONFIG?.version || "0.2.7";
    document.documentElement.classList.add("g10-redesign");
  }

  function initShell() {
    if (!RB.headerShell?.apply) {
      console.error(LOG, "headerShell missing — reload extension and refresh the page.");
      return false;
    }

    markReady();
    RB.headerShell.apply();
    RB.askLibrarianShell?.apply?.();

    if (RB.util.onPath(RB.CONFIG.loginPath)) {
      RB.loginShell?.apply?.();
    }

    if (RB.util.onPath(RB.CONFIG.homePath)) {
      if (!RB.homeShell?.apply) {
        console.error(LOG, "homeShell missing on Home — reload extension and refresh.");
        return false;
      }
      document.documentElement.classList.add("g10-home-page");
      RB.homeShell.apply();
    }
    return true;
  }

  function initLegacyOverlay() {
    if (RB.util.onPath(RB.CONFIG.homePath)) return;
    if (RB.util.onPath(RB.CONFIG.roomPagePath)) return;
    if (!RB.OverlayApp) return;

    const app = new RB.OverlayApp();
    app.mount();
    RB.app = app;
    app.showFab();
  }

  function init() {
    try {
      const ok = initShell();
      if (ok) {
        console.info(LOG, "Shell applied", RB.CONFIG.version, location.pathname);
      }

      chrome.storage?.local?.get(["g10_test_mode"], (data) => {
        if (typeof data.g10_test_mode === "boolean") {
          RB.CONFIG.TEST_MODE = data.g10_test_mode;
        }
      });

      initLegacyOverlay();
    } catch (err) {
      console.error(LOG, err);
    }
  }

  function syncHomeHeights() {
    if (!RB.util.onPath(RB.CONFIG.homePath)) return;
    RB.homeShell?.syncPaneHeights?.();
    RB.askLibrarianShell?.positionDefault?.();
  }

  function initWithRetries() {
    init();
    window.addEventListener("load", () => {
      init();
      syncHomeHeights();
    });
    window.addEventListener("resize", syncHomeHeights);
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (document.getElementById("navMenu")) {
        initShell();
        RB.askLibrarianShell?.positionDefault?.();
        syncHomeHeights();
      }
      if (RB.util.onPath(RB.CONFIG.loginPath) && document.getElementById("UserName")) {
        RB.loginShell?.apply?.();
      }
      if (
        attempts > 24 ||
        (document.documentElement.dataset.g10Extension &&
          (!RB.util.onPath(RB.CONFIG.homePath) ||
            document.querySelector(".g10-home-layout")))
      ) {
        clearInterval(timer);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWithRetries);
  } else {
    initWithRetries();
  }
})();
