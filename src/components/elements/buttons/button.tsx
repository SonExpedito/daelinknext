"use client";

interface ButtonProps {
    label: string;
    type: "button" | "submit" | "reset";
    onClick: () => void;
    className?: string; // nova prop opcional
}

export default function Button({ label, onClick, type, className }: ButtonProps) {
    return (
        <button
            className={`w-30 py-1 px-2 text-background background-secondary rounded-full text-lg cursor-pointer hover-size hover:opacity-80 ${className ?? ""}`}
            onClick={onClick}
            type={type}
        >
            {label}
        </button>
    );
}