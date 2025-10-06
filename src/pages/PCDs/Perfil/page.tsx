"use client";

import { useState } from "react";
import { UserPen } from "lucide-react";
import Button from "@/src/components/elements/buttons/button";
import { useUserStore } from "@/src/components/store/userstore";
import { PCD } from "@/src/components/types/bdtypes";
import { formatarDataNasc } from "@/src/components/utils/dateUtils";
import EditarPerfilModal from "./modal/editarperfil";

export default function PerfilPCD() {
  const userProfile = useUserStore((s) => s.userProfile) as PCD;
  const { idade, dataFormatada } = formatarDataNasc(userProfile?.dataNasc);
  const [isEditing, setIsEditing] = useState(false);

  if (!userProfile) return null;

  return (
    <>
      <div className="w-full h-fit flex flex-col items-center justify-center relative">
        <img
          src={userProfile.imageProfile || "/errors/bannererror.png"}
          alt={userProfile.name || "Banner do usuário"}
          className="w-[70rem] h-80 object-cover rounded-3xl"
        />

        <div className="flex flex-col items-center justify-center relative">
          <div
            className={`${userProfile.perfilvertical ? "w-60 h-[21.6rem] mb-68 " : "h-60 w-60 mb-40"
              } flex items-center justify-center absolute 
            rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
            hover:bg-white/20 transition duration-300`}
          >
            <img
              src={userProfile.imageUrl || "/errors/usererror.png"}
              alt={userProfile.name || ""}
              className="h-full w-full object-cover rounded-3xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center mt-12">
          <h1 className="text-color text-3xl font-bold text-center">{userProfile.name}</h1>
          <p className="text-base max-w-[30rem] text-center text-color">
            {userProfile.sobre || "Nenhuma descrição adicionada."}
          </p>
        </div>
      </div>

      <div className="w-full min-h-[38vh] flex items-center justify-center">
        <div className="w-1/3 flex flex-col items-start justify-center gap-2 px-4">
          <h1 className="text-color text-2xl font-bold self-start secondary-color">
            {userProfile.trabalho || "Sem cargo definido"}
          </h1>
          <p className="text-base max-w-[40rem] text-color">
            {userProfile.descrição || "Sem descrição de trabalho."}
          </p>
        </div>

        <div className="w-1/3 flex flex-col items-start justify-center gap-4 text-base">
          <p className="text-color">
            Idade: {idade}{" "}
            <span className="text-color opacity-50">({dataFormatada})</span>
          </p>
          <p className="text-color">E-mail: {userProfile.email}</p>
          <p className="text-color">Gênero: {userProfile.genero}</p>
          <p className="text-color">Telefone: {userProfile.telefone}</p>
          <p className="text-color">Deficiência: {userProfile.deficiencia}</p>
        </div>

        <div className="w-1/3 flex flex-col items-center justify-center gap-4">
          <Button
            type="button"
            label={
              <>
                <UserPen size={24} /> Editar Perfil
              </>
            }
            className="background-blue"
            onClick={() => setIsEditing(true)}
          />
        </div>
      </div>

      {isEditing && (
        <EditarPerfilModal user={userProfile} isOpen={isEditing} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
