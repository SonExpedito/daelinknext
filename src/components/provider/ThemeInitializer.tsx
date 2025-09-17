// src/components/provider/ThemeInitializer.tsx
"use client";

import Script from "next/script";

export default function ThemeInitializer() {
  return (
    <Script id="theme-initializer" strategy="beforeInteractive">
      {`
        (function() {
          const savedTheme = localStorage.getItem("theme");
          if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
          } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
          }
        })()
      `}
    </Script>
  );
}
