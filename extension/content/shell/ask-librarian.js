(function () {
  const RB = window.G10RoomBooking;

  RB.askLibrarianShell = {
    apply() {
      this.positionDefault();
      this.startDomWatch();
      if (this._wired) return;
      this._wired = true;
      window.addEventListener("resize", () => this.positionDefault());
      window.addEventListener("load", () => this.positionDefault());
      let ticks = 0;
      const timer = setInterval(() => {
        ticks += 1;
        this.positionDefault();
        if (ticks > 40) clearInterval(timer);
      }, 500);

      if (typeof ResizeObserver !== "undefined") {
        const footer = document.querySelector("#pageMainContent > footer");
        const ro = new ResizeObserver(() => this.positionDefault());
        if (footer) ro.observe(footer);
        const watchContainer = () => {
          const c = this.findContainer();
          if (c && !c.dataset.g10AskRo) {
            c.dataset.g10AskRo = "1";
            ro.observe(c);
          }
        };
        watchContainer();
        setInterval(watchContainer, 2000);
      }
    },

    startDomWatch() {
      if (this._domObserver) return;
      this._domObserver = new MutationObserver(() => {
        this.positionDefault();
        this.wireAskHeader(this.findContainer());
      });
      this._domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    },

    findContainer() {
      return [...document.querySelectorAll(".k-animation-container")].find((el) =>
        el.querySelector(".askLibrarianTitle, .askLibrarianBox, #askLibrarianContent")
      );
    },

    wireAskHeader(container) {
      if (!container) return;
      const box = container.querySelector(".askLibrarianBox, #askLibrarianContent");
      if (!box || box.dataset.g10AskHeaderWired) return;
      const header = box.querySelector(".askboxheader");
      const expandBtn = box.querySelector(".askLibrarianResWin");
      if (!header || !expandBtn) return;

      box.dataset.g10AskHeaderWired = "1";
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.setAttribute("aria-label", "Ask Librarian — expand chat");

      const activate = (e) => {
        if (e?.target?.closest?.(".askLibrarianMinWin")) return;
        expandBtn.click();
      };

      header.addEventListener("click", (e) => {
        if (e.target.closest(".askLibrarianResWin")) return;
        activate(e);
      });

      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate(e);
        }
      });
    },

    positionDefault() {
      const footer = document.querySelector("#pageMainContent > footer");
      const container = this.findContainer();
      if (!footer || !container) return;

      this.wireAskHeader(container);

      const footerRect = footer.getBoundingClientRect();
      if (footerRect.height < 8 || footerRect.width < 40) return;

      const width = container.offsetWidth || 200;
      const height = container.offsetHeight || 36;
      const left = footerRect.left + (footerRect.width - width) / 2;
      const top = footerRect.top + (footerRect.height - height) / 2;

      container.style.setProperty("position", "fixed", "important");
      container.style.setProperty("left", `${Math.round(left)}px`, "important");
      container.style.setProperty("top", `${Math.round(top)}px`, "important");
      container.style.setProperty("right", "auto", "important");
      container.style.setProperty("bottom", "auto", "important");
      container.style.setProperty("margin", "0", "important");
      container.dataset.g10AskPosition = "footer-center";
    }
  };
})();
