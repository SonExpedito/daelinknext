import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserInitializer from "@/src/components/store/UserInitializer";
import ClientWrapper from "@/src/components/provider/ClientWrapper";
import ThemeInitializer from "@/src/components/provider/ThemeInitializer";
import Modal from "@/src/components/elements/modal/modal";
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
        <UserInitializer />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
