/** Mock room data for offline UI demo (matches D2 R2 test views). */
(function (global) {
  const SLOTS_AM = [
    { hour: 9, minutes: 0, label: "9:00 AM" },
    { hour: 9, minutes: 15, label: "9:15 AM" },
    { hour: 10, minutes: 0, label: "10:00 AM" },
    { hour: 11, minutes: 0, label: "11:00 AM" },
    { hour: 14, minutes: 0, label: "2:00 PM" },
    { hour: 15, minutes: 0, label: "3:00 PM" }
  ];

  const ROOMS_BASE = [
    { id: "46", name: "Group Study Room 1", capacity: 6, location: "Ground Floor" },
    { id: "44", name: "Group Study Room 10", capacity: 6, location: "Ground Floor" },
    { id: "45", name: "Group Study Room 11", capacity: 10, location: "Ground Floor" },
    { id: "24", name: "Group Study Room 2", capacity: 6, location: "Ground Floor" },
    { id: "25", name: "Group Study Room 3", capacity: 6, location: "2nd floor" }
  ];

  function withSlots(rooms, slotFn) {
    return rooms.map((r) => {
      const slots = slotFn(r);
      return {
        ...r,
        slots,
        slotsLoaded: true,
        takenAllDay: slots.length === 0
      };
    });
  }

  const SCENARIOS = {
    default: {
      label: "Mixed availability",
      delayMs: 600,
      rooms: () =>
        withSlots(ROOMS_BASE, (r) => {
          if (r.id === "46") return SLOTS_AM.slice(0, 3);
          if (r.id === "24") return SLOTS_AM.slice(3, 5);
          return [];
        })
    },
    r2_all_taken: {
      label: "R2 view — all taken",
      delayMs: 500,
      rooms: () =>
        withSlots(ROOMS_BASE, () => [])
    },
    r2_one_free: {
      label: "R2 view — one room free",
      delayMs: 500,
      rooms: () =>
        withSlots(ROOMS_BASE, (r) => (r.id === "25" ? [{ hour: 14, minutes: 0, label: "2:00 PM" }] : []))
    },
    r2_several_free: {
      label: "R2 view — several free",
      delayMs: 500,
      rooms: () => withSlots(ROOMS_BASE, () => SLOTS_AM.slice(0, 4))
    },
    empty: {
      label: "No rooms returned",
      delayMs: 800,
      rooms: () => []
    },
    slow: {
      label: "Slow network (2.5s)",
      delayMs: 2500,
      rooms: () => SCENARIOS.default.rooms()
    },
    submit_error: {
      label: "Submit fails",
      delayMs: 600,
      failOnSubmit: true,
      rooms: () => SCENARIOS.default.rooms()
    }
  };

  global.G10_MOCK = {
    SCENARIOS,
    ROOMS_BASE,
    getScenario(key) {
      return SCENARIOS[key] || SCENARIOS.default;
    }
  };
})(window);
