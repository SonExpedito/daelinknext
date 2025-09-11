import { db, storage } from "@/src/api/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export async function POST(req: Request) {
  try {
    const { arquivos, processoid, objetivo, experiencia } = await req.json();

    if (!processoid || !Array.isArray(arquivos)) {
      return NextResponse.json(
        { message: "processoid e arquivos são obrigatórios." },
        { status: 400 }
      );
    }

    const documentosRef = collection(db, "Processos", processoid, "documento");
    const snap = await getDocs(documentosRef);

    if (snap.empty) {
      return NextResponse.json(
        { message: "Nenhum documento encontrado." },
        { status: 404 }
      );
    }

    const docSnap = snap.docs[0];
    const docRef = doc(db, "Processos", processoid, "documento", docSnap.id);

    const existingData = docSnap.data();
    const arquivosAntigos = existingData.arquivos || [];

    // Descobrir quais foram removidos
    const removidos = arquivosAntigos.filter(
      (url: string) => !arquivos.includes(url)
    );

    // Apagar do Storage os removidos
    for (const fileUrl of removidos) {
      try {
        const path = decodeURIComponent(
          new URL(fileUrl).pathname.split("/o/")[1].split("?")[0]
        );
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
      } catch (err) {
        console.warn("Não consegui deletar do storage:", err);
      }
    }

    // Atualizar Firestore com os arquivos e campos restantes
    await updateDoc(docRef, {
      arquivos,
      objetivo: objetivo ?? existingData.objetivo ?? "",
      experiencia: experiencia ?? existingData.experiencia ?? "",
      status: "Adicionados",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Documentos e campos atualizados com sucesso!",
      arquivos,
      objetivo,
      experiencia,
    });
  } catch (error: any) {
    console.error("🔥 Erro ao atualizar documentos:", error.message);
    return NextResponse.json(
      { message: "Erro interno.", error: error.message },
      { status: 500 }
    );
  }
}