(function () {
  const RB = window.G10RoomBooking;

  RB.submitBridge = {
    async confirmBooking({
      purpose,
      roomId,
      startHour,
      startMinutes,
      durationMinutes,
      searchDate
    } = {}) {
      if (RB.CONFIG.TEST_MODE) {
        return {
          simulated: true,
          ok: false,
          message: "TEST_MODE: Book click skipped."
        };
      }

      await RB.pageBridge.ensureInjected();
      await RB.pageBridge.assertBridgeVersion();
      const payload = {
        purpose: purpose || RB.CONFIG.defaultPurpose,
        roomId,
        startHour,
        startMinutes,
        durationMinutes
      };
      if (searchDate) {
        const d = searchDate instanceof Date ? searchDate : new Date(searchDate);
        payload.searchDate = {
          year: d.getFullYear(),
          month: d.getMonth(),
          date: d.getDate()
        };
      }
      return RB.pageBridge.submitRoomBooking(payload);
    },

    /** @deprecated Use confirmBooking result message */
    readConfirmationHint() {
      return null;
    }
  };
})();
