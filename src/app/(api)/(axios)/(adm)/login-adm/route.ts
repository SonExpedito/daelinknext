import { NextResponse } from "next/server";
import { auth, db } from "@/src/api/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Faz login pelo Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Busca o papel do usuário (role)
    const userDoc = await getDoc(doc(db, "Admin", user.uid));

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "Usuário não encontrado na coleção Admin." }, { status: 403 });
    }

    const tipo = userDoc.data()?.tipo;
    if (tipo !== "Adm") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    // Cria cookie de sessão simples
    const res = NextResponse.json({ message: "Login bem-sucedido", uid: user.uid });
    res.cookies.set("adminSession", user.uid, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2, // 2h
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao fazer login" }, { status: 401 });
  }
}
