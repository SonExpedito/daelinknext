"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "display" | "confirm";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function Modal({
  isOpen,
  onClose,
  message,
  type = "display",
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Card Liquid Glass */}
          <motion.div
            className="relative w-96 max-w-[90%] rounded-2xl p-6 shadow-xl border border-white/30"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Mensagem */}
            <p className="text-center text-white text-lg">{message}</p>

            {/* Botões se for modal de confirmação */}
            {type === "confirm" && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                >
                  {confirmText}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
