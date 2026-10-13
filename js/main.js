/* ============================================================
   DATALINK — shared JavaScript for all pages
   - Mobile navigation toggle
   - Phone mockup chat animation (sequential bubbles + typing)
   - Portfolio conversation tabs
   - FAQ accordion (about page)
   - Contact form validation (contact page)
   - Footer year
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    // Close the menu when a link is tapped
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- Phone mockup chat animation ----------
     Any element with class .chat-animate gets its child .msg
     bubbles revealed one by one. Before each agent (blue) bubble,
     the typing indicator (.typing) inside the same chat shows
     briefly. Replays each time it scrolls into view.           */
  function animateChat(chatEl) {
    var messages = Array.prototype.slice.call(
      chatEl.querySelectorAll(".msg:not(.typing)")
    );
    var typing = chatEl.querySelector(".typing");
    var delayBetween = 1500; // ms between messages
    var typingTime = 1100; // ms the typing dots show before agent reply
    var time = 400;

    // Reset
    messages.forEach(function (m) {
      m.classList.remove("show");
    });
    if (typing) typing.classList.remove("show");

    messages.forEach(function (msg) {
      var isAgent = msg.classList.contains("msg-agent");

      if (isAgent && typing) {
        // Show typing dots before the agent bubble
        scheduleTimeout(chatEl, function () {
          typing.classList.add("show");
          chatEl.scrollTop = chatEl.scrollHeight;
        }, time);
        time += typingTime;
        scheduleTimeout(chatEl, function () {
          typing.classList.remove("show");
          msg.classList.add("show");
          chatEl.scrollTop = chatEl.scrollHeight;
        }, time);
      } else {
        scheduleTimeout(chatEl, function () {
          msg.classList.add("show");
          chatEl.scrollTop = chatEl.scrollHeight;
        }, time);
      }
      time += delayBetween;
    });
  }

  // Track timeouts per chat so a replay cancels the previous run
  function scheduleTimeout(chatEl, fn, delay) {
    if (!chatEl._timers) chatEl._timers = [];
    chatEl._timers.push(window.setTimeout(fn, delay));
  }

  function clearChatTimers(chatEl) {
    (chatEl._timers || []).forEach(window.clearTimeout);
    chatEl._timers = [];
  }

  var animatedChats = document.querySelectorAll(".chat-animate");
  if (animatedChats.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              clearChatTimers(entry.target);
              animateChat(entry.target);
            } else {
              clearChatTimers(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      animatedChats.forEach(function (chat) {
        observer.observe(chat);
      });
    } else {
      // Fallback: just play immediately
      animatedChats.forEach(animateChat);
    }
  }

  /* ---------- Portfolio tabs ---------- */
  var tabButtons = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");

      tabButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      tabPanels.forEach(function (p) {
        p.classList.remove("active");
      });

      btn.classList.add("active");
      var panel = document.getElementById(target);
      if (panel) {
        panel.classList.add("active");
        // Replay animation if this panel contains an animated chat
        var chat = panel.querySelector(".chat-animate");
        if (chat) {
          clearChatTimers(chat);
          animateChat(chat);
        }
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!question || !answer) return;

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // Close all items
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        var a = other.querySelector(".faq-a");
        if (a) a.style.maxHeight = null;
      });

      // Open this one (unless it was already open)
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("pilot-form");

  if (form) {
    var statusBox = document.getElementById("form-status");

    function setInvalid(fieldEl, invalid) {
      var group = fieldEl.closest(".form-group");
      if (group) group.classList.toggle("invalid", invalid);
    }

    function validateField(fieldEl) {
      var value = (fieldEl.value || "").trim();
      var valid = true;

      if (fieldEl.hasAttribute("required") && value === "") {
        valid = false;
      }

      // Soft check for Ghana-style WhatsApp numbers: +233XXXXXXXXX or 0XXXXXXXXX
      if (valid && fieldEl.id === "whatsapp" && value !== "") {
        var cleaned = value.replace(/[\s\-()]/g, "");
        var ghPattern = /^(\+233\d{9}|0\d{9})$/;
        if (!ghPattern.test(cleaned)) valid = false;
      }

      setInvalid(fieldEl, !valid);
      return valid;
    }

    // Live validation as the user corrects fields
    form
      .querySelectorAll("input[required], select[required], textarea[required]")
      .forEach(function (fieldEl) {
        fieldEl.addEventListener("blur", function () {
          validateField(fieldEl);
        });
        fieldEl.addEventListener("input", function () {
          if (fieldEl.closest(".form-group.invalid")) validateField(fieldEl);
        });
      });

    form.addEventListener("submit", function (e) {
      var allValid = true;
      var firstInvalid = null;

      form
        .querySelectorAll(
          "input[required], select[required], textarea[required]"
        )
        .forEach(function (fieldEl) {
          var ok = validateField(fieldEl);
          if (!ok && !firstInvalid) firstInvalid = fieldEl;
          allValid = allValid && ok;
        });

      if (!allValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        if (statusBox) {
          statusBox.className = "form-status error";
          statusBox.textContent =
            "Please complete the highlighted fields before sending.";
        }
        return;
      }

      // If the form has no real backend configured yet
      // (action still contains the FORMSPREE placeholder),
      // stop the submit and show guidance instead of a 404.
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORMSPREE_ID") !== -1) {
        e.preventDefault();
        if (statusBox) {
          statusBox.className = "form-status success";
          statusBox.textContent =
            "✅ Form validated! (Demo mode: connect a Formspree ID in " +
            "contact.html to receive submissions, or use the WhatsApp " +
            "button to message directly.)";
        }
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
