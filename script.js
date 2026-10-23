// Portfolio interactions. Update the email address below before publishing.
const CONTACT_EMAIL = "jorilynpaculdo@gmail.com";

const dock = document.getElementById("leftDock");
const hideDockBtn = document.getElementById("hideDockBtn");
const showDockBtn = document.getElementById("showDockBtn");

hideDockBtn.addEventListener("click", () => {
  dock.classList.add("hidden");
  showDockBtn.classList.add("visible");
  showDockBtn.focus();
});

showDockBtn.addEventListener("click", () => {
  dock.classList.remove("hidden");
  showDockBtn.classList.remove("visible");
  hideDockBtn.focus();
});

// Filter project cards.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// Highlight the navigation item for the section currently in view.
const navLinks = document.querySelectorAll(".icon-link");
const observedSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-35% 0px -50% 0px", threshold: 0 });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

// Contact form: opens the visitor's default mail app; no backend required.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const emailLink = document.getElementById("emailLink");

emailLink.href = `mailto:${CONTACT_EMAIL}`;
emailLink.textContent = CONTACT_EMAIL;

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (CONTACT_EMAIL === "your.email@example.com") {
    formStatus.textContent = "Please update CONTACT_EMAIL in script.js with your real email address first.";
    return;
  }

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const senderEmail = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const body = `Name: ${name}\nReply email: ${senderEmail}\n\n${message}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "Opening your email application. If nothing opens, email me directly using the address shown.";
  window.location.href = mailto;
});

document.getElementById("year").textContent = new Date().getFullYear();


// ===== Draggable floating navigation dock =====
// Desktop: drag the empty dock background up or down.
// Buttons and links remain clickable. Pointer events support mouse and touch.
let dockDragging = false;
let dockPointerStartY = 0;
let dockTopStart = 0;
let dockHasCustomPosition = false;

dock.addEventListener("pointerdown", (event) => {
  if (event.target.closest("a, button")) return;
  if (window.matchMedia("(max-width: 760px)").matches) return;

  const rect = dock.getBoundingClientRect();
  dockDragging = true;
  dockPointerStartY = event.clientY;
  dockTopStart = rect.top;
  dockHasCustomPosition = true;

  // Switch from centered positioning to explicit top positioning while dragging.
  dock.style.top = `${rect.top}px`;
  dock.style.transform = "none";
  dock.classList.add("dragging");
  dock.setPointerCapture(event.pointerId);
  event.preventDefault();
});

dock.addEventListener("pointermove", (event) => {
  if (!dockDragging) return;

  const deltaY = event.clientY - dockPointerStartY;
  const maxTop = Math.max(0, window.innerHeight - dock.offsetHeight);
  const nextTop = Math.min(maxTop, Math.max(0, dockTopStart + deltaY));

  dock.style.top = `${nextTop}px`;
});

function endDockDrag() {
  if (!dockDragging) return;
  dockDragging = false;
  dock.classList.remove("dragging");
}

dock.addEventListener("pointerup", endDockDrag);
dock.addEventListener("pointercancel", endDockDrag);
window.addEventListener("blur", endDockDrag);

// If the dock is hidden after being moved, align the show button to its position.
hideDockBtn.addEventListener("click", () => {
  if (dockHasCustomPosition) {
    showDockBtn.style.top = dock.style.top;
    showDockBtn.style.transform = "none";
  }
});

showDockBtn.addEventListener("click", () => {
  if (dockHasCustomPosition) {
    dock.style.top = showDockBtn.style.top;
    dock.style.transform = "none";
  }
});
