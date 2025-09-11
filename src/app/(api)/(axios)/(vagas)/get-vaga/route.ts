import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { vagaId } = await req.json();

    if (!vagaId) {
      return NextResponse.json(
        { message: "vagaId é obrigatório." },
        { status: 400 }
      );
    }

    // Referência da vaga
    const docRef = doc(db, "Vagas", vagaId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "Vaga não encontrada." },
        { status: 404 }
      );
    }

    const vagaData = snapshot.data();
    let empresa = null;

    if (vagaData?.empresaId) {
      const empresaRef = doc(db, "Empresa", vagaData.empresaId);
      const empresaSnap = await getDoc(empresaRef);
      if (empresaSnap.exists()) {
        empresa = { id: empresaSnap.id, ...empresaSnap.data() };
      }
    }

    return NextResponse.json(
      { id: snapshot.id, ...vagaData, empresa },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar vaga:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}