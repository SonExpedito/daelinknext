'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import { useUIStore } from "@/src/components/store/modalstore";
import { useRouter } from "next/navigation";
import type { Empresa } from "@/src/components/types/bdtypes";
import VoltarIcon from "@/src/components/elements/voltar/page";
import Button from "@/src/components/elements/buttons/button"; // Adjust the import path if needed
import ComapanyTabs from "./companytabs";
import ErrorCard from "@/src/components/elements/errorcard/errorcard";
import { Mail, Phone } from "lucide-react";

type Props = {
    readonly empresaId: string; // Adjust the type if vagaId is not a string
};

export default function EmpresasInfoPage({ empresaId }: Props) {
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [loading, setLoading] = useState(true);
    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);
    const router = useRouter();

    useEffect(() => {
        if (!empresaId) {
            setLoading(false);
            openModal("Empresa não encontrada.");
            router.replace("/empresas");
            setTimeout(() => closeModal(), 1200);
            return;
        }

        setLoading(true);

        axios
            .post<Empresa>("/get-company", { empresaId })
            .then((res) => {
                setEmpresa(res.data);
                setLoading(false);
            })
            .catch((err) => {
                openModal(err.response?.data?.message || "Erro ao buscar empresa.");
                console.error(err);
                router.replace("/empresas");
                setTimeout(() => closeModal(), 1200);
                setLoading(false);
            });
    }, [empresaId, router, openModal, closeModal]);

    const handleContact = () => {
        if (empresa?.email) {
            openModal("Abrindo E-mail");
            window.location.href = `mailto:${empresa.email}`;
            setTimeout(() => closeModal(), 1200);
        } else {
            openModal("Email da empresa não disponível.");
            setTimeout(() => closeModal(), 1200);
        }
    };

    const handleTelefone = () => {
        if (empresa?.telefone) {
            openModal("Abrindo Telefone");
            window.location.href = `tel:${empresa.telefone}`;
            setTimeout(() => closeModal(), 1200);
        } else {
            openModal("Telefone da empresa não disponível.");
            setTimeout(() => closeModal(), 1200);
        }
    };

    let content;
    if (loading) {
        content = <Carregamento />;
    } else if (empresa) {
        content = (
            <>
                <div className="w-full h-fit flex flex-col items-center justify-center relative mb-8">
                    <img
                        src={empresa.imageProfile || "/errors/bannererror.png"}
                        alt={empresa.name || "Banner da empresa"}
                        className="w-[70rem] h-80 object-cover rounded-3xl"
                    />

                    <div className="flex flex-col items-center justify-center relative">
                        <div
                            className={`h-60 w-60 mb-40
                                } flex items-center justify-center absolute 
            rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
            hover:bg-white/20 transition duration-300`}
                        >
                            <img
                                src={empresa.imageUrl || "/errors/usererror.png"}
                                alt={empresa.name || ""}
                                className="h-full w-full object-cover rounded-3xl"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center mt-12">
                        <h1 className="text-color text-3xl font-bold text-center">{empresa.name}</h1>
                        <p className="text-base max-w-[30rem] text-center text-color">
                            {empresa.sobre || "Nenhuma descrição adicionada."}
                        </p>

                        <div className="flex gap-4 pt-2 ">
                            <Button type="button" label={<><Mail size={24} /> Email</>} className="background-blue" onClick={handleContact} />
                            <Button type="button" label={<><Phone size={24} /> Telefone</>} className="bg-[#5B21B6]" onClick={handleTelefone} />
                        </div>
                    </div>
                </div>

                <ComapanyTabs empresa={empresa} />
            </>
        );
    } else {
        content = <ErrorCard label="Empresa não encontrada." />;
    }

    return (
        <>
            <VoltarIcon />
            {content}
        </>
    );
}
