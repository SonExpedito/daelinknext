"use client";

import { ReactNode } from "react";
import { useUserStore } from "@/src/components/store/userstore";
import Loading from "@/src/components/elements/loadingScreen/loadingscreen";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const loading = useUserStore((s) => s.loading);

  if (loading) return <Loading isLoading={loading} />;

  return <>{children}</>;
}
