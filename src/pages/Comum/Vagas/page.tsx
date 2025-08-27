"use client";

import SearchBar from '@/src/components/elements/searchbar/searchbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './vagas.css'
import { useRouter } from 'next/navigation';
import Carregamento from '@/src/components/elements/carregamento/carregamento';


interface Empresa {
    imageUrl?: string;
    imageProfile?: string;
    name?: string;
}

interface Vaga {
    id: string;
    vaga: string;
    tipo?: string;
    salario?: string;
    empresa?: Empresa | null;
}

export default function VagasPage() {
    const [vagas, setVagas] = useState<Vaga[]>([]); // <- tipagem explícita
    const [loading, setLoading] = useState(true);
    const bannererror = 'https://storage.googleapis.com/star-lab/blog/OGs/image-not-found.png'

    const handleSearch = (query: string) => {
        console.log("Buscando:", query);
    };

    const router = useRouter();

    useEffect(() => {
        const getVagas = async () => {
            try {
                const response = await axios.get<Vaga[]>("/get-vagasall"); // opcional: tipar axios
                setVagas(response.data);
            } catch (error) {
                console.error("Erro ao buscar vagas com empresas:", error);
            } finally {
                setLoading(false);
            }
        };

        getVagas();
    }, []);

    const VagaDetalhes = (id: string) => {
        router.push(`/vagas/${id}`);
    }

    return (
        <>
            <div className="w-full h-auto py-20 flex flex-col items-center justify-center gap-12">
                <h1 className='text-5xl secondary-color font-bold'>Vagas</h1>
                <SearchBar onSearch={handleSearch} placeholder='Busque uma vaga específica' />

            </div>


            {loading ? (
                <Carregamento />
            ) : (
                <div className='h-auto w-full grid justify-items-center content-center grid-cols-3 gap-y-12 pb-8'>
                    {vagas.map((vaga) => (
                        <div key={vaga.id}
                            onClick={() => VagaDetalhes(vaga.id)}
                            className='w-90 h-40 p-4 rounded-3xl background-primary flex items-center justify-center overflow-hidden hover-size cursor-pointer card-border'>
                            <div className='h-full w-[48%] flex items-center justify-center '>
                                <img src={vaga.empresa?.imageProfile || bannererror} className='object-contain h-4/5 rounded-2xl'
                                    alt={vaga.empresa?.name || "Empresa não informada"} />
                            </div>
                            <div className='h-full w-[52%] flex flex-col gap-1 pl-4 justify-center'>
                                <h2 className='text-xl font-semibold text-color'>{vaga.vaga}</h2>
                                <p className='secondary-color'>{vaga.tipo || "Tipo não informado"}</p>
                                <p className='text-color'>R${vaga.salario || "Salário não informado"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </>

    );
}
