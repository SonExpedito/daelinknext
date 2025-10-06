"use client";
import { useState } from "react";
import cnaes from "../data/CNAE_modernizado.json";
import { Input } from "@/src/components/elements/input/input";

type RamosAutoComplete = {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  bgClassName?: string; // 🔹 opcional: personalização do fundo
};

export default function RamosAutoComplete({
  data,
  setData,
  bgClassName = "bg-white/70", // valor padrão
}: Readonly<RamosAutoComplete>) {
  const [filtradas, setFiltradas] = useState<{ cod: string; desc: string }[]>([]);

  const handleChange = (valor: string) => {
    setData((prev: any) => ({ ...prev, area: valor }));

    if (!valor.trim()) {
      setFiltradas([]);
      return;
    }

    const lista = Array.isArray(cnaes) ? cnaes : [];
    const match = lista
      .filter((item: any) =>
        (item.desc || "")
          .toLowerCase()
          .includes(valor.toLowerCase())
      )
      .slice(0, 8);

    setFiltradas(match);
  };

  const selecionarSugestao = (valor: string) => {
    setData((prev: any) => ({ ...prev, area: valor }));
    setFiltradas([]);
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <Input
        label="Ramo da Empresa"
        placeholder="Ex: Tecnologia da Informação, Moda, Agricultura..."
        type="text"
        className={`!w-[80%] mx-auto ${bgClassName} capitalize`}
        value={data.area}
        required
        onChange={handleChange}
      />

      {filtradas.length > 0 && (
        <ul
          className={`absolute top-[100%] mt-1 w-[80%] ${bgClassName.replace(
            "!bg-",
            "bg-"
          )} rounded-2xl shadow-lg z-40 border border-gray-200 overflow-hidden max-h-60 overflow-y-auto`}
        >
          {filtradas.map((sugestao) => (
            <li key={sugestao.cod}>
              <button
                type="button"
                onClick={() => selecionarSugestao(`${sugestao.desc}`)}
                className="w-full text-left px-4 py-2 text-color cursor-pointer hover:bg-blue-100 transition"
              >
                {sugestao.desc}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
