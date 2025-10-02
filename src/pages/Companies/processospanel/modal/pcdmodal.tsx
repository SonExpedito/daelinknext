"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/src/components/elements/buttons/button";
import type { Processo, Chat } from "@/src/components/types/bdtypes";
import axios from "axios";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import DocumentosModal from "./documentomodal";
import SituacaoModal from "./situacaomodal";
import { useUIStore } from "@/src/components/store/modalstore";
import { useUserStore } from "@/src/components/store/userstore";

interface Props {
  processo: Processo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PcdModal({ processo, isOpen, onClose }: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [situacaoModal, setSituacaoModal] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);

  const userProfile = useUserStore((state) => state.userProfile);
  const router = useRouter();
  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);

  // 🔹 Busca chat existente assim que o modal abrir
  useEffect(() => {
    if (!isOpen || !processo?.processo?.id) return;

    const fetchChat = async () => {
      try {
        const res = await axios.post("/get-chat", { processoId: processo.processo.id });
        const data = res.data as { empty: boolean; data?: Chat };
        setChat(!data.empty && data.data ? data.data : null);
      } catch (err) {
        console.error("Erro ao buscar chat:", err);
        setChat(null);
      }
    };

    fetchChat();
  }, [isOpen, processo]);

  if (!isOpen || !processo) return null;

  // 🔹 Criar ou abrir chat
  const handleChat = async () => {
    if (!processo?.pcd?.id || !userProfile?.id || !processo?.processo?.id) return;

    try {
      setLoading(true);
      openModal("Abrindo chat...");

      // Se já existe, vai direto
      if (chat) {
        closeModal();
        onClose();
        router.push(`/chat/${chat.id}`);
        return;
      }

      // Senão cria novo chat
      const res = await axios.post("/create-chat", {
        empresaId: userProfile.id,
        pcdId: processo.pcd.id,
        processoId: processo.processo.id,
      });

      if (res.status === 200) {
        const { chatId } = res.data as { chatId: string };
        // Fecha modal e redireciona **antes** de atualizar o estado
        closeModal();
        onClose();
        router.push(`/chat/${chatId}`);

        // Atualiza o estado depois
        setChat({
          id: chatId,
          processoId: processo.processo.id,
          empresaId: userProfile.id,
          pcdId: processo.pcd.id,
        });
      }
    } catch (err) {
      console.error("Erro ao abrir/criar chat:", err);
      closeModal();
      openModal("Erro ao abrir chat.");
      setTimeout(() => closeModal(), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSituacao = async (novaSituacao: "Aprovado" | "Encerrado") => {
    if (!processo?.processo?.id) return;

    try {
      setLoading(true);
      openModal("Atualizando situação...");

      const res = await axios.put("/situacao-processo", {
        situacao: novaSituacao,
        processoId: processo.processo.id,
      });

      if (res.status === 200) {
        processo.processo.situacao = novaSituacao;
        closeModal();
        setSituacaoModal(false);
      }
    } catch (err) {
      console.error("Erro ao atualizar situação:", err);
      closeModal();
      openModal("Erro ao atualizar situação.");
      setTimeout(() => closeModal(), 1500);
    } finally {
      setLoading(false);
    }
  };

  const getSituacaoClass = (situacao?: string) => {
    switch (situacao) {
      case "Pendente": return "bg-gray-500";
      case "Encerrado": return "bg-red-400";
      case "Aprovado": return "background-green";
      default: return "bg-gray-500";
    }
  };

  let chatButtonLabel = "Criar Chat";
  if (loading) {
    chatButtonLabel = "Carregando...";
  } else if (chat) {
    chatButtonLabel = "Abrir Chat";
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        data-role="modal"
        aria-modal="true"
        aria-labelledby="pcd-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      >
        <div className="w-[32rem] rounded-2xl background-primary p-6 flex flex-col gap-6 relative">
          <img
            src={processo.pcd?.imageUrl || "/errors/profileimg.png"}
            alt={`Foto de ${processo.pcd?.name}`}
            className="w-full h-64 object-cover rounded-xl"
          />

          <div className="text-center flex flex-col items-center gap-2">
            <h2 id="pcd-modal-title" className="text-2xl font-bold secondary-color">{processo.pcd?.name}</h2>
            <p className="text-color text-lg">{processo.pcd?.email}</p>
            <p className="text-xl text-gray-400">{processo.pcd?.trabalho}</p>

            <h1 className={`w-1/4 mt-2 text-lg font-bold p-1 px-3 rounded-full text-white ${getSituacaoClass(processo.processo?.situacao)}`}>
              {processo.processo?.situacao}
            </h1>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={() => setSituacaoModal(true)}
              label="Alterar Situação"
              className="bg-green-500 hover:bg-green-600"
            />

            <Button
              onClick={() => setDocsOpen(true)}
              label="Ver Docs"
              className="bg-gray-400 hover:bg-gray-500"
            />

            <Button
              onClick={handleChat}
              disabled={loading}
              label={
                <>
                  <MessagesSquare />
                  {chatButtonLabel}
                </>
              }
              className="background-blue"
            />
          </div>

          <button
            onClick={onClose}
            className="text-color transition hover:text-white absolute top-4 right-4 cursor-pointer"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>
      </motion.div>

      <DocumentosModal
        processoid={processo.processo.id}
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

      <SituacaoModal
        isOpen={situacaoModal}
        onClose={() => setSituacaoModal(false)}
        onConfirm={handleUpdateSituacao}
      />
    </>
  );
}
