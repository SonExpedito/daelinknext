import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { empresaId } = await req.json();

    if (!empresaId) {
      return NextResponse.json({ message: "empresaId é obrigatório." }, { status: 400 });
    }

    const docRef = doc(db, "Empresa", empresaId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Empresa não encontrada." }, { status: 404 });
    }

    const empresaData = snapshot.data();

    return NextResponse.json({ id: snapshot.id, ...empresaData }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return NextResponse.json({ message: "Erro ao buscar empresa." }, { status: 500 });
  }
}
