// app/me/route.ts
import { NextResponse } from "next/server";
import { admin } from "@/src/api/firebaseadmin";
import { cookies } from "next/headers";
import { getFirestore } from "firebase-admin/firestore";

async function findUserProfile(db: any, uid: string, email?: string) {
  // 1) tenta docId = uid
  const [pcdDoc, empresaDoc] = await Promise.all([
    db.collection("PCD").doc(uid).get(),
    db.collection("Empresa").doc(uid).get(),
  ]);

  if (pcdDoc.exists) {
    return { userType: "PCD" as const, userProfile: pcdDoc.data() || {}, docId: pcdDoc.id };
  }
  if (empresaDoc.exists) {
    return { userType: "Empresa" as const, userProfile: empresaDoc.data() || {}, docId: empresaDoc.id };
  }

  // fallback: busca por uid ou email
  const pcdByUid = await db.collection("PCD").where("uid", "==", uid).limit(1).get();
  if (!pcdByUid.empty) {
    return { userType: "PCD" as const, userProfile: pcdByUid.docs[0].data() || {}, docId: pcdByUid.docs[0].id };
  }

  const empByUid = await db.collection("Empresa").where("uid", "==", uid).limit(1).get();
  if (!empByUid.empty) {
    return { userType: "Empresa" as const, userProfile: empByUid.docs[0].data() || {}, docId: empByUid.docs[0].id };
  }

  if (email) {
    const pcdByEmail = await db.collection("PCD").where("email", "==", email).limit(1).get();
    if (!pcdByEmail.empty) {
      return { userType: "PCD" as const, userProfile: pcdByEmail.docs[0].data() || {}, docId: pcdByEmail.docs[0].id };
    }

    const empByEmail = await db.collection("Empresa").where("email", "==", email).limit(1).get();
    if (!empByEmail.empty) {
      return { userType: "Empresa" as const, userProfile: empByEmail.docs[0].data() || {}, docId: empByEmail.docs[0].id };
    }
  }

  return { userType: null, userProfile: {}, docId: null };
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  console.log("Cookie:", sessionCookie);

  if (!sessionCookie) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;
    const email = decoded.email;

    const db = getFirestore();

    const { userType, userProfile, docId } = await findUserProfile(db, uid, email);

    if (!userType) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      userType,
      userProfile: { ...userProfile, id: uid, docId },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }
}
