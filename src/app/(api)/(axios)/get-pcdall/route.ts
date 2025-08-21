import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "PCD"));

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
    console.error("Error fetching PCD data:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
