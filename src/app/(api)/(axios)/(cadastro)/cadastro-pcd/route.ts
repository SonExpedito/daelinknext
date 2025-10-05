import { NextResponse } from "next/server";
import { db, storage } from "@/src/api/firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const runtime = "nodejs"; // garante Node.js para usar Buffer

// 🔹 Função utilitária para upload de arquivo no Firebase Storage
async function uploadFile(file: File, path: string) {
  const storageRef = ref(storage, path);
  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadBytes(storageRef, buffer, { contentType: file.type });
  return await getDownloadURL(storageRef);
}

// 🔹 Rota POST — Cadastro de PCD
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const uid = formData.get("uid") as string | null;
    const cpf = formData.get("cpf") as string | null;
    const telefone = formData.get("telefone") as string | null;

    // 🧩 Validações básicas
    if (!uid) {
      return NextResponse.json({ error: "UID é obrigatório." }, { status: 400 });
    }
    if (!cpf) {
      return NextResponse.json({ error: "CPF é obrigatório." }, { status: 400 });
    }

    // 🔹 Verificar duplicidade de CPF
    const q = query(collection(db, "PCD"), where("cpf", "==", cpf));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return NextResponse.json({ error: "CPF já cadastrado." }, { status: 400 });
    }

    // 🔹 Obter arquivos enviados
    const imageProfileFile = formData.get("imageProfile") as File | null;
    const imageUrlFile = formData.get("imageUrl") as File | null;
    const laudoFile = formData.get("laudomedico") as File | null;

    // 🔹 URLs dos arquivos (se existirem)
    let imageProfile: string | null = null;
    let imageUrl: string | null = null;
    let laudoUrl: string | null = null;

    if (imageProfileFile) {
      imageProfile = await uploadFile(imageProfileFile, `pcd/${uid}/profile-${Date.now()}`);
    }
    if (imageUrlFile) {
      imageUrl = await uploadFile(imageUrlFile, `pcd/${uid}/extra-${Date.now()}`);
    }
    if (laudoFile) {
      laudoUrl = await uploadFile(laudoFile, `pcd/${uid}/laudo-${Date.now()}`);
    }

    // 🔹 Coleta dos demais campos do formulário
    const rest: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (
        key !== "uid" &&
        key !== "cpf" &&
        key !== "telefone" &&
        !(value instanceof File)
      ) {
        rest[key] = value;
      }
    });

    // 🔹 Cria ou substitui documento com ID = UID
    await setDoc(doc(db, "PCD", uid), {
      uid,
      cpf,
      telefone,
      ...rest,
      imageProfile,
      imageUrl,
      laudoUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Cadastro realizado com sucesso!" }, { status: 201 });
  } catch (error: any) {
    console.error("Erro no cadastro PCD:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
