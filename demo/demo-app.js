/**
 * Standalone demo — same UX as the extension overlay, mock backend.
 * Edit and refresh the browser tab; no extension reload.
 */
(function () {
  const state = {
    scenarioKey: "default",
    dayOffset: 0,
    rooms: [],
    selected: null,
    durationHours: 1,
    loading: false,
    view: "booking" /* booking | pass */,
    pass: null
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function formatDayLabel(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function announce(msg, tone) {
    els.live.textContent = msg;
    if (tone) els.live.dataset.tone = tone;
    else delete els.live.dataset.tone;
  }

  function scenario() {
    return G10_MOCK.getScenario(state.scenarioKey);
  }

  async function mockFetchRooms() {
    const sc = scenario();
    await new Promise((r) => setTimeout(r, sc.delayMs));
    const built = sc.rooms();
    if (state.dayOffset === 1 && state.scenarioKey === "default") {
      return built.map((r) =>
        r.slots.length
          ? { ...r, slots: r.slots.slice(0, 2), slotsLoaded: true }
          : r
      );
    }
    return built.map((r) => ({ ...r, slotsLoaded: false, slots: null, takenAllDay: false }));
  }

  async function mockLoadSlots(roomId) {
    await new Promise((r) => setTimeout(r, 400));
    const sc = scenario();
    const full = sc.rooms();
    const room = full.find((r) => r.id === roomId);
    if (!room) throw new Error("Room not found in mock data.");
    return room;
  }

  async function refresh() {
    if (state.loading) return;
    state.loading = true;
    state.selected = null;
    state.view = "booking";
    state.pass = null;
    updateSummary();
    els.passScreen.hidden = true;
    els.panel.hidden = false;
    announce("Loading rooms…");
    els.rooms.innerHTML = `<div class="g10-skeleton"></div><div class="g10-skeleton"></div>`;

    try {
      const list = await mockFetchRooms();
      state.rooms = list;
      if (!list.length) {
        announce(`No rooms for ${formatDayLabel(state.dayOffset)}.`, "error");
      } else {
        announce(`Showing ${list.length} rooms for ${formatDayLabel(state.dayOffset)}.`);
      }
      renderRooms();
    } catch (e) {
      announce(e.message, "error");
      els.rooms.innerHTML = "";
    } finally {
      state.loading = false;
    }
  }

  function renderRooms() {
    if (!state.rooms.length) {
      els.rooms.innerHTML = `<p class="g10-taken-label">No rooms returned. Try another scenario or day.</p>`;
      return;
    }

    els.rooms.innerHTML = state.rooms
      .map((room) => {
        const meta = [room.location, room.capacity ? `up to ${room.capacity}` : ""]
          .filter(Boolean)
          .join(" · ");
        let body = "";
        if (!room.slotsLoaded) {
          body = `<button type="button" class="g10-chip" data-load="${room.id}">Show free times</button>`;
        } else if (room.takenAllDay) {
          body = `<p class="g10-taken-label">Taken all day</p>`;
        } else if (room.slots?.length) {
          body = room.slots
            .map(
              (s) =>
                `<button type="button" class="g10-chip" data-room="${room.id}" data-hour="${s.hour}" data-min="${s.minutes}">Free ${escapeHtml(s.label)}</button>`
            )
            .join("");
        } else {
          body = `<p class="g10-taken-label">No free slots</p>`;
        }
        return `
          <article class="g10-room">
            <h2>${escapeHtml(room.name)}</h2>
            <p class="g10-room-meta">${escapeHtml(meta)}</p>
            <div class="g10-chips">${body}</div>
          </article>`;
      })
      .join("");

    els.rooms.querySelectorAll("[data-load]").forEach((btn) => {
      btn.addEventListener("click", () => loadSlots(btn.dataset.load, btn));
    });
    els.rooms.querySelectorAll("[data-room]").forEach((chip) => {
      chip.addEventListener("click", () => selectSlot(chip));
    });
  }

  async function loadSlots(roomId, btn) {
    btn.disabled = true;
    btn.textContent = "Loading…";
    try {
      const enriched = await mockLoadSlots(roomId);
      const room = state.rooms.find((r) => r.id === roomId);
      Object.assign(room, enriched);
      renderRooms();
      announce(`Loaded times for ${room.name}.`);
    } catch (e) {
      announce(e.message, "error");
      btn.disabled = false;
      btn.textContent = "Show free times";
    }
  }

  function selectSlot(chip) {
    const roomId = chip.dataset.room;
    const room = state.rooms.find((r) => r.id === roomId);
    const slot = room.slots.find(
      (s) => String(s.hour) === chip.dataset.hour && String(s.minutes) === chip.dataset.min
    );
    if (!slot) return;

    els.rooms.querySelectorAll("[data-room]").forEach((c) => {
      c.setAttribute("aria-pressed", c === chip ? "true" : "false");
    });

    state.selected = { room, slot };
    announce(`Selected ${room.name} at ${slot.label}.`);
    updateSummary();
  }

  function updateSummary() {
    if (!state.selected) {
      els.summary.textContent = "Choose a free time to continue.";
      els.confirm.disabled = true;
      return;
    }
    const { room, slot } = state.selected;
    els.summary.textContent = `You will book ${room.name} on ${formatDayLabel(state.dayOffset)} from ${slot.label} for ${state.durationHours} hour.`;
    els.confirm.disabled = false;
  }

  async function confirm() {
    if (!state.selected) return;
    els.confirm.disabled = true;
    announce("Submitting…");

    await new Promise((r) => setTimeout(r, 700));

    const sc = scenario();
    if (sc.failOnSubmit) {
      announce("That slot was just taken. Please pick another time.", "error");
      els.confirm.disabled = false;
      return;
    }

    const id = "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    state.pass = {
      id,
      room: state.selected.room.name,
      day: formatDayLabel(state.dayOffset),
      time: state.selected.slot.label,
      duration: state.durationHours
    };
    state.view = "pass";
    els.panel.hidden = true;
    els.passScreen.hidden = false;
    announce("Booking confirmed.", "success");
    els.confirm.disabled = false;

    renderPass();
  }

  function renderPass() {
    const p = state.pass;
    els.passBody.innerHTML = `
      <p class="g10-pass-lead">Room is held for you</p>
      <p class="g10-pass-room">${escapeHtml(p.room)}</p>
      <dl class="g10-pass-dl">
        <dt>Date</dt><dd>${escapeHtml(p.day)}</dd>
        <dt>Time</dt><dd>${escapeHtml(p.time)}</dd>
        <dt>Duration</dt><dd>${p.duration} hour</dd>
        <dt>Booking ID</dt><dd><code>${escapeHtml(p.id)}</code></dd>
      </dl>
      <button type="button" class="g10-btn-primary" id="g10-share">Share with group</button>
      <button type="button" class="g10-chip g10-pass-back" id="g10-pass-done">Book another</button>
    `;
    $("g10-share")?.addEventListener("click", () => {
      const text = `${p.room} — ${p.day} ${p.time} (ID ${p.id})`;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        announce("Copied to clipboard.");
      } else {
        announce(text);
      }
    });
    $("g10-pass-done")?.addEventListener("click", () => refresh());
  }

  function bindDevBar() {
    $("g10-scenario").addEventListener("change", (e) => {
      state.scenarioKey = e.target.value;
      refresh();
    });
    $("g10-reload").addEventListener("click", () => refresh());
    $("g10-width-320").addEventListener("click", () => {
      document.body.classList.toggle("g10-demo-narrow");
    });
  }

  function bindOverlay() {
    els.live = $("g10-live");
    els.rooms = $("g10-rooms");
    els.summary = $("g10-summary");
    els.confirm = $("g10-confirm");
    els.panel = $("g10-panel");
    els.passScreen = $("g10-pass");
    els.passBody = $("g10-pass-body");

    $("g10-close").addEventListener("click", () => {
      els.panel.hidden = true;
      announce("Panel closed (demo). Click “Open booking” in the toolbar.");
    });

    document.querySelectorAll(".g10-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.dayOffset = parseInt(tab.dataset.day, 10);
        document.querySelectorAll(".g10-tab").forEach((t) => {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        refresh();
      });
    });

    els.confirm.addEventListener("click", confirm);
    $("g10-open-booking").addEventListener("click", () => {
      els.panel.hidden = false;
      els.passScreen.hidden = true;
      if (!state.rooms.length) refresh();
    });
  }

  function init() {
    bindDevBar();
    bindOverlay();
    const params = new URLSearchParams(location.search);
    if (params.get("scenario") && G10_MOCK.SCENARIOS[params.get("scenario")]) {
      state.scenarioKey = params.get("scenario");
      $("g10-scenario").value = state.scenarioKey;
    }
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
