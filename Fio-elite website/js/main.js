/* =========================================================
   FIO ELITE ADVERTISING — SITE-WIDE JAVASCRIPT
   Loaded on every page. Each block guards for the elements
   it needs, so the same file works whether a page has a
   mobile menu, reveal-on-scroll items, a home-page counter,
   a portfolio filter, or the services showcase — nothing
   below runs on a page that doesn't have the matching markup.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     Mobile navigation — same toggle on every page
  --------------------------------------------------------- */
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".navlinks");
  const mobileQuery = window.matchMedia("(max-width:760px)");

  if (menu && nav) {
    const setMenuState = open => {
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      if (!menu.querySelector("span")) menu.textContent = open ? "×" : "☰";
    };

    menu.addEventListener("click", () => {
      setMenuState(!nav.classList.contains("open"));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMenuState(false));
    });

    nav.querySelectorAll(".nav-service-menu").forEach(details => {
      details.addEventListener("toggle", () => {
        if (!mobileQuery.matches) return;
        if (details.open) {
          nav.scrollTop = Math.max(0, details.offsetTop - 8);
        }
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenuState(false);
        menu.focus();
      }
    });

    const closeMenuOnDesktop = () => {
      if (!mobileQuery.matches) setMenuState(false);
    };
    mobileQuery.addEventListener?.("change", closeMenuOnDesktop);
  }

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    revealItems.forEach(item => item.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  /* ---------------------------------------------------------
     Counter animation (home page performance stats)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll(".stat-number[data-target]");

  const animateCounter = el => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => counterObserver.observe(counter));
    } else {
      counters.forEach(counter => {
        counter.textContent = counter.dataset.target + (counter.dataset.suffix || "");
      });
    }
  }

  /* ---------------------------------------------------------
     Pause marquees on hover (home page ticker + client logos)
  --------------------------------------------------------- */
  document.querySelectorAll(".logo-marquee,.marquee").forEach(marquee => {
    marquee.addEventListener("mouseenter", () => {
      const track = marquee.querySelector(".logo-track,.track");
      if (track) track.style.animationPlayState = "paused";
    });
    marquee.addEventListener("mouseleave", () => {
      const track = marquee.querySelector(".logo-track,.track");
      if (track) track.style.animationPlayState = "running";
    });
  });

  /* ---------------------------------------------------------
     FAQ accordion — closes sibling <details> in the same
     list when one is opened (about, contact, services)
  --------------------------------------------------------- */
  document.querySelectorAll("details").forEach(detail => {
    detail.addEventListener("toggle", () => {
      if (!detail.open || !detail.parentElement) return;
      Array.from(detail.parentElement.children).forEach(sibling => {
        if (sibling !== detail && sibling.tagName === "DETAILS") {
          sibling.removeAttribute("open");
        }
      });
    });
  });

  /* ---------------------------------------------------------
     Portfolio: category filters + project picker + hero tilt
  --------------------------------------------------------- */
  const filters = document.querySelectorAll(".pf-filter");
  const projects = document.querySelectorAll(".pf-project");

  if (filters.length && projects.length) {
    filters.forEach(btn => {
      btn.addEventListener("click", () => {
        filters.forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        projects.forEach(card => {
          const cats = (card.dataset.category || "").split(" ");
          const show = filter === "all" || cats.includes(filter);
          card.classList.toggle("is-hidden", !show);
          if (show && !reduceMotion) {
            card.animate(
              [{ opacity: .2, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" }
            );
          }
        });
      });
    });
  }

  const choices = document.querySelectorAll(".pf-choice");
  const choiceText = document.getElementById("choiceText");

  if (choices.length) {
    choices.forEach(choice => {
      choice.addEventListener("click", () => {
        choices.forEach(x => x.classList.remove("active"));
        choice.classList.add("active");
        if (choiceText) {
          choiceText.textContent = choice.dataset.choice.toUpperCase();
          if (!reduceMotion) {
            choiceText.animate(
              [{ opacity: .2, transform: "translateY(7px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 350 }
            );
          }
        }
      });
    });
  }

  const pfStage = document.querySelector(".pf-hero-stage");
  const pfHero = document.querySelector(".pf-hero");

  if (pfStage && pfHero && window.matchMedia("(pointer:fine)").matches) {
    pfHero.addEventListener("pointermove", e => {
      const r = pfHero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      pfStage.style.transform = `translate3d(${x * 10}px,${y * 7}px,0)`;
    });
    pfHero.addEventListener("pointerleave", () => pfStage.style.transform = "");
  }

  /* ---------------------------------------------------------
     Services: featured-services showcase (continuous
     scroll, drag to browse) + printing panel reveal +
     service-link redirect to contact + header scroll state
  --------------------------------------------------------- */
  const viewport = document.querySelector(".service-marquee");
  const track = document.querySelector("#serviceTrack");

  if (viewport && track && !reduceMotion) {
    const originalCards = Array.from(track.children);
    const getLoopWidth = () => {
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 0;
      return originalCards.reduce((total, card) => total + card.getBoundingClientRect().width + gap, 0);
    };

    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    let x = 0;
    let last = performance.now();
    let paused = false;
    let dragging = false;
    let pointerStart = 0;
    let xStart = 0;
    const speed = 0.11;
    let loopWidth = 0;

    function measure() {
      loopWidth = getLoopWidth();
      if (loopWidth > 0) x = ((x % loopWidth) + loopWidth) % loopWidth;
    }
    function render() { track.style.transform = `translate3d(${-x}px,0,0)`; }
    function animate(now) {
      const dt = Math.min(32, now - last);
      last = now;
      if (!paused && !dragging && loopWidth > 0) {
        x += speed * dt;
        if (x >= loopWidth) x -= loopWidth;
        render();
      }
      requestAnimationFrame(animate);
    }

    measure();
    render();
    requestAnimationFrame(animate);

    viewport.addEventListener("mouseenter", () => paused = true);
    viewport.addEventListener("mouseleave", () => paused = false);
    viewport.addEventListener("pointerdown", event => {
      dragging = true;
      pointerStart = event.clientX;
      xStart = x;
      viewport.classList.add("dragging");
      viewport.setPointerCapture?.(event.pointerId);
    });
    viewport.addEventListener("pointermove", event => {
      if (!dragging) return;
      const delta = event.clientX - pointerStart;
      x = xStart - delta;
      if (loopWidth > 0) {
        while (x < 0) x += loopWidth;
        while (x >= loopWidth) x -= loopWidth;
      }
      render();
    });
    function endDrag() { dragging = false; viewport.classList.remove("dragging"); }
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", measure);
  }

  if (!reduceMotion) {
    const visualObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.25 });
    document.querySelectorAll(".print-feature").forEach(el => visualObserver.observe(el));
  }

  document.querySelectorAll(".service-link, .print-feature").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const title = link.querySelector("h3")?.textContent?.trim() || "Service enquiry";
      const url = `contact.html?service=${encodeURIComponent(title)}`;
      document.body.classList.add("page-leaving");
      setTimeout(() => { window.location.href = url; }, 420);
    });
  });

  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }
});
