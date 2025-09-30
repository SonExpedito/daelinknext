import { db } from '@/src/api/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { empresaId, pcdId, processoId } = await req.json();

    if (!empresaId || !pcdId || !processoId) {
      return NextResponse.json(
        { message: "empresaId, pcdId e processoId são obrigatórios." },
        { status: 400 }
      );
    }

    const chatsRef = collection(db, "Chat");

    // Verifica se já existe chat para esse processo
    const q = query(
      chatsRef,
      where("empresaId", "==", empresaId),
      where("pcdId", "==", pcdId),
      where("processoId", "==", processoId)
    );

    const existingChatsSnap = await getDocs(q);
    if (!existingChatsSnap.empty) {
      const existingChat = existingChatsSnap.docs[0];
      return NextResponse.json({ chatId: existingChat.id }, { status: 200 });
    }

    // Cria novo chat
    const newChatDoc = await addDoc(chatsRef, {
      empresaId,
      pcdId,
      processoId,
      createdAt: new Date().toISOString(),
      messages: [] 
    });

    return NextResponse.json({ chatId: newChatDoc.id }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao criar chat:", error.message);
    return NextResponse.json(
      { message: "Erro interno ao criar chat.", error: error.message },
      { status: 500 }
    );
  }
}
