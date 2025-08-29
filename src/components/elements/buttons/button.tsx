"use client";

interface ButtonProps {
  label: string;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function Button({ label, onClick, type, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-4 py-1 rounded-full text-white text-lg cursor-pointer transition-all 
        hover:scale-105 hover:opacity-90 border border-white/30 shadow-md
        backdrop-blur-xl backdrop-saturate-150
        ${className ?? ""}`}
    >
      {label}
    </button>
  );
}
