import { NextResponse } from 'next/server';
import { db, storage } from '@/src/api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Atualiza vaga existente
export async function PUT(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const parseMultipart = async () => {
      const form = await req.formData();
      const val = (k: string) => {
        const v = form.get(k); return typeof v === 'string' ? v : undefined;
      };
      let imgUrl: string | undefined;
      const file = form.get('file');
      if (file && file instanceof File) {
        const storageRef = ref(storage, `vagas/${Date.now()}-${file.name}`);
        const buf = await file.arrayBuffer();
        await uploadBytes(storageRef, new Uint8Array(buf), { contentType: file.type });
        imgUrl = await getDownloadURL(storageRef);
      }
      return {
        id: val('id') || '',
        vaga: val('vaga'),
        tipo: val('tipo'),
        salario: val('salario'),
        local: val('local'),
        area: val('area'),
        descricao: val('descricao'),
        status: val('status'),
        img: imgUrl,
      };
    };
    const parseJson = async () => {
      const body = await req.json();
      return {
        id: body.id || '',
        vaga: body.vaga,
        tipo: body.tipo,
        salario: body.salario,
        local: body.local,
        area: body.area,
        descricao: body.descricao,
        status: body.status,
        img: body.img,
      } as Record<string, any>;
    };

    const { id, vaga, tipo, salario, local, area, descricao, status, img: newImageUrl } = contentType.includes('multipart/form-data')
      ? await parseMultipart()
      : await parseJson();

    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });

    const vagaRef = doc(db, 'Vagas', id);
    const snapshot = await getDoc(vagaRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Vaga não encontrada.' }, { status: 404 });
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
  if (vaga !== undefined) updateData.vaga = vaga;
  if (tipo !== undefined) updateData.tipo = tipo;
  if (salario !== undefined) updateData.salario = salario;
  if (local !== undefined) updateData.local = local;
  if (area !== undefined) updateData.area = area;
  if (descricao !== undefined) updateData.descricao = descricao;
  if (newImageUrl !== undefined) updateData.img = newImageUrl;
  if (status !== undefined) updateData.status = status;

  await updateDoc(vagaRef, updateData);
  const merged = { id, ...snapshot.data(), ...updateData };
  return NextResponse.json(merged, { status: 200 });
  } catch (e) {
    console.error('Erro ao atualizar vaga:', e);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// Alias POST caso o front envie POST por padrão
export { PUT as POST };
