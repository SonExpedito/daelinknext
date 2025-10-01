import { Vaga, Processo } from "@/src/components/types/bdtypes";

interface Props {
  readonly vagas: readonly Vaga[];
  readonly processos: readonly Processo[];
}

export default function AnalyticsTable({ vagas, processos }: Props) {
  return (
    <div className="liquid-glass p-6 rounded-2xl overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Resumo de Vagas</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/20 dark:border-white/10">
            <th className="text-left p-3">Vaga</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Processos</th>
          </tr>
        </thead>
        <tbody>
          {vagas.map((vaga) => (
            <tr
              key={vaga.id}
              className="border-b border-white/10 hover:bg-white/5 dark:hover:bg-black/10 transition-colors"
            >
              <td className="p-3">{vaga.vaga}</td>
              <td className="p-3">{vaga.status ?? "Indefinido"}</td>
              <td className="p-3">
                {processos.filter((p) => p.vagaId === vaga.id).length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
