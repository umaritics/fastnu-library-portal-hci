/** @file G10 Insignia room booking — selectors and flags (V1). */
(function () {
  const G10_SELECTORS = {
    datePicker: "#dtp_DateAvailable_Room",
    searchButton: "#btn_Search_Room",
    filterButton: "#btn_FilterF_Room",
    roomGrid: "#grd_Rooms_Room",
    bookButton: "#btn_Book_Room",
    purposeInput: "#txt_Purpose_Room",
    nativeBookingRoot: ".flexlayoutcol.roomBooking-content.base-border",
    roomControllerRoot: "#divRoomContent",
    timeCell: ".roomBookingTimeCell",
    timeCellDisabled: ".disabledTimeCell_Room",
    hourHeader: "[id^='roomTime_Room_']",
    timeFromSlider: "#sld_TimeFromTo_Room",
    timeToSlider: "#sld_TimeFromTo2_Room",
    roomScheduler: "#scheduler",
    homeInjectionAnchor: ".flexlayoutcol, main, #content, body"
  };

  const G10_CONFIG = {
    version: "1.0.12",
    pageBridgeVersion: "1.0.12",
    pageBridgeChannel: "g10-room-bridge-1.0.12",
    /** When true, Confirm skips native Book (dev only). Production: false. */
    TEST_MODE: false,
    defaultPurpose: "Group study",
    roomPagePath: "/Library/Room",
    homePath: "/Library/Home",
    loginPath: "/Library/Login",
    /** Public catalogue search (no patron login). */
    publicBookSearchPath: "/Library/Kiosk",
    loginUsernamePlaceholder: "ISB200XXI-XXXX",
    slotMinutes: 15,
    durationOptionsMinutes: [15, 30, 45, 60],
    libraryOpenHour: 9,
    libraryCloseHour: 20,
    minBookingMinutes: 15,
    maxBookingMinutes: 60,
  };

  window.G10RoomBooking = window.G10RoomBooking || {};
  window.G10RoomBooking.SELECTORS = G10_SELECTORS;
  window.G10RoomBooking.CONFIG = G10_CONFIG;
})();
