"use client";

import { useState, useEffect } from "react";
import { Input } from "@/src/components/elements/input/input";
import { IMaskInput } from "react-imask";
import RamosAutoComplete from "@/src/components/form/RamosEmpresas/ramoautocomplete";

type PerfilEtapaProps = {
    data: {
        name?: string;
        area?: string;
        sobre?: string;
        email?: string;
        cnpj: string;
        telefone: string;
        imageUrl?: File | null;       // logo
        imageProfile?: File | null;   // banner
    };
    setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function PerfilEtapa({ data, setData }: Readonly<PerfilEtapaProps>) {
    const [previewBanner, setPreviewBanner] = useState<string>("/cadastro/banner.jpeg");
    const [previewLogo, setPreviewLogo] = useState<string>("/cadastro/profile.png");

    useEffect(() => {
        if (data.imageProfile) {
            const url = URL.createObjectURL(data.imageProfile);
            setPreviewBanner(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.imageProfile]);

    useEffect(() => {
        if (data.imageUrl) {
            const url = URL.createObjectURL(data.imageUrl);
            setPreviewLogo(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.imageUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "imageProfile" | "imageUrl") => {
        const file = e.target.files?.[0] || null;
        setData((prev: any) => ({ ...prev, [field]: file }));
    };


    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative">
            {/* Banner e logo */}
            <div className="h-fit w-fit flex items-center justify-center relative ">
                <label className="relative cursor-pointer group">
                    <img
                        src={previewBanner}
                        alt="Banner"
                        className="w-[32rem] h-58 object-cover rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                        <span className="font-medium text-base">Alterar banner</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "imageProfile")} />
                </label>

                <div className={`absolute flex items-center justify-center rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300 h-40 w-40 mt-40"}`}>
                    <label className="relative cursor-pointer w-full h-full flex group">
                        <img
                            src={previewLogo}
                            alt="Logo"
                            className="h-full w-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                            <span className="font-medium text-sm">Alterar logo</span>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "imageUrl")} />
                    </label>
                </div>
            </div>

            {/* Inputs */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8">
                <Input
                    label="Nome da Empresa"
                    placeholder="Digite o nome da empresa"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.name || ""}
                    required
                    onChange={(v) => setData((prev: any) => ({ ...prev, name: v }))}
                />


                {/* Área */}
                <RamosAutoComplete data={data} setData={setData} bgClassName="!bg-white/70" />

                <Input
                    label="Sobre a empresa"
                    placeholder="Descrição breve"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.sobre || ""}
                    onChange={(v) => setData((prev: any) => ({ ...prev, sobre: v }))}
                />

                <Input
                    label="E-mail"
                    placeholder="Digite o e-mail da empresa"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.email || ""}
                    onChange={(v) => setData((prev: any) => ({ ...prev, email: v }))}
                />

                {/* CNPJ */}
                <div className="!w-full flex flex-col items-center gap-2 text-color">
                    <label htmlFor="cnpj" className="text-lg font-medium w-[80%] text-left">CNPJ *</label>
                    <IMaskInput
                        id="cnpj"
                        mask="00.000.000/0000-00"
                        value={data.cnpj}
                        onAccept={(value: any) => setData((prev: any) => ({ ...prev, cnpj: value }))}
                        placeholder="00.000.000/0000-00"
                        className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                {/* Telefone */}
                <div className="!w-full flex flex-col items-center gap-2 text-color">
                    <label htmlFor="telefone" className="text-lg font-medium w-[80%] text-left">Telefone *</label>
                    <IMaskInput
                        id="telefone"
                        mask="(00) 00000-0000"
                        value={data.telefone}
                        onAccept={(value: any) => setData((prev: any) => ({ ...prev, telefone: value }))}
                        placeholder="(11) 99999-9999"
                        className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
            </div>
        </div>
    );
}
