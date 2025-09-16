import { db, storage } from "@/src/api/firebase";
import { NextResponse } from "next/server";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const chatId = formData.get("chatId") as string;
    const mensagem = (formData.get("mensagem") as string) || "";
    const origem = formData.get("origem") as string;
    const remetenteId = formData.get("remetenteId") as string;
    const file = formData.get("file") as File | null;

    if (!chatId) {
      return NextResponse.json(
        { message: "ChatId não encontrado." },
        { status: 400 }
      );
    }

    let fileUrl = "";
    if (file) {
      const storageRef = ref(storage, `chats/${chatId}/${Date.now()}-${file.name}`);
      // Converte para Buffer
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);

      // Faz upload
      await uploadBytes(storageRef, buffer, { contentType: file.type });

      // Pega o downloadURL
      fileUrl = await getDownloadURL(storageRef);
    }

    // Salvar no Firestore
    const mensagemref = collection(db, "Chat", chatId, "Mensagens");
    const payload: {
      mensagem: string;
      fileUrl: string;
      origem: string;
      data: Timestamp;
      pcdId?: string;
      empresaId?: string;
    } = {
      mensagem,
      fileUrl,
      origem,
      data: Timestamp.now(),
    };

    if (origem === "PCD") {
      payload["pcdId"] = remetenteId;
    } else if (origem === "Empresa") {
      payload["empresaId"] = remetenteId;
    }

    await addDoc(mensagemref, payload);

    return NextResponse.json({ message: "Mensagem enviada com sucesso!" }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Erro ao enviar mensagem:", error.message);
    return NextResponse.json(
      { message: "Erro interno.", error: error.message },
      { status: 500 }
    );
  }
}
