// src/components/provider/ThemeInitializer.tsx
"use client";

import Script from "next/script";

export default function ThemeInitializer() {
  return (
    <Script id="theme-initializer" strategy="beforeInteractive">
      {`
        (function() {
          try {
            // Recupera tema salvo
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
              document.documentElement.setAttribute("data-theme", savedTheme);
            } else {
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
            }

            // Recupera cores salvas
            const savedPrimary = localStorage.getItem("primary");
            const savedSecondary = localStorage.getItem("secondary");

            // Define valores padrão caso não exista
            const defaultPrimary = "#2469F5";
            const defaultSecondary = "#07BEB8";

            document.documentElement.style.setProperty("--primary", savedPrimary || defaultPrimary);
            document.documentElement.style.setProperty("--secondary", savedSecondary || defaultSecondary);
          } catch (e) {
            console.warn("Erro ao aplicar tema inicial:", e);
          }
        })();
      `}
    </Script>
  );
}
