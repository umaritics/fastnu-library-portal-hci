(function () {
  const RB = window.G10RoomBooking;

  RB.dateBridge = {
    dayOffsetToDate(offset) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + offset);
      return d;
    },

    dateToDayOffset(date) {
      const today = RB.util.startOfDay(new Date());
      const target = RB.util.startOfDay(date);
      return Math.round((target.getTime() - today.getTime()) / 86400000);
    },

    async loadDay(dayOffset) {
      const date = this.dayOffsetToDate(dayOffset);
      return this.loadDate(date);
    },

    async loadDate(date) {
      const target = RB.util.startOfDay(date instanceof Date ? date : new Date(date));
      await RB.pageBridge.ensureInjected();
      await RB.pageBridge.searchRooms(target);
      return target;
    }
  };
})();
