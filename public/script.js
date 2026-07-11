// Mobile navigation
(function initMobileNav() {
  const header = document.querySelector(".header");
  const navCenter = document.querySelector(".nav-center");
  if (!header || !navCenter) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-label", "Toggle navigation menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML =
    '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>';

  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  overlay.setAttribute("aria-hidden", "true");

  header.insertBefore(toggle, navCenter);
  document.body.appendChild(overlay);

  function closeNav() {
    header.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
    overlay.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    header.classList.add("nav-open");
    document.body.classList.add("nav-open");
    overlay.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", () => {
    if (header.classList.contains("nav-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  overlay.addEventListener("click", closeNav);

  navCenter.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
})();

// Product tabs
const tabs = document.querySelectorAll(".tab-btn");
const tabItems = document.querySelectorAll(".tab-item");

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabs.forEach((btn) => btn.classList.remove("active"));
    tabItems.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
    const target = this.getAttribute("data-target");
    const panel = document.querySelector(target);
    if (panel) {
      panel.classList.add("active");
    }
  });
});


// ─── Auth UI in Navbar ─────────────────────────────────────────
(function updateAuthUI() {
  const user        = JSON.parse(localStorage.getItem("user"));
  const profileIcon = document.querySelector(".profile-icon");

  if (!profileIcon) return;

  if (user) {
    // Show name + logout instead of login icon
    profileIcon.innerHTML = `
      <span style="font-size:13px; font-weight:600;">Hi, ${user.name.split(" ")[0]}</span>
      <a href="#" id="logout-btn" style="margin-left:8px; font-size:12px; color:red;">Logout</a>
    `;
    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
})();