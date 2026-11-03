(function () {
  const RB = window.G10RoomBooking;

  RB.gridBridge = {
    readRooms() {
      if (RB.pageBridge?.getLastRooms) {
        const cached = RB.pageBridge.getLastRooms();
        if (cached.length) return cached;
      }
      return [];
    }
  };
})();
