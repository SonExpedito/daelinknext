"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import PerfilEtapa from "./etapas/perfil";
import CredenciaisEtapa from "./etapas/credencial";
import AdicionaisEtapa from "./etapas/adicionais";
import Button from "@/src/components/elements/buttons/button";

export default function CadastroPCDPage() {
    const router = useRouter();

    // imagens do carrossel lateral
    const cadastroPCD = ["/cadastro/pcd1.jpg", "/cadastro/pcd2.jpg", "/cadastro/pcd3.jpg"];
    const [currentIndex, setCurrentIndex] = useState(0);

    // controla em que etapa está
    const [etapa, setEtapa] = useState(0);

    // guarda os dados do formulário
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        adicionais: "",
        fotoPrincipal: null as File | null,
        fotoExtra: null as File | null,
    });

    // troca automática das imagens
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cadastroPCD.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // renderiza cada etapa do formulário
    const renderEtapa = () => {
        switch (etapa) {
            case 0:
                return <PerfilEtapa data={formData} setData={setFormData} />;
            case 1:
                return <CredenciaisEtapa data={formData} setData={setFormData} />;
            case 2:
                return <AdicionaisEtapa data={formData} setData={setFormData} />;
            default:
                return null;
        }
    };

    // renderiza os botões de navegação
    const renderBotoes = () => {
        return (
            <div className="flex items-center justify-center w-full">
                {/* Botão Voltar */}
                {etapa > 0 && (
                    <Button
                        label="Voltar"
                        onClick={() => setEtapa((prev) => prev - 1)}
                        className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:opacity-90 transition"
                    />

                )}

                {/* Botão Próximo ou Finalizar */}
                {etapa < 2 ? (
                    <Button
                        label="Próximo"
                        onClick={() => setEtapa((prev) => prev + 1)}
                        className="background-green"
                    />


                ) : (
                    <Button
                        label="Finalizar"
                        onClick={() => console.log("Enviar dados:", formData)}
                        className="ml-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition"
                    />

                )}
            </div>
        );
    };

    return (
        <motion.div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-white-primary-mockup">
            {/* Lado esquerdo - formulário */}
            <div className="h-full w-[60%] flex flex-col items-center justify-center gap-5">
                {/* Botão voltar para página anterior */}
                <button
                    onClick={router.back}
                    className="flex items-center gap-2 cursor-pointer self-start ml-8
                        font-bold text-white background-green pr-4 py-1 rounded-full 
                        border border-white/30 shadow-md backdrop-blur-xl backdrop-saturate-150
                        hover:scale-105 hover:opacity-90 transition-all"
                >
                    <ChevronLeft size={28} />
                    <p className="text-lg">Voltar</p>
                </button>

                <h1 className="text-5xl font-bold text-color mb-3">REGISTRO PCD</h1>

                {/* Conteúdo da etapa */}
                <div className="w-full h-[70%] flex flex-col items-center justify-center gap-6">
                    {renderEtapa()}
                    {renderBotoes()}
                </div>
            </div>

            {/* Lado direito - imagens */}
            <div className="h-full w-[40%] relative z-10 p-2">
                <motion.div
                    className="h-full w-full flex flex-col gap-8 items-center justify-center rounded-3xl overflow-hidden px-4 relative"
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px) saturate(150%)",
                        WebkitBackdropFilter: "blur(20px) saturate(150%)",
                    }}
                >
                    {/* fundo líquido */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -inset-[100%] animate-liquidGlass bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                    </div>

                    {/* Reflexo da imagem */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={cadastroPCD[currentIndex]}
                            alt="reflexo"
                            className="w-full h-full object-cover object-center opacity-30 blur-xl scale-110 transition-opacity duration-1000 ease-in-out"
                        />
                    </div>

                    {/* Imagem principal */}
                    <div className="relative w-3/4 h-4/5 flex items-center justify-center">
                        {cadastroPCD.map((img, index) => (
                            <img
                                key={img}
                                src={img}
                                alt=""
                                className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                                    }`}
                            />
                        ))}
                    </div>

                    <img src="/logo.png" className="h-12 object-contain z-20" alt="Logo" />
                </motion.div>
            </div>
        </motion.div>
    );
}
