(function () {
  const RB = window.G10RoomBooking;

  RB.roomBridge = {
    async loadSlotsForRoom(roomId) {
      await RB.pageBridge.ensureInjected();
      return RB.pageBridge.loadSlots(roomId);
    },

    extendSelectionByMinutes(roomId, startHour, startMinutes, durationMinutes) {
      return RB.pageBridge.extendSlots(
        roomId,
        startHour,
        startMinutes,
        durationMinutes
      );
    },

    clickNativeSlot(slot) {
      if (!slot || slot.status === "taken") {
        throw new Error("Slot is not available.");
      }
      return RB.pageBridge.clickSlot(slot.hour, slot.minutes);
    }
  };
})();
