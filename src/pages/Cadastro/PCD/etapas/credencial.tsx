import { FilePlus, Download, Trash2 } from "lucide-react";
import { Input, TextareaAutoResize } from "@/src/components/elements/input/input";
import ToggleSwitch from "@/src/components/elements/switchToggle/switch";
import { IMaskInput } from "react-imask";

type CredenciaisEtapaProps = {
  data: {
    password: string;
    confirmPassword: string;
    cpf: string;
    telefone: string;
    descrição: string;
    empresapick: boolean;
    laudomedico: File | null;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function CredenciaisEtapa({ data, setData }: Readonly<CredenciaisEtapaProps>) {
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

        <Input
          label="Senha"
          type="password"
          placeholder="Sua senha de Acesso"
          className="!bg-white/70 !w-[80%] mx-auto"
          value={data.password}
          onChange={(v) => setData((prev: any) => ({ ...prev, password: v }))}
        />

        <Input
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          type="password"
          className="!bg-white/70 !w-[80%] mx-auto"
          value={data.confirmPassword}
          onChange={(v) => setData((prev: any) => ({ ...prev, confirmPassword: v }))}
        />

        <div className="!w-full flex flex-col items-center gap-2 text-color">
          <label className="text-lg font-medium w-[80%] text-left">CPF *</label>
          <IMaskInput
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

        {/* Telefone com máscara */}
        <div className="!w-full flex flex-col items-center gap-2 text-color">
          <label className="text-lg font-medium w-[80%] text-left">Telefone *</label>
          <IMaskInput
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

        {/* Descrição */}
        <TextareaAutoResize
          label="Descrição *"
          placeholder="Conte mais sobre você"
          className="!bg-white/70 !w-[80%] mx-auto"
          value={data.descrição}
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
              className="flex items-center justify-between w-[80%] md:w-[50%] px-4 py-2 rounded-2xl 
                         bg-white/80 backdrop-blur-lg border border-white/20 shadow-md hover:scale-[1.02] 
                         transition-transform mt-2"
            >
              <p className="text-sm text-color truncate max-w-[220px]">
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

        {/* Empresa Pick com tooltip */}
        <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-3 relative group">
          <p className="text-lg text-color text-center font-medium flex items-center gap-1">
            Empresa Pick:
          </p>

          <ToggleSwitch checked={data.empresapick} onChange={handleEmpresaPick} />
          <span className="relative flex items-center justify-center w-5 h-5 rounded-full 
                           bg-gray-300 text-gray-700 text-xs font-bold cursor-pointer">
            i
            <span className="absolute bottom-full mb-2 hidden w-64 bg-gray-800 text-white text-sm 
                             rounded-md p-2 text-center group-hover:block z-50">
              Empresas podem adicionar você diretamente a um processo caso esta opção esteja habilitada.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
