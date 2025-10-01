'use client'
import { useEffect, useState } from "react";
import { useUIStore } from "@/src/components/store/modalstore";
import { useRouter } from "next/navigation";
import { formatarDataNasc } from "@/src/components/utils/dateUtils";
import VoltarIcon from "@/src/components/elements/voltar/page";
import ErrorCard from "@/src/components/elements/errorcard/errorcard";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import axios from "axios";
import type { PCD } from "@/src/components/types/bdtypes";
import Button from "@/src/components/elements/buttons/button";
import { Mail, Phone } from "lucide-react";
import AdicionarVagaModal from "./modal/adicionarvaga"; // <-- importar o modal
import { useUserStore } from "@/src/components/store/userstore";

type Props = {
    pcdId: string;
};

export default function CandidatoInfoPage({ pcdId }: Readonly<Props>) {
    const [pcd, setPCD] = useState<PCD | null>(null);
    const { idade, dataFormatada } = formatarDataNasc(pcd?.dataNasc);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // controla modal
    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);
    const router = useRouter();

    const userProfile = useUserStore((state) => state.userProfile);
    const empresaId = userProfile?.id;

    useEffect(() => {
        if (!pcdId) {
            setLoading(false);
            openModal("PCD não encontrado.");
            router.replace("/candidatos");
            setTimeout(() => closeModal(), 1200);
            return;
        }

        setLoading(true);
        axios.post<PCD>("/get-pcd", { pcdId })
            .then((res) => {
                if (!res.data) {
                    openModal("Candidato não encontrado.");
                    router.replace("/candidatos");
                    setTimeout(() => closeModal(), 1200);
                }
                setPCD(res.data);
                setLoading(false);
            })
            .catch((err) => {
                openModal(err.response?.data?.message || "Erro ao buscar PCD.");
                router.replace("/candidatos");
                setTimeout(() => closeModal(), 1200);
                setLoading(false);
            });
    }, [pcdId, router, openModal, closeModal]);

    const handleContact = () => {
        if (pcd?.email) {
            openModal("Abrindo E-mail");
            window.location.href = `mailto:${pcd.email}`;
            setTimeout(() => closeModal(), 1200);
        } else {
            openModal("Email do PCD não disponível.");
            setTimeout(() => closeModal(), 1200);
        }
    };

    const handleTelefone = () => {
        if (pcd?.telefone) {
            openModal("Abrindo Telefone");
            window.location.href = `tel:${pcd.telefone}`;
            setTimeout(() => closeModal(), 1200);
        } else {
            openModal("Telefone do PCD não disponível.");
            setTimeout(() => closeModal(), 1200);
        }
    };

    if (loading) {
        return <Carregamento />;
    } else if (pcd) {
        return (
            <>
                <VoltarIcon />

                <div className="w-full h-fit flex flex-col items-center justify-center relative">
                    <img
                        src={pcd.imageProfile}
                        alt={pcd.name}
                        className="w-[70rem] h-80 object-cover rounded-3xl"
                    />
                    <div className="flex flex-col items-center justify-center relative">
                        <div
                            className={`${pcd.perfilvertical ? "w-60 h-[21.6rem] mb-68 " : "h-60 w-60 mb-40"
                                } flex items-center justify-center absolute 
                 rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
                 hover:bg-white/20 transition duration-300`}
                        >
                            <img
                                src={pcd.imageUrl}
                                alt={pcd.name}
                                className="h-full object-cover rounded-3xl"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center mt-12">
                        <h1 className="text-color text-3xl font-bold text-center">{pcd.name}</h1>
                        <p className="text-base max-w-[30rem] text-center text-color">{pcd.sobre}</p>
                    </div>
                </div>

                <div className="w-full min-h-[38vh] flex items-center justify-center">
                    <div className="w-1/3 flex flex-col items-start justify-center gap-2  px-4">
                        <h1 className="text-color text-2xl font-bold self-start secondary-color">
                            {pcd.trabalho}
                        </h1>
                        <p className="text-base max-w-[40rem] text-color">{pcd.descrição}</p>
                    </div>

                    <div className="w-1/3 flex flex-col items-start justify-center gap-2 text-base">
                        <p className="text-color">
                            Idade: {idade}{" "}
                            <span className="text-color opacity-50">({dataFormatada})</span>
                        </p>
                        <p className="text-color">E-mail: {pcd.email}</p>
                        <p className="text-color">Telefone: {pcd.telefone}</p>
                        <p className="text-color">Deficiência: {pcd.deficiencia}</p>
                    </div>

                    <div className="w-1/3 flex flex-col items-center justify-center gap-4">
                        <Button
                            type="button"
                            label={
                                <>
                                    <Mail size={24} /> Email
                                </>
                            }
                            className="background-blue"
                            onClick={handleContact}
                        />
                        <Button
                            type="button"
                            label={
                                <>
                                    <Phone size={24} /> Telefone
                                </>
                            }
                            className="bg-[#5B21B6]"
                            onClick={handleTelefone}
                        />
                        {pcd.empresapick && (
                            <Button
                                type="button"
                                label="Adicionar a Vaga"
                                className="bg-green-600"
                                onClick={() => setShowModal(true)} // abre o modal
                            />
                        )}
                    </div>
                </div>

                {/* Modal de criar processo */}
                {showModal && (
                    <AdicionarVagaModal
                        empresaId={empresaId ?? ""}
                        pcdId={pcdId}
                        onClose={() => setShowModal(false)} // agora fecha certinho
                    />
                )}
            </>
        );
    } else {
        return <ErrorCard label="PCD não encontrado." />;
    }
}
