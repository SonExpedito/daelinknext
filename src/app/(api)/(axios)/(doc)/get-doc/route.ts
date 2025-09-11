import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { processoid } = await req.json();

    if (!processoid) {
      return NextResponse.json(
        { message: "processoid é obrigatório." },
        { status: 400 }
      );
    }

    const documentosRef = collection(db, "Processos", processoid, "documento");
    const documentosSnap = await getDocs(documentosRef);

    const documentos = documentosSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json(
      {
        documentos,
        quantidade: documentos.length,
        primeiroId: documentos[0]?.id || null
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("🔥 Erro detalhado ao buscar processo:", error.message);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}