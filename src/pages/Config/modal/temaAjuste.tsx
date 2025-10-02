"use client";

import ToggleSwitch from "@/src/components/elements/switchToggle/switch";
import { useTheme } from "@/src/components/hooks/useTheme";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeModal({ isOpen, onClose }: Readonly<ThemeModalProps>) {
  const { isDark, toggleTheme } = useTheme();

  const [primary, setPrimary] = useState("#2469F5");
  const [secondary, setSecondary] = useState("#07BEB8");

  // Paletas para daltonismo
  const colorBlindPalettes = {
    normal: { primary: "#2469F5", secondary: "#07BEB8", label: "Daelink" },
    protanopia: { primary: "#0072B2", secondary: "#D55E00", label: "Protanopia (dif. vermelho)" },
    deuteranopia: { primary: "#009E73", secondary: "#E69F00", label: "Deuteranopia (dif. verde)" },
    tritanopia: { primary: "#56B4E9", secondary: "#F0E442", label: "Tritanopia (dif. azul)" },
  };

  // Carrega valores salvos no localStorage
  useEffect(() => {
    const savedPrimary = localStorage.getItem("primary");
    const savedSecondary = localStorage.getItem("secondary");
    if (savedPrimary) {
      setPrimary(savedPrimary);
      document.documentElement.style.setProperty("--primary", savedPrimary);
    }
    if (savedSecondary) {
      setSecondary(savedSecondary);
      document.documentElement.style.setProperty("--secondary", savedSecondary);
    }
  }, []);

  // Atualiza valores no root + localStorage
  const updateColors = (primaryColor: string, secondaryColor: string) => {
    setPrimary(primaryColor);
    setSecondary(secondaryColor);
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--secondary", secondaryColor);
    localStorage.setItem("primary", primaryColor);
    localStorage.setItem("secondary", secondaryColor);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="background-primary p-6 rounded-2xl w-[90%] max-w-md shadow-xl relative">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-600 dark:text-zinc-300 hover:scale-110 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-color">Aparência</h2>

        {/* Toggle Tema */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium text-color">Modo Escuro</span>
          <ToggleSwitch checked={isDark} onChange={toggleTheme} />
        </div>

        {/* Paleta de cores custom */}
        <div className="mb-6">
          <p className="text-lg font-medium mb-3 text-color">Paleta de cores</p>
          <div className="flex flex-col gap-4">
            {/* Color pickers */}
            <div className="flex items-center justify-between">
              <label htmlFor="primary-color-picker" className="text-color">Primária:</label>
              <input
                id="primary-color-picker"
                type="color"
                value={primary}
                onChange={(e) => updateColors(e.target.value, secondary)}
                className="w-12 h-12 rounded-2xl cursor-pointer"
                title="Selecionar cor primária"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="secondary-color-picker" className="text-color">Secundária:</label>
              <input
                id="secondary-color-picker"
                type="color"
                value={secondary}
                onChange={(e) => updateColors(primary, e.target.value)}
                className="h-12 w-12 rounded-2xl cursor-pointer"
                title="Selecionar cor secundária"
              />
            </div>
          </div>
        </div>

        {/* Paletas pré-definidas para daltonismo */}
        <div>
          <p className="text-lg font-medium mb-3 text-color">Pré-definições para daltonismo</p>
          <div className="flex flex-col gap-2">
            {Object.entries(colorBlindPalettes).map(([key, palette]) => (
              <button
                key={key}
                onClick={() => updateColors(palette.primary, palette.secondary)}
                className="w-full h-12 rounded-lg shadow-lg flex items-center justify-center transition hover:scale-105 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})`,
                }}
                title={palette.label}
              >
                <span className="text-white font-medium">{palette.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
