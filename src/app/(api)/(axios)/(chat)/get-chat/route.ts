import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { processoId, chatId } = await req.json();

    // Caso venha o chatId, busca direto o documento
    if (chatId) {
      const chatDocRef = doc(db, "Chat", chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        return NextResponse.json({ empty: true, data: null }, { status: 200 });
      }

      const chatData = chatDocSnap.data();  
      return NextResponse.json({ id: chatDocSnap.id, ...chatData }, { status: 200 });
    }

    // Caso não tenha chatId, exige processoId
    if (!processoId) {
      console.log("Missing processoId");
      return NextResponse.json(
        { message: "processoId é obrigatório se não houver chatId." },
        { status: 400 }
      );
    }

    // Busca pelo processoId
    const chatRef = collection(db, "Chat");
    const chatQuery = query(chatRef, where("processoId", "==", processoId));
    const chatSnap = await getDocs(chatQuery);

    if (chatSnap.empty) {
      return NextResponse.json({ empty: true, data: null }, { status: 200 });
    }

    const docSnap = chatSnap.docs[0];
    const chatData = { id: docSnap.id, ...docSnap.data() };

    return NextResponse.json({ empty: false, data: chatData }, { status: 200 });

  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json({ message: "Error fetching chat" }, { status: 500 });
  }
}
