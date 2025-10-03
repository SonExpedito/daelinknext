import { Input } from "@/src/components/elements/input/input";
import { useState, useEffect } from "react";

type PerfilEtapaProps = {
    data: {
        nome: string;
        email: string;
        fotoPrincipal: File | null;
        fotoExtra: File | null;
    };
    setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function PerfilEtapa({ data, setData }: PerfilEtapaProps) {
    const [previewPrincipal, setPreviewPrincipal] = useState<string>("/cadastro/pcd1.jpg");
    const [previewExtra, setPreviewExtra] = useState<string>("/cadastro/pcd2.jpg");

    useEffect(() => {
        if (data.fotoPrincipal) {
            const url = URL.createObjectURL(data.fotoPrincipal);
            setPreviewPrincipal(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.fotoPrincipal]);

    useEffect(() => {
        if (data.fotoExtra) {
            const url = URL.createObjectURL(data.fotoExtra);
            setPreviewExtra(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.fotoExtra]);

    const perfilvertical = false;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            {/* Bloco de imagens encadeado */}
            <div className="h-fit w-fit flex items-center justify-center relative mb-6">
                {/* Imagem principal */}
                <label className="cursor-pointer">
                    <img
                        src={previewPrincipal}
                        className="w-[36rem] h-64 object-cover rounded-3xl"
                        alt="Foto principal"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                            setData((prev: any) => ({
                                ...prev,
                                fotoPrincipal: e.target.files?.[0] || null,
                            }))
                        }
                    />
                </label>

                {/* Imagem extra sobreposta */}
                <div
                    className={`
            absolute flex items-center justify-center 
            rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
            hover:bg-white/20 transition duration-300
            ${perfilvertical ? "w-60 h-[21.6rem] mt-24" : "h-40 w-40 mt-40"}
          `}
                >
                    <label className="cursor-pointer w-full h-full flex">
                        <img
                            src={previewExtra}
                            alt="Foto extra"
                            className="h-full w-full object-cover rounded-3xl"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                setData((prev: any) => ({
                                    ...prev,
                                    fotoExtra: e.target.files?.[0] || null,
                                }))
                            }
                        />
                    </label>
                </div>
            </div>

            {/* Inputs de texto */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.nome}
                    onChange={(v) => setData((prev: any) => ({ ...prev, nome: v }))}
                />

                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    className="!bg-white/70 !w-[80%] mx-auto"
                    value={data.email}
                    onChange={(v) => setData((prev: any) => ({ ...prev, email: v }))}
                />
            </div>

        </div>
    );
}
