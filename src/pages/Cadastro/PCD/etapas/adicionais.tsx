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

    // gera preview quando o usuário seleciona um arquivo
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
            {/* Imagem do perfil principal */}
            <div className="h-fit w-fit flex items-center justify-center relative mb-20">
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
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setData((prev: any) => ({ ...prev, fotoPrincipal: file }));
                        }}
                    />
                </label>

                {/* Foto extra (sobreposição) */}
                <div
                    className={`${perfilvertical ? "w-60 h-[21.6rem] mt-24 " : "h-40 w-40 mt-40"
                        } flex items-center justify-center absolute 
          rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
          hover:bg-white/20 transition duration-300`}
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
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setData((prev: any) => ({ ...prev, fotoExtra: file }));
                            }}
                        />
                    </label>
                </div>
            </div>

            {/* Campo Nome */}
            <div className="flex flex-col w-full">
                <label className="text-lg font-medium">Nome Completo</label>
                <input
                    type="text"
                    value={data.nome}
                    onChange={(e) => setData((prev: any) => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite seu nome"
                    className="w-full bg-white/70 rounded-2xl p-4 mt-1 placeholder-gray-500"
                />
            </div>

            {/* Campo Email */}
            <div className="flex flex-col w-full">
                <label className="text-lg font-medium">Email</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData((prev: any) => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite seu email"
                    className="w-full bg-white/70 rounded-2xl p-4 mt-1 placeholder-gray-500"
                />
            </div>

        </div>
    );
}
