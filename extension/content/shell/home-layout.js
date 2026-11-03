(function () {
  const RB = window.G10RoomBooking;

  RB.homeShell = {
    apply() {
      if (!RB.util.onPath(RB.CONFIG.homePath)) return;
      const body = document.getElementById("body");
      const grid = document.querySelector(".waterfall-grid");
      if (!body) return;
      if (body.dataset.g10HomeDone) {
        if (document.querySelector(".g10-main-row")) return;
        delete body.dataset.g10HomeDone;
      }
      if (!grid) {
        this.scheduleRetry();
        return;
      }

      body.classList.add("g10-home-shell");

      const panels = [...grid.querySelectorAll(".panel.panel-default")];
      const quotePanel = panels.find((p) =>
        /quote of the day/i.test(p.innerText || "")
      );
      const didYouKnowPanel = panels.find((p) =>
        /did you know/i.test(p.innerText || "")
      );
      const librariesPanel = panels.find((p) =>
        /fast-nu libraries/i.test(p.innerText || "")
      );
      const visitorsPanel = panels.find((p) =>
        /visitors counter/i.test(p.innerText || "")
      );
      const insigniaAppPanel = panels.find((p) =>
        /insignia app/i.test(p.innerText || "")
      );
      const scanPanel = panels.find((p) =>
        /scan and connect/i.test(p.innerText || "")
      );

      librariesPanel?.remove();
      visitorsPanel?.remove();

      const booksColumn = grid.querySelector(".grid-item--width28");
      const searchForm = document.getElementById("searchform");
      const mainContent = document.querySelector(".main-content");

      const shell = document.createElement("div");
      shell.className = "g10-home-layout";

      const insights = document.createElement("div");
      insights.className = "g10-insights-row";
      if (quotePanel) insights.appendChild(wrapCard(quotePanel, "g10-insight-card"));
      if (didYouKnowPanel) insights.appendChild(wrapCard(didYouKnowPanel, "g10-insight-card"));

      const mainRow = document.createElement("div");
      mainRow.className = "g10-main-row";

      const actionsPane = document.createElement("div");
      actionsPane.className = "g10-actions-pane";
      const actionsScroll = document.createElement("div");
      actionsScroll.className = "g10-pane-scroll";
      actionsScroll.appendChild(this.buildActionsPane());
      actionsPane.appendChild(actionsScroll);

      const booksPane = document.createElement("div");
      booksPane.className = "g10-books-pane";
      booksPane.id = "g10-books-pane";

      const booksScroll = document.createElement("div");
      booksScroll.className = "g10-pane-scroll";

      if (searchForm) {
        const searchWrap = document.createElement("div");
        searchWrap.id = "g10-books-search";
        searchWrap.className = "g10-search-block";
        resetMasonry(searchForm);
        searchForm.parentElement?.removeChild(searchForm);
        searchWrap.appendChild(searchForm);
        booksPane.appendChild(searchWrap);
      }

      const bookStack = extractBookPanels(booksColumn);
      booksScroll.appendChild(bookStack);

      const appsStrip = document.createElement("div");
      appsStrip.className = "g10-apps-strip";
      appsStrip.innerHTML = `<p class="g10-apps-title">Mobile apps &amp; OPAC</p>`;
      const appsGrid = document.createElement("div");
      appsGrid.className = "g10-apps-grid";
      if (insigniaAppPanel) appsGrid.appendChild(compactPanel(insigniaAppPanel));
      if (scanPanel) appsGrid.appendChild(compactPanel(scanPanel));
      appsStrip.appendChild(appsGrid);
      booksScroll.appendChild(appsStrip);
      booksPane.appendChild(booksScroll);

      mainRow.appendChild(actionsPane);
      mainRow.appendChild(booksPane);

      shell.appendChild(insights);
      shell.appendChild(mainRow);

      const root = document.createElement("div");
      root.className = "g10-home-root";
      root.appendChild(shell);

      grid.remove();
      purgeStrayGridItems(body);

      if (mainContent) {
        mainContent.prepend(root);
      } else {
        body.prepend(root);
      }

      body.dataset.g10HomeDone = "1";
      styleBookPanels(bookStack);
      RB.homeShell.syncPaneHeights?.();
    },

    syncPaneHeights() {
      const row = document.querySelector(".g10-main-row");
      if (!row) return;
      const top = row.getBoundingClientRect().top;
      const footer = document.querySelector("#footer, .footer, footer");
      const bottom = footer
        ? footer.getBoundingClientRect().top
        : window.innerHeight;
      const h = Math.max(240, Math.floor(bottom - top - 8));
      row.style.height = `${h}px`;
      row.style.maxHeight = `${h}px`;
    },

    scheduleRetry() {
      if (this._retries >= 40) return;
      this._retries = (this._retries || 0) + 1;
      requestAnimationFrame(() => this.apply());
    },

    buildActionsPane() {
      const root = document.createElement("div");
      root.className = "g10-actions-inner";

      const h = document.createElement("h2");
      h.className = "g10-pane-title";
      h.textContent = "Library services";
      root.appendChild(h);

      const prominent = document.createElement("div");
      prominent.className = "g10-prominent-grid";
      RB.navModel.PROMINENT.forEach((item) => {
        const a = document.createElement("a");
        a.className = "g10-prominent-card";
        a.href =
          item.href.startsWith("#") ? item.href : RB.navModel.resolveHref(item.href);
        a.innerHTML = `<span class="g10-prominent-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span>`;
        if (item.href.startsWith("#")) {
          a.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
          });
        }
        prominent.appendChild(a);
      });
      root.appendChild(prominent);

      const list = document.createElement("div");
      list.className = "g10-action-list";

      const pending = RB._pendingActionMenuItems || [];
      pending.forEach((li) => {
        flattenMenuLi(li, list);
      });

      if (!list.children.length) {
        this.fallbackActionLinks(list);
      }

      root.appendChild(list);
      return root;
    },

    fallbackActionLinks(container) {
      document.querySelectorAll("#navMenu ul ul a").forEach((a) => {
        if (!RB.navModel.isActionLink(a)) return;
        if (/library website/i.test(a.textContent || "")) return;
        appendActionTile(container, linkRow(a));
      });
    }
  };

  function resetMasonry(el) {
    if (!el || !el.style) return;
    el.style.position = "static";
    el.style.left = "";
    el.style.top = "";
    el.style.right = "";
    el.style.bottom = "";
    el.style.width = "";
    el.style.height = "";
    el.style.transform = "";
    el.style.margin = "";
  }

  function extractBookPanels(booksColumn) {
    const stack = document.createElement("div");
    stack.className = "g10-books-stack";

    if (!booksColumn) return stack;

    resetMasonry(booksColumn);
    booksColumn
      .querySelectorAll(":scope > .panel.panel-default, :scope > .panel")
      .forEach((panel) => {
        resetMasonry(panel);
        panel.classList.add("g10-book-panel");
        stack.appendChild(panel);
      });

    booksColumn.remove();
    return stack;
  }

  function purgeStrayGridItems(body) {
    body.querySelectorAll(".waterfall-grid").forEach((g) => g.remove());
    body.querySelectorAll(".grid-item").forEach((item) => {
      if (!item.closest(".g10-home-root")) item.remove();
    });
  }

  function wrapCard(panel, className) {
    resetMasonry(panel);
    const wrap = document.createElement("div");
    wrap.className = className;
    panel.classList.add("g10-panel-inset");
    wrap.appendChild(panel);
    return wrap;
  }

  function compactPanel(panel) {
    resetMasonry(panel);
    panel.classList.add("g10-app-panel");
    const heading = panel.querySelector(".panel-heading");
    if (heading) heading.classList.add("g10-app-panel-heading");
    return panel;
  }

  function flattenMenuLi(li, container) {
    const link = li.querySelector(":scope > a");
    const nested = li.querySelector(":scope > ul");
    if (link && !nested && RB.navModel.isActionLink(link)) {
      appendActionTile(container, linkRow(link));
      return;
    }
    if (link && nested) {
      const group = document.createElement("div");
      group.className = "g10-action-group";
      const title = document.createElement("h3");
      title.textContent = RB.navModel.labelFromAnchor(link);
      group.appendChild(title);
      const tiles = document.createElement("div");
      tiles.className = "g10-action-tiles";
      nested.querySelectorAll(":scope > li > a").forEach((a) => {
        if (RB.navModel.isActionLink(a)) tiles.appendChild(linkRow(a));
      });
      if (tiles.children.length) {
        group.appendChild(tiles);
        container.appendChild(group);
      }
    }
  }

  function appendActionTile(container, tileEl) {
    let grid = container.querySelector(":scope > .g10-action-tiles--flat");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "g10-action-tiles g10-action-tiles--flat";
      container.appendChild(grid);
    }
    grid.appendChild(tileEl);
  }

  function linkRow(anchor) {
    const a = document.createElement("a");
    a.className = "g10-action-tile";
    a.textContent = RB.navModel.labelFromAnchor(anchor);
    const href = anchor.getAttribute("href");
    a.href = RB.navModel.resolveHref(href);
    return a;
  }

  function styleBookPanels(stack) {
    if (!stack) return;
    stack.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.add("g10-carousel-panel");
    });
    stack.querySelectorAll(".panel-heading").forEach((heading) => {
      const pageInfo = heading.querySelector(".pageInfo");
      const btnL = heading.querySelector(".btnLeft");
      const btnR = heading.querySelector(".btnRight");
      if (!pageInfo && !btnL && !btnR) return;
      let rail = heading.querySelector(".g10-carousel-rail");
      if (!rail) {
        rail = document.createElement("div");
        rail.className = "g10-carousel-rail";
        heading.appendChild(rail);
      }
      [pageInfo, btnL, btnR].filter(Boolean).forEach((el) => rail.appendChild(el));
    });
    stack.querySelectorAll(".btnLeft").forEach((btn) => {
      btn.classList.add("g10-carousel-btn", "g10-carousel-btn--prev");
      btn.setAttribute("aria-label", "Previous titles");
    });
    stack.querySelectorAll(".btnRight").forEach((btn) => {
      btn.classList.add("g10-carousel-btn", "g10-carousel-btn--next");
      btn.setAttribute("aria-label", "Next titles");
    });
  }
})();
