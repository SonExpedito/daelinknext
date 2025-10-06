import { NextResponse } from "next/server";
import { db, storage } from "@/src/api/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const runtime = "nodejs";

// Helper: convert unknown file/blob to Buffer (arrayBuffer or stream fallback)
async function toBuffer(file: any): Promise<Buffer> {
  if (!file) throw new Error("No file provided");

  if (typeof file.arrayBuffer === "function") {
    const ab = await file.arrayBuffer();
    return Buffer.from(ab);
  }

  if (typeof file.stream === "function") {
    const reader = file.stream().getReader();
    const chunks: Uint8Array[] = [];
    // Read from Web ReadableStream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return Buffer.concat(chunks.map((c) => Buffer.from(c)));
  }

  // Blob fallback
  if (typeof (file as Blob).arrayBuffer === "function") {
    const ab = await (file as Blob).arrayBuffer();
    return Buffer.from(ab);
  }

  throw new Error("Unsupported file type");
}

// Upload + replace previous file (if any)
async function uploadReplace(file: any, path: string, oldUrl?: string) {
  const storageRef = ref(storage, path);

  if (oldUrl) {
    try {
      const oldRef = ref(storage, oldUrl);
      await deleteObject(oldRef);
    } catch {
      console.warn("Arquivo anterior não encontrado para exclusão:", oldUrl);
    }
  }

  const buffer = await toBuffer(file);
  await uploadBytes(storageRef, buffer, { contentType: file.type || "application/octet-stream" });
  return await getDownloadURL(storageRef);
}

// PUT — Atualizar PCD
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const uid = formData.get("uid") as string;

    if (!uid) {
      return NextResponse.json({ error: "UID é obrigatório." }, { status: 400 });
    }

    const userRef = doc(db, "PCD", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const userData = userSnap.data();

    // Arquivos
    const imageProfileFile = formData.get("imageProfile") as any | null;
    const imageUrlFile = formData.get("imageUrl") as any | null;

    let imageProfile = userData.imageProfile || null;
    let imageUrl = userData.imageUrl || null;

    if (imageProfileFile && typeof imageProfileFile !== "string") {
      imageProfile = await uploadReplace(imageProfileFile, `pcd/${uid}/profile`, userData.imageProfile);
    }

    if (imageUrlFile && typeof imageUrlFile !== "string") {
      imageUrl = await uploadReplace(imageUrlFile, `pcd/${uid}/extra`, userData.imageUrl);
    }

    // Outros campos
    const updates: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) return;
      updates[key] = value;
    });

    // Não persistir identificadores enviados via form
    delete updates.uid;
    delete updates.id;

    // Normalização de tipos
    if (typeof updates.perfilvertical === "string") {
      updates.perfilvertical = updates.perfilvertical === "true";
    }
    if (typeof updates.empresapick === "string") {
      updates.empresapick = updates.empresapick === "true";
    }

    await updateDoc(userRef, {
      ...updates,
      imageProfile,
      imageUrl,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Perfil atualizado com sucesso!", imageProfile, imageUrl },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao atualizar PCD:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}