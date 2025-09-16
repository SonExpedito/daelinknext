import type { PCD, Empresa } from "@/src/components/types/bdtypes";

export function getSituacaoClass(origem?: string): string {
  switch (origem) {
    case "Empresa":
      return "background-blue self-start";
    case "PCD":
      return "background-green self-end";
    default:
      return "";
  }
}

export function getName(origem: string | undefined, userType: string | null, participante: PCD | Empresa | null) {
  return origem === userType ? "Você" : participante?.name;
}

export function isImage(url?: string): boolean {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url.split("?")[0]);
}
