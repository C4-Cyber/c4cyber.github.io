/* C4 Cyber - main.js : nav state, mobile menu, scroll reveals, year */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = nav ? nav.querySelector(".nav__toggle") : null;
  var mobile = document.getElementById("mobileMenu");

  /* Sticky nav background on scroll */
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  if (nav) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu toggle */
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal via IntersectionObserver */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el, i) {
      /* subtle stagger for grouped siblings */
      el.style.transitionDelay = Math.min((i % 6) * 60, 300) + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Current year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Contact form: anti-bot + AJAX submit ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var status = document.getElementById("cf-status");
    var submitBtn = document.getElementById("cf-submit");
    var main = document.getElementById("cf-main");
    var thanks = document.getElementById("cf-thanks");
    var refEl = document.getElementById("cf-ref");
    var loadedAt = Date.now();

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = "cform__status" + (kind ? " is-" + kind : "");
    }

    /* Reference like C4-20260701-8FA3 : date for readability + short random suffix */
    function makeReference() {
      var d = new Date();
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var ymd = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
      return "C4-" + ymd + "-" + rand;
    }

    /* Replace the form with a persistent thank-you panel (stays up so the
       visitor can note their reference number). No auto-return. */
    function showThanks(reference) {
      if (refEl) refEl.textContent = reference || "";
      form.reset();
      setStatus("", "");
      if (main && thanks) {
        main.hidden = true;
        thanks.hidden = false;
        thanks.classList.add("in");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* 1. Honeypot - only a bot would tick this hidden checkbox. Silently stop. */
      var botCheckbox = form.querySelector('input[name="botcheck"]');
      if (botCheckbox && botCheckbox.checked) {
        setStatus("Thanks - your message has been sent.", "ok");
        form.reset();
        return;
      }

      /* 2. Timing check - a genuine human takes more than a few seconds to fill this in */
      if (Date.now() - loadedAt < 3000) {
        setStatus("Please take a moment to complete the form, then try again.", "error");
        return;
      }

      /* 3. Native validation (required fields, email format) */
      if (!form.checkValidity()) {
        setStatus("Please complete the required fields.", "error");
        form.reportValidity();
        return;
      }

      /* 4. Generate a contact reference number and include it in the submission */
      var reference = makeReference();

      var data = new FormData(form);
      data.delete("botcheck");
      data.append("reference", reference);
      data.set("subject", "New enquiry from c4cyber.com.au [" + reference + "]");

      submitBtn.disabled = true;
      setStatus("Sending...", "");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json.success) {
            if (typeof gtag === "function") {
              gtag("event", "generate_lead", { form: "contact", reference: reference });
            }
            showThanks(reference);
          } else {
            setStatus("Something went wrong. Please email contact@c4cyber.com.au.", "error");
          }
        })
        .catch(function () {
          setStatus("Network error. Please email contact@c4cyber.com.au.", "error");
        })
        .finally(function () { submitBtn.disabled = false; });
    });
  }
})();
