// app/api/me/route.ts
import { NextResponse } from "next/server";
import { admin } from "@/src/api/firebaseadmin";
import { cookies } from "next/headers";
import { getFirestore } from "firebase-admin/firestore";

export async function GET() {
  const cookieStore = await cookies(); // sem await
  const sessionCookie = cookieStore.get("session")?.value;
  console.log("Valor do cookie de sessão:", sessionCookie);

  if (!sessionCookie) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const db = getFirestore();
    const pcdDoc = await db.collection("PCD").doc(uid).get();
    const empresaDoc = await db.collection("Empresa").doc(uid).get();

    let userType = null;
    let userProfile = {};

    if (pcdDoc.exists) {
      userType = "PCD";
      userProfile = pcdDoc.data() || {};
    } else if (empresaDoc.exists) {
      userType = "Empresa";
      userProfile = empresaDoc.data() || {};
    }

    if (!userType) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
  userType,
  userProfile: { ...userProfile, id: uid },
});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }
}