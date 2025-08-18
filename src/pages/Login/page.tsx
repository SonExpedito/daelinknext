'use client'
import { useEffect, useState } from "react";
import "./logincss.css";
import { Auth /*, getAuth */ } from "firebase/auth";
import { db, auth } from "@/src/api/firebase"; // usa instâncias já inicializadas
import Link from "next/link";
import Button from "@/src/components/elements/buttons/button";

export default function LoginPage() {
    const images = [
        "/login/background.jpg",
        "/login/background2.jpg",
        "/login/background3.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 45000); // troca a cada 30 segundos
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const prev = root.getAttribute('data-theme');
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark'); // caso algum toggle adicione
        return () => {
            if (prev) root.setAttribute('data-theme', prev); else root.removeAttribute('data-theme');
        };
    }, []);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const auth = getAuth(); // comentado para evitar erro de app não inicializado
    auth.languageCode = 'it';




    return (
        <div data-theme="light" className="h-screen w-screen flex items-center justify-center relative overflow-hidden">

            {/* Slider de imagens */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                >
                    <img
                        src={img}
                        alt="Background"
                        className="w-full h-full object-cover scale-105 brightness-55 contrast-105 saturate-110"
                    />
                    {/* Glassmorphism overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-white/5 backdrop-saturate-150 border border-white/30 shadow-inner" />
                    {/* Optional subtle gradient to enhance depth */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 mix-blend-overlay" />
                </div>
            ))}

            {/* Glassmorphism effect */}
            <div className="absolute h-3/4 w-6/12 flex flex-col items-center justify-center rounded-3xl bg-white/70 border border-white/70 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 gap-8">
                <img src="/logo.png" className="h-12 object-contain " alt="Logo" />
                <h1 className="text-3xl font-bold">Bem Vindo de Volta!</h1>

                <div className="w-full h-fit flex flex-col gap-4 items-center justify-center">
                    <input type="email" className="w-2/4 bg-white/70 rounded-2xl p-4 mt-1 text-color"
                        onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" />

                    <input type="password" className="w-2/4 bg-white/70 rounded-2xl p-4 mt-1 text-color"
                        onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Senha" />
                </div>

                <div className="flex flex-col w-full h-fit justify-center items-center gap-6">
                    <Button label="Login" onClick={() => { handleButtonClick() }} />
                    <Link className='text-lg cursor-pointer primary-color font-medium' href='/cadastro'>Não Possui uma conta? Cadastre-se</Link>
                </div>

                <div className="w-full flex justify-center items-center gap-4">
                    <button className="background-primary h-12 flex items-center justify-center py-2 px-4 rounded-2xl cursor-pointer hover-size">
                        <img src="./icons/appleicon.png" alt="LoginApple" className="object-contain h-11/12" />
                    </button>
                    <button className="background-primary h-12 flex items-center justify-center py-2 px-4 rounded-2xl cursor-pointer hover-size">
                        <img src="./icons/googleicon.png" alt="LoginGooggle" className="object-contain h-11/12" />
                    </button>
                </div>

            </div>


        </div>
    );
}

