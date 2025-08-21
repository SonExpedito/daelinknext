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

    return NextResponse.json(
      { id: snapshot.id, ...snapshot.data() },
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
