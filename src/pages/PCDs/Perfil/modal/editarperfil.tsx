"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Button from "@/src/components/elements/buttons/button";
import { Input, TextareaAutoResize, Select } from "@/src/components/elements/input/input";
import ToggleSwitch from "@/src/components/elements/switchToggle/switch";
import type { PCD } from "@/src/components/types/bdtypes";
import { X } from "lucide-react";
import { useUIStore } from "@/src/components/store/modalstore";
import { useRouter } from "next/navigation";

type EditarPerfilModalProps = {
    readonly user: PCD;
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onUpdated?: (updated: Partial<PCD>) => void;
};

export default function EditarPerfilModal({ user, isOpen, onClose, onUpdated }: EditarPerfilModalProps) {
    const [formData, setFormData] = useState<PCD>(user);
    const [imageUrlFile, setImageUrlFile] = useState<File | null>(null);
    const [imageProfileFile, setImageProfileFile] = useState<File | null>(null);
    const [previewProfile, setPreviewProfile] = useState<string>(user.imageUrl || "/placeholder-profile.png");
    const [previewBanner, setPreviewBanner] = useState<string>(user.imageProfile || "/placeholder-banner.png");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const openModal = useUIStore((s) => s.openModal);
    const closeModal = useUIStore((s) => s.closeModal);

    if (!isOpen) return null;

    const handleChange = (key: keyof PCD, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleTogglePerfil = () => {
        handleChange("perfilvertical", !formData.perfilvertical);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "imageProfile" | "imageUrl") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            if (type === "imageProfile") {
                setPreviewBanner(ev.target?.result as string);
                setImageProfileFile(file);
            } else {
                setPreviewProfile(ev.target?.result as string);
                setImageUrlFile(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append("uid", formData.id || "");

            // Não enviar URLs atuais como campos (evita duplicidade com o File)
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "imageProfile" || key === "imageUrl") return;
                if (value !== undefined && value !== null && typeof value !== "object") {
                    data.append(key, String(value));
                }
            });

            if (imageUrlFile) data.append("imageUrl", imageUrlFile);
            if (imageProfileFile) data.append("imageProfile", imageProfileFile);

            const res = await axios.put<{ imageProfile?: string; imageUrl?: string }>("/editar-pcd", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                const { imageProfile, imageUrl } = res.data || {};
                const updatedData: Partial<PCD> = {
                    ...formData,
                    ...(imageProfile ? { imageProfile } : {}),
                    ...(imageUrl ? { imageUrl } : {}),
                };

                setFormData((prev) => ({ ...prev, ...updatedData }));
                if (imageProfile) setPreviewBanner(imageProfile);
                if (imageUrl) setPreviewProfile(imageUrl);

                openModal("Perfil atualizado com sucesso!");
                setTimeout(() => closeModal(), 1200);
                onUpdated?.(updatedData);
                onClose();
            } else {
                openModal("Erro ao atualizar perfil.");
                setTimeout(() => closeModal(), 1200);
            }
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            openModal("Falha ao salvar alterações.");
            setTimeout(() => closeModal(), 1500);
        } finally {
            setLoading(false);
            router.refresh();
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
                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-color hover:text-white transition"
                    aria-label="Fechar modal"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-center mb-6 text-color">Editar Perfil</h2>

                {/* 🔹 Seção de imagens com preview */}
                <div className="h-fit w-fit flex items-center justify-center relative mb-28 mx-auto">
                    {/* Banner principal */}
                    <label className="relative cursor-pointer group">
                        <img
                            src={previewBanner}
                            alt="Banner principal"
                            className="w-[32rem] h-58 object-cover rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                            <span className="font-medium text-base">Alterar imagem</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "imageProfile")}
                        />
                    </label>

                    {/* Foto de perfil sobreposta */}
                    <div
                        className={`absolute flex items-center justify-center 
              rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
              hover:bg-white/20 transition duration-300
              ${formData.perfilvertical ? "w-40 h-[14.4rem] mt-24" : "h-40 w-40 mt-40"}
            `}
                    >
                        <label className="relative cursor-pointer w-full h-full flex group">
                            <img
                                src={previewProfile}
                                alt="Foto de perfil"
                                className="h-full w-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-[1.05]"
                            />
                            <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                                <span className="font-medium text-sm">Alterar foto</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "imageUrl")}
                            />
                        </label>
                    </div>

                    {/* Toggle perfil vertical/horizontal */}
                    <div className="flex flex-col items-center gap-3 absolute top-72">
                        <span className="text-sm text-color">
                            Perfil {formData.perfilvertical ? "Vertical" : "Horizontal"}
                        </span>
                        <ToggleSwitch checked={!!formData.perfilvertical} onChange={handleTogglePerfil} />
                    </div>
                </div>

                {/* 🔹 Campos */}
                <div className="flex flex-col gap-4 text-color">
                    <Input label="Nome" className="w-[80%]" value={formData.name ?? ""} onChange={(v) => handleChange("name", v)} />
                    <Input label="E-mail" type="email" className="w-[80%]" value={formData.email ?? ""} onChange={(v) => handleChange("email", v)} />
                    <Input label="Telefone" className="w-[80%]" value={formData.telefone ?? ""} onChange={(v) => handleChange("telefone", v)} />
                    <Input label="Cargo / Trabalho" className="w-[80%]" value={formData.trabalho ?? ""} onChange={(v) => handleChange("trabalho", v)} />

                    <Select
                        label="Deficiência"
                        value={formData.deficiencia ?? ""}
                        required
                        className="!w-[80%]"
                        onChange={(v) => handleChange("deficiencia", v)}
                    >
                        <option className="text-black" value="" disabled>
                            Selecione uma opção
                        </option>
                        <option className="text-black" value="Visual">
                            Visual
                        </option>
                        <option className="text-black" value="Fisica">
                            Física
                        </option>
                        <option className="text-black" value="Auditiva">
                            Auditiva
                        </option>
                        <option className="text-black" value="Intelectual">
                            Intelectual
                        </option>
                        <option className="text-black" value="Mental">
                            Mental
                        </option>
                        <option className="text-black" value="Múltipla">
                            Múltipla
                        </option>
                        <option className="text-black" value="Outra">
                            Outra
                        </option>
                    </Select>

                    <Select
                        label="Gênero"
                        className="!w-[80%]"
                        value={formData.genero ?? ""}
                        required
                        onChange={(v) => handleChange("genero", v)}
                    >
                        <option className="text-black" value="" disabled>
                            Selecione uma opção
                        </option>
                        <option className="text-black" value="Masculino">
                            Masculino
                        </option>
                        <option className="text-black" value="Feminino">
                            Feminino
                        </option>
                        <option className="text-black" value="Não-binário">
                            Não-binário
                        </option>
                        <option className="text-black" value="Transgênero">
                            Transgênero
                        </option>
                        <option className="text-black" value="Agênero">
                            Agênero
                        </option>
                        <option className="text-black" value="Prefiro não informar">
                            Prefiro não informar
                        </option>
                        <option className="text-black" value="Outro">
                            Outro
                        </option>
                    </Select>

                    <TextareaAutoResize
                        label="Sobre"
                        value={formData.sobre ?? ""}
                        className="!w-[80%]"
                        onChange={(v) => handleChange("sobre", v)}
                    />

                    <TextareaAutoResize
                        label="Descrição do trabalho"
                        value={formData.descrição ?? ""}
                        className="!w-[80%]"
                        onChange={(v) => handleChange("descrição", v)}
                    />

                    <div className="flex justify-center items-center gap-6 mt-2">
                        <span className="font-medium">Empresa Pick:</span>
                        <ToggleSwitch
                            checked={!!formData.empresapick}
                            onChange={() => handleChange("empresapick", !formData.empresapick)}
                        />

                        <span aria-hidden="true">i</span>
                        <span className="absolute bottom-full mb-2 hidden w-64 bg-gray-800 text-white text-sm 
                                 rounded-md p-2 text-center group-hover:block z-50">
                            Empresas podem adicionar você diretamente a um processo caso esta opção esteja habilitada.
                        </span>
                    </div>
                </div>

                {/* 🔹 Botões */}
                <div className="flex justify-center mt-6 gap-4">
                    <Button label="Cancelar" className="bg-gray-400 hover:bg-gray-500" onClick={onClose} />
                    <Button
                        label={loading ? "Salvando..." : "Salvar"}
                        disabled={loading}
                        className="background-blue"
                        onClick={handleSave}
                    />
                </div>
            </div>
        </motion.div>
    );
}
