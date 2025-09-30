// app/api/processos/[id]/situacao/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase";// ajuste se seu firebase estiver em outro lugar
import { doc, updateDoc } from "firebase/firestore";


export async function PUT(req: Request) {
  try {
    const { situacao, processoId } = await req.json();
    const ref = doc(db, "Processos", processoId);

    await updateDoc(ref, { situacao });

    return NextResponse.json({ success: true, situacao });
  } catch (error) {
    console.error("Erro ao atualizar situação:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
