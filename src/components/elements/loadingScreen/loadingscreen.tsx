"use client";

import { motion, AnimatePresence } from "framer-motion";

type LoadingScreenProps = {
  isLoading: boolean;
  message?: string;
};

export default function loadingScreen({
  isLoading,
  message = "Carregando...",
}: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/20" // Apenas overlay preto
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Card Liquid Glass */}
          <motion.div
            className="relative w-64 max-w-[90%] rounded-2xl p-6 shadow-xl border border-white/30 flex flex-col items-center"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Spinner */}
            <motion.div
              className="w-12 h-12 border-4 border-t-[#2469F5] border-white/30 rounded-full mb-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            ></motion.div>

            {/* Mensagem */}
            <p className="text-center text-color font-bold text-lg">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
