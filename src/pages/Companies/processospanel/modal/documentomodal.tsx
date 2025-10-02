"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import type { Documento } from "@/src/components/types/bdtypes";
import { Download } from "lucide-react";

interface Props {
    processoid: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function DocumentosModal({ processoid, isOpen, onClose }: Readonly<Props>) {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchDocumentos = async () => {
            try {
                setLoading(true);
                const res = await axios.post("/get-doc", { processoid });
                const data = res.data as { documentos?: Documento[] };
                setDocumentos(data.documentos || []);
            } catch (err) {
                console.error("Erro ao buscar documentos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentos();
    }, [isOpen, processoid]);

    if (!isOpen) return null;

    let content;
    if (loading) {
        content = <p className="text-center text-color">Carregando...</p>;
    } else if (documentos.length === 0) {
        content = <p className="text-center text-color">Nenhum documento encontrado.</p>;
    } else {
        content = (
            <div className="flex flex-col gap-3">
                {documentos.map((doc) => (
                    <div key={doc.id} className="flex flex-col gap-2 p-3 rounded-xl ">
                        <p className="text-color text-base"> <span className="font-bold">Objetivo: </span>{doc.objetivo || ""}</p>
                        <p className="text-color text-base"> <span className="font-bold">Experiência: </span>{doc.experiencia || ""}</p>

                        <div className="flex flex-wrap gap-2 mt-1">
                            {doc.arquivos?.map((fileUrl: string, index) => (
                                <div
                                    key={fileUrl}
                                    className="flex items-center justify-between px-4 py-2 rounded-2xl  gap-2
                                        bg-white/10 backdrop-blur-lg border border-white/20 shadow-md hover-size cursor-pointer"
                                >
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-color truncate max-w-[220px]"
                                    >
                                        Documento {index + 1}
                                    </a>
                                    <div className="flex gap-3">
                                        <a
                                            href={fileUrl}
                                            download
                                            className="text-green-300 hover:text-green-400 cursor-pointer"
                                            aria-label={`Baixar documento ${index + 1}`}
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
            data-role="modal"
            aria-modal="true"
            aria-labelledby="documentos-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
            <div className="w-[32rem] max-h-[80vh] overflow-y-auto rounded-2xl background-primary p-6 flex flex-col gap-6 relative">
                <h2 id="documentos-modal-title" className="text-2xl font-bold secondary-color text-center">Documentos</h2>

                {content}

                <button
                    onClick={onClose}
                    className="text-color transition hover:text-white absolute top-4 right-4 cursor-pointer"
                    aria-label="Fechar modal"
                >
                    ✕
                </button>
            </div>
        </motion.div>
    );
}
