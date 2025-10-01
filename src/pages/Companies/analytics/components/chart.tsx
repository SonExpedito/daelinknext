"use client";
import { Vaga, Processo } from "@/src/components/types/bdtypes";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CustomPieLabel from "./pielabel";

interface Props {
  vagas: Vaga[];
  processos: Processo[];
}

// Move the label render function outside the component
function renderCustomPieLabel(props: any) {
  return <CustomPieLabel {...props} percent={props.percent} />;
}

export default function AnalyticsChart({ vagas, processos }: Readonly<Props>) {
  const dataVagas = vagas.map((vaga) => ({
    name: vaga.vaga ?? "Sem título",
    processos: processos.filter((p) => p.vagaId === vaga.id).length,
  }));

  const statusProcessos = [
    { name: "Aprovados", value: processos.filter((p) => p.situacao === "Aprovado").length },
    { name: "Pendentes", value: processos.filter((p) => p.situacao === "Pendente").length },
    { name: "Encerrados", value: processos.filter((p) => p.situacao === "Encerrado").length },
  ];

  const COLORS = ["#2469F5", "#07BEB8", "#F59E0B"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="liquid-glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Processos por Vaga</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataVagas}>
            <XAxis dataKey="name" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.1)" }} />
            <Bar dataKey="processos" fill="#2469F5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="liquid-glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Status dos Processos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusProcessos}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={renderCustomPieLabel}
            >
              {statusProcessos.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
