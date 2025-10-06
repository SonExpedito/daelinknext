"use client";

import { useState } from "react";
import { useUserStore } from "@/src/components/store/userstore";
import { Empresa } from "@/src/components/types/bdtypes";
import { UserPen } from "lucide-react";
import EditarPerfilModal from "./modal/editarperfil";
import Button from "@/src/components/elements/buttons/button";
import CompanyTabs from "./companytabs";

export default function PerfillEmpresa() {
    const userProfile = useUserStore((s) => s.userProfile) as Empresa;
    const [isEditing, setIsEditing] = useState(false);

    if (!userProfile) return null;
    return (
        <>
            <div className="w-full h-fit flex flex-col items-center justify-center relative mb-8">
                <img
                    src={userProfile.imageProfile || "/errors/bannererror.png"}
                    alt={userProfile.name || "Banner da empresa"}
                    className="w-[70rem] h-80 object-cover rounded-3xl"
                />

                <div className="flex flex-col items-center justify-center relative">
                    <div
                        className={`h-60 w-60 mb-40
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

                    <div className="flex gap-4 pt-2 ">
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
            </div>


            <CompanyTabs empresa={userProfile} />


            {isEditing && (
                <EditarPerfilModal empresa={userProfile} isOpen={isEditing} onClose={() => setIsEditing(false)} />
            )}

        </>


    )

}