(function () {
  const RB = window.G10RoomBooking;
  const LOG = "[G10 Library]";

  if (window.__G10_BOOKING_BOOTSTRAP_DONE) return;
  window.__G10_BOOKING_BOOTSTRAP_DONE = true;

  function roomWizardMounted() {
    return Boolean(RB.app && RB.app.mountEl);
  }

  function initRoomWizard() {
    if (!RB.util.onPath(RB.CONFIG.roomPagePath)) return false;
    if (!RB.RoomBookingWizard) {
      console.error(LOG, "RoomBookingWizard missing — reload extension.");
      return false;
    }

    const host = RB.util.findNativeBookingHost();
    if (!host) return false;

    document.documentElement.classList.add("g10-redesign");
    document.documentElement.dataset.g10Extension = RB.CONFIG.version;

    if (!RB.app) {
      RB.app = new RB.RoomBookingWizard();
    }
    RB.app.mount();

    if (!roomWizardMounted()) {
      console.warn(LOG, "Room booking host present but wizard did not mount.");
      return false;
    }

    console.info(LOG, "Room booking wizard mounted", RB.CONFIG.version);
    return true;
  }

  function initWithRetries() {
    initRoomWizard();
    window.addEventListener("load", initRoomWizard);

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      initRoomWizard();
      if (attempts > 80 || roomWizardMounted()) {
        clearInterval(timer);
      }
    }, 300);

    if (!roomWizardMounted()) {
      const observer = new MutationObserver(() => {
        if (initRoomWizard()) {
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      setTimeout(() => observer.disconnect(), 90000);
    }
  }

  try {
    initWithRetries();
  } catch (err) {
    console.error(LOG, err);
  }
})();
