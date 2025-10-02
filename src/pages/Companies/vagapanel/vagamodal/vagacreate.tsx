"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/elements/buttons/button";
import { Input, TextareaAutoResize, Select } from "@/src/components/elements/input/input";
import type { Vaga } from "@/src/components/types/bdtypes";
import { useUIStore } from "@/src/components/store/modalstore";
import { motion } from "framer-motion";

interface VagaCreateModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly empresaId: string;
  readonly onSave?: (vaga: Partial<Vaga>) => void;
  readonly vaga?: Vaga | null;
}

export default function VagaCreateModal({
  isOpen,
  onClose,
  empresaId,
  onSave,
  vaga,
}: VagaCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vaga>>({
    vaga: "",
    tipo: "",
    salario: "",
    local: "",
    area: "",
    descricao: "",
    img: "",
    status: "Aberta",
  });
  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);

  useEffect(() => {
    if (vaga && isOpen) {
      setFormData({
        id: vaga.id,
        vaga: vaga.vaga || "",
        tipo: vaga.tipo || "",
        salario: vaga.salario || "",
        local: vaga.local || "",
        area: vaga.area || "",
        descricao: vaga.descricao || "",
        img: vaga.img || "",
        status: vaga.status || "Aberta",
      });
      if (vaga.img) setPreview(vaga.img);
      setFile(null);
    } else if (!vaga && isOpen) {
      setFormData({
        vaga: "",
        tipo: "",
        salario: "",
        local: "",
        area: "",
        descricao: "",
        img: "",
        status: "Aberta",
      });
      setPreview(null);
      setFile(null);
    }
  }, [vaga, isOpen]);

  const handleChange = (name: keyof Vaga, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = useCallback(async (): Promise<null> => null, []);

  const handleSave = useCallback(async () => {
    if (loading) return; // evita cliques duplos
    setLoading(true);
    openModal("Salvando vaga...");
    try {
      await uploadImage();

      const isEdit = Boolean(vaga?.id);
      const endpoint = isEdit ? "/update-vaga" : "/create-vaga";

      const form = new FormData();
      if (vaga?.id) form.append("id", vaga.id);
      form.append("empresaId", empresaId);
      form.append("vaga", formData.vaga || "");
      form.append("tipo", formData.tipo || "");
      form.append("salario", formData.salario || "");
      form.append("local", formData.local || "");
      form.append("area", formData.area || "");
      form.append("descricao", formData.descricao || "");
      form.append("status", formData.status || "Aberta");
      if (file) form.append("file", file);

      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) throw new Error("Falha no envio");

      const saved = await res.json();
      // Notifica sucesso
      openModal(isEdit ? "Vaga atualizada." : "Vaga criada.");
      setTimeout(() => closeModal(), 1200);

      // Atualiza estado pai (otimista) sem forçar refresh aqui
      if (onSave) onSave(saved);

      // Fecha modal de criação/edição logo após salvar
      onClose();
      // força revalidação de rota (caso existam server components) e eventual recarrego
      try { router.refresh(); } catch { }
    } catch (err) {
      console.error("Erro ao salvar vaga:", err);
      openModal("Erro ao salvar.");
      setTimeout(() => closeModal(), 1600);
    } finally {
      setLoading(false);
    }
  }, [loading, uploadImage, vaga?.id, formData, empresaId, onSave, onClose, openModal, closeModal]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-role="modal"
      aria-modal="true"
      aria-labelledby="vaga-create-modal-title"
      className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-3xl rounded-2xl p-6 shadow-xl border border-white/30 background-primary">
        <h2 className="mb-4 text-xl font-bold text-color">
          {vaga?.id ? "Editar Vaga" : "Criar Nova Vaga"}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Esquerda: imagem */}
          <div className="flex flex-col items-center justify-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-white/30 text-white/60">
                Nenhuma imagem selecionada
              </div>
            )}
            <label htmlFor="vaga-image-upload" className="mt-3 w-full text-center text-white/80 cursor-pointer">
              <span>Selecionar imagem</span>
              <input id="vaga-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" title="Selecione uma imagem para a vaga" />
            </label>

            <TextareaAutoResize
              label="Descrição"
              value={formData.descricao || ""}
              onChange={(v) => handleChange("descricao", v)}
            />
          </div>

          {/* Direita: campos */}
          <div className="flex flex-col gap-4 text-white">
            <Input
              label="Título da Vaga"
              type="text"
              value={formData.vaga || ""}
              onChange={(v) => handleChange("vaga", v)}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label="Formato"
                value={formData.tipo || ""}
                onChange={(v) => handleChange("tipo", v)}
              >
                <option className="text-black" value="Presencial">Presencial</option>
                <option className="text-black" value="Remoto">Remoto</option>
                <option className="text-black" value="Híbrido">Híbrido</option>
              </Select>
              <Input
                label="Local"
                type="text"
                value={formData.local || ""}
                onChange={(v) => handleChange("local", v)}
              />
              <Input
                label="Salário"
                type="number"
                value={formData.salario || ""}
                onChange={(v) => handleChange("salario", v)}
              />
              <Input
                label="Área"
                type="text"
                value={formData.area || ""}
                onChange={(v) => handleChange("area", v)}
              />
            </div>


            <div className="flex flex-col gap-2">
              <Select
                label="Status"
                value={formData.status || "Aberta"}
                onChange={(v) => handleChange("status", v)}
              >
                <option className="text-black" value="Aberta">Aberta</option>
                <option className="text-black" value="Fechada">Fechada</option>
              </Select>

            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                label="Cancelar"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-500"
              />
              {(() => {
                let label = "Salvar Vaga";
                if (vaga?.id) label = "Atualizar";
                return (
                  <Button
                    label={label}
                    onClick={handleSave}
                    className="background-green"
                    disabled={loading}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
