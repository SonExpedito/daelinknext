// src/components/UserInitializer.tsx
'use client';

import { useEffect } from "react";
import { useUserStore } from "./userstore"; // ajuste o path conforme seu projeto

export default function UserInitializer() {
  const fetchUser = useUserStore((s) => s.fetchUser);
  const setUserType = useUserStore((s) => s.setUserType);

  useEffect(() => {
    // busca inicial
    fetchUser();

    // listener para mudanças em outras abas
    function handleStorage(e: StorageEvent) {
      if (e.key === "tipo") {
        // e.newValue pode ser string | null
        if (e.newValue !== null) {
          setUserType(e.newValue);
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchUser, setUserType]);

  return null; // não renderiza nada
}
