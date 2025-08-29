'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import { useUIStore } from "@/src/components/store/modalstore";
import { useRouter } from "next/navigation";
import VoltarIcon from "@/src/components/elements/voltar/page";
import ErrorCard from "@/src/components/elements/errorcard/errorcard";

type Empresa = {
  name: string;
  imageProfile: string;
};

type Vaga = {
  empresa?: Empresa;
  area?: string;
  salario?: string;
  tipo?: string;
  local?: string;
  detalhes?: string;
  vaga?: string;
  status?: string;
};

type Props = {
  vagaId: string;
};

export default function VagasinfoPage({ vagaId }: Props) {
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const router = useRouter();

  useEffect(() => {
    if (!vagaId) {
      setLoading(false);
      openModal("Vaga não encontrada.");
      router.replace("/vagas");
      setTimeout(() => closeModal(), 1200);
      return;
    }

    setLoading(true);
    axios.post<Vaga>("/get-vaga", { vagaId })
      .then((res) => {
        if (!res.data.empresa) {
          openModal("Empresa não encontrada.");
          router.replace("/vagas");
          setTimeout(() => closeModal(), 1200);
        }
        setVaga(res.data);
        setLoading(false);
      })
      .catch((err) => {
        openModal(err.response?.data?.message || "Erro ao buscar vaga.");
        router.replace("/vagas");
        setTimeout(() => closeModal(), 1200);
        setLoading(false);
      });
  }, [vagaId, router, openModal, closeModal]);


  const dados = [
    { label: 'Area', value: vaga?.area },
    { label: 'Salario', value: `R$${vaga?.salario}` },
    { label: 'Tipo', value: vaga?.tipo },
    { label: 'Endereço', value: vaga?.local },
    { label: 'Descrição', value: vaga?.detalhes },
  ]

  return (
    <>
      <VoltarIcon />
      {loading ? (
        <Carregamento />
      ) : (
        vaga?.empresa ? (
          <div className="h-auto w-full flex flex-col items-center justify-center gap-8 py-12">

            <img src={vaga.empresa.imageProfile} alt={vaga.empresa.name}
              className="w-[37%] object-contain rounded-3xl" />
            <h1 className="text-4xl font-bold text-color">{vaga.vaga}</h1>
            <p>{vaga.status}</p>

            <div className="w-full h-fit flex flex-col items-center justify-center gap-4">
              {dados.map((item, index) => (
                <p key={index} className="text-color font-normal text-lg capitalize">
                  <span className="font-bold">{item.label}:</span> {item.value}</p>
              ))}

            </div>
          </div>
        ) : (
          <ErrorCard label="Empresa não encontrada." />
        )
      )}
    </>
  );
}
