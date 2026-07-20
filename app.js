/* ============================================================
   CCW - Save Little Lives
   Shared JavaScript
   ============================================================ */

(function () {
  "use strict";

  // Password visibility toggle
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".toggle-pw");
    if (!btn) return;
    var input = btn.parentElement.querySelector("input");
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      btn.setAttribute("aria-label", "Hide password");
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>';
    } else {
      input.type = "password";
      btn.setAttribute("aria-label", "Show password");
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
  });

  // Sidebar toggle for mobile
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".menu-toggle");
    if (toggle) {
      var sb = document.querySelector(".sidebar");
      if (sb) sb.classList.toggle("open");
      return;
    }
    // Close sidebar when clicking outside on mobile
    if (e.target.closest(".sidebar") || e.target.closest(".menu-toggle")) return;
    var sb = document.querySelector(".sidebar");
    if (sb && window.innerWidth <= 860) sb.classList.remove("open");
  });

  // Multi-step form navigation
  document.addEventListener("click", function (e) {
    var next = e.target.closest("[data-step-next]");
    if (next) {
      var current = next.closest(".step-panel");
      if (current) {
        current.style.display = "none";
        var target = document.querySelector(next.getAttribute("data-step-next"));
        if (target) target.style.display = "block";
        updateStepper(next.getAttribute("data-step-index"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    var back = e.target.closest("[data-step-back]");
    if (back) {
      var cur = back.closest(".step-panel");
      if (cur) {
        cur.style.display = "none";
        var tgt = document.querySelector(back.getAttribute("data-step-back"));
        if (tgt) tgt.style.display = "block";
        updateStepper(back.getAttribute("data-step-index"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
  });

  function updateStepper(index) {
    var steps = document.querySelectorAll(".stepper .step");
    steps.forEach(function (s, i) {
      s.classList.remove("active", "done");
      var idx = parseInt(index, 10);
      if (i < idx) s.classList.add("done");
      else if (i === idx) s.classList.add("active");
    });
    var lines = document.querySelectorAll(".stepper .step-line");
    lines.forEach(function (l, i) {
      l.classList.toggle("done", i < parseInt(index, 10));
    });
  }

  // Form submit demo
  document.addEventListener("submit", function (e) {
    var form = e.target.closest("form[data-demo]");
    if (!form) return;
    e.preventDefault();
    var msg = form.getAttribute("data-demo-message") || "Form submitted successfully.";
    var alertBox = form.querySelector(".form-feedback");
    if (alertBox) {
      alertBox.innerHTML =
        '<div class="alert alert-success">' + msg + "</div>";
      alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
