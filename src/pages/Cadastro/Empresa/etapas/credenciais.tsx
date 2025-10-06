"use client";

import { useState } from "react";
import { TextareaAutoResize } from "@/src/components/elements/input/input";
import { IMaskInput } from "react-imask";
import { Eye, EyeOff, Download, Trash2 } from "lucide-react";

type CredenciaisEtapaProps = {
  data: {
    password: string;
    confirmPassword: string;
    cnpj: string;
    telefone: string;
    cep: string;
    endereco: string;
    descricao: string;
    sobreimg: File | null;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function CredenciaisEtapa({ data, setData }: Readonly<CredenciaisEtapaProps>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewSobreImg, setPreviewSobreImg] = useState<string | null>(null);

  const handleSobreImgChange = (file: File | null) => {
    setData((prev: any) => ({ ...prev, sobreimg: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewSobreImg(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewSobreImg(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sobre imagem */}
        <div className="!w-full flex flex-col items-center gap-2 text-color col-span-2">
          {!data.sobreimg ? (
            <label
              htmlFor="sobreimg"
              className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-md 
                 text-color font-medium py-3 px-6 rounded-2xl flex items-center gap-2 justify-center 
                 hover:bg-white/20 transition duration-300 cursor-pointer mt-2 w-[80%] text-center"
            >
              {/* Você pode adicionar um ícone, ex: <FilePlus size={20} /> */}
              Enviar Imagem Sobre
            </label>
          ) : (
            <div
              className="flex items-center justify-between w-[80%] px-4 py-2 rounded-2xl gap-4
                 bg-white/80 backdrop-blur-lg border border-white/20 shadow-md hover:scale-[1.02] 
                 transition-transform mt-2"
            >
              <p className="text-sm text-color truncate">
                {data.sobreimg.name}
              </p>
              <div className="flex gap-3">
                <a
                  href={previewSobreImg || ""}
                  download={data.sobreimg.name}
                  className="text-green-300 hover:text-green-400"
                  aria-label="Baixar arquivo"
                >
                  {/* Ícone de download */}
                  <Download size={18} />
                </a>
                <button
                  onClick={() => handleSobreImgChange(null)}
                  className="text-red-300 hover:text-red-400 transition"
                  aria-label="Remover arquivo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
          <input
            id="sobreimg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleSobreImgChange(e.target.files?.[0] || null)}
          />
        </div>


        {/* Senha */}
        <div className="!w-full flex flex-col items-center gap-2 text-color relative">

          <label htmlFor="password" className="text-lg font-medium w-[80%] text-left">Senha *</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Senha"
            value={data.password}
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <button
            type="button"
            className="absolute flex items-center justify-center inset-y-15 right-16"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Confirmar Senha */}
        <div className="!w-full flex flex-col items-center gap-2 text-color relative">
          <label htmlFor="confirm-password" className="text-lg font-medium w-[80%] text-left">Confirmar Senha *</label>
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Confirmar senha"
            value={data.confirmPassword}
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            required
          />
          <button
            type="button"
            className="absolute flex items-center justify-center inset-y-15 right-16"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Endereço */}
        <div className="!w-full flex flex-col items-center gap-2 text-color">
          <label htmlFor="endereco" className="text-lg font-medium w-[80%] text-left">Endereço *</label>
          <input
            id="endereco"
            placeholder="Digite o endereço"
            className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={data.endereco}
            required
            onChange={(e) => setData((prev: any) => ({ ...prev, endereco: e.target.value }))}
          />
        </div>

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

        {/* CEP */}
        <div className="!w-full flex flex-col items-center gap-2 text-color">
          <label htmlFor="cep" className="text-lg font-medium w-[80%] text-left">CEP *</label>
          <IMaskInput
            id="cep"
            mask="00000-000"
            value={data.cep}
            onAccept={(value: any) => setData((prev: any) => ({ ...prev, cep: value }))}
            placeholder="00000-000"
            className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>



      </div>

      {/* Descrição */}
      <TextareaAutoResize
        label="Descrição"
        placeholder="Descrição da empresa"
        className="!bg-white/70 !w-[80%] mx-auto"
        value={data.descricao}
        onChange={(v) => setData((prev: any) => ({ ...prev, descricao: v }))}
      />
    </div>
  );
}
