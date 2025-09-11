'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUIStore } from "@/src/components/store/modalstore";
import type { Processo } from "@/src/components/types/bdtypes";
import { useUserStore } from "@/src/components/store/userstore";
import Carregamento from "@/src/components/elements/carregamento/carregamento";
import VoltarIcon from "@/src/components/elements/voltar/page";
import TextareaAutoResize from "@/src/components/elements/textarea/textarea";
import Input from "@/src/components/elements/input/input";
import Button from "@/src/components/elements/buttons/button";
import MultiFileUpload from "./fileupload";
import axios from "axios";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "@/src/api/firebase";

type Props = {
  processoid: string;
};

export default function DocumentoPage({ processoid }: Props) {
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [loading, setLoading] = useState(true);
  const userProfile = useUserStore(state => state.userProfile);

  // Estados dos inputs do form
  const [objetivo, setObjetivo] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [docs, setDocs] = useState<{ newFiles: File[]; keptFiles: string[] }>({
    newFiles: [],
    keptFiles: [],
  });

  const openModal = useUIStore(state => state.openModal);
  const closeModal = useUIStore(state => state.closeModal);
  const router = useRouter();

  useEffect(() => {
    const fetchProcesso = async () => {
      try {
        const res = await axios.post<Processo>("/get-processo", {
          processoid: processoid.trim(),
        });
        if (!res.data) throw new Error("Processo não encontrado.");
        setProcesso(res.data);

        // pega URLs já salvas
        const doc = res.data.documentos?.[0];
        setObjetivo(doc?.objetivo || "");
        setExperiencia(doc?.experiencia || "");
        // setDocs só uma vez, não depende de outros estados
        setDocs({
          newFiles: [],
          keptFiles: doc?.arquivos || []
        });
      } catch (err: any) {
        openModal(err?.message || "Erro ao buscar processo.");
        router.replace(`/processos/${processoid}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesso();

  }, [processoid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const newUrls = await Promise.all(
      docs.newFiles.map(async (file) => {
        const storageRef = ref(storage, `docs/${processoid}/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );

    // 2. Montar a lista final
    const finalList = [...docs.keptFiles, ...newUrls];

    // 3. Atualizar no Firestore via rota
    await axios.post("/update-doc", {
      processoid,
      arquivos: finalList,
      objetivo,
      experiencia
    });

    openModal("Documentos e campos atualizados!");
    setLoading(false);
    setTimeout(() => {
                closeModal();
                router.push(`/processos/${processoid}`);
            }, 1200);
  };

  return (
    <>
      <VoltarIcon />
      {loading ? (
        <Carregamento />
      ) : processo ? (
        <div className="h-[110vh] max-h-auto w-full flex items-center py-12">
          {/* Coluna esquerda */}
          <div className="h-full w-[45%] flex flex-col items-center justify-center gap-4">
            <div className="h-60 w-60 flex items-center justify-center rounded-3xl p-1 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg hover:bg-white/20 transition duration-300">
              <img
                src={processo.empresa?.imageUrl || "/errors/profileimg.png"}
                alt={processo.empresa?.name || "Sem Foto"}
                className="h-full object-cover rounded-3xl"
              />
            </div>
            <h1 className="text-3xl font-bold text-color">
              {processo.vaga?.vaga || "Sem Nome"}
            </h1>
            <p className="text-color text-lg font-medium">
              {processo.vaga?.descricao || "Sem Descrição"}
            </p>
          </div>

          {/* Coluna direita */}
          <div className="h-full w-[55%] flex flex-col items-center justify-center gap-8">
            <h2 className="text-[#F5F5F5] text-xl font-bold px-4 py-2 rounded-full flex items-center justify-center background-blue">
              Preencha com mais Informações
            </h2>
            <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>

              <Input
                label="Email"
                value={userProfile?.email || ""}
                readOnly
                placeholder="Email para contato"
                className="ring-1 text-color bg-white"
              />

              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-medium text-color">Objetivo</h1>
                <TextareaAutoResize
                  value={objetivo}
                  onChange={setObjetivo}
                  placeholder="Digite seu objetivo na Vaga"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-medium text-color">Experiência</h1>
                <TextareaAutoResize
                  value={experiencia}
                  onChange={setExperiencia}
                  placeholder="Digite suas experiências"
                  rows={3}
                />
              </div>

              <MultiFileUpload
                onChange={setDocs}       // Recebe { newFiles, keptFiles }
                existingFiles={docs.keptFiles}
              />

              <div className="flex gap-8">
                <Button
                  label="Enviar Docs"
                  className="background-green w-32 justify-center items-center "
                  type="submit"
                />

                <Button
                  label="Resetar"
                  className="bg-red-400 w-32 justify-center items-center "
                  type="reset"
                />
              </div>

            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}