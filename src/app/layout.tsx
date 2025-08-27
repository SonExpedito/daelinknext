import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserInitializer from "@/src/components/store/UserInitializer";
import ClientWrapper from "@/src/components/provider/ClientWrapper";
import "./globals.css";
import Modal from "@/src/components/elements/modal/modal";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Daelink",
  description: "Plataforma de Conectividade PCD",
  icons: { icon: "/favicon.ico" }, // favicon aqui
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}>
        <Modal />
        <UserInitializer />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
