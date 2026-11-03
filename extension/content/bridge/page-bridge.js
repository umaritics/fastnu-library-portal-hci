/**
 * Content-script side of MAIN-world bridge (jQuery/Kendo live in page context only).
 */
(function () {
  const RB = window.G10RoomBooking;
  const CHANNEL =
    RB.CONFIG.pageBridgeChannel ||
    "g10-room-bridge-" + (RB.CONFIG.pageBridgeVersion || RB.CONFIG.version);

  RB.pageBridge = {
    _injectPromise: null,
    _lastRooms: [],

    assertExtensionContext() {
      if (!RB.util.isExtensionAlive()) {
        throw new Error(RB.util.extensionRefreshMessage());
      }
    },

    injectViaScriptTag() {
      this.assertExtensionContext();
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("content/bridge/page-world.js");
        script.async = false;
        script.onload = () => {
          script.remove();
          resolve();
        };
        script.onerror = () => {
          script.remove();
          reject(new Error("Script tag injection blocked."));
        };
        (document.head || document.documentElement).appendChild(script);
      });
    },

    injectViaInlineFetch() {
      const url = chrome.runtime.getURL("content/bridge/page-world.js");
      return fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error("Could not fetch page-world.js");
          return r.text();
        })
        .then((code) => {
          const script = document.createElement("script");
          script.textContent = code;
          (document.head || document.documentElement).appendChild(script);
          script.remove();
        });
    },

    injectViaBackground() {
      this.assertExtensionContext();
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "G10_INJECT_PAGE_WORLD" }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(RB.util.friendlyError(chrome.runtime.lastError)));
            return;
          }
          if (response?.ok) resolve();
          else reject(new Error(response?.error || "Background injection failed."));
        });
      });
    },

    ensureInjected() {
      this.assertExtensionContext();
      if (document.documentElement.dataset.g10PageBridge === "1") {
        return this.assertBridgeVersion().catch(() => {
          document.documentElement.dataset.g10PageBridge = "";
          this._injectPromise = null;
          return this.ensureInjected();
        });
      }
      if (this._injectPromise) return this._injectPromise;

      this._injectPromise = (async () => {
        const tryPing = async () => {
          try {
            const status = await this.invoke("ping", {}, 8000);
            if (status?.jquery && status?.bridgeVersion === RB.CONFIG.pageBridgeVersion) {
              return status;
            }
          } catch (_) {
            /* not ready */
          }
          return null;
        };

        const existing = await tryPing();
        if (existing) {
          document.documentElement.dataset.g10PageBridge = "1";
          return;
        }

        const methods = [
          () => this.injectViaBackground(),
          () => this.injectViaScriptTag()
        ];

        let lastErr = null;
        for (const inject of methods) {
          try {
            await inject();
            await this.sleep(100);
            if (await tryPing()) {
              document.documentElement.dataset.g10PageBridge = "1";
              return;
            }
          } catch (err) {
            lastErr = err;
          }
        }
        this._injectPromise = null;
        throw lastErr || new Error("Could not inject page bridge.");
      })();

      return this._injectPromise;
    },

    async assertBridgeVersion() {
      const status = await this.invoke("ping", {}, 10000);
      if (status?.bridgeVersion !== RB.CONFIG.pageBridgeVersion) {
        throw new Error(
          `Booking bridge out of date (page ${status?.bridgeVersion || "?"} · extension ${RB.CONFIG.pageBridgeVersion}). Hard-refresh this tab (Ctrl+F5), then try again.`
        );
      }
      return status;
    },

    sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    },

    invoke(op, payload, timeoutMs = 60000) {
      return new Promise((resolve, reject) => {
        const requestId =
          "g10_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);

        const timer = setTimeout(() => {
          window.removeEventListener("message", onMessage);
          reject(new Error("Timeout waiting for portal widget."));
        }, timeoutMs);

        const onMessage = (event) => {
          if (event.source !== window || !event.data || event.data.channel !== CHANNEL) {
            return;
          }
          if (event.data.type !== "response" || event.data.requestId !== requestId) {
            return;
          }
          clearTimeout(timer);
          window.removeEventListener("message", onMessage);
          if (event.data.ok) resolve(event.data.result);
          else reject(new Error(event.data.error || "Page bridge error."));
        };

        window.addEventListener("message", onMessage);
        window.postMessage(
          { channel: CHANNEL, type: "request", requestId, op, payload: payload || {} },
          "*"
        );
      });
    },

    async call(op, payload, timeoutMs) {
      await this.ensureInjected();
      return this.invoke(op, payload, timeoutMs);
    },

    async ping() {
      return this.invoke("ping", {}, 10000);
    },

    async ensureReady(timeoutMs = 60000) {
      return this.call("ensureReady", {}, timeoutMs);
    },

    async searchRooms(date) {
      const d = date instanceof Date ? date : new Date(date);
      const result = await this.call(
        "searchRooms",
        { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() },
        60000
      );
      this._lastRooms = result.rooms || [];
      return result;
    },

    getLastRooms() {
      return this._lastRooms.slice();
    },

    async loadSlots(roomId) {
      const result = await this.call("loadSlots", { roomId: String(roomId) }, 45000);
      return result.slots || [];
    },

    async loadSlotsBatch(roomIds, bookingDate) {
      const payload = { roomIds: roomIds.map((id) => String(id)) };
      if (bookingDate) {
        const d = bookingDate instanceof Date ? bookingDate : new Date(bookingDate);
        payload.searchDate = {
          year: d.getFullYear(),
          month: d.getMonth(),
          date: d.getDate()
        };
      }
      const result = await this.call("loadSlotsBatch", payload, 120000);
      return result.rooms || [];
    },

    async clickSlot(hour, minutes) {
      return this.call("clickSlot", { hour, minutes }, 15000);
    },

    async extendSlots(roomId, startHour, startMinutes, durationMinutes) {
      return this.call(
        "extendSlots",
        { roomId: String(roomId), startHour, startMinutes, durationMinutes },
        30000
      );
    },

    async setSliderDuration(startHour, startMinutes, durationMinutes) {
      return this.call(
        "setSliderDuration",
        { startHour, startMinutes, durationMinutes },
        15000
      );
    },

    async submitRoomBooking(payload) {
      return this.call("submitRoomBooking", payload, 90000);
    }
  };
})();
