'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from '@/src/components/store/userstore';
import axios from "axios";
import SearchBar from "@/src/components/elements/searchbar/searchbar";

type SearchModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userType: string | null;
};

export default function SearchModal({ isOpen, onClose, userType }: Readonly<SearchModalProps>) {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const userProfile = useUserStore((state) => state.userProfile);
    const router = useRouter();

    async function handleSearch(query: string) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return; // não busca se estiver vazio ou só espaços

        setLoading(true);
        try {
            const res = await axios.get("/search", {
                params: {
                    query: trimmedQuery,
                    userType,
                    userId: userProfile?.id || ""
                }
            });
            setResults(res.data as any[]);
        } catch (error: any) {
            console.error("Erro ao buscar:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // fecha só se clicar no overlay
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()} // impede fechamento ao clicar no conteúdo
                aria-modal="true"
                aria-labelledby="search-modal-title"
                className="relative w-full flex flex-col items-center justify-center max-w-lg rounded-2xl shadow-lg p-6 background-primary"
            >
                {/* SearchBar */}
                <SearchBar onSearch={handleSearch} />

                {/* Resultados */}
                <div className="mt-4 max-h-80 flex flex-col w-full overflow-y-auto gap-2">
                    {loading && (
                        <motion.div
                            className="w-12 h-12 border-4 border-t-[#2469F5] border-white/30 rounded-full self-center mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        ></motion.div>
                    )}

                    {!loading && results.length === 0 && (
                        <p className="text-gray-400 text-center">Nenhum resultado encontrado.</p>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <h2 id="search-modal-title" className="sr-only">Busca</h2>
                            {results.map((item) => {
                                // Define a rota dependendo da coleção
                                let href = "/";
                                if (item._collection === "Empresa") href = `/empresas/${item.id}`;
                                else if (item._collection === "Vagas") href = `/vagas/${item.id}`;
                                else if (item._collection === "Processos") {
                                    if (userType === "PCD") href = `/processos/${item.id}`;
                                    else if (userType === "Empresa") href = `/processospanel/${item.vagaId}`;
                                }
                                else if (item._collection === "PCD") href = `/pcd/${item.id}`;

                                return (
                                    <button
                                        key={item.id || item.nome || item.titulo || JSON.stringify(item)}
                                        onClick={() => router.push(href)}
                                        className="flex items-center hover-size cursor-pointer justify-between p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition w-full"
                                    >
                                        <div className="flex flex-col text-left">
                                            <span className="font-semibold">{item.nome || item.titulo}</span>
                                            {item.area && <span className="text-sm text-gray-400">{item.area}</span>}
                                            {item.tipo && <span className="text-sm text-gray-400">{item.tipo}</span>}
                                        </div>
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.nome || "Imagem"}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
