import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import type { Vaga } from "@/src/components/types/bdtypes";

export async function POST(req: Request) {
  try {
    const { vagaId } = await req.json();

    if (!vagaId) {
      return NextResponse.json({ message: "vagaId é obrigatório." }, { status: 400 });
    }

    const vagaRef = doc(db, "Vagas", vagaId);
    const vagaSnap = await getDoc(vagaRef);

    if (!vagaSnap.exists()) {
      return NextResponse.json({ message: "Vaga não encontrada." }, { status: 404 });
    }

    const vaga: Vaga = {
      id: vagaSnap.id,
      ...(vagaSnap.data() as any)
    };

    return NextResponse.json({ vaga }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar vaga:", error);
    return NextResponse.json({ message: "Erro ao buscar vaga." }, { status: 500 });
  }
}
