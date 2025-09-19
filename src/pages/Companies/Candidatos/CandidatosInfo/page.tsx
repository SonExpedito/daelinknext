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
import { Mail } from "lucide-react";


type Props = {
    pcdId: string;
};


export default function CandidatoInfoPage({ pcdId }: Readonly<Props>) {

    const [pcd, setPCD] = useState<PCD | null>(null);
    const { idade, dataFormatada } = formatarDataNasc(pcd?.dataNasc);
    const [loading, setLoading] = useState(true);
    const openModal = useUIStore((state) => state.openModal);
    const closeModal = useUIStore((state) => state.closeModal);
    const router = useRouter();

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

    function calcularIdade(dataNasc: any) {
        const hoje = new Date();

        let nascimento: Date;

        if (dataNasc instanceof Date) {
            nascimento = dataNasc; // já é Date
        } else if (typeof dataNasc === "string") {
            nascimento = new Date(dataNasc); // converte string
        } else if (dataNasc?.seconds) {
            nascimento = new Date(dataNasc.seconds * 1000); // caso venha como objeto Timestamp cru
        } else {
            return "Data inválida";
        }

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }

    if (loading) {
        return <Carregamento />;
    } else if (pcd) {
        return (
            <>
                <VoltarIcon />

                <div className="w-full  h-fit flex flex-col items-center justify-center relative">

                    <img src={pcd.imageProfile} alt={pcd.name} className="w-[60rem] h-80 object-cover rounded-3xl" />
                    <div className={`flex flex-col items-center justify-center relative`}>

                        <div className={`${pcd.perfilvertical ? "w-60 h-[21.6rem] bottom-[60%] " : "h-60 w-60 bottom-[80%]"} flex items-center justify-center absolute 
                                        rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg
                                      hover:bg-white/20 transition duration-300`}>
                            <img src={pcd.imageUrl} alt={pcd.name} className="h-full object-cover rounded-3xl" />
                        </div>

                        <div className="flex flex-col gap-2 items-center justify-center mt-16  ">
                            <h1 className='text-color text-3xl font-bold  text-center text-color'>{pcd.name}</h1>
                            <p className='text-base max-w-[30rem] text-center text-color'>{pcd.sobre}</p>
                        </div>
                    </div>

                </div>

                <div className="w-full min-h-[38vh] flex items-center justify-center px-12 ">


                    <div className="w-1/3 flex flex-col items-start justify-center gap-2 text-base">
                        <p className="text-color">
                            Idade: {idade} <span className="text-color opacity-50">({dataFormatada})</span>
                        </p>

                        <p className="text-color">E-mail: {pcd.email}</p>
                        <p className="text-color">Telefone: {pcd.telefone}</p>
                        <p className="text-color">Deficiência: {pcd.deficiencia}</p>
                    </div>

                    <div className="w-1/3 flex flex-col items-center justify-center gap-2 ">
                        <h1 className='text-color text-2xl font-bold self-start secondary-color'>{pcd.trabalho}</h1>
                        <p className='text-base max-w-[40rem] text-color'>{pcd.descrição}</p>

                    </div>

                    <div className="w-1/3 flex flex-col items-center justify-center  gap-2">

                        <Button type="button" label={<><Mail size={24} /> Contatar</>} className="background-blue" onClick={handleContact} />
                    </div>


                </div>

            </>
        );
    } else {
        return <ErrorCard label="PCD não encontrado." />;
    }

}