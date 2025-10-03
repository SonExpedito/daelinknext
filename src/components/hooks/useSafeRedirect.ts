"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useSafeRedirect() {
  const router = useRouter();

  return useCallback(
    (url: string) => {
      // Adia a navegação para o próximo ciclo de evento
      setTimeout(() => {
        router.replace(url);
      }, 0);
    },
    [router]
  );
}
