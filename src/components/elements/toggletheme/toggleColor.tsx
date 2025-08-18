'use client'
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ToggleTheme() {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        const root = document.documentElement;
        root.classList.add("theme-transition");
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setIsDark(newTheme === "dark");

        setTimeout(() => {
            root.classList.remove("theme-transition");
        }, 400);
    };


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
            setIsDark(savedTheme === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
            setIsDark(prefersDark);
        }
    }, []);


    return (

        <button onClick={toggleTheme} aria-label="Trocar tema" className="p-2 cursor-pointer">
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    )


}