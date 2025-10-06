"use client";

import { Input, Select } from "@/src/components/elements/input/input";
import { useState, useEffect } from "react";
import ToggleSwitch from "@/src/components/elements/switchToggle/switch";

type PerfilEtapaProps = {
    data: {
        name: string;
        email: string;
        genero: string;
        sobre: string
        dataNasc: string;
        deficiencia: string;
        perfilvertical: boolean;
        imageProfile: File | null;
        imageUrl: File | null;
    };
    setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function PerfilEtapa({ data, setData }: Readonly<PerfilEtapaProps>) {
    const [previewBanner, setPreviewBanner] = useState<string>("/cadastro/banner.jpeg");
    const [previewProfile, setPreviewProfile] = useState<string>("/cadastro/profile.png");

    // Preview banner principal
    useEffect(() => {
        if (data.imageProfile) {
            const url = URL.createObjectURL(data.imageProfile);
            setPreviewBanner(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.imageProfile]);

    // Preview imagem de perfil
    useEffect(() => {
        if (data.imageUrl) {
            const url = URL.createObjectURL(data.imageUrl);
            setPreviewProfile(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.imageUrl]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "imageProfile" | "imageUrl"
    ) => {
        const file = e.target.files?.[0] || null;
        setData((prev: any) => ({
            ...prev,
            [field]: file,
        }));
    };

    const handleTogglePerfil = () => {
        setData((prev: any) => ({
            ...prev,
            perfilvertical: !prev.perfilvertical,
        }));
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative">

            {/* Bloco de imagens */}
            <div className="h-fit w-fit flex items-center justify-center relative mb-8">
                {/* Imagem principal com overlay no hover */}
                <label className="relative cursor-pointer group">
                    <img
                        src={previewBanner}
                        className="w-[32rem] h-58 object-cover rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                        alt="Foto principal"
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

                {/* Imagem de perfil sobreposta com overlay */}
                <div
                    className={`
            absolute flex items-center justify-center 
            rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
            hover:bg-white/20 transition duration-300
            ${data.perfilvertical ? "w-40 h-[14.4rem] mt-24" : "h-40 w-40 mt-40"}
          `}
                >
                    <label className="relative cursor-pointer w-full h-full flex group">
                        <img
                            src={previewProfile}
                            alt="Foto extra"
                            className="h-full w-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                            <span className="font-medium text-sm">Alterar foto</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            required
                            onChange={(e) => handleFileChange(e, "imageUrl")}
                        />
                    </label>

                </div>
                <div className="flex flex-col items-center gap-3  absolute top-72">
                    <span className="text-sm text-color">
                        Perfil {data.perfilvertical ? "Vertical" : "Horizontal"}
                    </span>
                    <ToggleSwitch checked={data.perfilvertical} onChange={handleTogglePerfil} />
                </div>

            </div>

            {/* Inputs de texto */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8">
                <Input
                    label="Nome"
                    placeholder="Digite seu Nome"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.name}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, name: v }))}
                />

                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.email}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, email: v }))}
                />

                <Input
                    label="Sobre"
                    type="text"
                    placeholder="Se descreva de forma simples"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.sobre}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, sobre: v }))}
                />

                <Select
                    label="Deficiência"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.deficiencia}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, deficiencia: v }))}
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
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.genero}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, genero: v }))}
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

                <Input
                    type="date"
                    label="Data de Nascimento"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.dataNasc}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, dataNasc: v }))}
                />
            </div>
        </div>
    );
}
