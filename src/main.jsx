import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Import i18n configuration
import "./i18n/i18n";

// Apply initial theme according to Tailwind CSS best practices
// With light theme as default
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem("userTheme");
  console.log("Initial theme from localStorage:", savedTheme);

  // Clear any existing theme classes first
  document.documentElement.classList.remove("dark");

  // Only apply dark mode if explicitly set to "dark" or
  // if it's "system" AND system prefers dark
  let shouldApplyDark = false;

  if (savedTheme === "dark") {
    shouldApplyDark = true;
  } else if (savedTheme === "system") {
    shouldApplyDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  // Default (no savedTheme) or explicit "light" should be light mode

  console.log("Should apply dark mode:", shouldApplyDark);

  // Update the HTML element - only add 'dark' class if needed
  if (shouldApplyDark) {
    document.documentElement.classList.add("dark");
  }

  // For debugging
  console.log("Current HTML classes:", document.documentElement.className);
};

// Apply theme immediately
applyInitialTheme();

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    const theme = localStorage.getItem("userTheme");
    if (theme === "system") {
      document.documentElement.classList.toggle("dark", e.matches);
      console.log("System theme changed, dark mode:", e.matches);
    }
  });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
