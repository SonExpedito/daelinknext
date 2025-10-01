// app/api/candidatar-vaga/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vagaId, empresaId, pcdId, nome } = body;

    if (!vagaId || !empresaId || !pcdId) {
      return NextResponse.json(
        { message: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const processosRef = collection(db, "Processos");

    const newProcesso = {
      vagaId,
      empresaId,
      pcdId,
      nome,
      situacao: "Pendente",
      createdAt: new Date(),
    };

    const docRef = await addDoc(processosRef, newProcesso);

    return NextResponse.json(
      { message: "Candidatura registrada com sucesso!", id: docRef.id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao registrar candidatura." },
      { status: 500 }
    );
  }
}
