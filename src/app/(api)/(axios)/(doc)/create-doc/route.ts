// app/api/create-doc/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { processoid } = await req.json();

    const docRef = await addDoc(collection(db, "Documentos"), {
      processoid,
      nome: "",
      formacao: "",
      experiencia: "",
      createdAt: new Date(),
    });

    // Retorna exatamente no formato do seu type Documento
    return NextResponse.json({
      id: docRef.id,
      nome: "",
      formacao: "",
      experiencia: "",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
