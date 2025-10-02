// components/ToggleSwitch.tsx
"use client";

import React, { useEffect, useState } from "react";

interface ToggleSwitchProps {
  readonly checked: boolean;
  readonly onChange: () => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const backgroundColor =
    theme === "dark" ? "bg-white/10" : "bg-gray-300";

  const knobColor =
    theme === "dark" ? "before:bg-white/70" : "before:bg-black/70";

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        aria-label="Toggle switch"
      />
      <div
        className={`w-14 h-8 ${backgroundColor}
        backdrop-blur-md peer-focus:outline-none 
        rounded-full peer peer-checked:bg-[#07BEB8] transition-all duration-500 
        before:content-[''] before:absolute before:top-1 before:left-1 
        before:w-6 before:h-6 ${knobColor} before:rounded-full 
        before:shadow-lg before:transition-all before:duration-500
        peer-checked:before:translate-x-6 peer-checked:before:bg-white`}
      ></div>
    </label>
  );
}
