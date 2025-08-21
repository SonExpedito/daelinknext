import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, doc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { vagaId, candidatoDoc, IdDoc } = await req.json();

    if (!vagaId || !candidatoDoc || !IdDoc) {
      return NextResponse.json(
        { message: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    // Cria a referência do documento
    const docRef = doc(
      db,
      "Vagas",
      vagaId,
      "candidatos",
      candidatoDoc,
      "documentos",
      IdDoc
    );
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "Documento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: snapshot.id, ...snapshot.data() }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar documento:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
