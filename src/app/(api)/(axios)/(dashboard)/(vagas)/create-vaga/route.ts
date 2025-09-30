import { NextResponse } from 'next/server';
import { db, storage } from '@/src/api/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Vaga } from '@/src/components/types/bdtypes';

// Cria uma nova vaga
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let empresaId = '';
    let vaga = '';
    let tipo = '';
    let salario = '';
    let local = '';
    let area = '';
    let descricao = '';
    let status: string; // será definido via form ou json, default aplicado posteriormente
    let imageUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const safeText = (val: FormDataEntryValue | null, fallback = '') =>
        typeof val === 'string' ? val : fallback;
      empresaId = safeText(form.get('empresaId'));
      vaga = safeText(form.get('vaga'));
      tipo = safeText(form.get('tipo'));
      salario = safeText(form.get('salario'));
      local = safeText(form.get('local'));
      area = safeText(form.get('area'));
      descricao = safeText(form.get('descricao'));
      status = safeText(form.get('status'), 'aberta') || 'aberta';
      const file = form.get('file');
      if (file && file instanceof File) {
        const storageRef = ref(storage, `vagas/${Date.now()}-${file.name}`);
        const arrayBuffer = await file.arrayBuffer();
        await uploadBytes(storageRef, new Uint8Array(arrayBuffer), { contentType: file.type });
        imageUrl = await getDownloadURL(storageRef);
      }
    } else {
      const body = await req.json();
      empresaId = body.empresaId;
      vaga = body.vaga;
      tipo = body.tipo || '';
      salario = body.salario || '';
      local = body.local || '';
      area = body.area || '';
      descricao = body.descricao || '';
      status = body.status || 'aberta';
      imageUrl = body.img || '';
    }

    if (!empresaId || !vaga) {
      return NextResponse.json({ error: 'empresaId e título da vaga são obrigatórios.' }, { status: 400 });
    }

    const vagaData: Omit<Vaga, 'id'> = {
      empresaId,
      vaga,
      tipo,
      salario,
      local,
      area,
      descricao,
      img: imageUrl,
      status,
      createdAt: new Date().toISOString(),
    };

    const createdRef = await addDoc(collection(db, 'Vagas'), vagaData);
    return NextResponse.json({ id: createdRef.id, ...vagaData }, { status: 201 });
  } catch (e) {
    console.error('Erro ao criar vaga:', e);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
