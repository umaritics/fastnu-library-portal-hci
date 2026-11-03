(function () {
  const RB = window.G10RoomBooking;

  RB.headerShell = {
    apply() {
      this.injectStyles();
      this.unifyHeader();
      this.removeLibraryWebsiteLink();
    },

    injectStyles() {
      this.injectFont();
      if (document.getElementById("g10-portal-redesign-css")) return;
      if (typeof chrome === "undefined" || !chrome.runtime?.getURL) return;
      const link = document.createElement("link");
      link.id = "g10-portal-redesign-css";
      link.rel = "stylesheet";
      link.href = chrome.runtime.getURL("content/shell/portal-redesign.css");
      document.head.appendChild(link);
    },

    injectFont() {
      if (document.getElementById("g10-font-plus-jakarta")) return;
      const link = document.createElement("link");
      link.id = "g10-font-plus-jakarta";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    },

    wrapHeaderTools(pageHeader) {
      if (pageHeader.querySelector(".g10-header-tools")) return;
      const tools = document.createElement("div");
      tools.className = "g10-header-tools";
      [...pageHeader.querySelectorAll(":scope > .flexlayout")].forEach((el) => {
        tools.appendChild(el);
      });
      pageHeader.appendChild(tools);
    },

    unifyHeader() {
      const header = document.getElementById("header");
      const navMenu = document.getElementById("navMenu");
      if (!header || !navMenu) return;

      header.classList.add("g10-unified-header");

      const pageHeader = document.getElementById("divPageHeaderContent");
      pageHeader?.querySelector(".g10-header-library-title")?.remove();
      pageHeader
        ?.querySelector(":scope > div:first-child")
        ?.classList.remove("g10-header-brand");

      const navSection = header.querySelector("section");
      const menuWrap = navSection?.querySelector(".menu");

      if (pageHeader && menuWrap) {
        if (!header.querySelector(".g10-header-nav-slot")) {
          const slot = document.createElement("div");
          slot.className = "g10-header-nav-slot";

          menuWrap.parentElement?.removeChild(menuWrap);
          slot.appendChild(menuWrap);
          pageHeader.appendChild(slot);

          if (navSection) {
            navSection.hidden = true;
            navSection.style.display = "none";
          }
        }
        this.unwrapNavBubble();
        this.wrapHeaderTools(pageHeader);
      }

      this.splitMyAccountMenu(navMenu);
      this.unwrapNavBubble();
      this.normalizeTopNav(navMenu);
      RB.navDropdown?.stripTopNavDecoration?.(navMenu);
      RB.navDropdown?.apply(navMenu);
    },

    normalizeTopNav(navMenu) {
      navMenu.style.cssText =
        "display:inline-flex!important;align-items:center;justify-content:center;width:max-content;margin:0;padding:0;list-style:none;gap:14px;flex-wrap:wrap;";
      navMenu.querySelectorAll(":scope > li").forEach((li) => {
        li.style.cssText =
          "float:none;position:relative;display:flex;align-items:center;width:auto;height:auto;margin:0;padding:0;";
        const link = li.querySelector(":scope > a");
        if (link) {
          link.style.width = "auto";
          link.style.height = "auto";
          link.style.minWidth = "0";
          link.style.position = "relative";
          link.style.top = "auto";
          link.style.left = "auto";
        }
      });
      this.unwrapNavBubble();
      const menu = document.querySelector(".g10-header-nav-slot .menu");
      if (menu) {
        menu.style.width = "max-content";
        menu.style.display = "inline-flex";
        menu.style.alignItems = "center";
        menu.style.justifyContent = "center";
      }
    },

    unwrapNavBubble() {
      const bubble = document.querySelector(".g10-nav-bubble");
      const slot = document.querySelector(".g10-header-nav-slot");
      if (!bubble || !slot) return;
      while (bubble.firstChild) {
        slot.insertBefore(bubble.firstChild, bubble);
      }
      bubble.remove();
    },

    removeLibraryWebsiteLink() {
      document.querySelectorAll("#navMenu a").forEach((a) => {
        if (/library website/i.test(a.textContent || "")) {
          a.closest("li")?.remove();
        }
      });
    },

    splitMyAccountMenu(navMenu) {
      const myAccountLi = [...navMenu.children].find((li) =>
        /my account/i.test(li.querySelector(":scope > a")?.textContent || "")
      );
      if (!myAccountLi || myAccountLi.dataset.g10Split) return;

      const sub = myAccountLi.querySelector(":scope > ul");
      if (!sub) return;

      const actionItems = [];
      sub.querySelectorAll(":scope > li").forEach((li) => {
        const topLink = li.querySelector(":scope > a");
        if (!topLink) return;
        if (RB.navModel.isUserLink(topLink)) return;
        if (/historical data/i.test(topLink.textContent || "")) return;
        actionItems.push(li);
      });

      actionItems.forEach((li) => li.remove());
      myAccountLi.dataset.g10Split = "1";

      RB._pendingActionMenuItems = actionItems;
    }
  };
})();
