'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "./userstore";

const pcdRoutes = ["/documento", "/processos"];
const empresaRoutes = [
  "/analytics",
  "/candidatos",
  "/dashboard",
  "/processospanel",
  "/vagaspanel",
];

export default function UserInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const fetchUser = useUserStore((s) => s.fetchUser);
  const userType = useUserStore((s) => s.userType);
  const loading = useUserStore((s) => s.loading);

  // Estado local para evitar múltiplos fetches
  const [initialized, setInitialized] = useState(false);

  // Busca usuário apenas uma vez
  useEffect(() => {
    if (!initialized) {
      fetchUser().finally(() => setInitialized(true));
    }
  }, [initialized, fetchUser]);

  // Bloqueio de rotas
  useEffect(() => {
    if (!loading && initialized && pathname) {
      // Rotas PCD
      if (pcdRoutes.some((route) => pathname.startsWith(route))) {
        if (userType !== "PCD") {
          router.replace("/login");
        }
      }

      // Rotas Empresa
      if (empresaRoutes.some((route) => pathname.startsWith(route))) {
        if (userType !== "Empresa") {
          router.replace("/login");
        }
      }
    }
  }, [pathname, userType, loading, initialized, router]);

  return null;
}
