import { db } from '@/src/api/firebase';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenId = cookieStore.get("tokenId")?.value;
    if (!tokenId) {
      return NextResponse.json({ message: "Token não encontrado." }, { status: 401 });
    }

    // Referência do documento PCD
    const docRef = doc(db, "PCD", tokenId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "PCD não encontrado." }, { status: 404 });
    }

    return NextResponse.json(snapshot.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching PCD data:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
