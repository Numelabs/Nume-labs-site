// Minimal accordion: one open at a time.
// Selected Work is open by default (via aria-expanded="true" in HTML).

(function () {
  const triggers = document.querySelectorAll(".acc__trigger");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set current year in footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  function closePanel(trigger) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", "false");
    if (!panel) return;

    if (reduceMotion) {
      panel.hidden = true;
      panel.style.height = "";
      return;
    }

    const startHeight = panel.scrollHeight;
    panel.style.height = startHeight + "px";
    panel.offsetHeight; // force reflow
    panel.style.transition = "height 220ms ease";
    panel.style.height = "0px";

    panel.addEventListener("transitionend", function onEnd() {
      panel.hidden = true;
      panel.style.height = "";
      panel.style.transition = "";
      panel.removeEventListener("transitionend", onEnd);
    });
  }

  function openPanel(trigger) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", "true");
    if (!panel) return;

    panel.hidden = false;

    if (reduceMotion) {
      panel.style.height = "";
      return;
    }

    panel.style.height = "0px";
    panel.offsetHeight; // reflow
    const targetHeight = panel.scrollHeight;

    panel.style.transition = "height 240ms ease";
    panel.style.height = targetHeight + "px";

    panel.addEventListener("transitionend", function onEnd() {
      panel.style.height = "";
      panel.style.transition = "";
      panel.removeEventListener("transitionend", onEnd);
    });
  }

  function closeOthers(current) {
    triggers.forEach(t => {
      if (t !== current && t.getAttribute("aria-expanded") === "true") closePanel(t);
    });
  }

  triggers.forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    const expanded = trigger.getAttribute("aria-expanded") === "true";

    // Ensure initial hidden state matches aria
    if (panel) panel.hidden = !expanded;

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closePanel(trigger);
      } else {
        closeOthers(trigger);
        openPanel(trigger);
      }
    });
  });
})();
