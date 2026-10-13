/**
 * Montiix Preorder Shop – frontend
 */

(function () {
  "use strict";

  // ── Nav scroll state ─────────────────────────────────────
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  // ── Mobile menu ──────────────────────────────────────────
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // ── Live remaining count ─────────────────────────────────
  async function loadStats() {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      const el = document.getElementById("remainingCount");
      if (el) el.textContent = data.remaining;
    } catch {
      // silent
    }
  }
  loadStats();

  // ── Select model buttons ─────────────────────────────────
  document.querySelectorAll(".select-model").forEach((btn) => {
    btn.addEventListener("click", () => {
      const model = btn.dataset.model;
      const select = document.getElementById("model");
      if (select) {
        select.value = model;
      }
      document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ── Preorder form ────────────────────────────────────────
  const form = document.getElementById("preorderForm");
  const resultEl = document.getElementById("formResult");
  const submitBtn = document.getElementById("submitBtn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      resultEl.hidden = true;
      resultEl.className = "form-result";

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim() || undefined,
        model: form.model.value,
        size: form.size.value,
        quantity: form.quantity.value,
        notes: form.notes.value.trim() || undefined,
      };

      if (!payload.name || !payload.email || !payload.model) {
        showResult("error", "Please fill in name, email and model.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Securing…";

      try {
        const res = await fetch("/api/preorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          showResult("error", data.error || "Something went wrong.");
        } else {
          showResult(
            "success",
            `Preorder confirmed. You are #${data.position} in Batch 01. We’ll email ${payload.email} with next steps.`
          );
          form.reset();
          loadStats();
        }
      } catch {
        showResult("error", "Network error. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Confirm Preorder";
      }
    });
  }

  function showResult(type, message) {
    resultEl.hidden = false;
    resultEl.className = `form-result ${type}`;
    resultEl.textContent = message;
  }

  // ── Set initial watch hands based on real time ───────────
  function setWatchHands() {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();

    const hourEl = document.querySelector(".hand.hour");
    const minEl = document.querySelector(".hand.minute");
    const secEl = document.querySelector(".hand.second");

    if (hourEl) {
      hourEl.style.animation = "none";
      hourEl.style.transform = `rotate(${h * 30 + m * 0.5}deg)`;
    }
    if (minEl) {
      minEl.style.animation = "none";
      minEl.style.transform = `rotate(${m * 6 + s * 0.1}deg)`;
    }
    if (secEl) {
      secEl.style.animation = "none";
      secEl.style.transform = `rotate(${s * 6}deg)`;
    }

    // Restart smooth animation after setting position
    requestAnimationFrame(() => {
      if (hourEl) hourEl.style.animation = "";
      if (minEl) minEl.style.animation = "";
      if (secEl) secEl.style.animation = "";
    });
  }
  setWatchHands();
})();
