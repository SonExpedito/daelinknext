"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/src/components/store/modalstore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
    const router = useRouter();

    const images = [
        "/login/background.jpg",
        "/login/background2.jpg",
        "/login/background3.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Preencha todos os campos");
            openModal("Preencha todos os campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axios.post("/login-adm", { email, password });

            // Se o login foi bem-sucedido
            openModal("Autenticado com sucesso!");
            router.push("/dashboard-adm");
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || "Erro ao autenticar";
            setError(msg);
            openModal(msg);
        } finally {
            setLoading(false);
            setTimeout(() => closeModal(), 1200);
        }
    };

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

            <div className="absolute h-3/4 w-6/12 flex flex-col items-center justify-center rounded-3xl bg-white/70 border border-white/70 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 gap-8">
                <img src="/logo.png" className="h-12 object-contain" alt="Logo" />
                <h1 className="text-3xl font-bold text-black">Login Administrador</h1>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="flex flex-col w-full h-fit justify-center items-center gap-4"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-2/4 bg-white/70 rounded-2xl p-4 mt-1 pr-12 placeholder-gray-500 !text-black"
                    />

                    <div className="relative w-2/4 mb-4 items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-white/70 rounded-2xl p-4 mt-1 pr-12 placeholder-gray-500 !text-black"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-2/4 bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 font-medium"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
