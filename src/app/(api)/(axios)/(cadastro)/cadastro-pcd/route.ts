import { NextResponse } from "next/server";
import { db, storage } from "@/src/api/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const runtime = "nodejs";

// Converte para Buffer (arrayBuffer ou stream)
async function toBuffer(file: any): Promise<Buffer> {
  if (!file) throw new Error("No file provided");

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
  throw new Error("Unsupported file type");
}

// Pega o File mesmo se houver valores repetidos na mesma chave
function pickFileFromFormData(fd: FormData, key: string): File | null {
  const all = (fd as any).getAll?.(key) ?? [];
  const fileVal = all.find((v: any) => typeof File !== "undefined" && v instanceof File);
  return (fileVal as File) || null;
}

// Sobe novo primeiro, depois remove o antigo
async function uploadNewThenDeleteOld(params: {
  file: File;
  newPath: string;
  oldUrl?: string | null;
}) {
  const { file, newPath, oldUrl } = params;

  // Upload do novo
  const storageRef = ref(storage, newPath);
  const buffer = await toBuffer(file);
  await uploadBytes(storageRef, buffer, { contentType: (file as any).type || "application/octet-stream" });
  const newUrl = await getDownloadURL(storageRef);

  // Remove o antigo (se existir)
  if (oldUrl) {
    try {
      const oldRef = ref(storage, oldUrl);
      await deleteObject(oldRef);
    } catch (e) {
      console.warn("Falha ao excluir arquivo antigo:", oldUrl, e);
    }
  }
  return newUrl;
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const uid = formData.get("uid") as string;

    if (!uid) {
      return NextResponse.json({ error: "UID é obrigatório." }, { status: 400 });
    }

    const userRef = doc(db, "PCD", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }
    const userData = snap.data();

    // Garante que pegamos o File (não a string) mesmo se houver duplicidade
    const imageProfileFile = pickFileFromFormData(formData, "imageProfile");
    const imageUrlFile = pickFileFromFormData(formData, "imageUrl");

    let imageProfile: string | null = userData.imageProfile || null;
    let imageUrl: string | null = userData.imageUrl || null;

    // Usa nomes únicos para evitar cache e colisão
    if (imageProfileFile) {
      imageProfile = await uploadNewThenDeleteOld({
        file: imageProfileFile,
        newPath: `pcd/${uid}/profile-${Date.now()}`,
        oldUrl: userData.imageProfile ?? null,
      });
    }
    if (imageUrlFile) {
      imageUrl = await uploadNewThenDeleteOld({
        file: imageUrlFile,
        newPath: `pcd/${uid}/extra-${Date.now()}`,
        oldUrl: userData.imageUrl ?? null,
      });
    }

    // Campos simples
    const updates: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) return;
      updates[key] = value;
    });
    delete updates.uid;
    delete updates.id;

    if (typeof updates.perfilvertical === "string") updates.perfilvertical = updates.perfilvertical === "true";
    if (typeof updates.empresapick === "string") updates.empresapick = updates.empresapick === "true";

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
  } catch (err) {
    console.error("Erro ao atualizar PCD:", err);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}