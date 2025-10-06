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

// DESATIVAR usuário
export async function DELETE(req: Request) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "UID não fornecido" }, { status: 400 });
    }

    // Desativa usuário sem deletar
    await admin.auth().updateUser(uid, { disabled: true });

    return NextResponse.json({ message: "Conta desativada com sucesso!" });
  } catch (error) {
    console.error("Erro ao desativar conta:", error);
    return NextResponse.json({ error: "Erro ao desativar conta" }, { status: 500 });
  }
}
