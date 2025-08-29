import { db } from '@/src/api/firebase';
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
    const { empresaId } = await req.json();

    if (!empresaId) {
        return NextResponse.json(
            { message: "empresaId é obrigatório." },
            { status: 400 }
        );
    }

    try {
        // Referência à coleção "Vagas"
        const vagasRef = collection(db, "Vagas");

        // Consulta filtrando pelo empresaId
        const buscaid = query(vagasRef, where("empresaId", "==", empresaId));
        const snapshot = await getDocs(buscaid);

        if (snapshot.empty) {
            return NextResponse.json(
                { status: 404 }
            );
        }

        // Mapeando os documentos encontrados
        const vagas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(vagas, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { message: "Erro ao buscar vagas.", error: errorMessage },
            { status: 500 }
        );
    }
}
