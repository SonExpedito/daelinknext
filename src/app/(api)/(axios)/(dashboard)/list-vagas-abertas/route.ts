import { db } from "@/src/api/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { Vaga } from "@/src/components/types/bdtypes";

export async function POST(req: Request) {
  try {
    const { empresaId } = await req.json();

    if (!empresaId) {
      return NextResponse.json(
        { message: "empresaId é obrigatório." },
        { status: 400 }
      );
    }

    const q = query(
      collection(db, "Vagas"),
      where("empresaId", "==", empresaId),
      where("status", "==", "Aberta")
    );

    const snap = await getDocs(q);

    const vagas: Vaga[] = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Vaga[];

    return NextResponse.json(vagas, { status: 200 });
  } catch (err: any) {
    console.error("Erro ao buscar vagas:", err);
    return NextResponse.json(
      { message: "Erro ao buscar vagas." },
      { status: 500 }
    );
  }
}
