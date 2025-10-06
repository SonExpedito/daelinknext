"use client";

import { useRouter } from "next/navigation";
import Button from "@/src/components/elements/buttons/button";

export default function DashboardAdmPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/logout-adm", { method: "POST" });
      router.push("/admin-login"); // redireciona para login
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      <Button label="Sair" onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3" />
    </div>
  );
}
