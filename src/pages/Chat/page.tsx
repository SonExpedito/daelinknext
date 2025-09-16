'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Chat, Empresa, PCD } from "@/src/components/types/bdtypes";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { useUIStore } from "@/src/components/store/modalstore";
import { useUserStore } from "@/src/components/store/userstore";
import Carregamento from "@/src/components/elements/carregamento/carregamento";
import axios from "axios";
import MessageContainer from "./messages/message";


type Props = { readonly chatId: string; };

export default function ChatPage({ chatId }: Props) {
    const [loading, setLoading] = useState(true);

    const UserType = useUserStore((state) => state.userType);

    const [participante, setParticipante] = useState<PCD | Empresa | null>(null);

    const [chat, setChat] = useState<Chat | null>(null);

    const openModal = useUIStore(state => state.openModal);
    const closeModal = useUIStore(state => state.closeModal);

    const router = useRouter();

    useEffect(() => {
        if (!chatId?.trim()) {
            setLoading(false);
            openModal("Chat não encontrado.");
            router.back();
            setTimeout(() => closeModal(), 1200);
            return;
        }

        const getChat = async () => {
            try {
                const chatRes = await axios.post<Chat>("/get-chat", {
                    chatId: chatId.trim()
                });
                if (!chatRes.data) throw new Error("Chat não encontrado.");
                setChat(chatRes.data);

                if (UserType === "PCD" && chatRes.data.empresaId) {
                    const empresaRes = await axios.post<Empresa>("/get-company", { empresaId: chatRes.data.empresaId });
                    setParticipante(empresaRes.data);
                } else if (UserType === "Empresa" && chatRes.data.pcdId) {
                    const pcdRes = await axios.post<PCD>("/get-pcd", { pcdId: chatRes.data.pcdId });
                    setParticipante(pcdRes.data);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                openModal("Erro ao buscar chat.");
                setTimeout(() => closeModal(), 1200);
            }
        };

        getChat();
    }, [chatId]);

    const handleVoltar = () => {
        router.back();
    };

    const handleEmail = () => {
        if (participante?.email) {
            openModal("Abrindo E-mail");
            window.location.href = `mailto:${participante.email}`;
            setTimeout(() => closeModal(), 1200);
        } else {
            openModal("Email do participante não disponível.");
            setTimeout(() => closeModal(), 1200);
        }
    };

    const handleTelefone = () => {
        if (participante?.telefone) {
            openModal("Abrindo Telefone");
            window.location.href = `tel:${participante.telefone}`;
            setTimeout(() => closeModal(), 1200);
        } else {
            openModal("Telefone do participante não disponível.");
            setTimeout(() => closeModal(), 1200);
        }
    };



    let content;
    if (loading) {
        content = <Carregamento />;
    } else if (chat) {
        content = (
            <>
                <div className="w-[35%] h-full flex flex-col  pt-14 gap-6 items-center ">
                    <button
                        onClick={handleVoltar}
                        className="flex items-center gap-2 cursor-pointer 
                        font-bold text-white background-green pr-4 py-1 rounded-full
                        border border-white/30 shadow-md backdrop-blur-xl backdrop-saturate-150
                        hover:scale-105 hover:opacity-90 transition-all self-start ml-20"

                    >
                        <ChevronLeft size={28} />
                        <p className="text-lg">Voltar</p>
                    </button>

                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="h-48 flex items-center justify-center rounded-3xl p-1 border 
                        border-white/30 bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300">
                            <img src={participante?.imageUrl || "/errors/profileimg.png"} alt={participante?.name || "Sem Foto"} className="h-full object-cover rounded-3xl" />
                        </div>
                        <h1 className="text-color font-bold text-2xl">{participante?.name || "Sem Nome"} </h1>
                    </div>

                    <div className="w-auto h-auto flex flex-col gap-6 items-center justify-center">
                        <h1 className="text-color text-xl">Contatos</h1>
                        <button
                            onClick={handleEmail}
                            className="flex items-center gap-2 cursor-pointer 
                        font-bold text-white background-blue px-4 py-1 rounded-full
                        border border-white/30 shadow-md backdrop-blur-xl backdrop-saturate-150
                        hover:scale-105 hover:opacity-90 transition-all "
                        >
                            <Mail size={24} />
                            <p className="text-lg">Email</p>
                        </button>

                        <button
                            onClick={handleTelefone}
                            className="flex items-center gap-2 cursor-pointer 
                        font-bold text-white bg-[#5B21B6] px-4 py-1 rounded-full
                        border border-white/30 shadow-md backdrop-blur-xl backdrop-saturate-150
                        hover:scale-105 hover:opacity-90 transition-all "
                        >
                            <Phone size={24} />
                            <p className="text-lg">Telefone</p>
                        </button>

                    </div>

                </div>
                <div className="w-[65%] h-full">
                   <MessageContainer participante={participante} chat={chat} />
                </div>

            </>
        );
    } else {
        content = null;
    }

    return (
        <div className="w-full h-[84vh] flex justify-center items-center">
            {content}
        </div>
    );
}