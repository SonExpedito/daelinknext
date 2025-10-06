"use client";

import { useState } from "react";
import { TextareaAutoResize } from "@/src/components/elements/input/input";
import { IMaskInput } from "react-imask";
import { Eye, EyeOff} from "lucide-react";

type CredenciaisEtapaProps = {
  data: {
    password: string;
    confirmPassword: string;
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
        <div className="w-full flex flex-col items-center justify-center col-span-2">
          {previewSobreImg ? (
            <label className="relative cursor-pointer group h-fit w-fit">
              <img
                src={previewSobreImg}
                alt="Imagem Sobre"
                className="w-[32rem] h-58 object-cover rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-300">
                <span className="font-medium text-base">Alterar imagem</span>
              </div>
              <input
                id="sobreimg"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSobreImgChange(e.target.files?.[0] || null)}
              />
            </label>
          ) : (
            <label
              htmlFor="sobreimg"
              className="cursor-pointer w-[32rem] h-58 flex items-center justify-center border-2 border-dashed border-white/30 
      rounded-3xl bg-white/10 backdrop-blur-lg text-white/70 hover:bg-white/20 hover:text-white transition duration-300"
            >
              <span className="font-medium">Enviar imagem sobre</span>
              <input
                id="sobreimg"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSobreImgChange(e.target.files?.[0] || null)}
              />
            </label>
          )}
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
