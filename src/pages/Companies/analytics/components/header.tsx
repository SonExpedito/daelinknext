import { Vaga, Processo } from "@/src/components/types/bdtypes";

interface Props {
  readonly vagas: readonly Vaga[];
  readonly processos: readonly Processo[];
}

export default function AnalyticsHeader({ vagas, processos }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="liquid-glass p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
        <p className="text-sm opacity-70">Total de Vagas</p>
        <h2 className="text-3xl font-bold">{vagas.length}</h2>
      </div>

      <div className="liquid-glass p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
        <p className="text-sm opacity-70">Processos em Andamento</p>
        <h2 className="text-3xl font-bold">
          {processos.filter((p) => p.situacao === "Pendente").length}
        </h2>
      </div>

      <div className="liquid-glass p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
        <p className="text-sm opacity-70">Processos Finalizados</p>
        <h2 className="text-3xl font-bold">
          {processos.filter((p) => ["Encerrado", "Aprovado"].includes(p.situacao ?? "")).length}
        </h2>
      </div>
    </div>
  );
}
