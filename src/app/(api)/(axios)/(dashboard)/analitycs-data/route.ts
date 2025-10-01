import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase"; // ajuste para o caminho do seu firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { Processo, Vaga } from "@/src/components/types/bdtypes";

export async function POST(req: Request) {
  try {
    const { empresaId } = await req.json();

    if (!empresaId) {
      return NextResponse.json({ error: "empresaId é obrigatório" }, { status: 400 });
    }

    // 🔹 Buscar vagas da empresa
    const vagasRef = collection(db, "Vagas");
    const vagasQuery = query(vagasRef, where("empresaId", "==", empresaId));
    const vagasSnap = await getDocs(vagasQuery);

    const vagas: Vaga[] = vagasSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vaga[];

    // 🔹 Buscar processos da empresa
    const processosRef = collection(db, "Processos");
    const processosQuery = query(processosRef, where("empresaId", "==", empresaId));
    const processosSnap = await getDocs(processosQuery);

    const processos: Processo[] = processosSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Processo[];

    return NextResponse.json({ vagas, processos });
  } catch (error) {
    console.error("Erro no Analytics API:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
