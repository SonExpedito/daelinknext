import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Vaga } from "@/src/components/types/bdtypes";

export async function POST(req: Request) {
    try {
        const { empresaId } = await req.json();
        if (!empresaId) {
            return NextResponse.json({ message: "empresaId é obrigatório." }, { status: 400 });
        }

        // Busca todos os processos com o empresaId informado
        const vagasRef = collection(db, "Vagas");
        const vagasQuery = query(vagasRef, where("empresaId", "==", empresaId));
        const vagasSnapshot = await getDocs(vagasQuery);

        const vagas: Vaga[] = vagasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ vagas }, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        return NextResponse.json({ message: "Erro ao buscar vagas." }, { status: 500 });
    }
}
