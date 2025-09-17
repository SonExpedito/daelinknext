"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PCD } from "@/src/components/types/bdtypes";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import SearchBar from '@/src/components/elements/searchbar/searchbar';
import { useUIStore } from '@/src/components/store/modalstore';
import ErrorCard from '@/src/components/elements/errorcard/errorcard';
import axios from 'axios';
import { MagicButton } from '@/src/components/elements/magicButton/magicButton';

export default function CandidatosPage() {

  const [pcds, setPcds] = useState<PCD[]>([]);
  const [filteredPcds, setFilteredPcds] = useState<PCD[]>([]);
  const [originalPcds, setOriginalPcds] = useState<PCD[]>([]);
  const [magicMode, setMagicMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // <- termo da barra de busca
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  // Carrega todos os PCDs na primeira vez
  useEffect(() => {
    const getPcds = async () => {
      try {
        const response = await axios.get<PCD[]>("/get-pcdall");
        setPcds(response.data);
        setFilteredPcds(response.data);
      } catch (error) {
        openModal("Erro ao buscar PCDs.");
        setTimeout(() => closeModal(), 1200);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPcds();
  }, []);

  // ---- Função única de busca ----
  const handleSearch = async (query: string) => {
    setSearchTerm(query); // salva o último termo digitado

    const termo = (query || "").trim().toLowerCase();

    // se Modo Mágico estiver ativo: busca na API de recomendação
    if (magicMode) {
      if (!termo) {
        openModal("Digite algo para recomendação.");
        setTimeout(() => closeModal(), 1500);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post<PCD[]>('http://localhost:5000/recommend', {
          trabalho: termo // parâmetro que o Flask precisa
        });
        setFilteredPcds(response.data);
      } catch (error) {
        console.error('Erro ao buscar recomendações', error);
        openModal("Erro ao buscar recomendações.");
        setTimeout(() => closeModal(), 1500);
      } finally {
        setLoading(false);
      }
      return;
    }

    // busca normal local
    if (!termo) {
      setFilteredPcds(pcds);
      return;
    }

    const filtradas = pcds.filter(
      (pcd) =>
        (pcd.name || "").toLowerCase().includes(termo) ||
        (pcd.trabalho || "").toLowerCase().includes(termo)
    );
    setFilteredPcds(filtradas);
  };

  const toggleMagic = () => {
    if (magicMode) {
      setMagicMode(false);
      handleSearch(searchTerm);
    } else {
      // Ativando: guarda lista atual p/ se quiser restaurar e dispara a recomendação
      setOriginalPcds(filteredPcds);
      setMagicMode(true);
      handleSearch(searchTerm);
    }
  };

  const PcdDetalhes = (id: string) => {
    router.push(`/candidato/${id}`);
  };

  return (
    <>
      <div className="w-full h-auto py-20 flex flex-col items-center justify-center gap-12">
        <h1 className="text-5xl secondary-color font-bold">Candidatos</h1>
        <SearchBar onSearch={handleSearch} placeholder="Busque um candidato ou descrição" />
        <MagicButton onToggle={toggleMagic} active={magicMode} />
      </div>

      {loading ? (
        <Carregamento />
      ) : (
        <div
          className={`w-full pb-8 ${
            filteredPcds.length > 0
              ? "min-h-screen grid grid-cols-3 justify-items-center content-start gap-y-12"
              : "h-[30rem] flex items-start justify-center"}`}
        >
          {filteredPcds.length > 0 ? (
            filteredPcds.map((pcd) => (
              <button
                key={pcd.id}
                onClick={() => pcd.id && PcdDetalhes(pcd.id)}
                type="button"
                aria-label={`Ver detalhes do candidato ${pcd.name || ""}`}
                title={pcd.name || "Ver detalhes do candidato"}
                className="w-72 h-[26rem] gap-3 rounded-3xl background-primary flex flex-col items-center 
                          justify-center overflow-hidden hover-size cursor-pointer card-border"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && pcd.id) {
                    PcdDetalhes(pcd.id);
                  }
                }}
              >
                <img src={pcd.imageUrl || "/errors/profileimg.png"} alt={`Imagem do candidato ${pcd.name || ""}`}
                  className='h-[66%] w-[80%] rounded-3xl object-cover bannershadow'
                />
                <div className='flex flex-col items-center justify-center gap-1'>
                  <p className='text-color text-lg'>{pcd.name}</p>
                  <h1 className='secondary-color  text-2xl font-bold'>{pcd.trabalho}</h1>
                </div>
              </button>
            ))
          ) : (
            <ErrorCard label="Nenhuma PCD encontrada." />
          )}
        </div>
      )}
    </>
  );
}
