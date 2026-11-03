(function () {
  const RB = window.G10RoomBooking;

  const ICON_RULES = [
    { re: /my info|bio/i, glyph: "👤", color: "#3b82f6" },
    { re: /favourites|favorites/i, glyph: "★", color: "#ec4899" },
    { re: /notification|alert/i, glyph: "🔔", color: "#f59e0b" },
    { re: /loan history/i, glyph: "📋", color: "#8b5cf6" },
    { re: /fine history/i, glyph: "💳", color: "#ef4444" },
    { re: /book room|room booking/i, glyph: "📅", color: "#0ea5e9" },
    { re: /borrow|loan/i, glyph: "📚", color: "#10b981" },
    { re: /reserve/i, glyph: "🔖", color: "#6366f1" },
    { re: /event/i, glyph: "🎫", color: "#d946ef" },
    { re: /computer/i, glyph: "💻", color: "#14b8a6" },
    { re: /textbook|course/i, glyph: "🎓", color: "#f97316" },
    { re: /campus|islamabad|karachi|lahore|peshawar|multan|faisal/i, glyph: "🏫", color: "#2563eb" },
    { re: /e-resource|resource|service/i, glyph: "🌐", color: "#0891b2" },
    { re: /delivery|document/i, glyph: "📄", color: "#64748b" },
    { re: /communication|peer/i, glyph: "💬", color: "#7c3aed" },
    { re: /reading program/i, glyph: "📖", color: "#059669" },
    { re: /recommend/i, glyph: "✨", color: "#db2777" },
    { re: /media/i, glyph: "🎬", color: "#9333ea" },
    { re: /fine/i, glyph: "⚠", color: "#dc2626" },
    { re: /ill/i, glyph: "🔗", color: "#475569" }
  ];

  RB.navDropdown = {
    apply(navMenu) {
      if (!navMenu) return;
      this.stripTopNavDecoration(navMenu);
      if (!navMenu.dataset.g10Flattened) {
        this.flattenNestedSubmenus(navMenu);
        this.flattenTriangleItems(navMenu);
        navMenu.dataset.g10Flattened = "1";
      }
      this.decorateAll(navMenu);
    },

    stripTopNavDecoration(navMenu) {
      navMenu.querySelectorAll(":scope > li > a").forEach((anchor) => {
        const labelEl = anchor.querySelector(".g10-dd-label");
        if (!labelEl && !anchor.classList.contains("g10-dd-link")) return;
        const label = labelEl?.textContent?.trim() || anchor.textContent.trim();
        anchor.classList.remove("g10-dd-link");
        delete anchor.dataset.g10Dd;
        anchor.textContent = label;
      });
    },

    flattenTriangleItems(navMenu) {
      navMenu.querySelectorAll("li.liTriangle, li .triangle").forEach((el) => {
        el.closest("li")?.remove();
      });
    },

    flattenNestedSubmenus(navMenu) {
      navMenu.querySelectorAll(":scope > li > ul").forEach((menu) => {
        [...menu.querySelectorAll(":scope > li")].forEach((li) => {
          const nested = li.querySelector(":scope > ul");
          if (!nested) return;

          const sectionLink = li.querySelector(":scope > a");
          if (sectionLink) {
            sectionLink.classList.add("g10-dd-section-label");
            const headLi = document.createElement("li");
            headLi.className = "g10-dd-heading-li";
            headLi.appendChild(sectionLink);
            menu.insertBefore(headLi, li);
          }

          [...nested.children].forEach((child) => {
            menu.insertBefore(child, li.nextSibling);
          });
          li.remove();
        });
      });
    },

    decorateAll(navMenu) {
      navMenu
        .querySelectorAll(":scope > li > ul a")
        .forEach((anchor) => this.decorateLink(anchor));
    },

    decorateLink(anchor) {
      if (!anchor || anchor.dataset.g10Dd) return;

      if (anchor.classList.contains("g10-dd-section-label")) {
        anchor.dataset.g10Dd = "1";
        return;
      }

      const label = (anchor.textContent || "").replace(/\s+/g, " ").trim();
      if (!label || /^javascript/i.test(anchor.getAttribute("href") || "")) return;

      const rule =
        ICON_RULES.find((r) => r.re.test(label)) ||
        ICON_RULES.find((r) => r.re.test(anchor.getAttribute("href") || ""));

      const glyph = rule?.glyph || label.charAt(0).toUpperCase();
      const color = rule?.color || "#6366f1";

      anchor.textContent = "";
      anchor.classList.add("g10-dd-link");

      const icon = document.createElement("span");
      icon.className = "g10-dd-icon";
      icon.style.backgroundColor = color;
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = glyph;

      const text = document.createElement("span");
      text.className = "g10-dd-label";
      text.textContent = label;

      anchor.appendChild(icon);
      anchor.appendChild(text);
      anchor.dataset.g10Dd = "1";
    }
  };
})();
