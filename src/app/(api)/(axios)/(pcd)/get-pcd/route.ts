import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { pcdId } = await req.json();

    if (!pcdId) {
      return NextResponse.json({ message: "pcdId é obrigatório." }, { status: 400 });
    }

    const docRef = doc(db, "PCD", pcdId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "PCD não encontrado." }, { status: 404 });
    }

    const pcdData = snapshot.data();

    return NextResponse.json({ id: snapshot.id, ...pcdData }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar PCD:", error);
    return NextResponse.json({ message: "Erro ao buscar PCD." }, { status: 500 });
  }
}
