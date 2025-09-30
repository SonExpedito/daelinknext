'use client'
import { useEffect, useState, useRef } from "react";
import type { Chat, Mensagem, Empresa, PCD } from "@/src/components/types/bdtypes";
import { useUserStore } from "@/src/components/store/userstore";
import { useUIStore } from "@/src/components/store/modalstore";
import Carregamento from "@/src/components/elements/carregamento/carregamento";
import { Paperclip, Send, Image, FileText, Trash2 } from "lucide-react";
import "../scrollbar.css";
import axios from "axios";
import RenderedMessages from "./utils/RenderedMessages";
import { isImage } from "./utils/messageHelpers";

type MessageContainerProps = {
  readonly participante: PCD | Empresa | null;
  readonly chat: Chat | null;
};

export default function MessageContainer({ participante, chat }: MessageContainerProps) {
  const [loading, setLoading] = useState(true);
  const UserType = useUserStore((state) => state.userType);
  const UserProfile = useUserStore((state) => state.userProfile);

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const openModal = useUIStore(state => state.openModal);
  const closeModal = useUIStore(state => state.closeModal);

  const [isNearBottom, setIsNearBottom] = useState(true);

  const [mensagem, setMensagem] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsNearBottom(distanceFromBottom < 50);
  };

  useEffect(() => {
    if (!chat?.id?.trim()) return;
    let intervalId: NodeJS.Timeout;
    let firstLoad = true;

    const getMessages = async () => {
      try {
        const container = scrollContainerRef.current;
        const distanceFromBottom = container
          ? container.scrollHeight - container.scrollTop - container.clientHeight
          : 0;
        const estavaNoFim = distanceFromBottom < 50;

        const resposta = await axios.post("/get-messages", { chatId: chat.id.trim() });
        const data = resposta.data as { data: Mensagem[] };
        if (!Array.isArray(data.data)) throw new Error("Mensagens não encontradas.");

        setMensagens(data.data);

        // 🔽 só rola o container, nunca o body
        if (container) {
          if (firstLoad) {
            firstLoad = false;
            requestAnimationFrame(() => {
              container.scrollTo({
                top: container.scrollHeight,
                behavior: "auto",
              });
            });
          } else if (estavaNoFim) {
            requestAnimationFrame(() => {
              container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
              });
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        openModal("Erro ao buscar mensagens.");
        setTimeout(() => closeModal(), 1200);
      }
    };

    getMessages();
    intervalId = setInterval(getMessages, 1000);
    return () => clearInterval(intervalId);
  }, [chat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chat?.id?.trim()) {
      openModal("Chat inválido.");
      setTimeout(() => closeModal(), 1200);
      return;
    }

    if (!mensagem.trim() && !fileUrl) {
      openModal("Digite uma mensagem ou selecione um arquivo.");
      setTimeout(() => closeModal(), 1200);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("chatId", chat.id.trim());
      formData.append("mensagem", mensagem);
      formData.append("origem", UserType || "");
      formData.append("remetenteId", UserProfile?.id || "");

      if (selectedFile) formData.append("file", selectedFile);

      await axios.post("/send-message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensagem("");
      setFileUrl("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      openModal("Erro ao enviar mensagem.");
      setTimeout(() => closeModal(), 1200);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden pt-14 px-2 gap-6">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex-1 flex flex-col gap-6 p-4 px-12 overflow-y-auto overflow-x-hidden overscroll-contain
         rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-inner
         custom-scrollbar transition relative messages-scroll"
      >
        {loading ? <Carregamento /> : (
          <RenderedMessages
            mensagens={mensagens}
            participante={participante}
            userType={UserType}
          />
        )}

        {!isNearBottom && (
          <button
            onClick={() =>
              scrollContainerRef.current?.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth",
              })
            }
            className="absolute cursor-pointer hover-size bottom-4 self-center bg-white/20 backdrop-blur-md border border-white/30
                       px-4 py-2 rounded-full text-color shadow-md hover:bg-white/30 transition"
          >
            Novas mensagens
          </button>
        )}
      </div>

      {/* barra de envio e preview de arquivo */}
      <div className="w-full max-w-3xl flex relative">
        {selectedFile && (
          <div className="w-full max-w-3xl flex items-center justify-between gap-3 px-4 py-3 bottom-20
              rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg absolute"
          >
            <div className="flex items-center gap-3">
              {isImage(selectedFile.name) ? (
                <>
                  <Image size={28} className="text-color" />
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-white/20"
                  />
                </>
              ) : (
                <FileText size={28} className="text-color" />
              )}

              <span className="text-color truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setFileUrl("");
              }}
              className="text-red-300 hover:text-red-400 transition cursor-pointer"
            >
              <Trash2 size={24} />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl flex items-center px-4 py-3 gap-3
           rounded-2xl border border-white/30
           bg-white/10 backdrop-blur-xl shadow-lg
           hover:bg-white/20 transition duration-300"
        >
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent outline-none text-color "
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          <label
            className="cursor-pointer p-2 rounded-full
             bg-white/20 hover:bg-white/30 transition duration-300
             border border-white/30 shadow-md text-color hover-size"
          >
            <input
              type="file"
              className="hidden"
              title="Anexar arquivo"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  setFileUrl(URL.createObjectURL(file));
                }
              }}
            />
            <Paperclip size={20} />
          </label>

          <button
            type="submit"
            className="p-2 rounded-full cursor-pointer
             bg-white/20 hover:bg-white/30 transition duration-300
             border border-white/30 shadow-md text-color hover-size"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
