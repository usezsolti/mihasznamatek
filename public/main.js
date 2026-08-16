// frontend/public/main.js
(function () {
  // --- Mobilmenü toggle (delegáltan, hogy ne kelljen külön keresni) ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-toggle");
    if (!btn) return;
    const links = document.querySelector(".nav-links");
    if (links) {
      links.classList.toggle("closed");
      btn.classList.toggle("closed");
    }
  });

  // --- Background-image lazy+slide-in ---
  const sections = document.querySelectorAll(".has-bg");
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target;
          const bgDiv = section.querySelector(".bg-image");
          if (bgDiv && !bgDiv.style.backgroundImage) {
            const src = section.getAttribute("data-bg");
            bgDiv.style.backgroundImage = `url('${src}')`;
            bgDiv.classList.add("is-visible");
          }
          obs.unobserve(section);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -20% 0px" }
    );
    sections.forEach((sec) => io.observe(sec));
  }

  // Google Maps JS API nincs betöltve a főoldalon (nincs érvényes kulcs / placeholder map).
  window.initMap = function () {
    /* no-op: contact szekció linkeket használ */
  };
})();
