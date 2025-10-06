"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input, TextareaAutoResize } from "@/src/components/elements/input/input";
import type { Empresa } from "@/src/components/types/bdtypes";
import { X } from "lucide-react";
import { useUIStore } from "@/src/components/store/modalstore";
import Button from "@/src/components/elements/buttons/button";
import axios from "axios";
import RamosAutoComplete from "@/src/components/form/RamosEmpresas/ramoautocomplete";
import IMask from "imask";

type EditarPerfilEmpresaProps = {
  readonly empresa: Empresa;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUpdated?: (updated: Partial<Empresa>) => void;
};

export default function EditarPerfilEmpresa({
  empresa,
  isOpen,
  onClose,
  onUpdated,
}: EditarPerfilEmpresaProps) {
  const [formData, setFormData] = useState<Empresa>(empresa);

  const [imageUrlFile, setImageUrlFile] = useState<File | null>(null);
  const [imageProfileFile, setImageProfileFile] = useState<File | null>(null);
  const [sobreimgFile, setSobreimgFile] = useState<File | null>(null);

  const [previewProfile, setPreviewProfile] = useState<string>(empresa.imageUrl || "/placeholder-profile.png");
  const [previewBanner, setPreviewBanner] = useState<string>(empresa.imageProfile || "/placeholder-banner.png");
  const [previewSobre, setPreviewSobre] = useState<string>(empresa.sobreimg || "/placeholder-banner.png");

  const [loading, setLoading] = useState(false);

  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);

  if (!isOpen) return null;

  const handleChange = (key: keyof Empresa, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMaskedChange = (key: keyof Empresa, value: string, mask: string) => {
    const masked = IMask.createMask({ mask }).resolve(value);
    setFormData((prev) => ({ ...prev, [key]: masked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "imageProfile" | "imageUrl" | "sobreimg") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (type === "imageProfile") {
        setPreviewBanner(result);
        setImageProfileFile(file);
      } else if (type === "imageUrl") {
        setPreviewProfile(result);
        setImageUrlFile(file);
      } else {
        setPreviewSobre(result);
        setSobreimgFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const buildFormData = (src: Empresa) => {
    const data = new FormData();
    data.append("uid", src.id || "");

    const ignored = new Set(["imageProfile", "imageUrl", "sobreimg", "id"]);
    Object.entries(src as Record<string, unknown>).forEach(([key, value]) => {
      if (ignored.has(key)) return;
      if (value !== undefined && value !== null && typeof value !== "object") {
        data.append(key, String(value));
      }
    });

    if (imageUrlFile) data.append("imageUrl", imageUrlFile);
    if (imageProfileFile) data.append("imageProfile", imageProfileFile);
    if (sobreimgFile) data.append("sobreimg", sobreimgFile);

    return data;
  };

  type UpdateResponse = { imageProfile?: string; imageUrl?: string; sobreimg?: string };

  const putEmpresa = async (data: FormData): Promise<UpdateResponse> => {
    const res = await axios.put<UpdateResponse>("/editar-empresa", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.status !== 200) throw new Error("Erro ao atualizar perfil.");
    return res.data || {};
  };

  const applyUpdates = (payload: UpdateResponse) => {
    const { imageProfile, imageUrl, sobreimg } = payload;

    const updatedData: Partial<Empresa> = {
      ...formData,
      ...(imageProfile ? { imageProfile } : {}),
      ...(imageUrl ? { imageUrl } : {}),
      ...(sobreimg ? { sobreimg } : {}),
    };

    setFormData((prev) => ({ ...prev, ...updatedData }));
    if (imageProfile) setPreviewBanner(imageProfile);
    if (imageUrl) setPreviewProfile(imageUrl);
    if (sobreimg) setPreviewSobre(sobreimg);

    openModal("Perfil atualizado com sucesso!");
    setTimeout(() => closeModal(), 1200);
    onUpdated?.(updatedData);
    onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = buildFormData(formData);
      const resp = await putEmpresa(data);
      applyUpdates(resp);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      openModal("Falha ao salvar alterações.");
      setTimeout(() => closeModal(), 1500);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl rounded-3xl p-6 shadow-xl border border-white/30 background-primary overflow-y-auto max-h-[95vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-color hover:text-white transition" aria-label="Fechar modal">
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-color">Editar Perfil da Empresa</h2>

        {/* 🔹 Imagens principais */}
        <div className="h-fit w-fit flex items-center justify-center relative mb-12 mx-auto">
          {/* Banner */}
          <label className="relative cursor-pointer group">
            <img
              src={previewBanner}
              alt="Banner principal"
              className="w-[32rem] h-58 object-cover rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
              <span className="font-medium text-base">Alterar imagem</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "imageProfile")} />
          </label>

          {/* Logo */}
          <div className="absolute flex items-center justify-center rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300 h-40 w-40 mt-40">
            <label className="relative cursor-pointer w-full h-full flex group">
              <img src={previewProfile} alt="Logo da empresa" className="h-full w-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                <span className="font-medium text-sm">Alterar logo</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "imageUrl")} />
            </label>
          </div>
        </div>

        {/* 🔹 Campos */}
        <div className="flex flex-col items-center gap-4 text-color">
          <Input label="Nome da Empresa" className="w-[80%]" value={formData.name ?? ""} onChange={(v) => handleChange("name", v)} />
          <Input label="CNPJ" className="w-[80%]" value={formData.cnpj ?? ""} readOnly disabled onChange={() => { }} />
          <Input label="E-mail" type="email" className="w-[80%]" value={formData.email ?? ""} onChange={(v) => handleChange("email", v)} />
          <Input label="Telefone" className="w-[80%]" value={formData.telefone ?? ""} onChange={(v) => handleMaskedChange("telefone", v, "(00) 00000-0000")} />
          <Input label="CEP" className="w-[80%]" value={formData.cep ?? ""} onChange={(v) => handleMaskedChange("cep", v, "00000-000")} />
          <Input label="Endereço" className="w-[80%]" value={(formData as any).endereco ?? ""} onChange={(v) => handleChange("endereco" as any, v)} />
          <RamosAutoComplete data={formData} setData={setFormData} bgClassName="input-background" />
          <TextareaAutoResize label="Sobre a Empresa" value={formData.sobre ?? ""} className="!w-[80%]" onChange={(v) => handleChange("sobre", v)} />
          <TextareaAutoResize label="Descrição da Empresa" value={formData.descricao ?? ""} className="!w-[80%]" onChange={(v) => handleChange("descricao", v)} />

          {/* 🔹 Sobre Imagem */}
          <label className="w-[80%] flex flex-col gap-2 text-left">
            <span className="font-medium text-color">Imagem Sobre</span>
            <div className="relative cursor-pointer group w-full flex items-center justify-center">
              <img src={previewSobre} alt="Imagem Sobre" className="rounded-3xl h-52 w-full object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                <span className="font-medium text-base">Alterar imagem</span>
              </div>
              <input type="file" accept="image/*" className="hidden absolute inset-0" onChange={(e) => handleFileChange(e, "sobreimg")} />
            </div>
          </label>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          <Button label="Cancelar" className="bg-gray-400 hover:bg-gray-500" onClick={onClose} />
          <Button label={loading ? "Salvando..." : "Salvar"} disabled={loading} className="background-blue" onClick={handleSave} />
        </div>
      </div>
    </motion.div>
  );
}
