// app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/src/api/firebaseadmin";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Cria session cookie (5 dias)
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(token, { expiresIn: 1000 * 60 * 60 * 24 * 5 });

    const response = NextResponse.json({ message: "Sessão criada" });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 24 * 5, // 5 dias em segundos
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }
}