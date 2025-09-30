// src/app/api/chat/route.ts
import { db } from '@/src/api/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { empresaId, pcdId, processoId } = body;

    if (!empresaId || !pcdId || !processoId) {
      return NextResponse.json(
        { message: 'empresaId, pcdId e processoId são obrigatórios.' },
        { status: 400 }
      );
    }

    const chatsRef = collection(db, 'Chat');

    // ➕ Cria novo chat sem verificar duplicidade
    const newChatDoc = await addDoc(chatsRef, {
      empresaId,
      pcdId,
      processoId,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ chatId: newChatDoc.id }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao criar chat:', error);
    return NextResponse.json(
      {
        message: 'Erro interno ao criar chat.',
        error: error?.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
