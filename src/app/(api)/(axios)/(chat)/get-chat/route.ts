import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';


export async function POST(req: Request) {
  try {
    const { processoId } = await req.json();

      if (!processoId) {
        console.log("Missing processoId");
      return NextResponse.json(
        { message: "processoId é obrigatório." },
        { status: 400 }
      );
    }

    const chatRef = collection(db, "Chat");
    const chatQuery = query(
      chatRef,
      where("processoId", "==", processoId)
    );
    const chatSnap = await getDocs(chatQuery);

    if (chatSnap.empty) {
      return NextResponse.json({ empty: true, data: [] }, { status: 200 });
    }

    const chatData = chatSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ empty: false, data: chatData }, { status: 200 });

  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json({ message: "Error fetching chat" }, { status: 500 });
  }
}
