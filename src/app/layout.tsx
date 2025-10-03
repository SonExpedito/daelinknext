import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeInitializer from "@/src/components/provider/ThemeInitializer";
import Modal from "@/src/components/elements/modal/modal";
import UserGate from "../components/gate/UserGate";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daelink",
  description: "Plataforma de Conectividade PCD",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <ThemeInitializer />
      </head>
      <body className={`${inter.variable} antialiased overflow-x-hidden`}>
        <Modal />
        <UserGate>
          {children}
        </UserGate>
      </body>
    </html>
  );
}
