"use client";

interface ButtonProps {
  readonly label: React.ReactNode; // Ícone, texto, etc.
  readonly type?: "button" | "submit" | "reset";
  readonly onClick?: () => void;
  readonly className?: string;
  readonly disabled?: boolean; // ✅ Agora aceita disabled
}

export default function Button({
  label,
  onClick,
  type = "button",
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-1 flex rounded-full text-white text-lg transition-all
        border border-white/30 shadow-md
        backdrop-blur-xl backdrop-saturate-150
        ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100 hover:opacity-50" : "cursor-pointer hover:scale-105 hover:opacity-90"}
        ${className ?? ""}`}
    >
      {label}
    </button>
  );
}
