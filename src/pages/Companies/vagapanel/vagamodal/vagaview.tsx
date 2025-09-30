"use client";

// removed useState (not needed after lifting edit modal logic)
import { useRouter } from "next/navigation";
import { useUIStore } from "@/src/components/store/modalstore";
import Button from "@/src/components/elements/buttons/button";
import type { Vaga } from "@/src/components/types/bdtypes";
import { motion } from "framer-motion"; // AnimatePresence removido pois não é usado

interface VagaViewModalProps {
  readonly vaga: Vaga;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUpdated?: (vaga: Partial<Vaga>) => void;
  readonly onEdit?: (vaga: Vaga) => void;
}

export default function VagaViewModal({ vaga, isOpen, onClose, onUpdated, onEdit }: VagaViewModalProps) {
  const router = useRouter();
  const openModal = useUIStore(s => s.openModal);
  const closeModal = useUIStore(s => s.closeModal);

  const handleEdit = () => {
    if (onEdit) onEdit(vaga);
  };

  const handleEncerrar = async () => {
    if (vaga.status === 'fechada' || vaga.status === 'encerrada') {
      openModal('Já fechada.');
      setTimeout(() => closeModal(), 1000);
      return;
    }
    try {
      const res = await fetch('/update-vaga', {
        method: 'POST',
        body: (() => { const f = new FormData(); f.append('id', vaga.id); f.append('status', 'fechada'); return f; })()
      });
      if (!res.ok) throw new Error('Falha ao encerrar');
      openModal('Vaga fechada.');
      setTimeout(() => closeModal(), 1200);
      if (onUpdated) onUpdated({ id: vaga.id, status: 'fechada' });
      onClose();
    } catch (e) {
      console.error(e);
      openModal('Erro ao fechar.');
      setTimeout(() => closeModal(), 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-3xl rounded-2xl p-6 shadow-xl border border-white/30 background-primary"
        >
          <div className="flex items-center justify-center gap-12  border-b border-white/20 pb-3 relative">
              <img src={vaga.img || "/errors/bannererror.png"} alt={vaga.vaga || "VAGA não informada"} className="object-cover h-24 w-40 rounded-2xl" />

            <h2 className="text-2xl font-bold text-color">{vaga.vaga}</h2>
            <button onClick={onClose} className="text-color transition hover:text-white absolute right-4 cursor-pointer" aria-label="Fechar modal">✕</button>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-sm text-color">
              <p><span className="font-semibold">Área:</span> {vaga.area || '-'} </p>
              <p><span className="font-semibold">Status:</span> {vaga.status} </p>
              <p><span className="font-semibold">Tipo:</span> {vaga.tipo || '-'} </p>
              <p><span className="font-semibold">Salário:</span> {vaga.salario ? `R$ ${vaga.salario}` : '-'} </p>

            </div>
            <div className="max-h-56 overflow-y-auto pr-2 text-sm custom-scrollbar text-color">
              <p className="pb-4"><span className="font-semibold">Local:</span> {vaga.local || '-'} </p>
              <p className="mb-1 font-semibold">Descrição</p>
              <p className="whitespace-pre-wrap leading-relaxed">{vaga.descricao || 'Sem descrição.'}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button label="Visualizar Processos" onClick={() => router.push(`/processospanel/${vaga.id}`)} className="background-blue" />
            <Button label="Editar" onClick={handleEdit} className="background-green" />
            <Button
              label={(vaga.status === 'fechada' || vaga.status === 'encerrada') ? 'Fechada' : 'Fechar'}
              disabled={vaga.status === 'fechada' || vaga.status === 'encerrada'}
              onClick={handleEncerrar}
              className="bg-red-400 hover:bg-red-500 disabled:opacity-50"
            />

          </div>
        </motion.div>
      </div>

      {/* O modal de edição agora é controlado pelo componente pai (page.tsx) */}
    </>
  );
}

