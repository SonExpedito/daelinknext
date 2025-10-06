'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Carregamento from '@/src/components/elements/carregamento/carregamento';
import { useUIStore } from "@/src/components/store/modalstore";
import { useUserStore } from "@/src/components/store/userstore";
import { useRouter } from "next/navigation";
import VoltarIcon from "@/src/components/elements/voltar/page";
import ErrorCard from "@/src/components/elements/errorcard/errorcard";

import type { Vaga } from "@/src/components/types/bdtypes";
import Button from "@/src/components/elements/buttons/button";

type Props = {
  vagaId: string;
};

export default function VagasinfoPage({ vagaId }: Readonly<Props>) {
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [jaInscrito, setJaInscrito] = useState(false);
  const userProfile = useUserStore((state) => state.userProfile);
  const userType = useUserStore((state) => state.userType);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const router = useRouter();

  // 🔹 Buscar a vaga
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

  // 🔹 Verificar se já existe processo para este PCD na vaga
  useEffect(() => {
    if (!vagaId || !userProfile?.id || userType !== "PCD") return; // só verifica se for PCD

    const verificar = async () => {
      try {
        const res = await axios.post<{ exists: boolean }>("/verificar-processo", {
          vagaId,
          pcdId: userProfile.id,
        });

        if (res.data?.exists) {
          setJaInscrito(true);
        }
      } catch (err) {
        console.error("Erro ao verificar candidatura", err);
      }
    };

    verificar();
  }, [vagaId, userProfile?.id, userType]);

  const dados = [
    { label: 'Salario', value: `R$${vaga?.salario}` },
    { label: 'Tipo', value: vaga?.tipo },
    { label: 'Endereço', value: vaga?.local },
  ];

  const getStatusVaga = (situacao?: string) => {
    switch (situacao) {
      case "Aberta":
        return "background-blue";
      case "Fechada":
        return "bg-red-400";
    }
  };

  // 🔹 Candidatar-se
  const candidatarvaga = async () => {
    const empresaId = vaga?.empresaId;
    const pcdId = userProfile?.id;
    const nome = vaga?.vaga;

    if (!vagaId || !empresaId || !pcdId) {
      openModal("Não foi possível se candidatar. Dados incompletos.");
      setTimeout(() => closeModal(), 1500);
      return;
    }

    try {
      openModal("Enviando candidatura...");

      const res = await axios.post<{ message?: string }>("/candidatar-vaga", {
        vagaId,
        empresaId,
        pcdId,
        nome,
      });

      closeModal();
      openModal(res.data?.message || "Candidatura registrada com sucesso!");
      setJaInscrito(true);
      setTimeout(() => {
        closeModal();
        router.push("/processos");
      }, 1500);

    } catch (err: any) {
      closeModal();
      openModal(
        err.response?.data?.message || "Erro ao registrar candidatura."
      );
      setTimeout(() => closeModal(), 2000);
    }
  };

  let content;
  if (loading) {
    content = <Carregamento />;
  } else if (vaga?.empresa) {
    content = (
      <div className="h-[82vh] w-full flex items-center justify-center gap-8 py-12">
        <div className="h-full w-[60%] flex flex-col items-center justify-center gap-4 pl-2">
          <img src={vaga.img || vaga.empresa?.imageProfile || "/errors/bannererror.png"} alt={vaga.empresa.name}
            className="w-[60%] h-68 object-cover rounded-3xl" />
          <h1 className="text-4xl font-bold text-color">{vaga.vaga}</h1>
          <p className="text-color text-lg">{vaga.area}</p>
          <p className={`text-xl font-bold p-1 px-3 rounded-full text-white ${getStatusVaga(vaga.status)}`}>{vaga.status}</p>
          <p className="text-color font-normal text-lg capitalize">{vaga.detalhes}</p>
        </div>

        <div className="h-full w-[40%] flex flex-col items-center justify-center gap-8 pl-2">
          <p className={`text-2xl font-bold p-1 px-3 rounded-full text-white bg-[#5B21B6]`}>Outros Detalhes</p>
          <div className="flex flex-col gap-4 self-start">
            {dados.map((item) => (
              <p key={item.label} className="text-color font-normal text-lg capitalize">
                <span className="font-bold">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>

          {/* 🔹 Só mostra o botão se o usuário for PCD */}
          {userType === "PCD" && (
            <Button
              label={jaInscrito ? "Já inscrito" : "Candidatar-se"}
              onClick={candidatarvaga}
              disabled={jaInscrito}
              className="background-green"
            />
          )}
        </div>
      </div>
    );
  } else {
    content = <ErrorCard label="Empresa não encontrada." />;
  }

  return (
    <>
      <VoltarIcon />
      {content}
    </>
  );
}
