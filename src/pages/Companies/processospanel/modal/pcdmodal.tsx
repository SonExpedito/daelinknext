"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/src/components/elements/buttons/button";
import type { Processo } from "@/src/components/types/bdtypes";
import axios from "axios";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import DocumentosModal from "./documentomodal";
import SituacaoModal from "./situacaomodal";

interface Props {
  processo: Processo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PcdModal({ processo, isOpen, onClose }: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [situacaoModal, setSituacaoModal] = useState(false);
  const router = useRouter();

  if (!isOpen || !processo) return null;

  // 🔹 Abrir/entrar no chat
  const handleChat = async () => {
    if (!processo.pcdId || !processo.empresaId || !processo.id) return;

    try {
      setLoading(true);

      if (processo.chat) {
        router.push(`/chat/${processo.chat.id}`);
        return;
      }

      const res = await axios.post("/create-chat", {
        empresaId: processo.empresaId,
        pcdId: processo.pcdId,
        processoId: processo.id,
      });

      if (res.status === 200) {
        const { chatId } = res.data as { chatId: string };
        router.push(`/chat/${chatId}`);
      }
    } catch (err) {
      console.error("Erro ao abrir/criar chat:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualizar situação via rota
  const handleUpdateSituacao = async (novaSituacao: "Aprovado" | "Encerrado") => {
    if (!processo?.processo?.id) return;

    try {
      setLoading(true);
      const res = await axios.put("/situacao-processo", {
        situacao: novaSituacao,
        processoId: processo.processo.id, // 🔹 envia apenas o ID
      });

      if (res.status === 200) {
        processo.processo.situacao = novaSituacao; // atualiza localmente
        setSituacaoModal(false);
      }
    } catch (err) {
      console.error("Erro ao atualizar situação:", err);
    } finally {
      setLoading(false);
    }
  };


  // 🔹 Classes da situação
  const getSituacaoClass = (situacao?: string) => {
    switch (situacao) {
      case "Pendente":
        return "bg-gray-500";
      case "Encerrado":
        return "bg-red-400";
      case "Aprovado":
        return "background-green";
      default:
        return "bg-gray-500";
    }
  };

  // 🔹 Label do botão de chat
  let chatButtonLabel;
  if (loading) {
    chatButtonLabel = (
      <>
        <MessagesSquare /> Carregando...
      </>
    );
  } else if (processo.chat) {
    chatButtonLabel = (
      <>
        <MessagesSquare /> Abrir Chat
      </>
    );
  } else {
    chatButtonLabel = (
      <>
        <MessagesSquare /> Criar Chat
      </>
    );
  }

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-[32rem] rounded-2xl background-primary p-6 flex flex-col gap-6 relative"
        >
          {/* Foto */}
          <img
            src={processo.pcd?.imageUrl || "/errors/profileimg.png"}
            alt={`Foto de ${processo.pcd?.name}`}
            className="w-full h-64 object-cover rounded-xl"
          />

          {/* Infos */}
          <div className="text-center flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold secondary-color">{processo.pcd?.name}</h2>
            <p className="text-color text-lg">{processo.pcd?.email}</p>
            <p className="text-xl text-gray-400">{processo.pcd?.trabalho}</p>

            {/* Situação com classe dinâmica */}
            <h1
              className={`w-1/4 mt-2 text-lg font-bold p-1 px-3 rounded-full text-white ${getSituacaoClass(
                processo.processo?.situacao
              )}`}
            >
              {processo.processo?.situacao}
            </h1>
          </div>

          {/* Botões */}
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
              label={chatButtonLabel}
              className="background-blue"
            />


          </div>

          {/* Fechar */}
          <button
            onClick={onClose}
            className="text-color transition hover:text-white absolute top-4 right-4 cursor-pointer"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </motion.div>
      </div>

      {/* Modal de Documentos */}
      <DocumentosModal
        processoid={processo.processo.id}
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

      {/* Modal de Situação */}
      <SituacaoModal
        isOpen={situacaoModal}
        onClose={() => setSituacaoModal(false)}
        onConfirm={handleUpdateSituacao}
      />
    </>
  );
}
