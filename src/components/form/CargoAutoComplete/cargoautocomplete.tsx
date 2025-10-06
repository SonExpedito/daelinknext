"use client";
import { useState } from "react";
import cbos from "../data/ocupacoes_modernas.json";
import { Input } from "@/src/components/elements/input/input";

type CargoAutocompleteProps = {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  bgClassName?: string; // 🔹 nova prop opcional para customizar o fundo
};

export default function CargoAutocomplete({
  data,
  setData,
  bgClassName = "bg-white/70", // valor padrão
}: Readonly<CargoAutocompleteProps>) {
  const [filtradas, setFiltradas] = useState<string[]>([]);

  const handleChange = (valor: string) => {
    setData((prev: any) => ({ ...prev, trabalho: valor }));

    if (!valor.trim()) {
      setFiltradas([]);
      return;
    }

    const lista = Array.isArray(cbos) ? cbos : [];
    const match = lista
      .filter((item: any) =>
        (item.titulo || item.nome || item.descricao || "")
          .toLowerCase()
          .includes(valor.toLowerCase())
      )
      .map((item: any) => item.titulo || item.nome || item.descricao)
      .slice(0, 8);

    setFiltradas(match);
  };

  const selecionarSugestao = (valor: string) => {
    setData((prev: any) => ({ ...prev, trabalho: valor }));
    setFiltradas([]);
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <Input
        label="Digite seu Cargo"
        placeholder="Ex: Desenvolvedor de Software"
        type="text"
        className={`!w-[80%] mx-auto ${bgClassName} capitalize`}
        value={data.trabalho}
        required
        onChange={handleChange}
      />

      {filtradas.length > 0 && (
        <ul
          className={`absolute top-[100%] mt-1 w-[80%] ${bgClassName.replace(
            "!bg-",
            "bg-"
          )} rounded-2xl shadow-lg z-20 border border-gray-200 overflow-hidden max-h-60 overflow-y-auto`}
        >
          {filtradas.map((sugestao) => (
            <li key={sugestao}>
              <button
                type="button"
                onClick={() => selecionarSugestao(sugestao)}
                className="w-full text-left px-4 py-2 text-color cursor-pointer hover:bg-blue-100 transition"
              >
                {sugestao}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
