/**
 * Runs in the page MAIN world (not extension isolated world).
 * Handles Insignia Room() + Kendo via window.jQuery.
 */
(function () {
  const BRIDGE_VERSION = "1.0.12";
  if (window.__G10_PAGE_WORLD_VERSION__ === BRIDGE_VERSION) return;
  if (window.__G10_PAGE_WORLD_MESSAGE_HANDLER__) {
    window.removeEventListener("message", window.__G10_PAGE_WORLD_MESSAGE_HANDLER__);
  }
  window.__G10_PAGE_WORLD_VERSION__ = BRIDGE_VERSION;

  const CHANNEL = "g10-room-bridge-" + BRIDGE_VERSION;
  const SLOT_MIN = 15;

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function waitFor(fn, timeoutMs, intervalMs = 100) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const v = fn();
        if (v) return v;
      } catch (_) {
        /* retry */
      }
      await sleep(intervalMs);
    }
    throw new Error("Portal not ready in page context.");
  }

  function getRoom() {
    if (!window.jQuery) return null;
    return window.jQuery("#divRoomContent").data("room") || null;
  }

  function getGrid() {
    if (!window.jQuery) return null;
    return window.jQuery("#grd_Rooms_Room").data("kendoGrid") || null;
  }

  async function ensureReady() {
    await waitFor(() => window.jQuery, 45000);
    await waitFor(() => getRoom() && getGrid(), 45000);
    return { room: true, grid: true };
  }

  function asArray(view) {
    if (!view) return [];
    if (Array.isArray(view)) return view;
    if (typeof view.toArray === "function") return view.toArray();
    try {
      return Array.from(view);
    } catch (_) {
      const out = [];
      for (let i = 0; i < view.length; i += 1) out.push(view[i]);
      return out;
    }
  }

  function rowData(item) {
    return item && typeof item.toJSON === "function" ? item.toJSON() : item;
  }

  async function refreshPortalSearch() {
    const room = getRoom();
    const grid = getGrid();
    if (!room || !grid) throw new Error("Portal room grid not ready.");
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Timeout refreshing room search.")),
        45000
      );
      const onBound = () => {
        clearTimeout(timer);
        grid.unbind("dataBound", onBound);
        resolve();
      };
      grid.bind("dataBound", onBound);
      if (typeof room.btnSearch_click === "function") {
        room.btnSearch_click();
      } else {
        document.querySelector("#btn_Search_Room")?.click();
      }
    });
    await sleep(450);
  }

  function findRoomRowIndex(grid, roomId) {
    const view = asArray(grid.dataSource.view());
    for (let i = 0; i < view.length; i += 1) {
      if (String(rowData(view[i]).t102Identifier) === String(roomId)) return i;
    }
    return -1;
  }

  function readRoomsFromGrid() {
    const grid = getGrid();
    if (!grid?.dataSource) return [];
    return asArray(grid.dataSource.view()).map((item) => {
      const data = rowData(item);
      return {
        id: String(data.t102Identifier),
        barcode: data.t102Barcode,
        name: data.t102Title,
        capacity: data.t102Capacity,
        location: data.t102RoomLocation,
        roomType: data.RoomType,
        maxBookingMinutes: data.t102RoomMaxiBookingTime || 60
      };
    });
  }

  async function loadSlotsBatch(payload) {
    await ensureReady();
    const room = getRoom();
    const grid = getGrid();
    const ids = Array.isArray(payload.roomIds) ? payload.roomIds : [];
    const searchDate = payload.searchDate;
    if (searchDate && typeof searchDate.year === "number") {
      const date = new Date(searchDate.year, searchDate.month, searchDate.date);
      date.setHours(0, 0, 0, 0);
      room.controls.dtpDateAvailable.value(date);
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timeout refreshing search.")), 45000);
        const onBound = () => {
          clearTimeout(timer);
          grid.unbind("dataBound", onBound);
          resolve();
        };
        grid.bind("dataBound", onBound);
        room.btnSearch_click();
      });
      await sleep(300);
    }
    if (typeof room.checkBookedRoomDayByDay === "function") {
      try {
        room.checkBookedRoomDayByDay();
      } catch (_) {
        /* portal marks patron bookings */
      }
    }
    const rooms = [];
    for (const roomId of ids) {
      try {
        const result = await loadSlots({ roomId: String(roomId) });
        rooms.push({ roomId: String(roomId), slots: result.slots, error: null });
      } catch (err) {
        rooms.push({
          roomId: String(roomId),
          slots: [],
          error: err && err.message ? err.message : String(err)
        });
      }
    }
    return { rooms };
  }

  async function searchRooms(payload) {
    await ensureReady();
    const room = getRoom();
    const grid = getGrid();
    let date;
    if (typeof payload.year === "number") {
      date = new Date(payload.year, payload.month, payload.date);
    } else {
      date = new Date(payload.dateIso);
    }
    date.setHours(0, 0, 0, 0);
    room.controls.dtpDateAvailable.value(date);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Timeout waiting for room search.")),
        45000
      );
      let settled = false;
      let poll = null;

      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (poll) clearInterval(poll);
        grid.unbind("dataBound", onBound);
        resolve({ rooms: readRoomsFromGrid(), dateIso: date.toISOString() });
      };

      const hasRows = () => {
        try {
          return asArray(grid.dataSource.view()).length > 0;
        } catch (_) {
          return false;
        }
      };

      const onBound = () => {
        if (hasRows()) finish();
      };

      grid.bind("dataBound", onBound);
      room.btnSearch_click();
      poll = setInterval(() => {
        if (hasRows()) finish();
      }, 200);
    });
  }

  function parseHourFromHeaderId(id) {
    const match = id && id.match(/roomTime_Room_(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function isFreeTimeCell(el) {
    if (!el || !el.classList.contains("roomBookingTimeCell")) return false;
    if (el.classList.contains("disabledTimeCell_Room")) return false;
    if (el.classList.contains("appendingApproved_Room")) return false;
    if (el.classList.contains("bookedTimeCell_Room")) return false;
    if (el.classList.contains("reservedTimeCell_Room")) return false;
    return true;
  }

  function refreshRoomTimeStrip(room) {
    if (typeof room.gridRooms_Changed === "function") {
      room.gridRooms_Changed();
    }
    if (typeof room.checkBookedRoomDayByDay === "function") {
      room.checkBookedRoomDayByDay();
    } else if (typeof room._refreshBookingInfo === "function") {
      room._refreshBookingInfo();
    }
  }

  function formatTime12(hour24, minutes) {
    const d = new Date();
    d.setHours(hour24, minutes, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function readTimeSlots() {
    const slots = [];
    const headers = [...document.querySelectorAll("[id^='roomTime_Room_']")];
    for (const header of headers) {
      const hour = parseHourFromHeaderId(header.id);
      if (hour == null) continue;
      const container = header.querySelector(".flexlayout") || header;
      const cells = container.querySelectorAll(".roomBookingTimeCell");
      let quarter = 0;
      for (const cell of cells) {
        if (quarter >= 4) break;
        const minutes = quarter * SLOT_MIN;
        slots.push({
          hour,
          minutes,
          label: formatTime12(hour, minutes),
          status: isFreeTimeCell(cell) ? "free" : "taken"
        });
        quarter += 1;
      }
    }
    return slots;
  }

  async function loadSlots(payload) {
    await ensureReady();
    const room = getRoom();
    const grid = getGrid();
    const roomId = String(payload.roomId);
    const index = findRoomRowIndex(grid, roomId);
    if (index < 0) throw new Error("Room not in grid.");

    const rowEl = grid.tbody.find(`tr:eq(${index})`);
    grid.select(rowEl);
    const dom = rowEl[0];
    if (dom) dom.click();
    else rowEl.trigger("click");
    refreshRoomTimeStrip(room);

    await waitFor(() => document.querySelector(".roomBookingTimeCell"), 20000);
    await sleep(800);
    if (typeof room.checkBookedRoomDayByDay === "function") {
      try {
        room.checkBookedRoomDayByDay();
      } catch (_) {
        /* patron bookings on strip */
      }
    }
    await sleep(400);
    return { slots: readTimeSlots() };
  }

  async function clickSlot(payload) {
    await ensureReady();
    const { hour, minutes } = payload;
    const td = document.getElementById("roomTime_Room_" + hour);
    if (!td) throw new Error("Start time not found on portal.");
    const container = td.querySelector(".flexlayout") || td;
    const cells = container.querySelectorAll(".roomBookingTimeCell");
    const idx = minutes / SLOT_MIN;
    const cell = cells[idx];
    if (!cell) throw new Error("Start time not found on portal.");
    if (!isFreeTimeCell(cell)) throw new Error("Slot is not available.");
    cell.click();
    return { ok: true };
  }

  async function extendSlots(payload) {
    const { startHour, startMinutes, durationMinutes, roomId } = payload;
    const steps = durationMinutes / SLOT_MIN;
    let slots = readTimeSlots();
    if (!slots.length && roomId) {
      const loaded = await loadSlots({ roomId: String(roomId) });
      slots = loaded.slots;
    }
    const startIdx = slots.findIndex(
      (s) => s.hour === startHour && s.minutes === startMinutes
    );
    if (startIdx < 0) throw new Error("Start time not found on portal.");
    for (let i = 1; i < steps; i += 1) {
      const slot = slots[startIdx + i];
      if (!slot || slot.status !== "free") {
        throw new Error("That length is not free for this room.");
      }
      await clickSlot({ hour: slot.hour, minutes: slot.minutes });
    }
    return { ok: true };
  }

  async function setSliderDuration(payload) {
    await ensureReady();
    const $ = window.jQuery;
    const endTotal =
      payload.startHour * 60 + payload.startMinutes + payload.durationMinutes;
    const ids = ["#sld_TimeFromTo2_Room", "#sld_TimeFromTo_Room"];
    for (const sel of ids) {
      const slider = $(sel).data("kendoSlider");
      if (!slider) continue;
      slider.value(endTotal);
      slider.trigger("change");
      return { ok: true, via: sel };
    }
    return { ok: false };
  }

  function slotMinute(hour, minutes) {
    return hour * 60 + minutes;
  }

  function isRangeFree(slots, startHour, startMinutes, durationMinutes) {
    const start = slotMinute(startHour, startMinutes);
    const end = start + durationMinutes - SLOT_MIN;
    for (let t = start; t <= end; t += SLOT_MIN) {
      const hour = Math.floor(t / 60);
      const minutes = t % 60;
      const seg = slots.find((s) => s.hour === hour && s.minutes === minutes);
      if (!seg || seg.status !== "free") return false;
    }
    return true;
  }

  function getTimeCellAt(hour, minutes) {
    const td = document.getElementById("roomTime_Room_" + hour);
    if (!td) return null;
    const container = td.querySelector(".flexlayout") || td;
    const cells = container.querySelectorAll(".roomBookingTimeCell");
    const idx = minutes / SLOT_MIN;
    return cells[idx] || null;
  }

  function isCellPersistentlyBooked(cell) {
    if (!cell) return false;
    return (
      cell.classList.contains("appendingApproved_Room") ||
      cell.classList.contains("disabledTimeCell_Room") ||
      cell.classList.contains("bookedTimeCell_Room") ||
      cell.classList.contains("reservedTimeCell_Room")
    );
  }

  /** True only when every 15-min cell in range is server-marked taken (after a fresh search). */
  function isRangeBookedOnStrip(startHour, startMinutes, durationMinutes) {
    const expected = durationMinutes / SLOT_MIN;
    const start = slotMinute(startHour, startMinutes);
    const end = start + durationMinutes - SLOT_MIN;
    let seen = 0;
    let booked = 0;
    for (let t = start; t <= end; t += SLOT_MIN) {
      const hour = Math.floor(t / 60);
      const minutes = t % 60;
      const cell = getTimeCellAt(hour, minutes);
      if (!cell) return false;
      seen += 1;
      if (isCellPersistentlyBooked(cell)) booked += 1;
    }
    return seen === expected && booked === expected;
  }

  function portalUserMessageTexts() {
    const out = [];
    const selectors = [
      ".k-window",
      ".k-dialog",
      ".k-notification",
      ".k-notification-wrap",
      "[role='alert']"
    ];
    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      if (el.closest(".g10-rb-card, [data-g10-extension]")) return;
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return;
      const t = (el.innerText || "").trim().replace(/\s+/g, " ");
      if (t.length < 4) return;
      out.push(t);
    });
    return out;
  }

  function visiblePortalMessages() {
    return portalUserMessageTexts().filter((t) => t.length > 8);
  }

  const PORTAL_SUCCESS_RE =
    /successfully booked|booking successful|booked successfully|has been booked|booking id|thank you for|reservation confirmed/i;

  function readNewPortalError(beforeMessages) {
    const before = new Set(beforeMessages);
    for (const t of portalUserMessageTexts()) {
      if (before.has(t)) continue;
      if (PORTAL_SUCCESS_RE.test(t)) continue;
      if (
        /error|invalid|cannot book|not available|failed|unable|required|please select/i.test(
          t
        )
      ) {
        return t.slice(0, 400);
      }
    }
    const val = document.querySelector(".k-tooltip-validation, .field-validation-error");
    if (val?.innerText?.trim()) return val.innerText.trim().slice(0, 300);
    return null;
  }

  function readNewSuccessMessage(beforeMessages) {
    const before = new Set(beforeMessages);
    for (const t of portalUserMessageTexts()) {
      if (before.has(t)) continue;
      if (PORTAL_SUCCESS_RE.test(t)) {
        return t.slice(0, 500);
      }
    }
    return null;
  }

  async function clickPostBookDialogOk() {
    for (let i = 0; i < 20; i += 1) {
      const windows = [...document.querySelectorAll(".k-window")].filter((w) => {
        const style = window.getComputedStyle(w);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      for (const win of windows) {
        const text = (win.innerText || "").toLowerCase();
        if (!/book|fee|confirm|agreement|payment|charge/i.test(text)) continue;
        const buttons = win.querySelectorAll(
          ".k-primary, .k-button, button, a[role='button']"
        );
        for (const btn of buttons) {
          const label = (btn.innerText || btn.value || "").trim();
          if (/^(ok|yes|confirm|book|continue)$/i.test(label)) {
            btn.click();
            await sleep(400);
            return true;
          }
        }
      }
      await sleep(250);
    }
    return false;
  }

  function bookingBaseDate(room, searchDate) {
    if (searchDate && typeof searchDate.year === "number") {
      const d = new Date(searchDate.year, searchDate.month, searchDate.date);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const dp = room.controls?.dtpDateAvailable;
    if (dp && typeof dp.value === "function") {
      const v = dp.value();
      if (v instanceof Date) {
        const d = new Date(v);
        d.setHours(0, 0, 0, 0);
        return d;
      }
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  function setRoomDateTimeFields(room, baseDate, startHour, startMinutes, durationMinutes) {
    const from = new Date(baseDate);
    from.setHours(startHour, startMinutes, 0, 0);
    const to = new Date(from.getTime() + durationMinutes * 60 * 1000);
    const kendo = window.kendo;
    if (kendo && typeof kendo.toString === "function") {
      room.fromDateTime = kendo.toString(from, "yyyy-MM-dd HH:mm:ss");
      room.toDateTime = kendo.toString(to, "yyyy-MM-dd HH:mm:ss");
    } else {
      const pad = (n) => String(n).padStart(2, "0");
      const fmt = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
          d.getHours()
        )}:${pad(d.getMinutes())}:00`;
      room.fromDateTime = fmt(from);
      room.toDateTime = fmt(to);
    }
  }

  function parsePortalDateTime(str) {
    if (!str) return null;
    const kendo = window.kendo;
    if (kendo && typeof kendo.parseDate === "function") {
      const d = kendo.parseDate(str);
      if (d) return d;
    }
    const d = new Date(String(str).replace(" ", "T"));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function nativeRangeMatches(room, startHour, startMinutes, durationMinutes) {
    if (!room.fromDateTime) return false;
    const from = parsePortalDateTime(room.fromDateTime);
    if (!from) return false;
    if (from.getHours() !== startHour || from.getMinutes() !== startMinutes) {
      return false;
    }
    if (durationMinutes <= SLOT_MIN) return true;
    if (!room.toDateTime) return false;
    const to = parsePortalDateTime(room.toDateTime);
    if (!to) return false;
    const expectedEnd = from.getTime() + durationMinutes * 60 * 1000;
    return Math.abs(to.getTime() - expectedEnd) < 60000;
  }

  async function selectNativeRange(room, roomId, searchDate, startHour, startMinutes, durationMinutes) {
    await loadSlots({ roomId: String(roomId) });
    await clickSlot({ hour: startHour, minutes: startMinutes });
    if (durationMinutes > SLOT_MIN) {
      const slider = await setSliderDuration({
        startHour,
        startMinutes,
        durationMinutes
      });
      if (!slider.ok) {
        await extendSlots({
          roomId: String(roomId),
          startHour,
          startMinutes,
          durationMinutes
        });
      }
      if (typeof room.siler_change === "function") {
        try {
          room.siler_change();
        } catch (_) {
          /* sync */
        }
      }
    }
    const base = bookingBaseDate(room, searchDate);
    if (
      !room.toDateTime ||
      !nativeRangeMatches(room, startHour, startMinutes, durationMinutes)
    ) {
      setRoomDateTimeFields(room, base, startHour, startMinutes, durationMinutes);
    }
  }

  function assertNativeReadyForBook(room, durationMinutes) {
    const grid = getGrid();
    const row = grid.select();
    if (!row || !row.length) {
      throw new Error("Portal room row is not selected.");
    }
    const item = grid.dataItem(row);
    if (!item) {
      throw new Error("Portal room row is not selected.");
    }
    if (room.isBookingByPeriod) {
      const times =
        typeof room.getSelectPeriodTimes === "function" ? room.getSelectPeriodTimes() : [];
      if (!times || times.length < 1) {
        throw new Error("The portal did not register your time slots.");
      }
      return;
    }
    if (!room.fromDateTime) {
      throw new Error("The portal did not register a start time.");
    }
    if (durationMinutes > SLOT_MIN && !room.toDateTime) {
      throw new Error("The portal did not register an end time for this booking length.");
    }
  }

  function readNewKendoAlert(beforeMessages) {
    const before = new Set(beforeMessages || []);
    for (const win of document.querySelectorAll(".k-window")) {
      const style = window.getComputedStyle(win);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const text = (win.innerText || "").trim();
      if (text.length < 4 || before.has(text)) continue;
      if (/^(OK|Cancel|Yes|No)$/i.test(text)) continue;
      return text;
    }
    return null;
  }

  async function waitForNativeBookFeedback(messagesBefore, timeoutMs = 35000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      await clickPostBookDialogOk();
      const alertText = readNewKendoAlert(messagesBefore);
      if (alertText) {
        if (PORTAL_SUCCESS_RE.test(alertText)) {
          return alertText.slice(0, 500);
        }
        if (
          /invalid|cannot|select|error|failed|C58579|C62433|C61603/i.test(alertText)
        ) {
          throw new Error(alertText.slice(0, 400));
        }
      }
      const toastSuccess = readNewSuccessMessage(messagesBefore);
      if (toastSuccess) {
        return toastSuccess;
      }
      await sleep(350);
    }
    return readNewSuccessMessage(messagesBefore);
  }

  function invokeNativeBook(room) {
    if (room.isBookingByPeriod && typeof room.doRoomBookingByPeriod === "function") {
      room.doRoomBookingByPeriod();
      return;
    }
    if (typeof room.btnBook_click === "function") {
      room.btnBook_click();
      return;
    }
    const btn = document.querySelector("#btn_Book_Room");
    if (!btn) throw new Error("Book button not found on portal.");
    btn.click();
  }

  async function verifyBookingOnPortal(payload) {
    const roomId = String(payload.roomId);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await sleep(600 + attempt * 350);
      try {
        await refreshPortalSearch();
        await loadSlots({ roomId });
      } catch (_) {
        continue;
      }
      if (
        isRangeBookedOnStrip(
          payload.startHour,
          payload.startMinutes,
          payload.durationMinutes
        )
      ) {
        return true;
      }
    }
    return false;
  }

  function setPurposeOnPortal(room, purpose) {
    const text = purpose || "";
    const ctrl = room.controls?.txtPurpose;
    if (ctrl && typeof ctrl.value === "function") {
      ctrl.value(text);
      return;
    }
    const $ = window.jQuery;
    const el = $("#txt_Purpose_Room");
    el.val(text);
    el.trigger("change");
  }

  async function submitRoomBooking(payload) {
    await ensureReady();
    const room = getRoom();
    const {
      roomId,
      startHour,
      startMinutes,
      durationMinutes,
      purpose
    } = payload;

    console.info("[G10 page-world] submitRoomBooking", payload);

    if (!roomId || startHour == null || startMinutes == null || !durationMinutes) {
      throw new Error("Incomplete booking selection.");
    }

    if (payload.searchDate && typeof payload.searchDate.year === "number") {
      const date = new Date(
        payload.searchDate.year,
        payload.searchDate.month,
        payload.searchDate.date
      );
      date.setHours(0, 0, 0, 0);
      room.controls.dtpDateAvailable.value(date);
      await refreshPortalSearch();
    }

    const preBook = await loadSlots({ roomId: String(roomId) });
    if (
      !isRangeFree(
        preBook.slots,
        startHour,
        startMinutes,
        durationMinutes
      )
    ) {
      throw new Error("That time is no longer free on the portal.");
    }

    await selectNativeRange(
      room,
      roomId,
      payload.searchDate,
      startHour,
      startMinutes,
      durationMinutes
    );

    console.info(
      "[G10 page-world] native range",
      room.fromDateTime,
      room.toDateTime,
      "isBookingByPeriod",
      room.isBookingByPeriod
    );

    setPurposeOnPortal(room, purpose);
    await sleep(400);

    if (typeof room.checkRoomAvailable === "function") {
      try {
        room.checkRoomAvailable();
      } catch (_) {
        /* portal validates on book */
      }
    }

    assertNativeReadyForBook(room, durationMinutes);

    const messagesBefore = visiblePortalMessages();

    invokeNativeBook(room);

    let portalSuccess = null;
    try {
      portalSuccess = await waitForNativeBookFeedback(messagesBefore, 35000);
    } catch (err) {
      throw err;
    }

    const portalError = readNewPortalError(messagesBefore);
    if (portalError) {
      throw new Error(portalError);
    }

    if (portalSuccess) {
      const message =
        portalSuccess ||
        "Your room is held for the selected time. Check My Room Bookings for details.";
      return {
        ok: true,
        simulated: false,
        verified: true,
        bridgeVersion: BRIDGE_VERSION,
        message
      };
    }

    const verified = await verifyBookingOnPortal({
      roomId,
      startHour,
      startMinutes,
      durationMinutes
    });

    console.info("[G10 page-world] verifyBookingOnPortal", verified);

    if (!verified) {
      throw new Error(
        "The library portal did not save your booking — the time slot is still free. Check My Room Bookings or try again."
      );
    }

    const dialogMsg = readNewSuccessMessage(messagesBefore);
    const message =
      dialogMsg ||
      "Your room is held for the selected time. Check My Room Bookings for details.";

    return {
      ok: true,
      simulated: false,
      verified: true,
      bridgeVersion: BRIDGE_VERSION,
      message
    };
  }

  const handlers = {
    ping: () => ({
      bridgeVersion: BRIDGE_VERSION,
      jquery: !!window.jQuery,
      room: !!getRoom(),
      grid: !!getGrid()
    }),
    ensureReady,
    searchRooms,
    loadSlots,
    loadSlotsBatch,
    clickSlot,
    extendSlots,
    setSliderDuration,
    submitRoomBooking
  };

  const onPageBridgeMessage = (event) => {
    if (event.source !== window || !event.data || event.data.channel !== CHANNEL) {
      return;
    }
    if (event.data.type !== "request") return;

    const { requestId, op, payload } = event.data;
    const run = handlers[op];
    if (!run) {
      window.postMessage(
        {
          channel: CHANNEL,
          type: "response",
          requestId,
          ok: false,
          error: "Unknown operation: " + op
        },
        "*"
      );
      return;
    }

    Promise.resolve(run(payload || {}))
      .then((result) => {
        window.postMessage(
          { channel: CHANNEL, type: "response", requestId, ok: true, result },
          "*"
        );
      })
      .catch((err) => {
        window.postMessage(
          {
            channel: CHANNEL,
            type: "response",
            requestId,
            ok: false,
            error: err && err.message ? err.message : String(err)
          },
          "*"
        );
      });
  };

  window.__G10_PAGE_WORLD_MESSAGE_HANDLER__ = onPageBridgeMessage;
  window.addEventListener("message", onPageBridgeMessage);
})();
