"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {Vaga } from "@/src/components/types/bdtypes";
import axios from 'axios';
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import SearchBar from '@/src/components/elements/searchbar/searchbar';
import { useUIStore } from '@/src/components/store/modalstore';
import ErrorCard from '@/src/components/elements/errorcard/errorcard';



export default function VagasPage() {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [filteredVagas, setFilteredVagas] = useState<Vaga[]>([]);
    const router = useRouter();

    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getVagas = async () => {
            try {
                const response = await axios.get<Vaga[]>("/get-vagasall");
                setVagas(response.data);
                setFilteredVagas(response.data);
            } catch (error) {
                openModal("Erro ao buscar vagas com empresas.");
                setTimeout(() => closeModal(), 1200);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getVagas();
    }, []);

    // Agora funciona em tempo real (onChange)
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

    const VagaDetalhes = (id: string) => {
        router.push(`/vagas/${id}`);
    };

    return (
        <>
            <div className="w-full h-auto py-20 flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl secondary-color font-bold">Vagas</h1>
                <SearchBar onSearch={handleSearch} placeholder="Busque uma vaga ou tipo" />
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
                        filteredVagas.map((vaga) => (
                            <div
                                key={vaga.id}
                                onClick={() => VagaDetalhes(vaga.id)}
                                tabIndex={0}
                                role="button"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        VagaDetalhes(vaga.id);
                                    }
                                }}
                                className="w-90 h-40 p-4 rounded-3xl background-primary flex items-center 
                                justify-center overflow-hidden hover-size cursor-pointer card-border"
                            >
                                <div className="h-full w-[48%] flex items-center justify-center ">
                                    <img
                                        src={vaga.empresa?.imageProfile || "/errors/bannererror.png"}
                                        className="object-contain h-[85%]  rounded-3xl"
                                        alt={vaga.empresa?.name || "Empresa não informada"}
                                    />
                                </div>
                                <div className="h-full w-[52%] flex flex-col gap-1 pl-4 justify-center">
                                    <h2 className="text-xl font-semibold text-color">{vaga.vaga}</h2>
                                    <p className="secondary-color">{vaga.tipo || "Tipo não informado"}</p>
                                    <p className="text-color">R${vaga.salario || "Salário não informado"}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <ErrorCard label="Nenhuma vaga encontrada." />
                    )}
                </div>
            )}
        </>
    );
}
