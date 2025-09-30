'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUIStore } from "@/src/components/store/modalstore";
import { FileBadge, MessagesSquare, ClipboardList } from 'lucide-react';
import type { Processo, Chat, Documento } from "@/src/components/types/bdtypes";
import VoltarIcon from "@/src/components/elements/voltar/page";
import ErrorCard from "@/src/components/elements/errorcard/errorcard";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import axios from "axios";
import Button from "@/src/components/elements/buttons/button";

type Props = { readonly processoid: string; };


export default function ProcessosInfoPage({ processoid }: Props) {
    const [processo, setProcesso] = useState<Processo | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState(true);

    const openModal = useUIStore(state => state.openModal);
    const closeModal = useUIStore(state => state.closeModal);
    const router = useRouter();

    useEffect(() => {
        if (!processoid?.trim()) {
            setLoading(false);
            openModal("Processo não encontrado.");
            router.replace("/processos");
            setTimeout(() => closeModal(), 1200);
            return;
        }

        const fetchData = async () => {
            try {
                // Buscar processo
                const processoRes = await axios.post<Processo>("/get-processo", {
                    processoid: processoid.trim()
                });

                if (!processoRes.data) throw new Error("Processo não encontrado.");
                setProcesso(processoRes.data);

                // Buscar chat
                const chatRes = await axios.post<{ empty: boolean; data: Chat | null }>("/get-chat", {
                    processoId: processoid.trim()
                });

                if (chatRes.data.empty || !chatRes.data.data) {
                    setChat(null);
                } else {
                    setChat(chatRes.data.data); // agora é objeto único
                }
            } catch (err: any) {
                openModal(err.message || "Erro ao buscar processo/chat.");
                router.replace("/processos");
                setTimeout(() => closeModal(), 1200);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [processoid, router, openModal, closeModal]);


    const getSituacaoClass = (situacao?: string) => {
        switch (situacao) {
            case "Pendente":
                return "bg-gray-500";
            case "Encerrado":
                return "bg-red-400";
            case "Aprovado":
                return "background-green";
            default:
                return "bg-gray-500"; // fallback
        }
    };

    const vagaPush = (vagaId?: string) => {
        router.push(vagaId ? `/vagas/${vagaId}` : "/vagas");
    }

    function docsPush(docId?: string) {

        if (processo?.documentos.length === 0) {
            openModal("Criando Documentos para o Processo...");

            axios.post<Documento>("/create-doc", { processoid: processoid.trim() })
                .then(res => {
                    const newDocId = res.data.id;
                    if (!newDocId) throw new Error("ID não retornado");
                    closeModal();
                    router.push(`/documento/${processoid.trim()}`);
                })
                .catch(err => {
                    closeModal();
                    openModal(err.message || "Erro ao criar documento.");
                    setTimeout(() => closeModal(), 1500);
                });
            return;
        }
        router.push(docId ? `/documento/${processoid.trim()}` : "/docs");
    }

    function chatPush(chatId?: string) {
        if (chatId) {
            router.push(`/chat/${chatId}`);
        }
    }

    let content;
    if (loading) {
        content = <Carregamento />;
    } else if (processo) {
        content = (
            <div className="h-[85vh] w-full flex items-center py-12">
                {/* Coluna esquerda */}
                <div className="h-full w-[45%] flex flex-col items-center justify-center gap-4">
                    <div className="h-60 w-60 flex items-center justify-center rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300">
                        <img src={processo.empresa?.imageUrl || "/errors/profileimg.png"} alt={processo.empresa?.name || "Sem Foto"} className="h-full object-cover rounded-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-color">{processo.empresa?.name || "Sem Nome"}</h1>
                    <p className="text-color text-lg font-medium">{processo.empresa?.area || "Sem Descrição"}</p>
                </div>

                {/* Coluna direita */}
                <div className="h-full w-[55%] flex flex-col gap-16 justify-center items-center">
                    <div className="h-fit w-full flex-col flex gap-8 items-left justify-center">
                        <h1 className="text-4xl font-bold text-color">{processo.nome || "Sem Título"}</h1>
                        <h2 className={`text-[#F5F5F5] text-xl font-bold px-4 py-1 rounded-full w-32 flex items-center justify-center ${getSituacaoClass(processo.situacao)}`}>{processo.situacao || "Situação não encontrada"}</h2>
                        <div className="w-3/4 text-color bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-4">{processo.vaga?.descricao || "Sem Descrição"}</div>
                    </div>

                    <div className="h-auto w-full flex gap-20">
                        <div className="flex flex-col gap-4">
                            <Button
                                label={<><MessagesSquare /> {chat ? "Chat" : "Não Iniciado"}</>}
                                type="button"
                                className={`w-60 h-12 items-center justify-center gap-2 font-bold ${chat ? "background-green" : "bg-gray-400 cursor-not-allowed"}`}
                                onClick={() => chatPush(chat?.id)}
                                disabled={!chat}
                            />
                            <Button
                                label={<><ClipboardList /> Revisar Vaga</>}
                                type="button"
                                className="w-60 h-12 bg-[#b62178] items-center justify-center gap-2 font-bold"
                                onClick={() => vagaPush(processo.vagaId)}
                            />
                        </div>
                        <button type="button" onClick={() => docsPush(processo.documentos[0]?.id)}
                            className="h-full w-[30%] bg-[#5B21B6] rounded-3xl hover-size cursor-pointer flex items-center justify-center gap-2 text-white font-bold text-lg">
                            <FileBadge /> Conferir Documentos
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        content = <ErrorCard label="Empresa não encontrada." />;
    }

    return (
        <>
            <VoltarIcon />
            {content}
        </>
    );
}
