/* =====================================================================
   MISHTTEN CLUB & RESORT — "NOIR ROYALE · GOLDEN" interactions
   ===================================================================== */
(function () {
  "use strict";

  var WHATSAPP = "917230066807";

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add("is-on"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4200);
  }

  /* ---------- aurora orbs ---------- */
  var orbWrap = document.createElement("div");
  orbWrap.className = "orbs";
  orbWrap.setAttribute("aria-hidden", "true");
  orbWrap.innerHTML = '<i class="orb orb--1"></i><i class="orb orb--2"></i><i class="orb orb--3"></i>';
  document.body.appendChild(orbWrap);

  /* ---------- loader ---------- */
  var loader = $(".loader");
  if (loader) {
    var pctEl = $(".loader__pct", loader);
    var barEl = $(".loader__bar i", loader);
    var p = 0, done = false;
    var tick = setInterval(function () {
      p = Math.min(p + Math.random() * 14 + 6, 100);
      if (pctEl) pctEl.textContent = Math.round(p) + "%";
      if (barEl) barEl.style.transform = "scaleX(" + (p / 100) + ")";
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(finish, 260);
      }
    }, 110);
    function finish() {
      if (done) return;
      done = true;
      loader.classList.add("is-done");
    }
    if (document.readyState === "complete") setTimeout(finish, 900);
    else window.addEventListener("load", function () { setTimeout(finish, 600); });
    setTimeout(finish, 4800);
  }

  /* ---------- theme toggle ---------- */
  var themeBtn = $(".theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var root = document.documentElement;
      var isLight = root.getAttribute("data-theme") === "light";
      if (isLight) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "light");
      try { localStorage.setItem("mishtten-theme", isLight ? "dark" : "light"); } catch (e) {}
      toast(isLight ? "Golden Noir \u2014 dark mode" : "Champagne \u2014 light mode");
    });
  }

  /* ---------- header / progress / dock ---------- */
  var head = $(".head");
  var progress = $(".scroll-progress");
  var heroMedia = $(".hero__media");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (head) head.classList.toggle("is-scrolled", y > 50);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    $$(".dock__b--top").forEach(function (b) { b.classList.toggle("is-in", y > 620); });
    if (heroMedia && !reduced) {
      heroMedia.style.transform = "translate3d(0," + (y * 0.16) + "px,0)";
    }
  }
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = false;
  window.addEventListener("scroll", function () {
    if (raf) return;
    raf = true;
    requestAnimationFrame(function () { onScroll(); raf = false; });
  }, { passive: true });
  onScroll();

  /* ---------- drawer ---------- */
  var drawer = $(".drawer");
  var burger = $(".burger");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
    if (burger) burger.classList.toggle("is-x", open);
  }
  $$("[data-drawer-open]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(true); }); });
  $$("[data-drawer-close]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setDrawer(false); closeLb(); }
  });

  /* ---------- reveal on scroll ---------- */
  var rvEls = $$("[data-rv]");
  var groups = {};
  rvEls.forEach(function (el) {
    var key = (el.parentElement ? (el.parentElement.className || "p") : "root") + (el.getAttribute("data-group") || "");
    groups[key] = (groups[key] || 0) + 1;
    if (!el.style.getPropertyValue("--d")) {
      var d = Math.min((groups[key] - 1) * 85, 420);
      if (d > 0) el.style.setProperty("--d", d + "ms");
    }
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
        if (en.target.hasAttribute("data-to")) runCounter(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- counters ---------- */
  function runCounter(el) {
    var to = parseFloat(el.getAttribute("data-to")) || 0;
    var dur = parseInt(el.getAttribute("data-dur") || "1800", 10);
    var dec = (String(el.getAttribute("data-to")).split(".")[1] || "").length;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var pr = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - pr, 3);
      var val = to * eased;
      el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString("en-IN");
      if (pr < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  $$("[data-to]").forEach(function (el) {
    if (!("IntersectionObserver" in window)) runCounter(el);
  });

  /* ---------- quotes slider ---------- */
  var qTrack = $(".quotes__track");
  if (qTrack) {
    var qSlides = $$(".quote", qTrack);
    var qDots = $(".quotes__dots");
    var qi = 0, qt = null;
    qSlides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Review " + (i + 1));
      if (!i) b.classList.add("is-on");
      b.addEventListener("click", function () { qGo(i); });
      if (qDots) qDots.appendChild(b);
    });
    var dots = qDots ? $$("button", qDots) : [];
    function qGo(i) {
      qi = (i + qSlides.length) % qSlides.length;
      qTrack.style.transform = "translateX(-" + qi * 100 + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("is-on", k === qi); });
      qAuto();
    }
    function qAuto() {
      clearInterval(qt);
      qt = setInterval(function () { qGo(qi + 1); }, 6800);
    }
    var qPrev = $("[data-q-prev]"), qNext = $("[data-q-next]");
    if (qPrev) qPrev.addEventListener("click", function () { qGo(qi - 1); });
    if (qNext) qNext.addEventListener("click", function () { qGo(qi + 1); });
    qTrack.parentElement.addEventListener("mouseenter", function () { clearInterval(qt); });
    qTrack.parentElement.addEventListener("mouseleave", qAuto);
    var qsx = 0;
    qTrack.addEventListener("touchstart", function (e) { qsx = e.touches[0].clientX; }, { passive: true });
    qTrack.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - qsx;
      if (Math.abs(dx) > 44) qGo(qi + (dx < 0 ? 1 : -1));
    }, { passive: true });
    qAuto();
  }

  /* ---------- room rail ---------- */
  $$(".rail").forEach(function (rail) {
    var track = $(".rail__track", rail);
    var bar = $(".rail__bar i", rail);
    if (!track) return;
    var down = false, startX = 0, startL = 0, moved = false;
    track.addEventListener("pointerdown", function (e) {
      down = true; moved = false;
      startX = e.clientX; startL = track.scrollLeft;
      track.classList.add("is-drag");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = startL - dx * 1.15;
    });
    window.addEventListener("pointerup", function () {
      down = false;
      track.classList.remove("is-drag");
    });
    track.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    function syncBar() {
      if (!bar) return;
      var max = track.scrollWidth - track.clientWidth;
      var ratio = track.clientWidth / track.scrollWidth;
      var pos = max > 0 ? track.scrollLeft / max : 0;
      bar.style.width = Math.max(ratio * 100, 12) + "%";
      bar.style.transform = "translateX(" + (pos * (100 - Math.max(ratio * 100, 12)) / Math.max(ratio * 100, 12)) * 100 + "%)";
    }
    track.addEventListener("scroll", syncBar, { passive: true });
    syncBar();
    var step = function () {
      var card = $(".rcard", track);
      return card ? card.getBoundingClientRect().width + 18 : 340;
    };
    var prev = $(".rail__prev", rail), next = $(".rail__next", rail);
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  });

  /* ---------- gallery filter ---------- */
  var gfil = $(".gfil");
  if (gfil) {
    var gItems = $$(".g-item");
    $$("button", gfil).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("button", gfil).forEach(function (b) { b.classList.remove("is-on"); });
        btn.classList.add("is-on");
        var f = btn.getAttribute("data-f");
        gItems.forEach(function (it) {
          var show = f === "all" || (it.getAttribute("data-c") || "").split(" ").indexOf(f) > -1;
          it.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------- lightbox ---------- */
  var lb = $(".lb"), lbImg, lbCap, lbCount, lbList = [], lbIdx = 0;
  function collectLb() {
    lbList = $$(".g-item:not(.is-hidden)").map(function (it) {
      var img = $("img", it);
      return { src: img ? img.currentSrc || img.src : "", cap: it.getAttribute("data-cap") || (img ? img.alt : "") };
    });
  }
  function openLb(i) {
    if (!lb || !lbList.length) return;
    lbIdx = (i + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIdx].src;
    lbImg.alt = lbList[lbIdx].cap || "";
    if (lbCap) lbCap.textContent = lbList[lbIdx].cap || "";
    if (lbCount) lbCount.textContent = (lbIdx + 1) + " / " + lbList.length;
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }
  if (lb) {
    lbImg = $(".lb__img", lb);
    lbCap = $(".lb__cap", lb);
    lbCount = $(".lb__count", lb);
    var lbX = $(".lb__x", lb), lbP = $(".lb__arrow--p", lb), lbN = $(".lb__arrow--n", lb);
    if (lbX) lbX.addEventListener("click", function (e) { e.stopPropagation(); closeLb(); });
    if (lbP) lbP.addEventListener("click", function (e) { e.stopPropagation(); openLb(lbIdx - 1); });
    if (lbN) lbN.addEventListener("click", function (e) { e.stopPropagation(); openLb(lbIdx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("click", function (e) {
      var item = e.target.closest ? e.target.closest(".g-item") : null;
      if (!item) return;
      collectLb();
      openLb($$(".g-item:not(.is-hidden)").indexOf(item));
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "ArrowRight") openLb(lbIdx + 1);
      if (e.key === "ArrowLeft") openLb(lbIdx - 1);
    });
  }

  /* ---------- booking form → WhatsApp ---------- */
  var booking = $("#book-form");
  if (booking) {
    booking.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(booking);
      var msg = "Hello Mishtten! I would like to enquire about a stay.%0A%0A" +
        "Name: " + (fd.get("name") || "-") + "%0A" +
        "Phone: " + (fd.get("phone") || "-") + "%0A" +
        "Check-in: " + (fd.get("checkin") || "-") + "%0A" +
        "Check-out: " + (fd.get("checkout") || "-") + "%0A" +
        "Accommodation: " + (fd.get("room") || "-") + "%0A" +
        "Guests: " + (fd.get("guests") || "-") + "%0A" +
        "Occasion / Notes: " + (fd.get("message") || "-");
      toast("Opening WhatsApp with your enquiry\u2026");
      window.open("https://wa.me/" + WHATSAPP + "?text=" + msg, "_blank", "noopener");
    });
  }

  /* ---------- newsletter ---------- */
  $$(".news").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("input", f);
      if (input && input.value.trim()) {
        toast("Thank you \u2014 you are on the Mishtten list.");
        input.value = "";
      } else {
        toast("Please enter your email address.");
      }
    });
  });

  /* ---------- back to top ---------- */
  $$("[data-top]").forEach(function (b) {
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  });

  /* ---------- menu nav sync ---------- */
  var mnav = $(".mnav");
  if (mnav) {
    var mLinks = $$("a", mnav);
    var mSecs = mLinks.map(function (l) { return $(l.getAttribute("href")); }).filter(Boolean);
    function syncM() {
      var y = window.scrollY + window.innerHeight * 0.34;
      var act = 0;
      mSecs.forEach(function (s, i) { if (s.offsetTop <= y) act = i; });
      mLinks.forEach(function (l, i) { l.classList.toggle("is-on", i === act); });
      var on = mLinks[act];
      if (on && mnav.scrollWidth > 0) {
        var box = mnav.querySelector(".mnav__in");
        if (box) box.scrollTo({ left: Math.max(on.offsetLeft - box.clientWidth / 2 + on.clientWidth / 2, 0), behavior: "smooth" });
      }
    }
    window.addEventListener("scroll", syncM, { passive: true });
    syncM();
  }

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();


/* =====================================================================
   GOLD EDITION v2 — cursor · tilt · curtain · dust · letter reveals
   ===================================================================== */
(function () {
  "use strict";
  var fine = window.matchMedia ? window.matchMedia("(pointer:fine)").matches : false;
  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---- body.is-live gate (starts after the loader finishes) ---- */
  function live() { document.body.classList.add("is-live"); }
  var loader = $(".loader");
  if (loader) {
    var mo = new MutationObserver(function () {
      if (loader.classList.contains("is-done")) { live(); mo.disconnect(); }
    });
    mo.observe(loader, { attributes: true, attributeFilter: ["class"] });
    if (loader.classList.contains("is-done")) live();
  }
  window.addEventListener("load", function () { setTimeout(live, 2400); });
  setTimeout(live, 5200);

  /* ---- letter-by-letter title reveal ---- */
  function splitTitle(el) {
    if (!el || el.getAttribute("data-split")) return;
    el.setAttribute("data-split", "1");
    var idx = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var txt = node.textContent;
        if (!txt.trim()) return;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < txt.length; i++) {
          var s = document.createElement("span");
          s.className = "ltr";
          s.style.setProperty("--i", idx++);
          s.textContent = txt.charAt(i);
          frag.appendChild(s);
        }
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        if (node.classList.contains("grad")) {
          node.classList.add("ltr-blk");
          node.style.setProperty("--i", idx);
          idx += 3;
        } else {
          var t2 = node.textContent;
          node.textContent = "";
          for (var j = 0; j < t2.length; j++) {
            var s2 = document.createElement("span");
            s2.className = "ltr";
            s2.style.setProperty("--i", idx++);
            s2.textContent = t2.charAt(j);
            node.appendChild(s2);
          }
        }
      }
    });
  }
  $$(".hero__title, .ph__title").forEach(splitTitle);

  /* ---- exit curtain (cinematic page transition) ---- */
  if (!reduce) {
    var curtain = document.createElement("div");
    curtain.className = "curtain";
    curtain.innerHTML = '<div class="curtain__panel"></div><div class="curtain__mark"><span class="curtain__m"><b>M</b></span></div>';
    document.body.appendChild(curtain);
    var leaving = false;
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || leaving) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return;
      if (/^(mailto|tel|https?:|javascript|whatsapp)/i.test(href)) return;
      if (href.indexOf(".html") === -1) return;
      e.preventDefault();
      leaving = true;
      curtain.classList.add("is-on");
      var done = false;
      function go() { if (done) return; done = true; window.location.href = href; }
      setTimeout(go, 640);
      setTimeout(go, 1500);
    }, true);
  }

  /* ---- floating gold dust in the hero ---- */
  var hero = $(".hero");
  if (hero && !reduce) {
    var dust = document.createElement("div");
    dust.className = "hero__dust";
    dust.setAttribute("aria-hidden", "true");
    var html = "";
    for (var i = 0; i < 26; i++) {
      var l = (Math.random() * 100).toFixed(2),
          b = (Math.random() * 70).toFixed(2),
          s = (1.5 + Math.random() * 2.6).toFixed(2),
          d = (7 + Math.random() * 9).toFixed(2),
          dl = (Math.random() * 9).toFixed(2);
      html += '<i style="left:' + l + '%;bottom:' + b + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + d + 's;animation-delay:-' + dl + 's"></i>';
    }
    dust.innerHTML = html;
    hero.appendChild(dust);
  }

  /* ---- 3D tilt cards ---- */
  if (fine && !reduce) {
    $$(".bt, .vcard, .dcard").forEach(function (card) {
      card.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse") card.classList.add("is-tilting");
      });
      card.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var b = card.getBoundingClientRect();
        var px = (e.clientX - b.left) / b.width - 0.5;
        var py = (e.clientY - b.top) / b.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }
})();


/* =====================================================================
   GOLD EDITION v3 — buttery scroll · parallax · stagger · magnetic
   ===================================================================== */
(function () {
  "use strict";
  var fine = window.matchMedia ? window.matchMedia("(pointer:fine)").matches : false;
  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---- native, lerp-smoothed wheel scrolling (sticky-safe) ---- */
  var smTarget = window.pageYOffset, smCurrent = smTarget, smRaf = null;
  function smScrollNow() {
    try { window.scrollTo({ top: smCurrent, behavior: "instant" }); }
    catch (e) {
      if (document.documentElement.getAttribute("data-scrm-auto") !== "1") {
        document.documentElement.setAttribute("data-scrm-auto", "1");
        document.documentElement.style.scrollBehavior = "auto";
      }
      window.scrollTo(0, smCurrent);
    }
  }
  function smStep() {
    smCurrent += (smTarget - smCurrent) * 0.135;
    if (Math.abs(smTarget - smCurrent) < 0.4) { smCurrent = smTarget; smRaf = null; }
    else { smRaf = requestAnimationFrame(smStep); }
    smScrollNow();
  }
  function smStart() { if (!smRaf) smRaf = requestAnimationFrame(smStep); }
  if (fine && !reduce) {
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.defaultPrevented) return;
      if (document.body.classList.contains("no-scroll")) return;
      var dx = Math.abs(e.deltaX), dy = Math.abs(e.deltaY);
      if (!e.deltaY || dx > dy) return;
      e.preventDefault();
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 18; else if (e.deltaMode === 2) d *= innerHeight;
      var max = document.documentElement.scrollHeight - innerHeight;
      smTarget = Math.max(0, Math.min(smTarget + d, max));
      smStart();
    }, { passive: false });
    /* keep in sync when page is scrolled by other means (keys, anchors, buttons) */
    window.addEventListener("scroll", function () {
      if (!smRaf) { smCurrent = smTarget = window.pageYOffset; }
    }, { passive: true });
  }

  /* ---- parallax layers (containers only — no conflicts with img animations) ---- */
  var plxList = [];
  [[".hero__media", 0.18], [".hero__ghost", 0.10], [".ph__media", 0.16],
   [".band__bg", 0.22], [".cta__bg", 0.22], [".collage__a", 0.12], [".collage__b", 0.18]]
  .forEach(function (cfg) {
    $$(cfg[0]).forEach(function (el) {
      el.setAttribute("data-plx", cfg[1]);
      plxList.push({ el: el, sp: cfg[1], cover: el.matches(".hero__media,.ph__media,.band__bg,.cta__bg") });
    });
  });
  var heroIn = $(".hero__in"), heroVeil = $(".hero__veil");
  var lastY = -1;
  function frame() {
    var y = window.pageYOffset;
    if (y !== lastY) {
      lastY = y;
      var vh = innerHeight;
      for (var i = 0; i < plxList.length; i++) {
        var it = plxList[i], r = it.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var off = (r.top + r.height / 2 - vh / 2) * -it.sp;
        it.el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)" + (it.cover ? " scale(1.09)" : "");
      }
      if (heroIn) {
        var p = Math.max(0, Math.min(y / (vh * 0.85), 1));
        heroIn.style.transform = "translate3d(0," + (p * 46).toFixed(1) + "px,0)";
        heroIn.style.opacity = (1 - p * .85).toFixed(2);
        if (heroVeil) heroVeil.style.opacity = (1 + p * .38).toFixed(2);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- staggered group reveals ---- */
  var grids = [".dgrid", ".vgrid", ".vgrid2", ".fgrid", ".bento"];
  var gridList = [];
  grids.forEach(function (sel) { $$(sel).forEach(function (g) { gridList.push(g); }); });
  gridList.forEach(function (g) {
    var kids = $$("[data-rv]", g);
    if (!kids.length) return;
    kids.forEach(function (k, i) { k.style.setProperty("--rvd", (i % 9) * 68 + "ms"); });
    /* clear delays after the group has revealed so hover stays instant */
    var cleared = false;
    function unstage() {
      if (cleared) return;
      cleared = true;
      kids.forEach(function (k) { k.style.removeProperty("--rvd"); });
    }
    if ("IntersectionObserver" in window) {
      var go = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (x.isIntersecting) { setTimeout(unstage, 1900); go.disconnect(); }
        });
      }, { threshold: 0.06 });
      go.observe(g);
    } else { setTimeout(unstage, 3000); }
  });

  /* ---- media curtain-lift in ---- */
  var mediaSels = ".rcard__media, .dcard__media, .g-item, .bt";
  var mediaEls = $$(mediaSels).filter(function (m) { return m.querySelector("img"); });
  mediaEls.forEach(function (m, i) {
    var veil = document.createElement("i");
    veil.className = "mr-veil";
    veil.style.setProperty("--mrd", (m.classList.contains("g-item") ? (i % 6) * 55 : Math.floor(i / 3) * 60) + "ms");
    m.appendChild(veil);
    if (!("IntersectionObserver" in window)) { veil.classList.add("is-out"); setTimeout(function () { veil.remove(); }, 2200); return; }
    var mo = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        veil.classList.add("is-out");
        setTimeout(function () { veil.remove(); }, 2400);
        mo.disconnect();
      });
    }, { threshold: 0.22 });
    mo.observe(m);
  });

  /* ---- section heading line-draw hook ---- */
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); so.unobserve(x.target); } });
    }, { threshold: 0.3 });
    $$(".s-head").forEach(function (s) { so.observe(s); });
  } else { $$(".s-head").forEach(function (s) { s.classList.add("is-in"); }); }

  /* ---- magnetic buttons ---- */
  if (fine && !reduce) {
    $$(".btn--gold, .btn--ghost, .dock__b--wa, .dock__b--call").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        var mx = Math.max(-1, Math.min(1, dx)) * 7;
        var my = Math.max(-1, Math.min(1, dy)) * 6;
        b.style.transition = "transform .14s cubic-bezier(.18,.74,.22,1)";
        b.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () {
        b.style.transition = "transform .5s cubic-bezier(.18,.74,.22,1)";
        b.style.transform = "";
      });
    });
  }

  /* ---- kicker decode (scramble-in) ---- */
  if (fine && !reduce && "IntersectionObserver" in window) {
    var POOL = "MISHTEN◆✦AURG7249";
    function scramble(el) {
      var orig = el.getAttribute("data-txt") || el.textContent;
      el.setAttribute("data-txt", orig);
      var step = 0, total = 13;
      var iv = setInterval(function () {
        step++;
        var done = Math.floor(orig.length * (step / total));
        var out = orig.slice(0, done);
        for (var i = done; i < orig.length; i++) {
          var ch = orig.charAt(i);
          out += ch === " " ? " " : POOL.charAt(Math.floor(Math.random() * POOL.length));
        }
        el.textContent = out;
        if (step >= total) { clearInterval(iv); el.textContent = orig; }
      }, 42);
    }
    var ko = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { scramble(x.target); ko.unobserve(x.target); } });
    }, { threshold: 0.5 });
    $$(".kicker").forEach(function (k) { ko.observe(k); });
  }
})();
