import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { PCD, Processo } from "@/src/components/types/bdtypes";

export async function POST(req: Request) {
  try {
    const { vagaId } = await req.json();

    if (!vagaId) {
      return NextResponse.json({ message: "vagaId é obrigatório." }, { status: 400 });
    }

    // Busca todos os processos com o vagaId informado
    const processosRef = collection(db, "Processos");
    const processosQuery = query(processosRef, where("vagaId", "==", vagaId));
    const processosSnapshot = await getDocs(processosQuery);

    const processosData: Processo[] = processosSnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nome: data.nome ?? "", // fallback caso não exista
        ...data
      } as Processo;
    });

    if (processosData.length === 0) {
      return NextResponse.json({ message: "Nenhum processo encontrado." }, { status: 404 });
    }

    // Monta mapa de PCDs
    const pcdsnap = await getDocs(collection(db, "PCD"));
    const pcdMap: Record<string, PCD> = {};
    pcdsnap.forEach(doc => {
      pcdMap[doc.id] = { id: doc.id, ...(doc.data() as any) };
    });

    // Junta os dados (apenas processo + pcd)
    const processosComDetalhes = processosData.map(processo => {
      const pcd = processo.pcdId ? pcdMap[processo.pcdId] || null : null;
      return { processo, pcd };
    });

    return NextResponse.json({ processos: processosComDetalhes }, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar processos:", error);
    return NextResponse.json({ message: "Erro ao buscar processos." }, { status: 500 });
  }
}
