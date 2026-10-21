// Shared layout (header, footer, voice agent button) and interactive components.
// No cookies or browser storage are used; third-party services load only after a click.
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

  // Floating button: the ElevenLabs widget is only loaded after the visitor agrees.
  function voiceButton() {
    if (!cfg.elevenlabsAgentId) return;
    var wrap = el(
      '<div class="voice-fab">' +
      '<div class="voice-pop" id="voice-pop" hidden>' +
      "<p>The voice agent is provided by ElevenLabs. Starting it connects to their service and processes your call data under their terms and our <a href=\"ppl.html\">privacy policy</a>.</p>" +
      '<button class="btn btn--xs" type="button" data-voice-start>Start voice agent</button>' +
      "</div>" +
      '<button class="btn voice-toggle" type="button" aria-expanded="false" aria-controls="voice-pop">&#128222; Speak to AI-Agent now</button>' +
      "</div>"
    );
    var toggle = wrap.querySelector(".voice-toggle");
    var pop = wrap.querySelector(".voice-pop");
    toggle.addEventListener("click", function () {
      var open = pop.hidden;
      pop.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    wrap.querySelector("[data-voice-start]").addEventListener("click", function () {
      wrap.remove();
      loadVoiceAgent();
    });
    document.body.appendChild(wrap);
  }

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
        data._form = key;
        var req = cfg.demoForms
          ? new Promise(function (res) { setTimeout(res, 500); }) // preview only: nothing is sent
          : fetch(cfg.formEndpoint || "/api/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(data)
            }).then(function (r) { if (!r.ok) throw new Error(r.status); });
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

  /* ---------- Embeds (click to load, so nothing third-party runs before the visitor asks) ---------- */
  function facade(target, service, label, linkUrl, load) {
    target.innerHTML =
      '<div class="facade">' +
      '<p>' + label + '</p>' +
      '<button class="btn" type="button">Load ' + service + '</button>' +
      '<p class="facade-note">Loading connects to ' + service + ' and their privacy policy applies. ' +
      '<a href="' + linkUrl + '" target="_blank" rel="noopener">Open on ' + service + ' instead</a>.</p>' +
      "</div>";
    target.querySelector("button").addEventListener("click", function () { target.innerHTML = ""; load(); });
  }

  function embeds() {
    var cal = document.querySelector("[data-calendly]");
    if (cal && cfg.calendlyUrl) {
      cal.classList.remove("calendly-inline-widget");
      facade(cal, "Calendly", "Pick a time that suits you in our booking calendar.", cfg.calendlyUrl, function () {
        cal.classList.add("calendly-inline-widget");
        cal.setAttribute("data-url", cfg.calendlyUrl);
        var s = document.createElement("script");
        s.src = "https://assets.calendly.com/assets/external/widget.js";
        s.async = true;
        document.body.appendChild(s);
      });
    }
    var sp = document.querySelector("[data-spotify]");
    if (sp && cfg.spotifyPlaylistId) {
      var url = "https://open.spotify.com/playlist/" + cfg.spotifyPlaylistId;
      facade(sp, "Spotify", "Listen to every episode in the Spotify player.", url, function () {
        sp.innerHTML = '<iframe title="Podcast on Spotify" src="https://open.spotify.com/embed/playlist/' +
          cfg.spotifyPlaylistId + '?utm_source=generator" height="560" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>';
      });
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
    // The voice test page has its own consent checkbox; elsewhere a floating button asks first.
    if (!document.body.hasAttribute("data-voice-consent")) voiceButton();
  });
})();
