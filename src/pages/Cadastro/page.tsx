'use client'
import Link from "next/link";
import { Building, PersonStandingIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function CadastroPage() {
    useEffect(() => {
        const root = document.documentElement;
        const prev = root.getAttribute('data-theme');
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
        return () => {
            if (prev) root.setAttribute('data-theme', prev); else root.removeAttribute('data-theme');
        };
    }, []);


    const router = useRouter();

    const images = [
        "/login/background.jpg",
        "/login/background2.jpg",
        "/login/background3.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (

        <div data-theme="light" className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                >
                    <img
                        src={img}
                        alt="Background"
                        className="w-full h-full object-cover scale-105 brightness-55 contrast-105 saturate-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-white/5 backdrop-saturate-150 border border-white/30 shadow-inner" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 mix-blend-overlay" />
                </div>
            ))}

            <div className="absolute h-3/4 w-6/12 flex flex-col items-center justify-center rounded-3xl 
            bg-white/70 border border-white/70 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 gap-8">
                <Link href="/"><img src="/logo.png" className="h-12 object-contain" alt="Logo" /></Link>
                <div className="flex flex-col items-center justify-center gap-4 ">
                    <h1 className="text-2xl font-bold">Estamos Felizes que Deseja Continuar!</h1>
                    <p className="text-xl ">Selecione o tipo de cadastro que deseja realizar:</p>
                </div>

                <div className=" flex flex-col items-center justify-center gap-4 w-full">
                    <button className="w-1/2 flex items-center justify-center gap-4 py-3  rounded-3xl border hover-size cursor-pointer
                    border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
                        onClick={() => router.push('/cadastro/pcd')}>
                        <PersonStandingIcon size={48} />
                        <p className="text-lg font-bold">Registre-se como Candidato</p>
                    </button>

                    <button className="w-1/2 flex items-center justify-center gap-4 py-3  rounded-3xl border hover-size cursor-pointer
                    border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
                        onClick={() => router.push('/cadastro/empresa')}>
                        <Building size={48} />
                        <p className="text-lg font-bold">Registre-se como Empresa</p>
                    </button>

                </div>

                <Link
                    className="text-lg cursor-pointer primary-color font-medium"
                    href="/login"
                >
                    Já possui cadastro? Faça login aqui!
                </Link>

            </div>

        </div>

    )

}