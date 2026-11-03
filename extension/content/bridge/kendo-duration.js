(function () {
  const RB = window.G10RoomBooking;
  const SLOT_MIN = RB.CONFIG.slotMinutes;

  RB.durationBridge = {
    async applyDuration(roomId, startHour, startMinutes, durationMinutes) {
      if (!durationMinutes || durationMinutes % SLOT_MIN !== 0) {
        throw new Error("Duration must be in 15-minute steps.");
      }

      const slider = await RB.pageBridge.setSliderDuration(
        startHour,
        startMinutes,
        durationMinutes
      );
      if (slider?.ok) return true;

      return RB.roomBridge.extendSelectionByMinutes(
        roomId,
        startHour,
        startMinutes,
        durationMinutes
      );
    }
  };
})();
