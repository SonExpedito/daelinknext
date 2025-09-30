import { db } from "@/src/api/firebase";
import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { vagaId, pcdId, empresaId, vagaTitulo } = await req.json();

    if (!vagaId || !pcdId || !empresaId || !vagaTitulo) {
      return NextResponse.json(
        { message: "vagaId, pcdId, empresaId e vagaTitulo são obrigatórios." },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "Processos"), {
      vagaId,
      pcdId,
      empresaId,
      nome: vagaTitulo,
      situacao: "Pendente",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Processo criado com sucesso.", id: docRef.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Erro ao criar processo:", err);
    return NextResponse.json(
      { message: "Erro ao criar processo." },
      { status: 500 }
    );
  }
}
