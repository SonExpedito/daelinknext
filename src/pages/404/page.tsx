"use client"
import Button from "@/src/components/elements/buttons/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NotFoundPage() {
    const router = useRouter();
    const [selectMode, setSelectMode] = useState({
        modo: "light",
        texto: "Página não encontrada.",
        img: "/errors/404/light.png"
    });

    useEffect(() => {
        const modos = [
            { modo: "dark", texto: "O que procura está numa galáxia muito, muito distante...", img: "/errors/404/dark.png" },
            { modo: "light", texto: "A página que você está procurando não existe.", img: "/errors/404/light.png" }
        ];

        const savedTheme = localStorage.getItem("theme") || "light";
        const modoSelecionado = modos.find(m => m.modo === savedTheme);
        if (modoSelecionado) setSelectMode(modoSelecionado);
    }, []);

    const voltarButton = () => router.back();

    return (
        <div className="h-[calc(100vh-5rem)] w-full flex items-center justify-center">
            <div className="h-full w-1/2 flex flex-col items-center justify-center gap-4">
             <h1 className="text-8xl text-color font-bold text-center">404</h1>
                <h1 className="text-3xl text-color font-bold text-center">Página Não Encontrada</h1>
                <p className="text-xl">{selectMode.texto}</p>
                <Button onClick={voltarButton} type="button"
                    label="Voltar" className="background-green text-3xl mt-4" />
            </div>
            <div className="h-full w-1/2 flex flex-col items-center justify-end overflow-hidden">
                <img src={selectMode.img} alt="Imagem Conforme o Tema" className="h-[90%] object-cover" />
            </div>
        </div>
    );
}
