"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/src/components/store/modalstore";

export default function Modal() {
  const {
    modalOpen,
    modalMessage,
    modalType,
    onConfirmCallback,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    closeModal,
  } = useUIStore();

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal} // fechar ao clicar no overlay
        >
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
            onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
          >
            <p className="text-center text-white text-lg">{modalMessage}</p>

            {modalType === "confirm" && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirmCallback?.();
                    closeModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2469F5] hover:bg-[#1e4f8c] text-white shadow-md"
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
