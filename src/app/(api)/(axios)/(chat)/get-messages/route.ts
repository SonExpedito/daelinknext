import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();

    if (!chatId) {
      console.log("Missing chatId");
      return NextResponse.json(
        { message: "chatId é obrigatório." },
        { status: 400 }
      );
    }

    const messagesRef = collection(db, "Chat", chatId, "Mensagens");
    const messagesQuery = query(messagesRef, orderBy("data", "asc"));
    const messagesSnap = await getDocs(messagesQuery);

    if (messagesSnap.empty) {
      return NextResponse.json({ empty: true, data: [] }, { status: 200 });
    }

    const messages = messagesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ empty: false, data: messages }, { status: 200 });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Error fetching messages" }, { status: 500 });
  }
}
