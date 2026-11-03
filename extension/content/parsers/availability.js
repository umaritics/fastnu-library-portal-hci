(function () {
  const RB = window.G10RoomBooking;

  function slotLabel(hour, minutes) {
    const d = new Date();
    d.setHours(hour, minutes, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  /** Full 15-min grid from open→close; missing portal cells = taken. */
  function buildFullTimelineGrid(portalSlots) {
    const open = RB.CONFIG.libraryOpenHour * 60;
    const close = RB.CONFIG.libraryCloseHour * 60;
    const step = RB.CONFIG.slotMinutes;
    const byTime = new Map();
    for (const s of portalSlots || []) {
      byTime.set(s.hour * 60 + s.minutes, s);
    }
    const grid = [];
    for (let t = open; t + step <= close; t += step) {
      const hour = Math.floor(t / 60);
      const minutes = t % 60;
      const hit = byTime.get(t);
      grid.push({
        hour,
        minutes,
        label: hit?.label || slotLabel(hour, minutes),
        status: hit && hit.status === "free" ? "free" : "taken"
      });
    }
    return grid;
  }

  function mapRoomSlots(slots, { freeOnly = true } = {}) {
    const timelineSlots = buildFullTimelineGrid(slots);
    const filtered = freeOnly ? timelineSlots.filter((s) => s.status === "free") : timelineSlots;
    return {
      timelineSlots,
      slots: filtered.map(({ label, hour, minutes, status }) => ({
        label,
        hour,
        minutes,
        status
      })),
      takenAllDay:
        timelineSlots.length > 0 &&
        filtered.length === 0 &&
        timelineSlots.every((s) => s.status === "taken")
    };
  }

  RB.availability = {
    async fetchForDay(dayOffset) {
      const date = await RB.dateBridge.loadDay(dayOffset);
      const rooms = RB.gridBridge.readRooms();
      return { date, dayOffset, rooms };
    },

    async fetchForDate(date) {
      const dayOffset = RB.dateBridge.dateToDayOffset(date);
      const loaded = await RB.dateBridge.loadDate(date);
      const rooms = RB.gridBridge.readRooms();
      return { date: loaded, dayOffset, rooms };
    },

    async enrichRoomWithSlots(room, { freeOnly = true } = {}) {
      const slots = await RB.roomBridge.loadSlotsForRoom(room.id);
      return { ...room, ...mapRoomSlots(slots, { freeOnly }) };
    },

    async enrichAllRoomsWithSlots(rooms, { freeOnly = true, bookingDate = null } = {}) {
      await RB.pageBridge.ensureInjected();
      const batch = await RB.pageBridge.loadSlotsBatch(
        rooms.map((r) => r.id),
        bookingDate
      );
      const byId = new Map(batch.map((item) => [String(item.roomId), item]));
      return rooms.map((room) => {
        const item = byId.get(String(room.id));
        if (!item) {
          return { ...room, slots: [], error: "No slot data returned.", slotsLoaded: true };
        }
        if (item.error) {
          return { ...room, slots: [], error: item.error, slotsLoaded: true };
        }
        return {
          ...room,
          ...mapRoomSlots(item.slots || [], { freeOnly }),
          error: null,
          slotsLoaded: true
        };
      });
    },

    async fetchRoomsWithSlots(dayOffset, { maxRooms = 11 } = {}) {
      const base = await this.fetchForDay(dayOffset);
      const slice = base.rooms.slice(0, maxRooms);
      const enriched = await this.enrichAllRoomsWithSlots(slice);
      return { ...base, rooms: enriched };
    }
  };
})();
