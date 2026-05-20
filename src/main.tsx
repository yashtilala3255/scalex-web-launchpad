import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Force dark mode on the HTML element permanently
document.documentElement.classList.add("dark");
// Also remove light class if somehow present
document.documentElement.classList.remove("light");

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
