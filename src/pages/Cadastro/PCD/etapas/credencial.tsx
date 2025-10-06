import { FilePlus, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {TextareaAutoResize } from "@/src/components/elements/input/input";
import CargoAutocomplete from "@/src/components/form/CargoAutoComplete/cargoautocomplete";
import ToggleSwitch from "@/src/components/elements/switchToggle/switch";
import { IMaskInput } from "react-imask";

type CredenciaisEtapaProps = {
  data: {
    password: string;
    confirmPassword: string;
    trabalho: string;
    cpf: string;
    telefone: string;
    descrição: string;
    empresapick: boolean;
    laudomedico: File | null;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function CredenciaisEtapa({ data, setData }: Readonly<CredenciaisEtapaProps>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmpresaPick = () => {
    setData((prev: any) => ({
      ...prev,
      empresapick: !prev.empresapick,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData((prev: any) => ({ ...prev, laudomedico: file }));
  };

  const removeFile = () => {
    setData((prev: any) => ({ ...prev, laudomedico: null }));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">

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
      </div>

      {/* CPF */}
      <div className="!w-full flex flex-col items-center gap-2 text-color">
        <label htmlFor="cpf" className="text-lg font-medium w-[80%] text-left">CPF *</label>
        <IMaskInput
          id="cpf"
          mask="000.000.000-00"
          value={data.cpf}
          onAccept={(value: any) =>
            setData((prev: any) => ({ ...prev, cpf: value }))
          }
          required
          placeholder="000.000.000-00"
          className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Telefone */}
      <div className="!w-full flex flex-col items-center gap-2 text-color">
        <label htmlFor="telefone" className="text-lg font-medium w-[80%] text-left">Telefone *</label>
        <IMaskInput
          id="telefone"
          mask="(00) 00000-0000"
          value={data.telefone}
          onAccept={(value: any) =>
            setData((prev: any) => ({ ...prev, telefone: value }))
          }
          required
          placeholder="(11) 99999-9999"
          className="!bg-white/70 !w-[80%] mx-auto rounded-2xl p-3 text-color 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <CargoAutocomplete data={data} setData={setData} />

      {/* Empresa Pick com tooltip */}
      <div className="col-span-1 flex items-center justify-center gap-3 relative group">
        <p className="text-lg text-color text-center font-medium flex items-center gap-1">
          Empresa Pick:
        </p>

        <ToggleSwitch checked={data.empresapick} onChange={handleEmpresaPick} />
        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-gray-700 text-xs font-bold cursor-pointer">
          <span aria-hidden="true">i</span>
          <span className="absolute bottom-full mb-2 hidden w-64 bg-gray-800 text-white text-sm 
                             rounded-md p-2 text-center group-hover:block z-50">
            Empresas podem adicionar você diretamente a um processo caso esta opção esteja habilitada.
          </span>
        </span>


        {/* Descrição */}
        <TextareaAutoResize
          label="Descrição *"
          placeholder="Conte mais sobre você"
          className="!bg-white/70 !w-[80%] mx-auto"
          value={data.descrição}
          required
          onChange={(v) => setData((prev: any) => ({ ...prev, descrição: v }))}
        />

        {/* Upload do laudo médico */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <input
            type="file"
            id="laudo-medico"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          {!data.laudomedico ? (
            <label
              htmlFor="laudo-medico"
              className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-md 
                         text-color font-medium py-3 px-6 rounded-2xl flex items-center gap-2 justify-center 
                         hover:bg-white/20 transition duration-300 cursor-pointer mt-2"
            >
              <FilePlus size={20} />
              Enviar Laudo Médico
            </label>
          ) : (
            <div
              className="flex items-center justify-between w-full px-4 py-2 rounded-2xl gap-6
                         bg-white/80 backdrop-blur-lg border border-white/20 shadow-md hover:scale-[1.02] 
                         transition-transform mt-2"
            >
              <p className="text-sm text-color truncate">
                {data.laudomedico.name}
              </p>
              <div className="flex gap-3">
                <a
                  href={URL.createObjectURL(data.laudomedico)}
                  download={data.laudomedico.name}
                  className="text-green-300 hover:text-green-400"
                  aria-label="Baixar laudo médico"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={removeFile}
                  className="text-red-300 hover:text-red-400 transition"
                  aria-label="Remover arquivo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


