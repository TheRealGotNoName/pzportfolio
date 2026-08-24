// Scroll reveal: fade/slide elements marked ".reveal" up as they enter
// view on normal-scrolling pages (project grids on school-projects.html
// and ecen5730.html). The homepage doesn't use this — see the slide
// crossfade system below instead.
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// Homepage: crossfade between full-screen "slides" instead of real page
// scrolling — see .slide in style.css. Only one slide is visible at
// rest; wheel/touch/keyboard input fades the current slide out while
// fading the next one in at the same time, both sliding vertically.
const slides = Array.from(document.querySelectorAll(".slide"));
if (slides.length) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 800; // ms
  const projectsHeader = document.getElementById("projects-sticky-header");
  let current = Math.max(0, slides.findIndex((el) => el.classList.contains("is-active")));
  let busy = false;

  function setHeaderVisible(index) {
    if (projectsHeader) {
      projectsHeader.classList.toggle("is-visible", slides[index].dataset.group === "projects");
    }
  }

  function goTo(nextIndex) {
    if (busy || nextIndex === current || nextIndex < 0 || nextIndex >= slides.length) return;
    busy = true;
    setHeaderVisible(nextIndex);

    const outgoing = slides[current];
    const incoming = slides[nextIndex];

    if (reduceMotion) {
      outgoing.classList.remove("is-active");
      incoming.classList.add("is-active");
      current = nextIndex;
      busy = false;
      return;
    }

    const dir = nextIndex > current ? 1 : -1;

    // place the incoming slide off-screen (below if moving forward,
    // above if moving back) with no transition, then let it and the
    // outgoing slide animate to their end states on the next frame —
    // that's what makes the two fades/slides run simultaneously
    incoming.style.transition = "none";
    incoming.style.visibility = "visible";
    incoming.style.pointerEvents = "auto";
    incoming.style.opacity = "0";
    incoming.style.transform = `translateY(${dir * 40}px)`;
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";
    incoming.getBoundingClientRect(); // flush the styles above before animating

    requestAnimationFrame(() => {
      incoming.style.transition = "";
      incoming.style.opacity = "1";
      incoming.style.transform = "translateY(0)";
      outgoing.style.opacity = "0";
      outgoing.style.transform = `translateY(${-dir * 40}px)`;
    });

    window.setTimeout(() => {
      outgoing.classList.remove("is-active");
      incoming.classList.add("is-active");
      outgoing.style.cssText = "";
      incoming.style.cssText = "";
      current = nextIndex;
      busy = false;
    }, DURATION);
  }

  setHeaderVisible(current);

  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (busy) return;
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  let touchStartY = null;
  window.addEventListener(
    "touchstart",
    (e) => { touchStartY = e.touches[0].clientY; },
    { passive: true }
  );
  window.addEventListener(
    "touchend",
    (e) => {
      if (touchStartY === null) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(dy) > 40) goTo(current + (dy > 0 ? 1 : -1));
    },
    { passive: true }
  );

  const scrollCue = document.querySelector(".scroll-cue");
  if (scrollCue) {
    scrollCue.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current + 1);
    });
  }
}

// Contact page: click the mail icon to reveal the email modal.
// Click anywhere outside the modal (the overlay) to close it.

const mailTrigger = document.getElementById("mail-trigger");
const overlay = document.getElementById("email-overlay");
const modal = document.getElementById("email-modal");

if (mailTrigger && overlay && modal) {
  function openModal() {
    overlay.hidden = false;
    // next frame, so the transition actually runs
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    mailTrigger.setAttribute("aria-expanded", "true");
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    mailTrigger.setAttribute("aria-expanded", "false");
    overlay.addEventListener(
      "transitionend",
      () => { overlay.hidden = true; },
      { once: true }
    );
  }

  mailTrigger.addEventListener("click", openModal);

  // Close when clicking the overlay itself, not the modal inside it.
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });
}