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

// 🔹 Rota POST — Cadastro de Empresa
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const uid = formData.get("uid") as string | null;
    const cnpj = formData.get("cnpj") as string | null;
    const telefone = formData.get("telefone") as string | null;

    // 🧩 Validações básicas
    if (!uid) return NextResponse.json({ error: "UID é obrigatório." }, { status: 400 });
    if (!cnpj) return NextResponse.json({ error: "CNPJ é obrigatório." }, { status: 400 });
    if (!telefone) return NextResponse.json({ error: "Telefone é obrigatório." }, { status: 400 });

    // 🔹 Verificar duplicidade de CNPJ
    const q = query(collection(db, "Empresa"), where("cnpj", "==", cnpj));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return NextResponse.json({ error: "CNPJ já cadastrado." }, { status: 400 });
    }

    // 🔹 Obter arquivos enviados
    const imageProfileFile = formData.get("imageProfile") as File | null; // banner
    const imageUrlFile = formData.get("imageUrl") as File | null; // logo
    const sobreimgFile = formData.get("sobreimg") as File | null; // sobre imagem

    // 🔹 URLs dos arquivos (se existirem)
    let imageProfile: string | null = null;
    let imageUrl: string | null = null;
    let sobreimg: string | null = null;

    if (imageProfileFile) {
      imageProfile = await uploadFile(imageProfileFile, `empresas/${uid}/banner-${Date.now()}`);
    }
    if (imageUrlFile) {
      imageUrl = await uploadFile(imageUrlFile, `empresas/${uid}/logo-${Date.now()}`);
    }
    if (sobreimgFile) {
      sobreimg = await uploadFile(sobreimgFile, `empresas/${uid}/sobre-${Date.now()}`);
    }

    // 🔹 Coleta dos demais campos do formulário
    const rest: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (
        key !== "uid" &&
        key !== "cnpj" &&
        key !== "telefone" &&
        !(value instanceof File)
      ) {
        rest[key] = value;
      }
    });

    await setDoc(doc(db, "Empresa", uid), {
      uid,
      cnpj,
      telefone,
      ...rest,
      imageProfile,
      imageUrl,
      sobreimg,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Cadastro da empresa realizado com sucesso!" }, { status: 201 });
  } catch (error: any) {
    console.error("Erro no cadastro da empresa:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
