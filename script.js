// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Shared email validation
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Hero / guide form
const heroForm = document.getElementById("guide-form");
if (heroForm) {
  const status = heroForm.parentElement.querySelector(".form-status");
  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const first = heroForm.first_name.value.trim();
    const email = heroForm.email.value.trim();
    if (!first || !isValidEmail(email)) {
      status.style.color = "#fc8181";
      status.textContent = "Please enter your first name and a valid email.";
      return;
    }
    status.style.color = "";
    status.textContent = `Thanks, ${first} — check your inbox, the guide is on its way.`;
    heroForm.reset();
  });
}

// CTA banner form
const ctaForm = document.getElementById("cta-form");
if (ctaForm) {
  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = ctaForm.email.value.trim();
    if (!isValidEmail(email)) return;
    ctaForm.innerHTML = '<p style="color:#fff;font-weight:600;">Thanks — the guide is headed to your inbox.</p>';
  });
}

// Footer newsletter
const footerForm = document.getElementById("footer-form");
if (footerForm) {
  footerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = footerForm.email.value.trim();
    if (!isValidEmail(email)) return;
    footerForm.innerHTML = '<p style="color:rgba(255,255,255,.8);font-size:13.5px;">Subscribed. Thanks for joining.</p>';
  });
}

// Product-category tab filter (visual only)
const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});
