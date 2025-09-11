import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Empresa, Vaga, Processo } from "@/src/components/types/bdtypes";



export async function POST(req: Request) {
  try {
    const { pcdId } = await req.json();

    if (!pcdId) {
      return NextResponse.json({ message: "pcdId é obrigatório." }, { status: 400 });
    }

    // Busca todos os processos com o pcdId informado
    const processosRef = collection(db, "Processos");
    const processosQuery = query(processosRef, where("pcdId", "==", pcdId));
    const processosSnapshot = await getDocs(processosQuery);

    const processosData: Processo[] = processosSnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Processo, 'id'>;
      return {
        id: doc.id,
        nome: data.nome ?? "",
        vagaId: data.vagaId,
        empresaId: data.empresaId,
        processoId: data.processoId,
        documento: data.documento,
        empresa: data.empresa,
        vaga: data.vaga,
        situacao: data.situacao,
        ...data
      };
    });

    if (processosData.length === 0) {
      return NextResponse.json({ message: "Nenhum processo encontrado." }, { status: 404 });
    }

    const empresasSnapshot = await getDocs(collection(db, "Empresa"));
    const empresasMap: Record<string, Empresa> = {};
    empresasSnapshot.forEach(doc => {
      empresasMap[doc.id] = { id: doc.id, ...(doc.data() as any) };
    });

    const processosComDetalhes = processosData.map(processo => {
      const empresa = processo.empresaId
        ? empresasMap[processo.empresaId] || null
        : null;
      return { processo, empresa };
    });

    return NextResponse.json({ processos: processosComDetalhes }, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar processos:", error);
    return NextResponse.json({ message: "Erro ao buscar processos." }, { status: 500 });
  }
}