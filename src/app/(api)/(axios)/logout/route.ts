// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "cookies deletados" });

  // cookies que você quer limpar
  const cookiesToRemove = ["tokenId", "userType"];

  cookiesToRemove.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(0), // expira imediatamente
      path: "/",
    });
  });

  return response;
}
