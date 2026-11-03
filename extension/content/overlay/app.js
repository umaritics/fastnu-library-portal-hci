(function () {
  const RB = window.G10RoomBooking;

  class OverlayApp {
    constructor() {
      this.dayOffset = 0;
      this.rooms = [];
      this.selected = null;
      this.durationHours = 1;
      this.loading = false;
      this.host = null;
      this.shadow = null;
      this.liveRegion = null;
    }

    mount() {
      if (this.host) return;

      this.host = document.createElement("div");
      this.host.id = "g10-room-booking-host";
      this.shadow = this.host.attachShadow({ mode: "open" });

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = chrome.runtime.getURL("content/overlay/overlay.css");
      this.shadow.appendChild(link);

      const root = document.createElement("div");
      root.className = "g10-root";
      root.innerHTML = this.template();
      this.shadow.appendChild(root);

      document.body.appendChild(this.host);
      this.bind(root);

      this.liveRegion = root.querySelector("#g10-live");
      this.panel = root.querySelector(".g10-panel");
      this.fab = root.querySelector(".g10-fab");

      if (RB.util.onPath(RB.CONFIG.roomPagePath)) {
        this.open();
        this.refresh();
      }
    }

    template() {
      const testBadge = RB.CONFIG.TEST_MODE
        ? '<span style="font-size:12px;opacity:.85"> · test mode</span>'
        : "";
      return `
        <button type="button" class="g10-fab" hidden>Book a study room</button>
        <div class="g10-panel" hidden role="dialog" aria-modal="true" aria-labelledby="g10-title">
          <header class="g10-header">
            <h1 id="g10-title">Book a study room${testBadge}</h1>
            <button type="button" class="g10-btn-icon" id="g10-close" aria-label="Close booking panel">×</button>
          </header>
          <div class="g10-tabs" role="tablist">
            <button type="button" class="g10-tab" role="tab" data-day="0" aria-selected="true">Today</button>
            <button type="button" class="g10-tab" role="tab" data-day="1" aria-selected="false">Tomorrow</button>
          </div>
          <div class="g10-body">
            <div id="g10-live" class="g10-status" aria-live="polite">Loading rooms…</div>
            <div id="g10-rooms"></div>
          </div>
          <footer class="g10-footer">
            <div class="g10-summary" id="g10-summary">Choose a free time to continue.</div>
            <button type="button" class="g10-btn-primary" id="g10-confirm" disabled>Confirm booking</button>
          </footer>
        </div>
      `;
    }

    bind(root) {
      root.querySelector("#g10-close").addEventListener("click", () => this.close());
      root.querySelector(".g10-fab").addEventListener("click", () => {
        if (!RB.util.onPath(RB.CONFIG.roomPagePath)) {
          window.location.href = "https://nu.insigniails.com/Library/Room";
          return;
        }
        this.open();
      });
      root.querySelector("#g10-confirm").addEventListener("click", () => this.confirm());

      root.querySelectorAll(".g10-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          this.dayOffset = parseInt(tab.dataset.day, 10);
          root.querySelectorAll(".g10-tab").forEach((t) => {
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          this.refresh();
        });
      });
    }

    announce(msg, tone) {
      if (!this.liveRegion) return;
      this.liveRegion.textContent = msg;
      if (tone) this.liveRegion.dataset.tone = tone;
      else delete this.liveRegion.dataset.tone;
    }

    open() {
      this.panel.hidden = false;
      this.fab.hidden = true;
      this.hideNativeChrome(true);
    }

    close() {
      this.panel.hidden = true;
      this.fab.hidden = !RB.util.onPath(RB.CONFIG.roomPagePath);
      this.hideNativeChrome(false);
    }

    hideNativeChrome(hide) {
      const el = document.querySelector(RB.SELECTORS.nativeBookingRoot);
      if (!el) return;
      if (hide) {
        el.classList.add("g10-native-hidden");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.classList.remove("g10-native-hidden");
        el.removeAttribute("aria-hidden");
      }
    }

    async refresh() {
      if (this.loading) return;
      this.loading = true;
      this.selected = null;
      this.updateSummary();
      this.announce("Loading rooms from the library portal…");
      this.renderSkeleton();

      try {
        if (!RB.util.onPath(RB.CONFIG.roomPagePath)) {
          throw new Error("Open the Book Room page to load availability.");
        }
        const data = await RB.availability.fetchForDay(this.dayOffset);
        this.rooms = data.rooms.map((r) => ({ ...r, slots: null, slotsLoaded: false }));
        this.announce(
          `Showing ${this.rooms.length} rooms for ${RB.util.formatDateLabel(data.date)}.`
        );
        this.renderRooms();
      } catch (err) {
        this.announce(err.message || String(err), "error");
        this.renderError();
      } finally {
        this.loading = false;
      }
    }

    renderSkeleton() {
      const container = this.shadow.getElementById("g10-rooms");
      container.innerHTML = `<div class="g10-skeleton"></div><div class="g10-skeleton"></div>`;
    }

    renderError() {
      this.shadow.getElementById("g10-rooms").innerHTML = "";
    }

    renderRooms() {
      const container = this.shadow.getElementById("g10-rooms");
      if (!this.rooms.length) {
        container.innerHTML = `<p class="g10-taken-label">No rooms returned. Try another day.</p>`;
        return;
      }

      container.innerHTML = this.rooms
        .map((room) => {
          const meta = [room.location, room.capacity ? `up to ${room.capacity}` : ""]
            .filter(Boolean)
            .join(" · ");
          let body = "";
          if (!room.slotsLoaded) {
            body = `<button type="button" class="g10-chip" data-load="${room.id}">Show free times</button>`;
          } else if (room.takenAllDay) {
            body = `<p class="g10-taken-label">Taken all day</p>`;
          } else if (room.slots && room.slots.length) {
            body = room.slots
              .map(
                (s) =>
                  `<button type="button" class="g10-chip" data-room="${room.id}" data-hour="${s.hour}" data-min="${s.minutes}">Free ${escapeHtml(s.label)}</button>`
              )
              .join("");
          } else {
            body = `<p class="g10-taken-label">No free slots shown</p>`;
          }
          return `
            <article class="g10-room" data-room-id="${room.id}">
              <h2>${escapeHtml(room.name)}</h2>
              <p class="g10-room-meta">${escapeHtml(meta)}</p>
              <div class="g10-chips">${body}</div>
            </article>`;
        })
        .join("");

      container.querySelectorAll(".g10-chip[data-load]").forEach((btn) => {
        btn.addEventListener("click", () => this.loadRoomSlots(btn.dataset.load, btn));
      });
      container.querySelectorAll(".g10-chip[data-room]").forEach((chip) => {
        chip.addEventListener("click", () => this.selectSlot(chip));
      });
    }

    async loadRoomSlots(roomId, btn) {
      btn.disabled = true;
      btn.textContent = "Loading…";
      try {
        const room = this.rooms.find((r) => r.id === roomId);
        if (!room) return;
        const enriched = await RB.availability.enrichRoomWithSlots(room);
        Object.assign(room, enriched, { slotsLoaded: true });
        this.renderRooms();
        this.announce(`Loaded times for ${room.name}.`);
      } catch (err) {
        this.announce(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Show free times";
      }
    }

    async selectSlot(chip) {
      const roomId = chip.dataset.room;
      const hour = parseInt(chip.dataset.hour, 10);
      const minutes = parseInt(chip.dataset.min, 10);
      const room = this.rooms.find((r) => r.id === roomId);
      if (!room) return;

      this.shadow.querySelectorAll(".g10-chip").forEach((c) => {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });

      try {
        const slots = await RB.roomBridge.loadSlotsForRoom(roomId);
        const match = slots.find((s) => s.hour === hour && s.minutes === minutes);
        if (!match || match.status !== "free") {
          throw new Error("That time was just taken. Refreshing…");
        }
        RB.roomBridge.clickNativeSlot(match);
        this.selected = { room, hour, minutes, label: match.label };
        this.announce(`Selected ${room.name} at ${match.label}.`);
        this.updateSummary();
      } catch (err) {
        this.announce(err.message, "error");
        this.refresh();
      }
    }

    updateSummary() {
      const summary = this.shadow.getElementById("g10-summary");
      const confirm = this.shadow.getElementById("g10-confirm");
      if (!this.selected) {
        summary.textContent = "Choose a free time to continue.";
        confirm.disabled = true;
        return;
      }
      const day = RB.dateBridge.dayOffsetToDate(this.dayOffset);
      const dayLabel = RB.util.formatDateLabel(day);
      summary.textContent = `You will book ${this.selected.room.name} on ${dayLabel} from ${this.selected.label} for ${this.durationHours} hour(s).`;
      confirm.disabled = false;
    }

    async confirm() {
      if (!this.selected) return;
      const confirmBtn = this.shadow.getElementById("g10-confirm");
      confirmBtn.disabled = true;
      this.announce("Submitting…");

      try {
        const result = await RB.submitBridge.confirmBooking({});
        if (result.simulated) {
          this.announce(
            "Test mode: slot selected on the portal. Turn off TEST_MODE in config to submit.",
            "error"
          );
        } else {
          const hint = RB.submitBridge.readConfirmationHint();
          this.announce(hint || "Booking submitted. Check My Room Bookings.", "success");
        }
      } catch (err) {
        this.announce(err.message, "error");
      } finally {
        confirmBtn.disabled = false;
      }
    }

    showFab() {
      if (this.fab) this.fab.hidden = false;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  RB.OverlayApp = OverlayApp;
})();
