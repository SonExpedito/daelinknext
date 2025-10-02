// SituacaoModal.tsx
"use client";

import { FC } from "react";
import Button from "@/src/components/elements/buttons/button";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (novaSituacao: "Aprovado" | "Encerrado") => Promise<void>;
}

const SituacaoModal: FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-role="modal"
      aria-modal="true"
      aria-labelledby="situacao-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="w-80 rounded-2xl background-primary p-6 flex flex-col gap-6 relative">
        {/* Título */}
        <h2 id="situacao-modal-title" className="text-2xl font-bold secondary-color text-center">Alterar Situação</h2>

        {/* Botões de ação */}
        <div className="flex justify-around gap-4">
          <Button
            onClick={() => onConfirm("Aprovado")}
            label="Aprovar"
            className="background-green hover:bg-green-600"
          />
          <Button
            onClick={() => onConfirm("Encerrado")}
            label="Recusar"
            className="bg-red-400 hover:bg-red-500"
          />
        </div>

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="text-color transition hover:text-white absolute top-4 right-4 cursor-pointer"
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default SituacaoModal;
