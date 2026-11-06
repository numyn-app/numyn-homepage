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
    toggle.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode";
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
