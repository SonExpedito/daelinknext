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
                <div className="w-full h-[45vh] flex items-center justify-center py-2">
                    <img src={empresa.imageProfile} alt={empresa.name} className="w-[85%] h-full object-cover object-center rounded-3xl" />
                </div>
                <div className="w-full min-h-[30vh] h-auto flex relative items-center pl-36 pb-8">

                    <div className="h-60 w-60 flex items-center justify-center absolute bottom-[50%]
                        rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
                         hover:bg-white/20 transition duration-300">
                        <img src={empresa.imageUrl} alt={empresa.name} className="h-full object-cover rounded-3xl" />
                    </div>

                    <div className="h-full w-full pt-4 flex flex-col gap-3 ml-72">
                        <h2 className="text-5xl font-bold primary-color ">{empresa.name}</h2>
                        <p className="text-xl font-semibold text-color ">{empresa.area}</p>

                        <p className="text-lg text-color text-left whitespace-normal break-words line-clamp-3 w-3/5">{empresa.sobre}</p>
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
