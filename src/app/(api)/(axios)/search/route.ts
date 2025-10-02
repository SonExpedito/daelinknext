import { NextResponse } from "next/server";
import { db } from "@/src/api/firebase"; 
import {
  collection,
  query as fsQuery,
  where,
  getDocs,
} from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchText = searchParams.get("query") || "";
    const userType = searchParams.get("userType") || "generic";
    const userId = searchParams.get("userId");

    if (!searchText) return NextResponse.json([], { status: 200 });

    let results: any[] = [];

    async function searchCollection(
      collectionName: string,
      searchField: string,
      extraFilters: any[] = []
    ) {
      const colRef = collection(db, collectionName);

      // 🔍 query flexível
      const q = fsQuery(
        colRef,
        where(searchField, ">=", searchText),
        where(searchField, "<=", searchText + "\uf8ff"),
        ...extraFilters
      );

      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        _collection: collectionName,
      }));
    }

    if (userType === "PCD") {
      if (!userId)
        return NextResponse.json({ error: "Usuário PCD não identificado" }, { status: 400 });

      const vagas = await searchCollection("Vagas", "vaga");
      const processos = await searchCollection("Processos", "nome", [
        where("pcdId", "==", userId),
      ]);
      const empresas = await searchCollection("Empresa", "name");

      results = [...vagas, ...processos, ...empresas];
    } else if (userType === "Empresa") {
      if (!userId)
        return NextResponse.json({ error: "Usuário Empresa não identificado" }, { status: 400 });

      const vagas = await searchCollection("Vagas", "vaga", [
        where("empresaId", "==", userId),
      ]);
      const processos = await searchCollection("Processos", "nome", [
        where("empresaId", "==", userId),
      ]);
      const pcds = await searchCollection("PCD", "name");

      results = [...vagas, ...processos, ...pcds];
    } else {
      // fallback caso não tenha userType
      const vagas = await searchCollection("Vagas", "vaga");
      const empresas = await searchCollection("Empresa", "name");

      results = [...vagas, ...empresas];
    }

    return NextResponse.json(results, { status: 200 });
} catch (err: any) {
  if (err.code === "failed-precondition" && err.message.includes("index")) {
    console.error("⚠️ Índice Firestore necessário:", err.message);
    return NextResponse.json(
      { error: "É necessário criar um índice no Firestore para esta consulta." },
      { status: 400 }
    );
  }

  console.error("Erro no /search:", err);
  return NextResponse.json({ error: "Erro interno" }, { status: 500 });
}
}
