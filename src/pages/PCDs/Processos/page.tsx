'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import type { Empresa, Processo } from "@/src/components/types/bdtypes";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import SearchBar from '@/src/components/elements/searchbar/searchbar';
import { useUIStore } from '@/src/components/store/modalstore';
import { useUserStore } from '@/src/components/store/userstore';
import ErrorCard from '@/src/components/elements/errorcard/errorcard';


interface ProcessoDetalhado {
    processo: Processo;
    empresa: Empresa | null;
}

export default function ProcessosPage() {
    const [processos, setProcessos] = useState<ProcessoDetalhado[]>([]);
    const [filteredProcessos, setFilteredProcessos] = useState<ProcessoDetalhado[]>([]);
    const userProfile = useUserStore((state) => state.userProfile);

    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchProcessos = async () => {
            try {

                const response = await axios.post<{ processos: ProcessoDetalhado[] }>('/get-processosall', {
                    pcdId: userProfile?.id
                });

                const { processos } = response.data;

                setProcessos(processos);
                setFilteredProcessos(processos);

            } catch (error) {
                openModal("Erro ao buscar processos.");
                setTimeout(() => closeModal(), 1200);
                console.error(error);
            } finally {
                setLoading(false);

            }
        };

        if (userProfile?.id) {
            fetchProcessos();
        } else {
            setLoading(false);

        }
    }, [userProfile]);

    const handleSearch = (query: string) => {
        const termo = (query || "").trim().toLowerCase();

        if (!termo) {
            setFilteredProcessos(processos); // reset
            return;
        }

        const filtradas = processos.filter(
            (processo) =>
                (processo.processo?.name || "").toLowerCase().includes(termo) ||
                (processo.empresa?.name || "").toLowerCase().includes(termo)
        );

        setFilteredProcessos(filtradas);
    };

    const ProcessosInfo = (id: string) => {
        router.push(`/processos/${id}`);
    }


    function getSituacaoClass(situacao?: string) {
        switch (situacao) {
            case "Dispensado":
                return "bg-gray-400";
            case "Pendente":
                return "background-blue";
            case "Concluído":
                return "background-green";
            default:
                return "bg-gray-200";
        }
    }


    return (
        <>
            <div className="w-full h-auto py-20 flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl secondary-color font-bold">Processos</h1>
                <SearchBar onSearch={handleSearch} placeholder="Busque por um processo ou empresa" />
            </div>

            {loading ? (
                <Carregamento />
            ) : (
                <div
                    className={`w-full pb-8 
                        ${filteredProcessos.length > 0
                            ? "min-h-[30rem] h-auto grid grid-cols-3 justify-items-center content-start gap-y-12"
                            : "h-[30rem] flex items-start justify-center"}`}
                >
                    {filteredProcessos.length > 0 ? (
                        filteredProcessos.map((item) => (
                            <div
                                key={item.processo.id}
                                tabIndex={0}
                                role="button"
                                onClick={() => ProcessosInfo(item.processo.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        // ação acessível
                                        ProcessosInfo(item.processo.id);
                                    }
                                }}
                                className="flex flex-col h-72 w-80 card-border
                                items-center justify-center cursor-pointer hover-size overflow-hidden gap-4"
                            >

                                <div className=" h-3/5 flex items-center justify-center
                            rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
                             hover:bg-white/20 transition duration-300">
                                    <img src={item.empresa?.imageUrl || "/errors/profileimg.png"} alt={item.empresa?.name || "Empresa não informada"} className="h-full object-cover rounded-3xl" />
                                </div>


                                <div className='flex flex-col items-center justify-center gap-2'>
                                    <p className="text-color font-bold text-xl capitalize">{item.processo.nome|| "Vaga não encontrada"}</p>
                                    <h2 className={`text-[#F5F5F5] text-xl font-bold px-4 py-1 rounded-full ${getSituacaoClass(item.processo.situacao)}`}>{item.processo.situacao || "Situação não encontrada"}</h2>
                                </div>
                            </div>
                        ))
                    ) : (
                        <ErrorCard label="Nenhum processo encontrado." />
                    )}
                </div>
            )}
        </>
    );
}