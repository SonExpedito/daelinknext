// app/api/create-doc/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { processoid } = await req.json();

    if (!processoid) {
      return NextResponse.json(
        { error: "processoid é obrigatório." },
        { status: 400 }
      );
    }

    // cria documento na subcoleção correta
    const docRef = await addDoc(
      collection(db, "Processos", processoid, "documento"),
      {
        arquivos: [],
        objetivo: "",
        experiencia: "",
        status: "Criado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    // Retorna no formato esperado pelo seu type Documento
    return NextResponse.json({
      id: docRef.id,
      arquivos: [],
      objetivo: "",
      experiencia: "",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
