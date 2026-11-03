(function () {
  const RB = window.G10RoomBooking;

  RB.loginShell = {
    apply() {
      if (!RB.util.onPath(RB.CONFIG.loginPath)) return false;
      if (document.documentElement.classList.contains("g10-login-page")) {
        this.decorateForm();
        return true;
      }

      document.documentElement.classList.add("g10-login-page");
      this.hideSearchBar();
      this.injectSearchBooksLink();
      this.decorateForm();
      return true;
    },

    hideSearchBar() {
      const search = document.getElementById("searchform");
      if (search) {
        search.hidden = true;
        search.style.display = "none";
      }
    },

    injectSearchBooksLink() {
      const anchor = document.querySelector(".divloginContent, .main-content");
      if (!anchor || document.getElementById("g10-login-search-books")) return;

      const wrap = document.createElement("div");
      wrap.id = "g10-login-search-books";
      wrap.className = "g10-login-search-books";
      wrap.innerHTML = `<a class="g10-search-books-link" href="${RB.CONFIG.publicBookSearchPath}">Search books</a><span class="g10-login-search-note">No login required</span>`;
      anchor.insertBefore(wrap, anchor.firstChild);
    },

    decorateForm() {
      const user = document.getElementById("UserName");
      if (user) {
        user.placeholder = RB.CONFIG.loginUsernamePlaceholder || "ISB200XXI-XXXX";
      }
    }
  };
})();
