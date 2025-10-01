"use client";
import { useEffect, useState } from "react";
import { Vaga, Processo } from "@/src/components/types/bdtypes";
import AnalyticsHeader from "./components/header";
import AnalyticsChart from "./components/chart";
import AnalyticsTable from "./components/table";
import { useUserStore } from "@/src/components/store/userstore";
import axios from "axios";

export default function AnalyticsPage() {
  const userProfile = useUserStore((state) => state.userProfile);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!userProfile?.id) return;

      try {
        const response = await axios.post<{ vagas: Vaga[]; processos: Processo[] }>(
          "/analitycs-data",
          { empresaId: userProfile.id }
        );

        setVagas(response.data.vagas);
        setProcessos(response.data.processos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userProfile?.id]);

  if (loading) return <p className="text-center">Carregando estatísticas...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        📊 Analytics - {userProfile?.name}
      </h1>

      <AnalyticsHeader vagas={vagas} processos={processos} />
      <AnalyticsChart vagas={vagas} processos={processos} />
      <AnalyticsTable vagas={vagas} processos={processos} />
    </div>
  );
}
