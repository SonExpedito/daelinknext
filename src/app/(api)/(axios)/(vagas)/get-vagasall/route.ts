import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import type { Empresa, Vaga } from "@/src/components/types/bdtypes";



export async function GET() {
  try {
    // Busca todas as vagas
    const vagasSnapshot = await getDocs(collection(db, "Vagas"));

    if (vagasSnapshot.empty) {
      return NextResponse.json([], { status: 200 }); // array vazio ao invés de 404
    }

    // Busca todas as empresas de uma vez
    const empresasSnapshot = await getDocs(collection(db, "Empresa"));
    const empresasMap: Record<string, Empresa> = {};
    empresasSnapshot.forEach(doc => {
      empresasMap[doc.id] = doc.data() as Empresa;
    });

    // Mapeia as vagas e associa a empresa
    const vagasArray: Vaga[] = vagasSnapshot.docs.map(vagaDoc => {
      const vagaData: Vaga = { id: vagaDoc.id, ...(vagaDoc.data() as any) };
      vagaData.empresa = vagaData.empresaId ? empresasMap[vagaData.empresaId] || undefined : undefined;
      return vagaData;
    });

    return NextResponse.json(vagasArray, { status: 200 });

  } catch (error: any) {
    console.error("Erro ao buscar vagas com empresas:", error.message);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
