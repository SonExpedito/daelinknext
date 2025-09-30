"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Vaga } from "@/src/components/types/bdtypes";
import { useUIStore } from '@/src/components/store/modalstore';
import { useUserStore } from '@/src/components/store/userstore';
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import SearchBar from '@/src/components/elements/searchbar/searchbar';
import ErrorCard from '@/src/components/elements/errorcard/errorcard';
import axios from 'axios';
import Button from '@/src/components/elements/buttons/button';
import VagaCreateModal from './vagamodal/vagacreate';
import VagaViewModal from './vagamodal/vagaview';


export default function VagaPanelPage() {
    const router = useRouter();
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [filteredVagas, setFilteredVagas] = useState<Vaga[]>([]);
    const userProfile = useUserStore((state) => state.userProfile);

    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
    const [viewVaga, setViewVaga] = useState<Vaga | null>(null);


    useEffect(() => {
        if (!userProfile?.id) return; // só busca quando tiver id

        const getVagas = async () => {
            try {
                const response = await axios.post<{ vagas: Vaga[] }>('/list-vagas', {
                    empresaId: userProfile.id
                });

                const { vagas } = response.data;

                setVagas(vagas);
                setFilteredVagas(vagas);
            } catch (error) {
                openModal("Erro ao buscar Vagas.");
                setTimeout(() => closeModal(), 1200);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getVagas();
    }, [userProfile?.id]); // depende do id


    const handleSearch = (query: string) => {
        const termo = (query || "").trim().toLowerCase();

        if (!termo) {
            setFilteredVagas(vagas); // reset
            return;
        }

        const filtradas = vagas.filter(
            (vaga) =>
                (vaga.vaga || "").toLowerCase().includes(termo) ||
                (vaga.tipo || "").toLowerCase().includes(termo)
        );

        setFilteredVagas(filtradas);
    };

    const handleOpenCreate = () => {
        setEditingVaga(null);
        setModalOpen(true);
    };

    // Edição agora feita dentro do modal de visualização

    const handleView = (vaga: Vaga) => {
        setViewVaga(vaga);
    };

    const handleSaved = (vagaPartial: Partial<Vaga>) => {
        // Atualiza localmente sem refetch total (otimista)
        setVagas(prev => {
            if (vagaPartial.id) {
                return prev.map(v => v.id === vagaPartial.id ? { ...v, ...vagaPartial } as Vaga : v);
            }
            // criação: gerar id temporário se não vier (UI only)
            const tempId = vagaPartial.id || `temp-${Date.now()}`;
            return [...prev, { id: tempId, ...vagaPartial } as Vaga];
        });
        setFilteredVagas(prev => {
            if (vagaPartial.id) {
                return prev.map(v => v.id === vagaPartial.id ? { ...v, ...vagaPartial } as Vaga : v);
            }
            const tempId = vagaPartial.id || `temp-${Date.now()}`;
            return [...prev, { id: tempId, ...vagaPartial } as Vaga];
        });
        openModal('Lista atualizada.');
        setTimeout(() => closeModal(), 900);
        // refresh para revalidar possíveis componentes server (caso existam)
        try { router.refresh(); } catch { }
    };

    const handleEditRequest = (vaga: Vaga) => {
        // Fecha modal de visualização e abre de edição
        setViewVaga(null);
        setEditingVaga(vaga);
        setModalOpen(true);
    };

    // Fechamento de vaga tratado no modal de visualização

    // Fechamento agora apenas via modal de visualização

    return (
        <>

            <div className="w-full h-auto pt-20 py-8 flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl secondary-color font-bold">Vagas & Processos</h1>
                <SearchBar onSearch={handleSearch} placeholder="Busque uma vaga ou tipo" />
            </div>

            <div className='w-full flex flex-col items-center justify-center pb-8'>
                <Button
                    label="Adicionar Vaga"
                    onClick={handleOpenCreate}
                    className='background-blue' />
            </div>

            {loading ? (
                <Carregamento />
            ) : (
                <div
                    className={`w-full pb-8 
                            ${filteredVagas.length > 0
                            ? "min-h-screen grid grid-cols-3 justify-items-center content-start gap-y-12"
                            : "h-[30rem] flex items-start justify-center"}`}
                >
                    {filteredVagas.length > 0 ? (
                        filteredVagas.map((vaga) => {
                            const closed = vaga.status === 'fechada' || vaga.status === 'encerrada'; // trata legado
                            return (
                                <button
                                    key={vaga.id}
                                    type="button"
                                    onClick={() => handleView(vaga)}
                                    className="relative w-90 h-40 p-4 rounded-3xl background-primary flex items-center 
                                    justify-center overflow-hidden card-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {closed && (
                                        <span className="absolute text-[14px] uppercase tracking-wide rounded-b-2xl bg-red-400 text-white p-1 px-2 right-2 top-2">Fechada</span>
                                    )}
                                    <div className="h-full w-[48%] flex items-center justify-center ">
                                        <img
                                            src={vaga.img || "/errors/bannererror.png"}
                                            className={`object-contain h-[85%] rounded-3xl ${closed ? 'opacity-60 grayscale' : ''}`}
                                            alt={vaga.vaga || "VAGA não informada"}
                                        />
                                    </div>
                                    <div className="h-full w-[52%] flex flex-col gap-1 pl-4 justify-center">

                                        <h2 className="text-xl font-semibold text-color flex items-center justify-center gap-2 text-center">
                                            {vaga.vaga}
                                        </h2>
                                        <p className="secondary-color">{vaga.tipo || "Tipo não informado"}</p>
                                        <p className="text-color">R${vaga.salario || "Salário não informado"}</p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <ErrorCard label="Nenhuma vaga encontrada." />
                    )}
                </div>
            )}

            <VagaCreateModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                empresaId={userProfile?.id || ''}
                vaga={editingVaga}
                onSave={handleSaved}
            />
            {viewVaga && (
                <VagaViewModal
                    vaga={viewVaga}
                    isOpen={Boolean(viewVaga)}
                    onClose={() => setViewVaga(null)}
                    onUpdated={handleSaved}
                    onEdit={handleEditRequest}
                />
            )}
        </>
    );

}