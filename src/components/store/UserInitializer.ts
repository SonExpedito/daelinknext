'use client';

import { useEffect } from "react";
import { useUserStore } from "./userstore"; // ajuste o path conforme seu projeto

export default function UserInitializer() {
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null; // Componente não exibe nada
}
