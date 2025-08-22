'use client'
import { useEffect, useState } from "react";
import "./logincss.css";
import { auth } from "@/src/api/firebase";
import Link from "next/link";
import Button from "@/src/components/elements/buttons/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/src/components/elements/modal/modal";
import { useUserStore } from "@/src/components/store/userstore";

export default function LoginPage() {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("Mensagem inicial...");
    const router = useRouter();

    const images = [
        "/login/background.jpg",
        "/login/background2.jpg",
        "/login/background3.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const prev = root.getAttribute('data-theme');
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
        return () => {
            if (prev) root.setAttribute('data-theme', prev); else root.removeAttribute('data-theme');
        };
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    auth.languageCode = 'it';

    // Hook zustand
    const loginUser = useUserStore((state) => state.loginUser);
    const setUserType = useUserStore((state) => state.setUserType);

    const handleLogin = async () => {
        if (!email || !password) {
            setMsg("Preencha todos os campos.");
            setOpen(true);
            setTimeout(() => setOpen(false), 2200);
            return;
        }

        const success = await loginUser(email, password);
        if (success) {
            // Garante que o tipo está atualizado no zustand (caso o loginUser não tenha feito)
            const tipo = localStorage.getItem("tipo");
            setUserType(tipo); // tipo pode ser "PCD", "Empresa" ou null
            setMsg("Autenticado com sucesso");
            setOpen(true);
            setTimeout(() => {
                router.push(`/`);
            }, 1200);
        } else {
            setMsg("Credenciais inválidas ou usuário não encontrado.");
            setOpen(true);
            setTimeout(() => setOpen(false), 2200);
        }
    };

    return (
        <>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                message={msg}
                type="display"
            />

            <div data-theme="light" className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
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
                        <div className="pointer-events-none absolute inset-0 bg-white/5 backdrop-saturate-150 border border-white/30 shadow-inner" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 mix-blend-overlay" />
                    </div>
                ))}

                <div className="absolute h-3/4 w-6/12 flex flex-col items-center justify-center rounded-3xl bg-white/70 border border-white/70 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 gap-8">
                    <Link href="/"><img src="/logo.png" className="h-12 object-contain" alt="Logo" /></Link>
                    <h1 className="text-3xl font-bold">Bem Vindo de Volta!</h1>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                        className="flex flex-col w-full h-fit justify-center items-center gap-4"
                    >
                        <input
                            type="email"
                            className="w-2/4 bg-white/70 rounded-2xl p-4 mt-1 text-color"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Email"
                            required
                        />

                        <div className="relative w-2/4 mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-white/70 rounded-2xl p-4 mt-1 pr-12 placeholder-gray-500"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
                            </button>
                        </div>

                        <Button label="Login" type="submit" onClick={() => { }} />
                    </form>

                    <Link
                        className="text-lg cursor-pointer primary-color font-medium"
                        href="/cadastro"
                    >
                        Não Possui uma conta? Cadastre-se
                    </Link>

                    <div className="w-full flex justify-center items-center gap-4 mt-2">
                        <button className="background-primary h-12 flex items-center justify-center py-2 px-4 rounded-2xl cursor-pointer hover-size">
                            <img src="./icons/appleicon.png" alt="LoginApple" className="object-contain h-11/12" />
                        </button>
                        <button className="background-primary h-12 flex items-center justify-center py-2 px-4 rounded-2xl cursor-pointer hover-size">
                            <img src="./icons/googleicon.png" alt="LoginGooggle" className="object-contain h-11/12" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
