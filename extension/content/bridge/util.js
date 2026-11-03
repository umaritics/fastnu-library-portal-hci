(function () {
  const RB = window.G10RoomBooking;
  RB.util = {
    $() {
      if (!window.jQuery) {
        throw new Error("jQuery not loaded — open the library portal first.");
      }
      return window.jQuery;
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    waitFor(fn, { timeoutMs = 15000, intervalMs = 100 } = {}) {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const tick = () => {
          try {
            const value = fn();
            if (value) {
              resolve(value);
              return;
            }
          } catch (_) {
            /* retry */
          }
          if (Date.now() - start > timeoutMs) {
            reject(new Error("Timeout waiting for portal widget."));
            return;
          }
          setTimeout(tick, intervalMs);
        };
        tick();
      });
    },

    onPath(pathSuffix) {
      return window.location.pathname.toLowerCase().includes(pathSuffix.toLowerCase());
    },

    findNativeBookingHost() {
      const RB = window.G10RoomBooking;
      const candidates = [
        RB.SELECTORS?.nativeBookingRoot,
        ".flexlayoutcol.roomBooking-content.base-border",
        ".flexlayoutcol.roomBooking-content:not(#divRoomContent)",
        "#pageMainContent .roomBooking-content"
      ].filter(Boolean);
      for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (!el || el.id === "divRoomContent") continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        return el;
      }
      return null;
    },

    waitForJQuery(options) {
      return this.waitFor(() => window.jQuery, options);
    },

    startOfDay(d) {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    },

    isToday(date) {
      if (!date) return false;
      const a = this.startOfDay(date);
      const b = this.startOfDay(new Date());
      return a.getTime() === b.getTime();
    },

    isWeekend(date) {
      const d = date instanceof Date ? date : new Date(date);
      const day = d.getDay();
      return day === 0 || day === 6;
    },

    isBookableDay(date) {
      const d = this.startOfDay(date instanceof Date ? date : new Date(date));
      const today = this.startOfDay(new Date());
      if (d < today) return false;
      if (this.isWeekend(d)) return false;
      return true;
    },

    nextBookableDay(fromDate) {
      let d = this.startOfDay(fromDate instanceof Date ? fromDate : new Date(fromDate));
      for (let i = 0; i < 14; i += 1) {
        if (this.isBookableDay(d)) return d;
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        d = this.startOfDay(next);
      }
      return d;
    },

    formatDateLabel(date) {
      const d = date instanceof Date ? date : new Date(date);
      const base = d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric"
      });
      if (this.isToday(d)) {
        return `${base} (Today)`;
      }
      return base;
    },

    parsePortalDate(value) {
      if (!value) return null;
      const parts = String(value).split(/[/.-]/);
      if (parts.length !== 3) return null;
      const [d, m, y] = parts.map((p) => parseInt(p, 10));
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    isExtensionAlive() {
      try {
        return Boolean(chrome?.runtime?.id);
      } catch (_) {
        return false;
      }
    },

    extensionRefreshMessage() {
      return "Extension was reloaded or updated. Refresh this page (Ctrl+F5), then continue.";
    },

    friendlyError(err) {
      const msg = err && err.message ? err.message : String(err || "Unknown error");
      if (/invalidated|extension context/i.test(msg)) {
        return this.extensionRefreshMessage();
      }
      return msg;
    }
  };
})();
