/**
 * Legacy facade — all Kendo/Room() work runs in page MAIN world via pageBridge.
 */
(function () {
  const RB = window.G10RoomBooking;

  RB.portalBridge = {
    async ensureReady(timeoutMs = 60000) {
      await RB.pageBridge.ensureInjected();
      return RB.pageBridge.ensureReady(timeoutMs);
    }
  };
})();
