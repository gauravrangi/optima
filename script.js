// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Signup form handler (client-side demo)
const form = document.getElementById("signup");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const first = form.first_name.value.trim();
  const email = form.email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!first || !valid) {
    status.style.color = "#a0392f";
    status.textContent = "Please enter your first name and a valid email.";
    return;
  }

  status.style.color = "";
  status.textContent = `Thanks, ${first}! Check your inbox — the guide is on its way.`;
  form.reset();
});
