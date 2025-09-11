'use client'

import SearchBar from '@/src/components/elements/searchbar/searchbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/src/components/store/modalstore';
import type { Empresa} from "@/src/components/types/bdtypes";
import axios from 'axios';
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import ErrorCard from '@/src/components/elements/errorcard/errorcard';


export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);



    useEffect(() => {
        const getEmpresas = async () => {
            try {
                const response = await axios.get<Empresa[]>("/get-companyall");
                setEmpresas(response.data);
                setFilteredEmpresas(response.data);
            } catch (error) {
                openModal("Erro ao buscar Empresas.");
                setTimeout(() => closeModal(), 1200);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getEmpresas();
    }, []);

    const EmpresaDetalhes = (id: string) => {
        router.push(`/empresas/${id}`);
    };

    const handleSearch = (query: string) => {
        const termo = (query || "").trim().toLowerCase();

        if (!termo) {
            setFilteredEmpresas(empresas); // reset
            return;
        }

        const filtradas = empresas.filter(
            (empresa) =>
                (empresa.name || "").toLowerCase().includes(termo) ||
                (empresa.area || "").toLowerCase().includes(termo)
        );

        setFilteredEmpresas(filtradas);
    };

    return (
        <>
            <div className="w-full h-auto py-20 flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl secondary-color font-bold">Empresas</h1>
                <SearchBar onSearch={handleSearch} placeholder="Busque uma Empresa" />
            </div>
            {loading ? (
                <Carregamento />
            ) : (
                <div
                    className={`w-full pb-8 
                        ${filteredEmpresas.length > 0
                            ? "min-h-screen grid grid-cols-3 justify-items-center content-start gap-y-12"
                            : "h-[30rem] flex items-start justify-center"}`}
                >
                    {filteredEmpresas.length > 0 ? (
                        filteredEmpresas.map((empresa) => (
                            <div key={empresa.id}
                                onClick={() => empresa.id && EmpresaDetalhes(empresa.id)}
                                tabIndex={0}
                                role="button"
                                onKeyDown={(e) => {
                                    if ((e.key === "Enter" || e.key === " ") && empresa.id) {
                                        EmpresaDetalhes(empresa.id);
                                    }
                                }}
                                className="flex flex-col h-72 w-80 card-border
                                items-center justify-center cursor-pointer hover-size overflow-hidden gap-4 ">

                                <img src={empresa.imageProfile || "/errors/bannererror.png"} alt={empresa.name || "Empresa não informada"}
                                    className="object-contain h-[70%] rounded-3xl bannershadow" />

                                <div className='flex flex-col items-center justify-center'>
                                    <p className="text-color font-medium text-lg ">{empresa.area}</p>
                                    <h2 className="text-xl font-bold primary-color uppercase ">{empresa.name}</h2>
                                </div>
                            </div>
                        ))
                    ) : (
                        <ErrorCard label="Nenhuma Empresa encontrada." />
                    )}
                </div>


            )}
        </>
    );
}   