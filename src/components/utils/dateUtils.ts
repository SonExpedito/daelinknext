// utils/dateUtils.ts
export function formatarDataNasc(dataNasc: any) {
  if (!dataNasc) return { idade: "Não informada", dataFormatada: "sem data" };

  let nascimento: Date;

  if (dataNasc instanceof Date) {
    nascimento = dataNasc;
  } else if (typeof dataNasc === "string") {
    nascimento = new Date(dataNasc);
  } else if (dataNasc?.seconds) {
    nascimento = new Date(dataNasc.seconds * 1000); // Timestamp Firestore cru
  } else {
    return { idade: "Data inválida", dataFormatada: "Data inválida" };
  }

  // Calcula idade
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  // Formata data dd/mm/aaaa
  const dataFormatada = nascimento.toLocaleDateString("pt-BR");

  return { idade, dataFormatada };
}
