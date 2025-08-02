"use client";

interface ButtonProps {
    label: string;
    
    onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
    return (
        <button
            className="w-30 py-1 px-2 text-background foreground-color rounded-full text-lg cursor-pointer"
            onClick={onClick}
        >
           {label}
        </button>
    );
}