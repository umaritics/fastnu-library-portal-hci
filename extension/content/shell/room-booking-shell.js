(function () {
  const RB = window.G10RoomBooking;
  const STEPS = [
    { id: "day", label: "Day" },
    { id: "schedule", label: "Room & time" },
    { id: "confirm", label: "Confirm" }
  ];

  class RoomBookingWizard {
    constructor() {
      this.step = 0;
      this.state = {
        dayOffset: null,
        date: null,
        dateLabel: "",
        room: null,
        slot: null,
        slotEnd: null,
        durationMinutes: null,
        purpose: RB.CONFIG.defaultPurpose,
        bookingHint: "",
        submitError: "",
        bookingCommitted: false,
        dayBookings: []
      };
      this.rooms = [];
      this.loading = false;
      this.mountEl = null;
      this.liveEl = null;
      this.calendarYear = null;
      this.calendarMonth = null;
    }

    initDefaultDay() {
      const today = RB.util.startOfDay(new Date());
      const initial = RB.util.isBookableDay(today) ? today : RB.util.nextBookableDay(today);
      this.state.date = initial;
      this.state.dayOffset = RB.dateBridge.dateToDayOffset(initial);
      this.state.dateLabel = RB.util.formatDateLabel(initial);
      this.calendarYear = initial.getFullYear();
      this.calendarMonth = initial.getMonth();
    }

    mount() {
      if (this.mountEl) return;
      document.documentElement.classList.add("g10-room-booking-page");
      this.injectStyles();
      this.prepareNativeHost();

      const host = RB.util.findNativeBookingHost();
      if (!host) {
        console.warn("[G10 Library] Room booking host not in DOM yet.");
        return;
      }

      this.mountEl = document.createElement("div");
      this.mountEl.className = "g10-room-wizard";
      this.mountEl.innerHTML = this.shellHtml();
      const nav = host.querySelector(".navigationbar");
      if (nav) {
        nav.after(this.mountEl);
      } else {
        host.prepend(this.mountEl);
      }

      this.liveEl = this.mountEl.querySelector("#g10-rb-live");
      this.extensionBannerEl = this.mountEl.querySelector("#g10-rb-extension-banner");
      this.initDefaultDay();
      this.syncDayBookings();
      this.bind();
      this.syncExtensionBanner();
      this.render();
      this.prefetchNativeBooking();
    }

    syncExtensionBanner() {
      if (!this.extensionBannerEl) return;
      if (RB.util.isExtensionAlive()) {
        this.extensionBannerEl.hidden = true;
        this.extensionBannerEl.textContent = "";
        return;
      }
      const msg = RB.util.extensionRefreshMessage();
      this.extensionBannerEl.hidden = false;
      this.extensionBannerEl.textContent = msg;
      this.announce(msg, "error");
    }

    injectStyles() {
      if (document.getElementById("g10-room-booking-css")) return;
      if (!RB.util.isExtensionAlive()) {
        this.syncExtensionBanner();
        return;
      }
      const link = document.createElement("link");
      link.id = "g10-room-booking-css";
      link.rel = "stylesheet";
      link.href = chrome.runtime.getURL("content/shell/room-booking.css");
      document.head.appendChild(link);
    }

    prepareNativeHost() {
      const host = RB.util.findNativeBookingHost();
      if (!host || host.dataset.g10NativePrepared) return;
      host.dataset.g10NativePrepared = "1";
      host.classList.add("g10-room-native-host");
      host.querySelectorAll(":scope > .flexlayout").forEach((el) => {
        el.classList.add("g10-native-booking-hidden");
        el.setAttribute("aria-hidden", "true");
      });
      const hideRemaining = () => {
        host.querySelectorAll(":scope > *:not(.g10-room-wizard):not(.navigationbar)").forEach((el) => {
          if (el.classList.contains("g10-native-booking-hidden")) return;
          el.classList.add("g10-native-booking-hidden");
          el.setAttribute("aria-hidden", "true");
        });
      };
      (async () => {
        try {
          await RB.pageBridge.ensureInjected();
          await RB.pageBridge.ensureReady(45000);
        } catch (_) {
          /* wide panels stay clipped */
        }
        hideRemaining();
      })();
    }

    prefetchNativeBooking() {
      if (this._prefetchStarted) return;
      this._prefetchStarted = true;
      (async () => {
        try {
          await RB.pageBridge.ensureInjected();
          await RB.pageBridge.ensureReady();
          await RB.dateBridge.loadDay(this.state.dayOffset ?? 0);
        } catch (err) {
          console.warn("[G10 Library] Room portal prefetch:", err.message);
        }
      })();
    }

    shellHtml() {
      const test = RB.CONFIG.TEST_MODE
        ? '<span class="g10-rb-test">Test mode — Book not sent</span>'
        : "";
      return `
        <div class="g10-rb-card">
          <header class="g10-rb-header">
            <h1>Book a study room</h1>
            ${test}
          </header>
          <nav class="g10-rb-steps" aria-label="Booking steps">${STEPS.map((s, i) => `<span class="g10-rb-step" data-step="${i}"><span class="g10-rb-step-num">${i + 1}</span>${esc(s.label)}</span>`).join("")}</nav>
          <div id="g10-rb-extension-banner" class="g10-rb-extension-banner" hidden role="alert"></div>
          <div id="g10-rb-recap" class="g10-rb-recap" hidden></div>
          <div id="g10-rb-live" class="g10-rb-live" aria-live="polite"></div>
          <div id="g10-rb-panel" class="g10-rb-panel"></div>
          <footer class="g10-rb-footer">
            <button type="button" class="g10-rb-btn g10-rb-btn-secondary" id="g10-rb-back" hidden>Back</button>
            <button type="button" class="g10-rb-btn g10-rb-btn-primary" id="g10-rb-next" disabled>Next</button>
          </footer>
        </div>`;
    }

    dayKeyForDate(date) {
      if (!date) return "";
      return RB.util.startOfDay(date).toISOString().slice(0, 10);
    }

    loadDayBookingsFromStorage(date) {
      const dayKey = this.dayKeyForDate(date);
      if (!dayKey) return [];
      try {
        const list = JSON.parse(sessionStorage.getItem("g10_confirmed_bookings_v1") || "[]");
        return list.filter((b) => b.dayKey === dayKey);
      } catch (_) {
        return [];
      }
    }

    persistConfirmedBooking(booking, date) {
      const dayKey = this.dayKeyForDate(date);
      if (!dayKey || !booking) return;
      const entry = {
        roomId: String(booking.roomId),
        startHour: booking.startHour,
        startMinutes: booking.startMinutes,
        durationMinutes: booking.durationMinutes,
        dayKey
      };
      try {
        const list = JSON.parse(sessionStorage.getItem("g10_confirmed_bookings_v1") || "[]");
        const filtered = list.filter(
          (b) =>
            !(
              b.dayKey === dayKey &&
              String(b.roomId) === entry.roomId &&
              b.startHour === entry.startHour &&
              b.startMinutes === entry.startMinutes
            )
        );
        filtered.push(entry);
        sessionStorage.setItem("g10_confirmed_bookings_v1", JSON.stringify(filtered.slice(-24)));
      } catch (_) {
        /* storage blocked */
      }
      this.state.dayBookings = this.loadDayBookingsFromStorage(date);
    }

    syncDayBookings() {
      this.state.dayBookings = this.loadDayBookingsFromStorage(this.state.date);
    }

    bind() {
      this.mountEl.querySelector("#g10-rb-back").addEventListener("click", () => this.goBack());
      this.mountEl.querySelector("#g10-rb-next").addEventListener("click", () => this.goNext());
    }

    announce(msg, tone) {
      if (!this.liveEl) return;
      if (this.step === STEPS.length - 1 && tone === "error") {
        return;
      }
      this.liveEl.textContent = msg || "";
      if (tone) this.liveEl.dataset.tone = tone;
      else delete this.liveEl.dataset.tone;
    }

    goBack() {
      if (this.step <= 0 || this.step >= STEPS.length) return;
      this.step -= 1;
      if (this.step === 0 && this.state.date) {
        this.calendarYear = this.state.date.getFullYear();
        this.calendarMonth = this.state.date.getMonth();
      }
      this.render();
      if (this.step === 1 && this.rooms.length) {
        void this.refreshScheduleTimelines();
      }
    }

    async goNext() {
      if (this._goNextLock) return;
      this._goNextLock = true;
      try {
        if (!RB.util.isExtensionAlive()) {
          this.syncExtensionBanner();
          return;
        }

        if (this.step === STEPS.length - 1) {
          await this.submitBooking();
          return;
        }
        if (!this.canAdvance() || this.loading) return;

        if (this.step === 1) {
          try {
            await this.syncNativeBooking();
          } catch (err) {
            this.announce(RB.util.friendlyError(err), "error");
            return;
          }
        }

        this.step += 1;
        if (this.step === STEPS.length - 1) {
          this.announce("");
        }
        this.render();
        if (this.step === 1) {
          await this.loadRoomsForDay();
        }
      } finally {
        this._goNextLock = false;
      }
    }

    canAdvance() {
      switch (this.step) {
        case 0:
          return this.state.date != null;
        case 1:
          return !!(
            this.state.room &&
            this.state.slot &&
            this.state.slotEnd &&
            this.state.durationMinutes
          );
        case 2:
          return true;
        default:
          return false;
      }
    }

    async loadRoomsForDay() {
      this.loading = true;
      this.announce("Loading rooms for " + this.state.dateLabel + "…");
      this.renderPanelSkeleton();
      this.renderFooter();
      try {
        if (!RB.util.isExtensionAlive()) {
          this.syncExtensionBanner();
          throw new Error(RB.util.extensionRefreshMessage());
        }
        await RB.pageBridge.ensureInjected();
        const base = this.state.date
          ? await RB.availability.fetchForDate(this.state.date)
          : await RB.availability.fetchForDay(this.state.dayOffset ?? 0);

        this.state.date = base.date;
        this.state.dayOffset = base.dayOffset;
        this.state.dateLabel = RB.util.formatDateLabel(base.date);
        this.syncDayBookings();

        this.rooms = base.rooms.map((room) => ({
          ...room,
          slots: null,
          slotsLoaded: false,
          slotsLoading: false,
          error: null
        }));

        if (!this.rooms.length) {
          this.announce("No rooms returned for this date.", "error");
          return;
        }

        this.announce(`${this.rooms.length} rooms found. Loading free times…`);
        this.loading = false;
        this.render();
        this.rooms.forEach((r) => {
          r.slotsLoading = true;
        });
        this.renderPanel();
        await this.loadSlotsForAllRooms();
        this.announce(`Loaded ${this.rooms.length} rooms. Pick a room and time range.`);
      } catch (err) {
        this.rooms = [];
        this.announce(RB.util.friendlyError(err), "error");
        this.syncExtensionBanner();
      } finally {
        this.loading = false;
        this.render();
      }
    }

    async loadSlotsForAllRooms() {
      this.rooms.forEach((room) => {
        room.slotsLoading = true;
      });
      this.renderPanel();
      try {
        const enriched = await RB.availability.enrichAllRoomsWithSlots(this.rooms, {
          bookingDate: this.state.date
        });
        this.rooms = enriched.map((room) => ({
          ...room,
          slotsLoading: false
        }));
      } catch (err) {
        this.rooms.forEach((room) => {
          room.slotsLoading = false;
          room.slotsLoaded = true;
          room.error = err.message || String(err);
        });
      }
      this.renderPanel();
    }

    async refreshScheduleTimelines() {
      if (!this.rooms.length || !this.state.date) return;
      this.rooms.forEach((room) => {
        room.slotsLoading = true;
        room.error = null;
      });
      if (this.step === 1) {
        this.renderPanel();
      }
      try {
        await RB.pageBridge.ensureInjected();
        const enriched = await RB.availability.enrichAllRoomsWithSlots(this.rooms, {
          bookingDate: this.state.date,
          freeOnly: false
        });
        this.rooms = enriched.map((room) => ({
          ...room,
          slotsLoading: false,
          slotsLoaded: true
        }));
        this.syncDayBookings();
      } catch (err) {
        this.rooms.forEach((room) => {
          room.slotsLoading = false;
          room.slotsLoaded = true;
          room.error = err.message || String(err);
        });
      }
      if (this.step === 1) {
        this.renderPanel();
      }
    }

    async syncNativeBooking() {
      const { room, slot, durationMinutes } = this.state;
      if (!room || !slot || !durationMinutes) {
        throw new Error("Pick a room and time range first.");
      }
      const slots = await RB.roomBridge.loadSlotsForRoom(room.id);
      const match = slots.find((s) => s.hour === slot.hour && s.minutes === slot.minutes);
      if (!match || match.status !== "free") {
        throw new Error("That start time is no longer free. Adjust your selection.");
      }
      await RB.roomBridge.clickNativeSlot(match);
      await RB.durationBridge.applyDuration(
        room.id,
        slot.hour,
        slot.minutes,
        durationMinutes
      );
    }

    async submitBooking() {
      if (this.state.bookingCommitted || this.step >= STEPS.length) {
        return;
      }
      if (this._submitInFlight) {
        return;
      }
      this._submitInFlight = true;

      const nextBtn = this.mountEl.querySelector("#g10-rb-next");
      const sendBtn = this.mountEl.querySelector("#g10-rb-send-booking");
      if (nextBtn) nextBtn.disabled = true;
      if (sendBtn) sendBtn.disabled = true;

      this.state.submitError = "";
      this.announce("Submitting booking to the library…");
      try {
        const { room, slot, durationMinutes, purpose } = this.state;
        if (!room || !slot || !durationMinutes) {
          throw new Error("Complete room and time selection first.");
        }

        const result = await RB.submitBridge.confirmBooking({
          purpose,
          roomId: room.id,
          startHour: slot.hour,
          startMinutes: slot.minutes,
          durationMinutes,
          searchDate: this.state.date
        });

        if (result.simulated) {
          this.state.bookingHint = result.message;
          this.state.submitError = result.message;
          this.announce("");
          if (nextBtn) nextBtn.disabled = false;
          if (sendBtn) sendBtn.disabled = false;
          this.render();
          return;
        }

        if (!result.ok || !result.verified) {
          throw new Error(
            result.message ||
              "The portal did not confirm this booking. Check My Room Bookings."
          );
        }
        if (result.bridgeVersion && result.bridgeVersion !== RB.CONFIG.pageBridgeVersion) {
          throw new Error(
            "Booking bridge mismatch. Hard-refresh this tab (Ctrl+F5) and try again."
          );
        }

        this.state.submitError = "";
        this.state.bookingCommitted = true;
        this.persistConfirmedBooking(
          {
            roomId: room.id,
            startHour: slot.hour,
            startMinutes: slot.minutes,
            durationMinutes
          },
          this.state.date
        );
        this.announce("");
        this.step = STEPS.length;
        void this.refreshScheduleTimelines();
        this.render();
      } catch (err) {
        if (this.state.bookingCommitted) {
          this.render();
          return;
        }
        const msg = RB.util.friendlyError(err);
        this.state.submitError = msg;
        this.announce("");
        this.syncExtensionBanner();
        if (nextBtn) nextBtn.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        this.render();
      } finally {
        this._submitInFlight = false;
      }
    }

    render() {
      this.syncExtensionBanner();
      this.renderSteps();
      this.renderRecap();
      this.renderPanel();
      this.renderFooter();
    }

    renderSteps() {
      const onPass = this.step >= STEPS.length && this.state.bookingCommitted;
      this.mountEl.querySelectorAll(".g10-rb-step").forEach((el, i) => {
        el.classList.toggle("is-active", !onPass && i === this.step);
        el.classList.toggle("is-done", onPass || i < this.step);
      });
    }

    renderRecap() {
      const recap = this.mountEl.querySelector("#g10-rb-recap");
      if (this.step === STEPS.length - 1) {
        recap.hidden = true;
        recap.innerHTML = "";
        return;
      }
      const items = this.recapItems();
      if (!items.length) {
        recap.hidden = true;
        recap.innerHTML = "";
        return;
      }

      recap.hidden = false;
      recap.classList.remove("g10-rb-recap--prominent");
      recap.innerHTML =
        '<p class="g10-rb-recap-title">Your choices so far</p><dl class="g10-rb-recap-list">' +
        items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("") +
        "</dl>";
    }

    recapItems() {
      const items = [];
      if (this.state.dateLabel && this.step >= 1) {
        items.push(["Date", this.state.dateLabel]);
      }
      if (this.state.room && this.step >= 1) {
        items.push(["Room", this.state.room.name]);
      }
      if (this.state.slot && this.state.durationMinutes && this.step >= 1) {
        items.push(["Time", `${this.state.slot.label} – ${this.endTimeLabel()}`]);
      }
      if (this.state.durationMinutes && this.step >= 1) {
        items.push(["Duration", formatDuration(this.state.durationMinutes)]);
      }
      return items;
    }

    renderRecapListHtml(className) {
      const items = this.recapItems();
      return `<dl class="${className}">${items
        .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
        .join("")}</dl>`;
    }

    renderFooter() {
      const back = this.mountEl.querySelector("#g10-rb-back");
      const next = this.mountEl.querySelector("#g10-rb-next");
      const onPass = this.step >= STEPS.length && this.state.bookingCommitted;
      back.hidden = this.step === 0 || onPass;
      if (onPass) {
        next.hidden = false;
        next.textContent = "Return to Home";
        next.disabled = false;
        next.onclick = () => {
          window.location.href = "/Library/Home";
        };
        return;
      }
      next.hidden = false;
      next.onclick = () => this.goNext();
      if (this.step === STEPS.length - 1) {
        next.hidden = true;
        back.hidden = false;
        return;
      }
      if (this.step === 1 && this.canAdvance()) {
        next.textContent = "Review booking";
      } else {
        next.textContent = "Next";
      }
      next.disabled = !this.canAdvance() || this.loading;
    }

    renderPanel() {
      const panel = this.mountEl.querySelector("#g10-rb-panel");
      const savedScroll = this.preserveScheduleScroll();
      if (this.step >= STEPS.length && this.state.bookingCommitted) {
        panel.innerHTML = this.renderPass();
        this.wirePanel(panel);
        return;
      }
      switch (this.step) {
        case 0:
          panel.innerHTML = this.renderDayStep();
          break;
        case 1:
          panel.innerHTML = this.renderScheduleStep();
          break;
        case 2:
          if (this.state.submitError) {
            this.announce("");
          }
          panel.innerHTML = this.renderConfirmStep();
          break;
        default:
          panel.innerHTML = "";
      }
      this.wirePanel(panel);
      this.restoreScheduleScroll(savedScroll);
    }

    preserveScheduleScroll() {
      if (this.step !== 1 || !this.mountEl) return 0;
      const el = this.mountEl.querySelector(".g10-rb-schedule-scroll");
      return el ? el.scrollTop : 0;
    }

    restoreScheduleScroll(scrollTop) {
      if (this.step !== 1 || !this.mountEl || scrollTop == null) return;
      const apply = () => {
        const el = this.mountEl.querySelector(".g10-rb-schedule-scroll");
        if (el) el.scrollTop = scrollTop;
      };
      requestAnimationFrame(() => requestAnimationFrame(apply));
    }

    renderPanelSkeleton() {
      this.mountEl.querySelector("#g10-rb-panel").innerHTML =
        '<div class="g10-rb-skeleton"></div><div class="g10-rb-skeleton"></div>';
    }

    renderDayStep() {
      const today = RB.util.startOfDay(new Date());
      const year = this.calendarYear;
      const month = this.calendarMonth;
      const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      });
      const canPrev =
        year > today.getFullYear() ||
        (year === today.getFullYear() && month > today.getMonth());

      const first = new Date(year, month, 1);
      const startPad = first.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

      let cells = "";
      for (let i = 0; i < startPad; i += 1) {
        cells += '<span class="g10-rb-cal-pad" aria-hidden="true"></span>';
      }
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = RB.util.startOfDay(new Date(year, month, day));
        const isPast = date < today;
        const isClosed = RB.util.isWeekend(date);
        const isDisabled = isPast || isClosed;
        const isSelected = this.state.date && sameDay(date, this.state.date);
        const isTodayDate = RB.util.isToday(date);
        const classes = ["g10-rb-cal-day"];
        if (isDisabled) classes.push("is-disabled");
        if (isClosed && !isPast) classes.push("is-closed");
        if (isSelected) classes.push("is-selected");
        if (isTodayDate) classes.push("is-today");
        const dayInner = isTodayDate
          ? `${day}<span class="g10-rb-cal-today-mark">(Today)</span>`
          : String(day);
        const closedNote = isClosed ? " — library closed" : "";
        cells += `<button type="button" class="${classes.join(" ")}" data-cal-day="${day}" ${
          isDisabled ? "disabled" : ""
        } aria-pressed="${isSelected ? "true" : "false"}" aria-label="${esc(
          RB.util.formatDateLabel(date) + closedNote
        )}">${dayInner}</button>`;
      }

      return `
        <h2 class="g10-rb-panel-title">When do you need the room?</h2>
        <p class="g10-rb-panel-hint">Choose a weekday (Monday–Friday). The library is closed on Saturday and Sunday.</p>
        <div class="g10-rb-calendar" role="group" aria-label="Choose booking date">
          <div class="g10-rb-cal-nav">
            <button type="button" class="g10-rb-cal-nav-btn" data-cal-prev ${
              canPrev ? "" : "disabled"
            } aria-label="Previous month">‹</button>
            <span class="g10-rb-cal-month">${esc(monthLabel)}</span>
            <button type="button" class="g10-rb-cal-nav-btn" data-cal-next aria-label="Next month">›</button>
          </div>
          <div class="g10-rb-cal-weekdays">${weekdays
            .map((w) => `<span>${w}</span>`)
            .join("")}</div>
          <div class="g10-rb-cal-grid">${cells}</div>
        </div>`;
    }

    selectCalendarDate(date) {
      const day = RB.util.startOfDay(date);
      if (!RB.util.isBookableDay(day)) {
        if (RB.util.isWeekend(day)) {
          this.announce("The library is closed on weekends. Pick a weekday.", "error");
        }
        return;
      }
      this.state.date = day;
      this.state.dayOffset = RB.dateBridge.dateToDayOffset(day);
      this.state.dateLabel = RB.util.formatDateLabel(day);
      this.state.room = null;
      this.state.slot = null;
      this.state.slotEnd = null;
      this.state.durationMinutes = null;
      this.rooms = [];
      this.syncDayBookings();
      this.calendarYear = day.getFullYear();
      this.calendarMonth = day.getMonth();
      this.announce("Selected " + this.state.dateLabel + ".");
      this.render();
    }

    renderScheduleStep() {
      if (this.loading) return "";
      if (!this.rooms.length) {
        return `<p class="g10-rb-empty">No rooms to show for this date. Try another day.</p>`;
      }
      const anyLoading = this.rooms.some((r) => r.slotsLoading);
      const openLabel = formatHourLabel(RB.CONFIG.libraryOpenHour);
      const closeLabel = formatHourLabel(RB.CONFIG.libraryCloseHour);

      return `
        <h2 class="g10-rb-panel-title">Choose room and time</h2>
        <p class="g10-rb-panel-hint">
          <span class="g10-rb-legend"><span class="g10-rb-legend-free"></span> Free</span>
          <span class="g10-rb-legend"><span class="g10-rb-legend-busy"></span> Booked</span>
          · ${esc(openLabel)}–${esc(closeLabel)} (8 PM not bookable) · Tap a green start, then pick end below.
          ${anyLoading ? " Loading…" : ""}
        </p>
        <div class="g10-rb-schedule-scroll">
          ${this.rooms.map((room) => this.renderRoomScheduleRow(room)).join("")}
        </div>`;
    }

    renderRoomScheduleRow(room) {
      const meta = [room.location, room.capacity ? `Up to ${room.capacity}` : ""]
        .filter(Boolean)
        .join(" · ");
      const active = this.state.room?.id === room.id;
      let body = "";
      if (room.slotsLoading) {
        body = '<p class="g10-rb-taken">Loading timeline…</p>';
      } else if (room.error) {
        body = `<p class="g10-rb-taken">${esc(room.error)}</p>`;
      } else if (room.takenAllDay) {
        body = '<p class="g10-rb-taken">No free time in library hours.</p>';
      } else {
        body = this.renderTimeline(room, active);
        if (active && this.state.slot) {
          body += this.renderEndDropdown(room);
        }
      }
      return `<article class="g10-rb-room-row${active ? " is-active" : ""}" data-room-id="${escAttr(
        room.id
      )}">
        <header class="g10-rb-room-row-head">
          <h3>${esc(room.name)}</h3>
          <p class="g10-rb-meta">${esc(meta)}</p>
        </header>
        ${body}
      </article>`;
    }

    renderEndDropdown(room) {
      const segments = displayTimelineSegments(room, this.state.date);
      const options = validEndOptions(segments, this.state.slot);
      if (!options.length) {
        return `<p class="g10-rb-timeline-summary">No valid end times from ${esc(
          this.state.slot.label
        )} (busy slot blocks longer bookings).</p>`;
      }
      const current = this.state.durationMinutes
        ? options.find((o) => o.durationMinutes === this.state.durationMinutes)
        : null;
      return `
        <div class="g10-rb-end-row">
          <label class="g10-rb-end-field">
            <span>End time</span>
            <select id="g10-rb-end-select" data-room-id="${escAttr(room.id)}">
              <option value="">Select end time…</option>
              ${options
                .map(
                  (o) =>
                    `<option value="${escAttr(o.value)}" ${
                      current && current.value === o.value ? "selected" : ""
                    }>${esc(o.label)}</option>`
                )
                .join("")}
            </select>
          </label>
          <button type="button" class="g10-rb-btn-clear" id="g10-rb-clear-range">Clear selection</button>
        </div>
        <p class="g10-rb-timeline-summary">${esc(this.bookingRangeLabel())}</p>`;
    }

    renderTimeline(room, isActiveRow) {
      this.syncDayBookings();
      let segments = displayTimelineSegments(room, this.state.date);
      segments = overlayConfirmedBookings(segments, room.id, this.state.dayBookings);
      if (!segments.length) {
        return `<p class="g10-rb-taken">No future slots today (or none in library hours).</p>`;
      }
      const startSel = isActiveRow ? this.state.slot : null;
      const endSel = isActiveRow ? this.state.slotEnd : null;
      const cells = segments
        .map((s) => {
          const sel = slotInRange(s, startSel, endSel);
          const classes = ["g10-rb-tl-seg"];
          if (s.status !== "free") classes.push("is-busy");
          else classes.push("is-free");
          if (sel === "start") classes.push("is-range-start");
          if (sel === "end") classes.push("is-range-end");
          if (sel === "between") classes.push("is-in-range");
          const disabled = s.status !== "free" ? "disabled" : "";
          const short = formatSlotShort(s.hour, s.minutes);
          const label = s.label || formatSlotLabel(s.hour, s.minutes);
          return `<button type="button" class="${classes.join(" ")}" ${disabled} data-room-id="${escAttr(
            room.id
          )}" data-hour="${s.hour}" data-min="${s.minutes}" data-label="${escAttr(
            label
          )}" title="${esc(label)}" aria-label="${esc(label)}${
            s.status === "free" ? ", free" : ", booked"
          }"><span class="g10-rb-tl-lbl">${esc(short)}</span></button>`;
        })
        .join("");
      return `
        <div class="g10-rb-timeline" role="group" aria-label="Timeline for ${esc(room.name)}">
          <div class="g10-rb-timeline-labels">
            <span>${esc(formatHourLabel(RB.CONFIG.libraryOpenHour))}</span>
            <span>${esc(formatHourLabel(14))}</span>
            <span>${esc(formatHourLabel(RB.CONFIG.libraryCloseHour))}</span>
          </div>
          <div class="g10-rb-timeline-track">${cells}</div>
        </div>`;
    }

    bookingRangeLabel() {
      const { slot, slotEnd, durationMinutes, room } = this.state;
      if (!room || !slot) return "Tap a green cell to set start time.";
      if (!slotEnd || !durationMinutes) {
        return `Start ${slot.label} — choose end time below.`;
      }
      return `${room.name}: ${slot.label} – ${bookingEndDisplay(slotEnd)} (${formatDuration(
        durationMinutes
      )})`;
    }

    selectTimelineStart(roomId, hour, minutes, label) {
      const room = this.rooms.find((r) => r.id === roomId);
      if (!room) return;
      const segments = displayTimelineSegments(room, this.state.date);
      const slot = segments.find((s) => s.hour === hour && s.minutes === minutes);
      if (!slot || slot.status !== "free") {
        this.announce("That time is not free.", "error");
        return;
      }
      this.state.room = room;
      this.state.slot = { hour, minutes, label: label || formatSlotLabel(hour, minutes) };
      this.state.slotEnd = null;
      this.state.durationMinutes = null;
      this.announce(`Start ${this.state.slot.label} in ${room.name}. Pick end time.`);
      this.render();
    }

    applyEndSelection(value) {
      if (!value || !this.state.room || !this.state.slot) return;
      const room = this.state.room;
      const segments = displayTimelineSegments(room, this.state.date);
      const options = validEndOptions(segments, this.state.slot);
      const pick = options.find((o) => o.value === value);
      if (!pick) {
        this.announce("Invalid end time.", "error");
        return;
      }
      this.state.slotEnd = pick.endSlot;
      this.state.durationMinutes = pick.durationMinutes;
      this.announce(
        `${room.name}: ${this.state.slot.label} – ${bookingEndDisplay(pick.endSlot)} (${formatDuration(
          pick.durationMinutes
        )}).`
      );
      this.renderRecap();
      this.renderPanel();
      this.renderFooter();
    }

    clearTimeSelection() {
      this.state.room = null;
      this.state.slot = null;
      this.state.slotEnd = null;
      this.state.durationMinutes = null;
      this.announce("Time selection cleared.");
      this.render();
    }

    renderDurationStep() {
      return "";
    }

    renderConfirmStep() {
      const err = this.state.submitError
        ? `<div class="g10-rb-submit-error" role="alert">${esc(this.state.submitError)}</div>`
        : "";
      return `
        ${err}
        <div class="g10-rb-confirm-recap">
          <h2 class="g10-rb-confirm-recap-title">Your choices so far</h2>
          ${this.renderRecapListHtml("g10-rb-confirm-recap-list")}
        </div>
        <label class="g10-rb-field g10-rb-field-purpose">
          <span>Purpose (optional)</span>
          <input type="text" id="g10-rb-purpose" value="${escAttr(this.state.purpose)}" />
        </label>
        <div class="g10-rb-send-wrap g10-rb-send-wrap--center">
          <button type="button" class="g10-rb-btn g10-rb-btn-primary g10-rb-send-booking" id="g10-rb-send-booking">
            Confirm Booking
          </button>
        </div>`;
    }

    endTimeLabel() {
      if (this.state.slotEnd) return bookingEndDisplay(this.state.slotEnd);
      const { slot, durationMinutes } = this.state;
      if (!slot || !durationMinutes) return "";
      const endMin = slotMinutes(slot) + durationMinutes;
      const h = Math.floor(endMin / 60);
      const m = endMin % 60;
      return formatSlotLabel(h, m);
    }

    renderPass() {
      const idMatch = (this.state.bookingHint || "").match(/\b\d{5,}\b/);
      const bookingId = idMatch ? idMatch[0] : "—";
      return `
        <div class="g10-rb-pass">
          <h2>Your room is held</h2>
          <p class="g10-rb-pass-lead">${esc(this.state.bookingHint || "Booking recorded.")}</p>
          <dl class="g10-rb-pass-details">
            <div><dt>Room</dt><dd>${esc(this.state.room?.name || "")}</dd></div>
            <div><dt>Date</dt><dd>${esc(this.state.dateLabel)}</dd></div>
            <div><dt>Time</dt><dd>${esc(this.state.slot?.label || "")} – ${esc(this.endTimeLabel())}</dd></div>
            <div><dt>Booking ID</dt><dd>${esc(bookingId)}</dd></div>
          </dl>
          <p class="g10-rb-pass-note">Save or share this pass. Find it again under My Room Bookings.</p>
          <div class="g10-rb-pass-actions">
            <button type="button" class="g10-rb-btn g10-rb-btn-secondary g10-rb-book-another" id="g10-rb-book-another">
              Book another time
            </button>
          </div>
        </div>`;
    }

    wirePanel(panel) {
      panel.querySelector("[data-cal-prev]")?.addEventListener("click", (e) => {
        const btn = e.currentTarget;
        if (btn.disabled) return;
        this.calendarMonth -= 1;
        if (this.calendarMonth < 0) {
          this.calendarMonth = 11;
          this.calendarYear -= 1;
        }
        this.render();
      });

      panel.querySelector("[data-cal-next]")?.addEventListener("click", () => {
        this.calendarMonth += 1;
        if (this.calendarMonth > 11) {
          this.calendarMonth = 0;
          this.calendarYear += 1;
        }
        this.render();
      });

      panel.querySelectorAll("[data-cal-day]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const dayNum = parseInt(btn.dataset.calDay, 10);
          this.selectCalendarDate(new Date(this.calendarYear, this.calendarMonth, dayNum));
        });
      });

      panel.querySelectorAll(".g10-rb-tl-seg.is-free").forEach((seg) => {
        seg.addEventListener("click", () => {
          this.selectTimelineStart(
            seg.dataset.roomId,
            parseInt(seg.dataset.hour, 10),
            parseInt(seg.dataset.min, 10),
            seg.dataset.label
          );
        });
      });

      panel.querySelector("#g10-rb-end-select")?.addEventListener("change", (e) => {
        this.applyEndSelection(e.target.value);
      });

      panel.querySelector("#g10-rb-clear-range")?.addEventListener("click", () => {
        this.clearTimeSelection();
      });

      const purpose = panel.querySelector("#g10-rb-purpose");
      purpose?.addEventListener("input", (e) => {
        this.state.purpose = e.target.value;
      });

      panel.querySelector("#g10-rb-send-booking")?.addEventListener("click", () => {
        void this.submitBooking();
      });

      panel.querySelector("#g10-rb-book-another")?.addEventListener("click", () => {
        this.state.bookingCommitted = false;
        this.state.room = null;
        this.state.slot = null;
        this.state.slotEnd = null;
        this.state.durationMinutes = null;
        this.state.submitError = "";
        this.step = 1;
        this.syncDayBookings();
        void this.refreshScheduleTimelines();
        this.render();
      });
    }
  }

  function overlayConfirmedBookings(segments, roomId, bookings) {
    let out = segments;
    for (const booking of bookings || []) {
      out = overlayConfirmedBooking(out, roomId, booking);
    }
    return out;
  }

  function overlayConfirmedBooking(segments, roomId, booking) {
    if (!booking || String(booking.roomId) !== String(roomId)) {
      return segments;
    }
    const start = booking.startHour * 60 + booking.startMinutes;
    const end = start + booking.durationMinutes;
    return segments.map((s) => {
      const t = s.hour * 60 + s.minutes;
      if (t >= start && t < end) {
        return { ...s, status: "taken" };
      }
      return s;
    });
  }

  function formatSlotShort(hour, minutes) {
    const d = new Date();
    d.setHours(hour, minutes, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function bookingEndDisplay(endSlot) {
    const step = RB.CONFIG.slotMinutes;
    const endMin = slotMinutes(endSlot) + step;
    return formatSlotLabel(Math.floor(endMin / 60), endMin % 60);
  }

  function displayTimelineSegments(room, bookingDate) {
    const base = sortTimelineSlots(room.timelineSlots || []);
    return filterPastSegments(base, bookingDate);
  }

  function filterPastSegments(segments, bookingDate) {
    if (!bookingDate || !RB.util.isToday(bookingDate)) return segments;
    const step = RB.CONFIG.slotMinutes;
    const now = new Date();
    let min = now.getHours() * 60 + now.getMinutes();
    min = Math.ceil(min / step) * step;
    return segments.filter((s) => slotMinutes(s) >= min);
  }

  function validEndOptions(segments, start) {
    const step = RB.CONFIG.slotMinutes;
    const minM = RB.CONFIG.minBookingMinutes;
    const maxM = RB.CONFIG.maxBookingMinutes;
    const options = [];
    for (let dur = minM; dur <= maxM; dur += step) {
      const endMin = slotMinutes(start) + dur - step;
      const endHour = Math.floor(endMin / 60);
      const endMinutes = endMin % 60;
      const endSlot = { hour: endHour, minutes: endMinutes, label: formatSlotLabel(endHour, endMinutes) };
      const check = validateBookingRange(segments, start, endSlot);
      if (!check.ok) continue;
      options.push({
        value: `${endHour}-${endMinutes}-${dur}`,
        endSlot,
        durationMinutes: dur,
        label: `${bookingEndDisplay(endSlot)} (${formatDuration(dur)})`
      });
    }
    return options;
  }

  function formatHourLabel(hour24) {
    const d = new Date();
    d.setHours(hour24, 0, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function formatSlotLabel(hour, minutes) {
    const d = new Date();
    d.setHours(hour, minutes, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function slotMinutes(s) {
    return s.hour * 60 + s.minutes;
  }

  function sortTimelineSlots(slots) {
    return (slots || []).slice().sort((a, b) => slotMinutes(a) - slotMinutes(b));
  }

  function slotInRange(s, start, end) {
    if (!start) return null;
    const t = slotMinutes(s);
    const a = slotMinutes(start);
    if (!end) return t === a ? "start" : null;
    const b = slotMinutes(end);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (t === a) return "start";
    if (t === b) return "end";
    if (t > lo && t < hi) return "between";
    return null;
  }

  function validateBookingRange(segments, start, end) {
    const step = RB.CONFIG.slotMinutes;
    const minM = RB.CONFIG.minBookingMinutes;
    const maxM = RB.CONFIG.maxBookingMinutes;
    const a = slotMinutes(start);
    const b = slotMinutes(end);
    if (b < a) {
      return { ok: false, message: "End time must be after start." };
    }
    const durationMinutes = b - a + step;
    if (durationMinutes < minM) {
      return { ok: false, message: "Minimum booking is 15 minutes." };
    }
    if (durationMinutes > maxM) {
      return { ok: false, message: "Maximum booking is 1 hour on this flow." };
    }
    if ((durationMinutes - minM) % step !== 0) {
      return { ok: false, message: "Use 15-minute steps." };
    }
    for (let t = a; t <= b; t += step) {
      const seg = segments.find((s) => slotMinutes(s) === t);
      if (!seg || seg.status !== "free") {
        return { ok: false, message: "That range includes a busy slot. Pick a shorter span." };
      }
    }
    return {
      ok: true,
      durationMinutes,
      endLabel: end.label || formatSlotLabel(end.hour, end.minutes)
    };
  }

  function formatDuration(minutes) {
    if (minutes === 60) return "60 min";
    if (minutes % 60 === 0) return `${minutes / 60} hr`;
    return `${minutes} min`;
  }

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escAttr(str) {
    return esc(str).replace(/'/g, "&#39;");
  }

  function sameDay(a, b) {
    return RB.util.startOfDay(a).getTime() === RB.util.startOfDay(b).getTime();
  }

  RB.RoomBookingWizard = RoomBookingWizard;
})();
