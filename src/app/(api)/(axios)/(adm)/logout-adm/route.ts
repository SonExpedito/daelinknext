import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Sessão encerrada" });

  res.cookies.set({
    name: "adminSession",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return res;
}
