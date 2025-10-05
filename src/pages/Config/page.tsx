"use client";

import { SunMoon, UserLockIcon } from "lucide-react";
import ToggleSwitch from "@/src/components/elements/switchToggle/switch";
import ThemeModal from "./modal/temaAjuste";
import AccountModal from "./modal/contaconfig";
import { useUserStore } from "@/src/components/store/userstore";
import { useEffect, useState } from "react";

export default function ConfigPage() {
  const [shareData, setShareData] = useState(true);
  const [isThemeModal, setIsThemeModal] = useState(false);
  const [isAccountModal, setIsAccountModal] = useState(false);

  const userType = useUserStore((state) => state.userType);

  // Carrega valor salvo no localStorage
  useEffect(() => {
    const savedShareData = localStorage.getItem("shareData");
    if (savedShareData !== null) {
      setShareData(savedShareData === "true");
    }
  }, []);

  // Atualiza o localStorage sempre que shareData mudar
  const handleShareDataToggle = () => {
    const newValue = !shareData;
    setShareData(newValue);
    localStorage.setItem("shareData", newValue.toString());
  };

  return (
    <div className="h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center gap-8">
      <h1 className="secondary-color text-5xl font-bold">Configurações</h1>

      {/* Config Conta */}
      {userType && (
      <button
        type="button"
        onClick={() => setIsAccountModal(true)}
        className="h-[25%] w-[50%] flex flex-col gap-4 cursor-pointer items-start justify-center
            pt-4 pl-12 rounded-3xl overflow-hidden border border-gray-300 dark:border-white/50
             bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300"
      >
        <div className="self-start flex items-center justify-center gap-4 text-color">
          <UserLockIcon size={42} />
          <span className="text-2xl font-semibold">Conta</span>
        </div>

        <p className="text-color text-base w-[90%]">
          Gerencie suas informações de conta e preferências.
        </p>
      </button>
      )}

      {/* Tema */}
      <button
        type="button"
        onClick={() => setIsThemeModal(true)}
        className="h-[25%] w-[50%] flex flex-col gap-4 cursor-pointer items-start justify-center
            pt-4 pl-12 rounded-3xl overflow-hidden border border-gray-300 dark:border-white/50
             bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300"
      >
        <div className="self-start flex items-center justify-center gap-4 text-color">
          <SunMoon size={42} />
          <span className="text-2xl font-semibold">Tema</span>
        </div>

        <p className="text-color text-base w-[90%]">
          Mude conforme sua preferência, para não afetar sua experiência de uso.
        </p>
      </button>

      {/* Compartilhar Informações */}
      <div
        className="h-[25%] w-[50%] flex flex-col gap-4 items-start justify-center
            pt-4 pl-12 rounded-3xl overflow-hidden border border-gray-300 dark:border-white/50
             bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300"
      >
        <div className="self-start flex items-center justify-between w-[90%] text-color">
          <div className="flex items-center gap-4">
            <img src="/config/watson.png" alt="watson logo" className="w-12 h-12" />
            <span className="text-2xl font-semibold">
              Compartilhar Informações com a IBM
            </span>
          </div>

          <ToggleSwitch checked={shareData} onChange={handleShareDataToggle} />
        </div>

        <p className="text-color text-base w-[90%]">
          Caso não queira compartilhar informações com a IBM, desative esta opção.
        </p>
      </div>

      {/* Modais */}
      <ThemeModal isOpen={isThemeModal} onClose={() => setIsThemeModal(false)} />
      <AccountModal isOpen={isAccountModal} onClose={() => setIsAccountModal(false)} />
    </div>
  );
}
