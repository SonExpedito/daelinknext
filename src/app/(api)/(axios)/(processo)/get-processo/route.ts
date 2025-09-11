import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { processoid } = await req.json();

    if (!processoid) {
      return NextResponse.json(
        { message: "processoid é obrigatório." },
        { status: 400 }
      );
    }

    // Documento do processo
    const docRef = doc(db, "Processos", processoid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "Processo não encontrado." },
        { status: 404 }
      );
    }

    const processoData = snapshot.data();

    // ✅ Buscar subcoleção "documento"
    const documentosRef = collection(db, "Processos", processoid, "documento");
    const documentosSnap = await getDocs(documentosRef);

    // Se não tiver documentos, retorna []
    const documentos = documentosSnap.empty
      ? []
      : documentosSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

    // Buscar dados relacionados (empresa e vaga)
    let empresa = null;
    let vaga = null;

    if (processoData?.empresaId) {
      const empresaRef = doc(db, "Empresa", processoData.empresaId);
      const empresaSnap = await getDoc(empresaRef);
      if (empresaSnap.exists()) {
        empresa = { id: empresaSnap.id, ...empresaSnap.data() };
      }
    }

    if (processoData?.vagaId) {
      const vagaRef = doc(db, "Vagas", processoData.vagaId);
      const vagaSnap = await getDoc(vagaRef);
      if (vagaSnap.exists()) {
        vaga = { id: vagaSnap.id, ...vagaSnap.data() };
      }
    }

    return NextResponse.json(
      { id: snapshot.id, ...processoData, documentos, empresa, vaga },
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
