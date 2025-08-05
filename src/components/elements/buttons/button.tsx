"use client";

interface ButtonProps {
    label: string;

    onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
    return (
        <button
            className="w-30 py-1 px-2 text-background background-secondary rounded-full text-lg cursor-pointer hover-size hover:opacity-80"
            onClick={onClick}
        >
            {label}
        </button>
    );
}