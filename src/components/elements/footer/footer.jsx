'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";


export default function Footer() {

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
        <div className="w-full h-20 background-secondary px-12 ">
            <div className="h-full w-full flex relative justify-center items-center  text-background ">

                <div className="absolute left-0 flex h-full items-center gap-2 ">
                    <img src="./link.png" alt="Logo" className="flex object-contain h-2/5" />
                    <p className="text-xl"><span className="font-bold">DAE</span>, Inc.</p>
                </div>

                <div className="h-full items-center flex  justify-center gap-4 text-background">
                    <Link href="/sobre" className="text-hover">Sobre</Link>
                    <Link href="/suporte" className="text-hover">Suporte</Link>
                    <Link href="https://github.com/Endrigogustavo/DaeLink-Projeto" className="text-hover">Github</Link>
                </div>

                <div className="absolute right-0 flex h-full items-center gap-2 ">
                    <p className="text-base">Brasil, São Paulo</p>

                    <button onClick={toggleTheme} aria-label="Trocar tema" className="p-2 cursor-pointer">
                        {isDark ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </div>

            </div>
        </div>

    );
}
