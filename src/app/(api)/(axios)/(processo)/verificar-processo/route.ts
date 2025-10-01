// app/api/verificar-candidatura/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vagaId, pcdId } = body;

    if (!vagaId || !pcdId) {
      return NextResponse.json(
        { message: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const processosRef = collection(db, "Processos");
    const q = query(
      processosRef,
      where("vagaId", "==", vagaId),
      where("pcdId", "==", pcdId)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      return NextResponse.json(
        { exists: true, message: "Você já está inscrito nesta vaga." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { exists: false, message: "Ainda não inscrito." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao verificar candidatura." },
      { status: 500 }
    );
  }
}
