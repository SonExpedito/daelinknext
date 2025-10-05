import { NextResponse } from "next/server";
import { admin } from "@/src/api/firebaseadmin"; // seu admin Firebase

export async function PATCH(req: Request) {
  try {
    const { uid, newPassword } = await req.json();

    if (!uid || !newPassword) {
      return NextResponse.json({ error: "UID ou senha não fornecida" }, { status: 400 });
    }

    // Atualiza senha do usuário
    await admin.auth().updateUser(uid, { password: newPassword });

    return NextResponse.json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao trocar senha:", error);
    return NextResponse.json({ error: "Erro ao trocar senha" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "UID não fornecido" }, { status: 400 });
    }

    // Deleta usuário
    await admin.auth().deleteUser(uid);

    return NextResponse.json({ message: "Conta deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    return NextResponse.json({ error: "Erro ao deletar conta" }, { status: 500 });
  }
}
