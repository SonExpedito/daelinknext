'use client'

import { useEffect, useState } from 'react';
import type { Processo, Vaga } from "@/src/components/types/bdtypes";
import { useUIStore } from '@/src/components/store/modalstore';
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import SearchBar from '@/src/components/elements/searchbar/searchbar';
import ErrorCard from '@/src/components/elements/errorcard/errorcard';
import axios from 'axios';
import PcdModal from './modal/pcdmodal'; // import do modal

type Props = { readonly vagaid: string; };

// Gera chave única e estável (evita duplicação e fallback para casos sem id)
function getProcessoKey(p: Processo, index: number): string {
    const id = p.id?.trim();
    if (id) return `proc-${id}`;
    if ((p as any).pcdId) return `proc-pcd-${(p as any).pcdId}`;
    const composite = `${p.pcd?.name || 'pcd'}-${p.processo?.situacao || 'situacao'}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-)|(-$)/g, '');
    return `proc-fallback-${composite}-${index}`;
}

export default function ProcessosPanelPage({ vagaid }: Props) {
    const [processos, setProcessos] = useState<Processo[]>([]);
    const [vaga, setVaga] = useState<Vaga | null>(null);
    const [filteredProcessos, setFilteredProcessos] = useState<Processo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalUI = useUIStore((state) => state.openModal);
    const closeModalUI = useUIStore((state) => state.closeModal);

    const handleSearch = (query: string) => {
        const termo = (query || "").trim().toLowerCase();
        if (!termo) {
            setFilteredProcessos(processos);
            return;
        }
        setFilteredProcessos(processos.filter(
            (p) =>
                (p.pcd?.name || "").toLowerCase().includes(termo) ||
                (p.pcd?.trabalho || "").toLowerCase().includes(termo)
        ));
    };

    const handleOpenPcdModal = (processo: Processo) => {
        setSelectedProcesso(processo);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (!vagaid) return;

        const getProcessos = async () => {
            try {
                const response = await axios.post<{ processos: Processo[] }>("/list-processo", { vagaId: vagaid });
                setProcessos(response.data.processos);
                setFilteredProcessos(response.data.processos);
            } catch (error) {
                openModalUI("Erro ao buscar Processos.");
                setTimeout(() => closeModalUI(), 1200);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const getVaga = async () => {
            try {
                const response = await axios.post<{ vaga: Vaga }>("/list-datavaga", { vagaId: vagaid });
                setVaga(response.data.vaga);
            } catch (error) {
                openModalUI("Erro ao buscar Vaga.");
                setTimeout(() => closeModalUI(), 1200);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getProcessos();
        getVaga();
    }, [vagaid]);

    const getSituacaoClass = (situacao?: string) => {
        switch (situacao) {
            case "Pendente":
                return "bg-gray-500";
            case "Encerrado":
                return "bg-red-400";
            case "Aprovado":
                return "background-green";
            default:
                return "bg-gray-500"; // fallback
        }
    };

    return (
        <>
            <div className="w-full h-auto pt-20 py-8 flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl secondary-color font-bold">
                    Processos <span className='text-color'>{vaga?.vaga}</span>
                </h1>
                <SearchBar onSearch={handleSearch} placeholder="Busque um Candidato ou Especialidade" />
            </div>

            {loading ? (
                <Carregamento />
            ) : (
                <div className={`w-full pb-8 ${filteredProcessos.length > 0
                    ? "min-h-screen grid grid-cols-3 justify-items-center content-start gap-y-12"
                    : "h-[30rem] flex items-start justify-center"}`}
                >
                    {filteredProcessos.length > 0 ? (
                        filteredProcessos.map((processo, index) => (
                            <button
                                key={getProcessoKey(processo, index)}
                                onClick={() => handleOpenPcdModal(processo)}
                                type="button"
                                aria-label={`Ver detalhes do candidato ${processo.pcd?.name || ""}`}
                                title={processo.pcd?.name || "Ver detalhes do candidato"}
                                className="w-72 h-[26rem] gap-3 rounded-3xl background-primary flex flex-col items-center justify-center overflow-hidden hover-size cursor-pointer card-border"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if ((e.key === "Enter" || e.key === " ") && (processo as any).pcdId) {
                                        handleOpenPcdModal(processo);
                                    }
                                }}
                            >
                                <img
                                    src={processo.pcd?.imageUrl || "/errors/profileimg.png"}
                                    alt={`Imagem do candidato ${processo.pcd?.name || ""}`}
                                    className='h-[66%] w-[80%] rounded-3xl object-cover bannershadow'
                                />
                                <div className='flex flex-col items-center justify-center gap-3'>
                                    <p className='text-color text-lg'>{processo.pcd?.name}</p>
                                    <h1 className={`text-lg font-bold p-1 px-3 rounded-full text-white ${getSituacaoClass(processo.processo?.situacao)}`}>{processo.processo?.situacao}</h1>
                                </div>
                            </button>
                        ))
                    ) : (
                        <ErrorCard label="Nenhuma vaga encontrada." />
                    )}
                </div>
            )}

            <PcdModal
                processo={selectedProcesso}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
