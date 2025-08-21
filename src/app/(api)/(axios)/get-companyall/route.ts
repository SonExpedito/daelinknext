import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs } from "firebase/firestore"; // Import certo no v9+

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "Empresa"));

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "Nenhuma empresa encontrada." },
        { status: 404 }
      );
    }

    const empresas: any[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(empresas, { status: 200 });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
