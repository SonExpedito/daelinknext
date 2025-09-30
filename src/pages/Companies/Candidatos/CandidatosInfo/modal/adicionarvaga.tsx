"use client";

import { motion } from "framer-motion";
import { useUIStore } from "@/src/components/store/modalstore";
import Button from "@/src/components/elements/buttons/button";
import type { Vaga } from "@/src/components/types/bdtypes";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  readonly empresaId: string;
  readonly pcdId: string;
  readonly onClose?: () => void;
}

export default function AdicionarVagaModal({ empresaId, pcdId, onClose }: Props) {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);

  useEffect(() => {
    async function fetchVagas() {
      try {
        setLoading(true);
        const res = await axios.post<Vaga[]>("/list-vagas-abertas", { empresaId });
        setVagas(res.data);
      } catch {
        openModal("Erro ao carregar vagas.");
        setTimeout(() => closeModal(), 1500);
      } finally {
        setLoading(false);
      }
    }
    fetchVagas();
  }, [empresaId, openModal, closeModal]);

  async function handleAdicionar(vagaId: string, vagaNome: string) {
    try {
      await axios.post("/add-pcd-processo", { vagaId, pcdId, empresaId, vagaTitulo: vagaNome });
      openModal("Candidato (a) adicionado à vaga!");
      setTimeout(() => closeModal(), 1200);
      if (onClose) onClose(); // fecha modal
    } catch {
      openModal("Erro ao adicionar processo.");
      setTimeout(() => closeModal(), 1500);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative w-full max-w-2xl rounded-2xl p-6 shadow-xl border border-white/30"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
        }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-white/20 pb-3 relative">
          <h2 className="text-xl font-semibold text-white">Selecionar vaga</h2>
          <button
            onClick={onClose}
            className="text-color transition hover:text-white absolute right-0"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Lista de vagas */}
        <div className="mt-5 max-h-80 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          {(() => {
            if (loading) {
              return (
                <div className="h-42 w-full flex justify-center items-center ">
                  <motion.div
                    className="w-12 h-12 border-4 border-t-[#2469F5] border-white/30 rounded-full mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  ></motion.div>
                </div>
              );
            }
            if (vagas.length > 0) {
              return vagas.map((vaga) => (
                <div
                  key={vaga.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
                >
                  <div>
                    <p className="text-white font-medium">{vaga.vaga}</p>
                    <p className="text-white/70 text-sm">{vaga.area}</p>
                  </div>
                  <Button
                    type="button"
                    label="Adicionar"
                    className="background-green"
                    onClick={() => {
                      if (vaga.id && vaga.vaga) {
                        handleAdicionar(vaga.id, vaga.vaga);
                      }
                    }}
                  />
                </div>
              ));
            }
            return <p className="text-white/70 text-center">Nenhuma vaga aberta encontrada.</p>;
          })()}
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex justify-end">
          <Button type="button" label="Cancelar" className="bg-gray-400" onClick={onClose} />
        </div>
      </motion.div>
    </div>
  );
}
