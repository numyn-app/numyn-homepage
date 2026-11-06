const root = document.documentElement;
const themeKey = "numyn-theme";

try {
  if (localStorage.getItem(themeKey) === "light") root.dataset.theme = "light";
} catch {
  // The toggle still works when browser storage is unavailable.
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const updateLabel = () => {
    const dark = root.dataset.theme === "dark";
    toggle.querySelector("span").textContent = dark ? "🌙" : "☀️";
    toggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
    toggle.setAttribute("aria-label", toggle.title);
  };

  toggle.hidden = false;
  updateLabel();
  toggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    updateLabel();
    try {
      localStorage.setItem(themeKey, root.dataset.theme);
    } catch {
      // Keep the selected theme for this page.
    }
  });
});
