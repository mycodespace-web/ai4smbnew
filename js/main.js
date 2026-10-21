// Shared layout (header, footer, cookie banner, voice agent) and interactive components.
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var path = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  var page = path.split("/").pop() || "";

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function storage(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Header ---------- */
  function navLink(href, label, key) {
    var current = key === page || (key === "" && (page === "" || page === "home"));
    return '<a href="' + href + '"' + (current ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }

  function logoHtml() {
    if (cfg.logoSrc) return '<img src="' + cfg.logoSrc + '" alt="' + cfg.brand + '">';
    // Placeholder wordmark; set logoSrc in js/config.js to use the real logo file.
    return '<svg viewBox="0 0 250 50" role="img" aria-label="' + cfg.domain + '">' +
      '<text x="4" y="24" font-family="Verdana, sans-serif" font-size="21" font-weight="700" letter-spacing="-.5" fill="#000">ai<tspan fill="#c79e30">4</tspan>smb<tspan fill="#c79e30">.</tspan>agency</text>' +
      '<path d="M8 40c40 6 120 4 210-22" fill="none" stroke="#c79e30" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M212 10l14 4-9 11" fill="none" stroke="#c79e30" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<ellipse cx="11" cy="40" rx="6" ry="3.5" fill="#c79e30"/></svg>';
  }

  function renderHeader() {
    var slot = document.getElementById("site-header");
    if (!slot) return;
    var links = navLink("index.html", "Home", "") + navLink("contact.html", "Contact", "contact") + navLink("podcast.html", "Podcast", "podcast");
    var globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c3 3.2 3 15.8 0 19M12 2.5c-3 3.2-3 15.8 0 19"/></svg>';
    slot.outerHTML =
      '<a class="skip-link" href="#page">Skip to Content</a>' +
      '<header class="site-header" id="header">' +
      '  <div class="header-inner">' +
      '    <a class="logo" href="index.html" aria-label="' + cfg.brand + ' home">' + logoHtml() + "</a>" +
      '    <nav class="main-nav" aria-label="Main">' + links + "</nav>" +
      '    <div class="header-actions">' +
      '      <a class="login" href="' + (cfg.loginUrl || "#") + '">Login</a>' +
      '      <button class="lang" type="button" aria-label="Language: English">' + globe + 'English<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg></button>' +
      '      <a class="btn btn--sm" href="book-discovery-call.html">Get Started</a>' +
      "    </div>" +
      '    <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>' +
      "  </div>" +
      "</header>" +
      '<nav class="mobile-menu" id="mobile-menu" aria-label="Mobile">' + links +
      '  <a href="' + (cfg.loginUrl || "#") + '">Login</a>' +
      '  <span class="lang">' + globe + 'English</span>' +
      '  <a class="btn" href="book-discovery-call.html">Get Started</a>' +
      "</nav>";

    var header = document.getElementById("header");
    var burger = header.querySelector(".burger");
    var menu = document.getElementById("mobile-menu");
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    var slot = document.getElementById("site-footer");
    if (!slot) return;
    slot.outerHTML =
      '<footer class="site-footer">' +
      '  <div class="container footer-inner">' +
      '    <span class="footer-brand">' + cfg.domain + "</span>" +
      '    <nav class="footer-links" aria-label="Footer">' +
      '      <a href="tms.html">Terms</a><a href="ppl.html">Privacy*</a><a href="cpd.html">About</a>' +
      "    </nav>" +
      "  </div>" +
      "</footer>";
  }

  /* ---------- Cookie banner (opt-in) ---------- */
  function cookieBanner() {
    var choice = storage("cookie-consent");
    var pill;
    function showPill() {
      if (pill) return;
      pill = el('<button class="cookie-pill" type="button">Cookie Preferences</button>');
      pill.addEventListener("click", function () { pill.remove(); pill = null; showBanner(); });
      document.body.appendChild(pill);
    }
    function showBanner() {
      var b = el(
        '<div class="cookie-banner" role="dialog" aria-label="Cookie consent">' +
        "<p>&#127850; Cookies, anyone?</p>" +
        "<p>We use a few cookies to keep this site working well and to learn what visitors find useful:</p>" +
        "<ul><li>&#128736;&#65039; Essential site features</li><li>&#128200; Anonymous usage statistics</li><li>&#10024; Ongoing improvements</li></ul>" +
        "<p>Choose \u201cYum, I Accept!\u201d to allow them all, or manage your options. Details are in our <a href=\"ppl.html\">privacy policy</a>.</p>" +
        '<div class="cookie-actions">' +
        '<button class="btn btn--xs" data-c="accepted" type="button">&#127850; Yum, I Accept!</button>' +
        '<button class="btn btn--xs btn--outline" data-manage type="button">Manage cookies</button>' +
        "</div></div>"
      );
      b.addEventListener("click", function (e) {
        if (e.target.hasAttribute("data-manage")) {
          e.target.outerHTML = '<button class="btn btn--xs btn--outline" data-c="declined" type="button">Decline all</button>';
          return;
        }
        var c = e.target.getAttribute("data-c");
        if (!c) return;
        storage("cookie-consent", c);
        b.remove();
        showPill();
      });
      document.body.appendChild(b);
    }
    if (choice) showPill(); else showBanner();
  }

  /* ---------- ElevenLabs voice agent ---------- */
  var voiceLoaded = false;
  function loadVoiceAgent(container) {
    if (!cfg.elevenlabsAgentId || voiceLoaded) return;
    voiceLoaded = true;
    var widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", cfg.elevenlabsAgentId);
    (container || document.body).appendChild(widget);
    var s = document.createElement("script");
    s.src = "https://elevenlabs.io/convai-widget/index.js";
    s.async = true;
    document.body.appendChild(s);
  }
  window.loadVoiceAgent = loadVoiceAgent;

  /* ---------- Hero slideshow ---------- */
  function slideshow() {
    var hero = document.querySelector("[data-slideshow]");
    if (!hero) return;
    var slides = hero.querySelectorAll(".slide");
    var i = 0, timer;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle("is-active", k === i);
        s.setAttribute("aria-hidden", String(k !== i));
      });
    }
    function restart() {
      clearInterval(timer);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = setInterval(function () { go(i + 1); }, 6000);
      }
    }
    hero.querySelector("[data-prev]").addEventListener("click", function () { go(i - 1); restart(); });
    hero.querySelector("[data-next]").addEventListener("click", function () { go(i + 1); restart(); });
    hero.addEventListener("mouseenter", function () { clearInterval(timer); });
    hero.addEventListener("mouseleave", restart);
    var startX = null;
    hero.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });
    go(0);
    restart();
  }

  /* ---------- Accordion ---------- */
  function accordion() {
    document.querySelectorAll(".acc-trigger").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        if (open) {
          panel.style.height = panel.scrollHeight + "px";
          requestAnimationFrame(function () { panel.style.height = "0px"; });
        } else {
          panel.style.height = panel.scrollHeight + "px";
          panel.addEventListener("transitionend", function done() {
            if (btn.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
            panel.removeEventListener("transitionend", done);
          });
        }
      });
    });
  }

  /* ---------- Modal ---------- */
  function modals() {
    var lastFocus;
    function open(m) {
      lastFocus = document.activeElement;
      m.classList.add("is-open");
      document.body.style.overflow = "hidden";
      var f = m.querySelector("input, textarea, button.modal-close");
      if (f) setTimeout(function () { f.focus(); }, 50);
    }
    function close(m) {
      m.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll("[data-open-modal]").forEach(function (b) {
      b.addEventListener("click", function () { open(document.getElementById(b.getAttribute("data-open-modal"))); });
    });
    document.querySelectorAll(".modal").forEach(function (m) {
      m.addEventListener("click", function (e) {
        if (e.target.matches(".modal-backdrop, .modal-close, [data-close-modal]")) close(m);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var m = document.querySelector(".modal.is-open");
      if (m) close(m);
    });
  }

  /* ---------- Forms ---------- */
  function validateField(field) {
    var required = field.hasAttribute("data-required");
    if (!required) return true;
    var inputs = field.querySelectorAll("input, textarea");
    var ok;
    var first = inputs[0];
    if (first && (first.type === "radio" || first.type === "checkbox")) {
      ok = Array.prototype.some.call(inputs, function (x) { return x.checked; });
    } else {
      ok = Array.prototype.every.call(inputs, function (x) {
        if (!x.value.trim()) return false;
        if (x.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.value.trim());
        return true;
      });
    }
    field.classList.toggle("has-error", !ok);
    return ok;
  }

  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "_gotcha") return;
      if (data[k] !== undefined) data[k] = [].concat(data[k], v);
      else data[k] = v;
    });
    data._page = location.href;
    data._submittedAt = new Date().toISOString();
    return data;
  }

  function forms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      var key = form.getAttribute("data-form");
      var success = document.querySelector('[data-success="' + key + '"]');
      var bar = form.querySelector(".progress span");
      var fields = form.querySelectorAll(".field[data-required]");

      function progress() {
        if (!bar) return;
        var done = Array.prototype.filter.call(fields, function (f) {
          var inputs = f.querySelectorAll("input, textarea");
          return Array.prototype.some.call(inputs, function (x) {
            return (x.type === "radio" || x.type === "checkbox") ? x.checked : x.value.trim();
          });
        }).length;
        bar.style.width = Math.round((done / fields.length) * 100) + "%";
      }

      function onEdit(e) {
        var f = e.target.closest(".field");
        if (f && f.classList.contains("has-error")) validateField(f);
        progress();
      }
      form.addEventListener("input", onEdit);
      form.addEventListener("change", onEdit);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.querySelector('input[name="_gotcha"]').value) return; // bot
        var bad = Array.prototype.filter.call(fields, function (f) { return !validateField(f); });
        if (bad.length) {
          bad[0].scrollIntoView({ behavior: "smooth", block: "center" });
          var x = bad[0].querySelector("input, textarea");
          if (x) x.focus({ preventScroll: true });
          return;
        }
        var btn = form.querySelector('[type="submit"]');
        var label = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Sending…";
        var data = serialize(form);
        var endpoint = (cfg.forms || {})[key];
        var req = endpoint
          ? fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(data)
            }).then(function (r) { if (!r.ok) throw new Error(r.status); })
          : new Promise(function (res) {
              var saved = JSON.parse(storage("submissions-" + key) || "[]");
              saved.push(data);
              storage("submissions-" + key, JSON.stringify(saved));
              console.info("[" + key + "] No form endpoint configured in js/config.js; submission kept locally:", data);
              setTimeout(res, 500);
            });
        req.then(function () {
          form.hidden = true;
          if (success) {
            success.classList.add("is-visible");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }).catch(function () {
          btn.disabled = false;
          btn.textContent = label;
          alert("Sorry, something went wrong while sending. Please try again or email us directly.");
        });
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (x) { x.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (x) { io.observe(x); });
  }

  /* ---------- Embeds ---------- */
  function embeds() {
    var cal = document.querySelector("[data-calendly]");
    if (cal && cfg.calendlyUrl) {
      cal.setAttribute("data-url", cfg.calendlyUrl);
      var s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
    var sp = document.querySelector("[data-spotify]");
    if (sp && cfg.spotifyPlaylistId) {
      sp.innerHTML = '<iframe title="The AI4SMB Podcast on Spotify" src="https://open.spotify.com/embed/playlist/' +
        cfg.spotifyPlaylistId + '?utm_source=generator" height="560" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    slideshow();
    accordion();
    modals();
    forms();
    reveal();
    embeds();
    cookieBanner();
    // Voice test pages load the agent only after consent; everywhere else it loads straight away.
    if (!document.body.hasAttribute("data-voice-consent")) loadVoiceAgent();
  });
})();
