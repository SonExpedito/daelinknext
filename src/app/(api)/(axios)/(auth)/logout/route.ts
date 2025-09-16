// src/app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Agora remove também o cookie de sessão
  const cookiesToRemove = ["session", "tokenId", "userType"];

  cookiesToRemove.forEach((cookieName) => {
    cookieStore.set({
      name: cookieName,
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      expires: new Date(0),
    });
  });

  return NextResponse.json({ message: "cookies deletados" });
}