(function () {
  const RB = window.G10RoomBooking;

  const USER_HREF_PATTERNS = [
    /^MyBio$/i,
    /^MyFavorites$/i,
    /^NotificationAlerts$/i,
    /^LoanHistory$/i,
    /^FineHistory$/i
  ];

  const PROMINENT = [
    { key: "book-room", label: "Book a study room", href: "Room", icon: "📅" },
    { key: "find-book", label: "Find a book", href: "#g10-books-search", icon: "🔍" }
  ];

  const TOP_NAV_LABELS = new Set([
    "Home",
    "My Account",
    "University Site",
    "Campus Locations",
    "E-Resources"
  ]);

  RB.navModel = {
    PROMINENT,
    TOP_NAV_LABELS,

    resolveHref(href) {
      if (!href || href.startsWith("javascript") || href.startsWith("#")) return href;
      if (href.startsWith("http")) return href;
      const path = href.startsWith("/") ? href : `/Library/${href}`;
      return `${location.origin}${path}`;
    },

    isUserLink(anchor) {
      const href = (anchor.getAttribute("href") || "").trim();
      return USER_HREF_PATTERNS.some((re) => re.test(href));
    },

    isActionLink(anchor) {
      const text = (anchor.textContent || "").trim();
      if (!text || text === "My Account") return false;
      if (TOP_NAV_LABELS.has(text)) return false;
      if (/library website/i.test(text)) return false;
      return !this.isUserLink(anchor);
    },

    labelFromAnchor(a) {
      return (a.textContent || "").replace(/\s+/g, " ").trim();
    }
  };
})();
