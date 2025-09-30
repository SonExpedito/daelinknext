"use client";
import { Download } from "lucide-react";
import type { Mensagem, PCD, Empresa } from "@/src/components/types/bdtypes";
import {getName, isImage } from "../utils/messageHelpers";

type Props = {
  mensagens: Mensagem[];
  participante: PCD | Empresa | null;
  userType: string | null;
};

export default function RenderedMessages({ mensagens, participante, userType }: Readonly<Props>) {
  return (
    <>
      {mensagens.map((mensagem) => {
        const hasFile = !!mensagem.fileUrl;
        const isImg = hasFile && isImage(mensagem.fileUrl);

        // garante que "Você" (userType) fique sempre à direita
        const alignClass =
          mensagem.origem === userType ? "self-end background-blue" : "self-start background-green";

        return (
          <div
            key={mensagem.id}
            className={`
              w-fit h-fit flex flex-col gap-1
              p-4 rounded-3xl shadow-lg
              bg-white/10 border border-white/20
              backdrop-blur-md backdrop-saturate-125
              transition duration-300 hover-size
              ${alignClass}
            `}
          >
            <p className="font-medium text-lg text-white/90">
              {getName(mensagem.origem, userType, participante)}
            </p>

            {hasFile &&
              (isImg ? (
                <img
                  src={mensagem.fileUrl}
                  alt="Arquivo da mensagem"
                  className="max-w-xs max-h-60 rounded-lg my-1"
                />
              ) : (
                <a
                  href={mensagem.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-white bg-[#1c1c1c] rounded-3xl p-2 px-3 cursor-pointer my-1
                  border border-white/30 shadow-md
                  backdrop-blur-xl backdrop-saturate-150"
                  aria-label="Baixar arquivo"
                >
                  <Download size={22} />
                  <span className="text-base">Arquivo Enviado</span>
                </a>
              ))}

            <p className="text-base text-white/85">{mensagem.mensagem}</p>
          </div>
        );
      })}
    </>
  );
}
