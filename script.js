document.getElementById("year").textContent = new Date().getFullYear();

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function wireForm(form) {
  if (!form) return;
  const status = form.parentElement.querySelector(".form-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!isValidEmail(email)) {
      if (status) {
        status.style.color = "#e53e3e";
        status.textContent = "Please enter a valid email address.";
      }
      return;
    }
    if (status) {
      status.style.color = "";
      status.textContent = "Thanks — the handbook is on its way to your inbox.";
    } else {
      form.innerHTML = '<p style="padding:10px 4px;color:var(--accent-dark);font-size:.9rem;font-weight:600;">Thanks — the handbook is on its way to your inbox.</p>';
    }
    form.reset && form.reset();
  });
}

wireForm(document.getElementById("hero-form"));
wireForm(document.getElementById("cta-form"));
