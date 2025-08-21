import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "Vagas"));

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "Nenhuma vaga encontrada." },
        { status: 404 }
      );
    }

    const vagas: any[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(vagas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
