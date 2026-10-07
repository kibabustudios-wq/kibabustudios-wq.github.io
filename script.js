(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");
  const progress = document.querySelector(".page-progress span");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    menu.classList.toggle("is-open", opening);
    document.body.classList.toggle("menu-open", opening);
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  let scrollScheduled = false;
  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (maxScroll > 0 ? Math.min(100, window.scrollY / maxScroll * 100) : 0) + "%";
    const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= window.innerHeight * .35);
    navLinks.forEach((link) => {
      const active = current && link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("is-active", Boolean(active));
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scrollScheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (!scrollScheduled) {
      requestAnimationFrame(updateScrollUI);
      scrollScheduled = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });
  updateScrollUI();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px 40px 0px" });
    revealItems.forEach((element) => observer.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add("in-view"));
  }

  const steps = {
    think: {
      kicker: "01 / THINK",
      title: "Reason through the possibility.",
      description: "We use Claude for codebase reasoning, production planning, and validating game-system ideas before committing to a direction."
    },
    build: {
      kicker: "02 / BUILD",
      title: "Turn intent into playable code.",
      description: "AI assists with programming, prototyping, debugging, and MCP-connected development tools—accelerating implementation without replacing creative judgment."
    },
    test: {
      kicker: "03 / TEST",
      title: "Find the cracks early.",
      description: "QA, regression testing, and game-system checks help us examine what works, what breaks, and what still needs a human eye."
    },
    refine: {
      kicker: "04 / REFINE",
      title: "Make the details matter.",
      description: "We iterate on feel, clarity, and performance. Human direction chooses what stays; AI helps us explore and verify the path."
    }
  };
  const stepButtons = [...document.querySelectorAll(".console-step")];
  const consoleVisual = document.querySelector(".console-visual");
  stepButtons.forEach((button) => button.addEventListener("click", () => {
    const step = steps[button.dataset.step];
    if (!step) return;
    stepButtons.forEach((other) => {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    if (!reducedMotion.matches) {
      consoleVisual.classList.add("is-changing");
      window.setTimeout(() => consoleVisual.classList.remove("is-changing"), 250);
    }
    document.getElementById("console-kicker").textContent = step.kicker;
    document.getElementById("console-title").textContent = step.title;
    document.getElementById("console-description").textContent = step.description;
  }));

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
