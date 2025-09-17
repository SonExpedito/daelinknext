import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const pcdQuery = query(collection(db, "PCD"), orderBy("trabalho", "asc"));
    const snapshot = await getDocs(pcdQuery);

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "Nenhum PCD encontrado." },
        { status: 404 }
      );
    }

    const pcds: any[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(pcds, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar PCDs:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
