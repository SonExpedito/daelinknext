import { useUIStore } from "@/src/components/store/modalstore";
import { use, useEffect, useState } from "react";

import Carregamento from "@/src/components/elements/carregamento/carregamento";
import { Briefcase } from 'lucide-react';
import { useRouter } from "next/navigation";
import axios from "axios";
import ErrorCard from "@/src/components/elements/errorcard/errorcard";

interface Empresa {
    id: string;
    name?: string;
    sobreimg?: string;
    descricao?: string;
    email?: string;
    cep?: string;
    cnpj?: string;
}

interface Vaga {
    id: string;
    vaga: string;
    tipo?: string;
    salario?: string;
    empresa?: Empresa | null;
}

type Props = {
    empresa: Empresa;
};

export default function ComapanyTabs({ empresa }: Props) {
    const [activeTab, setActiveTab] = useState(1);
    const empresaId = empresa.id;
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const router = useRouter();


    const [loading, setLoading] = useState(true);
    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);


    useEffect(() => {
        if (activeTab !== 3 || !empresaId) return;

        setLoading(true);

        axios
            .post<Vaga[]>("/get-companyvagas", { empresaId })
            .then((res) => {
                setVagas(res.data);
                setLoading(false);
            })
            .catch((err) => {
                openModal(err.response?.data?.message || "Erro ao buscar vagas.");
                console.error(err);
                setTimeout(() => closeModal(), 1200);
                setLoading(false);
            });
    }, [activeTab, empresaId, openModal, closeModal]);

    const tabs = [
        { id: 1, nome: "Posts" },
        { id: 2, nome: "Sobre" },
        { id: 3, nome: "Vagas" }
    ];

    const VagaDetalhes = (id: string) => {
        router.push(`/vagas/${id}`);
    };

    return (
        <div className="w-full h-fit flex flex-col">
            <div className="w-full h-16 flex justify-center gap-8" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        role="tab"
                        aria-selected={activeTab === tab.id}// booleano
                        aria-controls={`tabpanel-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        onClick={() => setActiveTab(tab.id)}
                        className={
                            "h-full w-[12%] flex items-center justify-center cursor-pointer transition-all duration-200 rounded-3xl outline-none " +
                            (activeTab === tab.id
                                ? " border-b-4 border-[#2469F5] font-bold text-[#2469F5] bg-blue-500/10"
                                : " border-b-4 border-[#A0A0A0] font-normal text-color hover:text-blue-300 hover:border-blue-300")
                        }
                    >
                        {tab.nome}
                    </button>
                ))}
            </div>

            {/* Conteúdo das tabs com efeito liquid glass */}
            <div className="mt-4 p-6 rounded-2xl transition-all duration-500">
                {activeTab === 1 && (
                    <div className="w-full h-auto min-h-[24rem] px-6">
                        <p className="text-color">Aqui vão os posts da empresa.</p>
                    </div>
                )}
                {activeTab === 2 && (
                    <div className="w-full min-h-[24rem] h-auto px-6">
                        <div className="w-full h-full flex items-center justify-center gap-40">
                            <div className="h-full w-1/2 flex items-center justify-center">
                                <img src={empresa.sobreimg || "/errors/sobreimgpadrao.jpg"} alt={empresa.name} className="h-full object-cover rounded-3xl" />
                            </div>

                            <div className="h-full w-1/2 flex flex-col  justify-center gap-2">
                                <p className="text-color text-lg">Email: {empresa.email}</p>
                                <p className="text-color text-lg">CEP: {empresa.cep}</p>
                                <p className="text-color text-lg">CNPJ: {empresa.cnpj}</p>
                                <p className="text-color text-lg">{empresa.descricao || "Sem descrição disponível."}</p>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 3 && (
                    <div
                        className={`w-full min-h-[24rem] px-6 flex justify-center`}
                    >
                        {loading ? (
                            <Carregamento />
                        ) : vagas && vagas.length > 0 ? (
                            <div className="w-full h-full grid grid-cols-2 gap-4 justify-center">
                                {vagas.map((vaga) => (
                                    <div
                                        key={vaga.id}
                                        onClick={() => VagaDetalhes(vaga.id)}
                                        className="w-72 h-40 p-4 rounded-2xl flex items-center justify-center cursor-pointer
                                        border border-black/80 dark:border-white/30 shadow-inner hover:scale-105 transition-transform duration-300
                                        bg-gradient-to-br from-black/80 via-black/15 to-black/80 dark:from-white/20 dark:via-white/15 dark:to-white/20
                                        backdrop-blur-[22px] saturate-150"
                                    >
                                        <div className="h-full w-[42%] flex items-center justify-center">
                                            <Briefcase size={50} className="text-color" />
                                        </div>
                                        <div className="h-full w-[58%] flex flex-col justify-center items-center text-color">
                                            <h3 className="font-bold">{vaga.vaga}</h3>
                                            <p>{vaga.tipo}</p>
                                            <p>R${vaga.salario}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ErrorCard label="Nenhuma vaga disponível." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
