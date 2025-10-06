"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "../store/userstore";
import { useSafeRedirect } from "@/src/components/hooks/useSafeRedirect";
import { useUIStore } from "../store/modalstore";
import Loading from "@/src/components/elements/loadingScreen/loadingscreen";

const protectedRoutes = {
  PCD: ["/documento", "/processos"],
  Empresa: ["/analytics", "/candidatos", "/dashboard", "/processospanel", "/vagaspanel"],
};

const chatRoutes = ["/chat"]; // acessível por ambos
const authRoutes = ["/login", "/cadastro"];
const profileRoutes = ["/perfil"];

export default function UserGate({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const { fetchUser, userType, loading } = useUserStore();
  const redirect = useSafeRedirect();
  const [initialized, setInitialized] = useState(false);

  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);

  useEffect(() => {
    if (!initialized) fetchUser().finally(() => setInitialized(true));
  }, [initialized, fetchUser]);

  const matchRoute = (routes: string[]) =>
    routes.some((route) => new RegExp(`^${route}(?:/.*)?$`).test(pathname ?? ""));

  const showModalMessage = (message: string, duration = 1200) => {
    openModal(message);
    setTimeout(closeModal, duration);
  };

  useEffect(() => {
    if (!loading && initialized && pathname) {
      const isPCDRoute = matchRoute(protectedRoutes.PCD);
      const isEmpresaRoute = matchRoute(protectedRoutes.Empresa);
      const isChatRoute = matchRoute(chatRoutes);
      const isProfile = matchRoute(profileRoutes);
      const isAuthRoute = authRoutes.includes(pathname);

      // Usuário não logado tenta acessar rota protegida
      if (!userType && (isPCDRoute || isEmpresaRoute || isChatRoute || isProfile)) {
        showModalMessage("Acesso restrito. Faça login para continuar.");
        redirect("/login");
        return;
      }

      // Usuário logado tenta acessar login/cadastro
      if (userType && isAuthRoute) {
        showModalMessage("Você já está autenticado, caso queira apenas faça Logout.");
        redirect(userType === "PCD" ? "/processos" : "/dashboard");
        return;
      }

      // Verificação por tipo de rota (excluindo chat)
      if ((isPCDRoute && userType !== "PCD") || (isEmpresaRoute && userType !== "Empresa")) {
        redirect("/login");
        return;
      }

      // Chat é acessível por ambos, então não precisa de verificação extra
    }
  }, [pathname, userType, loading, initialized, redirect]);

  if (loading || !initialized) return <Loading isLoading={true} />;

  return <>{children}</>;
}
