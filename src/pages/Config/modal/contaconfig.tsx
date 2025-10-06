"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RectangleEllipsis, Eraser, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { useUIStore } from "@/src/components/store/modalstore";
import Button from "@/src/components/elements/buttons/button";
import { Input } from "@/src/components/elements/input/input";

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: Readonly<AccountModalProps>) {
    const auth = getAuth();
    const { openModal, openConfirmModal } = useUIStore();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Trocar senha
    const handleChangePassword = async () => {
        if (!auth.currentUser) return;

        if (newPassword.length < 6) {
            openModal("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            openModal("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await axios.patch("/conta-auth", {
                uid: auth.currentUser.uid,
                newPassword,
            });
            setNewPassword("");
            setConfirmPassword("");
            setShowPassword(false);
            setShowConfirmPassword(false);
            openModal("Senha atualizada com sucesso!");
        } catch (err: any) {
            console.error(err);
            openModal(err.response?.data?.error || "Erro ao atualizar senha");
        } finally {
            setLoading(false);
        }
    };

    // Desativar conta
    const handleDisableAccount = () => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;

        openConfirmModal(
            "Deseja realmente desativar sua conta? Esta ação é reversível.",
            async () => {
                try {
                    await axios.delete("/conta-auth", { params: { uid } });
                    openModal("Conta desativada com sucesso!");
                    onClose(); // fecha o modal principal
                    // aqui você pode deslogar/redirecionar
                } catch (err: any) {
                    console.error(err);
                    openModal(err.response?.data?.error || "Erro ao desativar conta");
                }
            },
            "Desativar",
            "Cancelar"
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative w-96 max-w-[90%] rounded-2xl p-6 shadow-xl border border-white/30"
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px) saturate(150%)",
                        WebkitBackdropFilter: "blur(20px) saturate(150%)",
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white hover:scale-110 transition"
                    >
                        <X size={22} />
                    </button>

                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Gerenciar Conta</h2>

                    {/* Trocar Senha */}
                    <div className="mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-inner flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-white">
                            <RectangleEllipsis size={24} />
                            <span className="text-lg font-medium">Trocar Senha</span>
                        </div>

                        {/* Nova senha com visualizar/ocultar */}
                        <div className="relative w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nova senha"
                                value={newPassword}
                                onChange={(e: any) =>
                                    setNewPassword(typeof e === "string" ? e : e.target?.value)
                                }
                                className="w-full pr-12"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-white/80"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Confirmar senha com visualizar/ocultar */}
                        <div className="relative w-full">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmar senha"
                                value={confirmPassword}
                                onChange={(e: any) =>
                                    setConfirmPassword(typeof e === "string" ? e : e.target?.value)
                                }
                                className="w-full pr-12"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-white/80"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <Button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="background-blue"
                            label="Trocar Senha"
                        />
                    </div>

                    {/* Desativar Conta */}
                    <div className="mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-inner flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Eraser size={24} className="text-yellow-400" />
                            <span className="text-lg font-medium text-yellow-400">Desativar Conta</span>
                        </div>
                        <p className="text-white text-sm">
                            Esta ação desativa sua conta. Você não poderá mais acessar até que seja reativada.
                        </p>
                        <Button
                            onClick={handleDisableAccount}
                            className="bg-yellow-400"
                            label="Desativar Conta"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}