import { NextResponse } from "next/server";
import { db, storage } from "@/src/api/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const runtime = "nodejs";

async function toBuffer(file: any): Promise<Buffer> {
  if (!file) throw new Error("Nenhum arquivo fornecido");

  if (typeof file.arrayBuffer === "function") {
    const ab = await file.arrayBuffer();
    return Buffer.from(ab);
  }

  if (typeof file.stream === "function") {
    const reader = file.stream().getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return Buffer.concat(chunks.map((c) => Buffer.from(c)));
  }

  if (typeof (file as Blob).arrayBuffer === "function") {
    const ab = await (file as Blob).arrayBuffer();
    return Buffer.from(ab);
  }

  throw new Error("Tipo de arquivo não suportado");
}

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

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const uid = formData.get("uid") as string;

    if (!uid) return NextResponse.json({ error: "UID é obrigatório." }, { status: 400 });

    const empresaRef = doc(db, "Empresa", uid);
    const empresaSnap = await getDoc(empresaRef);

    if (!empresaSnap.exists()) return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 });

    const empresaData = empresaSnap.data();

    const imageProfileFile = formData.get("imageProfile") as any | null;
    const imageUrlFile = formData.get("imageUrl") as any | null;
    const sobreimgFile = formData.get("sobreimg") as any | null;

    let imageProfile = empresaData.imageProfile || null;
    let imageUrl = empresaData.imageUrl || null;
    let sobreimg = empresaData.sobreimg || null;

    if (imageProfileFile && typeof imageProfileFile !== "string") {
      imageProfile = await uploadReplace(imageProfileFile, `empresa/${uid}/profile`, empresaData.imageProfile);
    }

    if (imageUrlFile && typeof imageUrlFile !== "string") {
      imageUrl = await uploadReplace(imageUrlFile, `empresa/${uid}/extra`, empresaData.imageUrl);
    }

    if (sobreimgFile && typeof sobreimgFile !== "string") {
      sobreimg = await uploadReplace(sobreimgFile, `empresa/${uid}/sobre`, empresaData.sobreimg);
    }

    const updates: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) return;
      updates[key] = value;
    });

    delete updates.uid;
    delete updates.id;

    if (typeof updates.verified === "string") {
      updates.verified = updates.verified === "true";
    }

    await updateDoc(empresaRef, {
      ...updates,
      imageProfile,
      imageUrl,
      sobreimg,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Perfil atualizado com sucesso!", imageProfile, imageUrl, sobreimg },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar Empresa:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
