'use client'
import { useState, useEffect } from "react";
import { FilePlus, Trash2, Download } from "lucide-react";

type Props = {
  onChange: (data: { newFiles: File[]; keptFiles: string[] }) => void;
  existingFiles?: string[]; // urls vindas do banco
};

export default function MultiFileUpload({ onChange, existingFiles = [] }: Props) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptFiles, setKeptFiles] = useState<string[]>([]);

  // Inicializa apenas uma vez
  useEffect(() => {
    setKeptFiles(existingFiles);
  }, []);

  // Notifica o pai apenas quando os arquivos realmente mudarem
  useEffect(() => {
    onChange({ newFiles, keptFiles });
  }, [newFiles, keptFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    // Limite de 3 arquivos no total
    const updated = [...newFiles, ...selected].slice(0, 3 - keptFiles.length);
    setNewFiles(updated);
    e.target.value = ""; // resetar input
  };

  const removeNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const removeSavedFile = (index: number) => {
    setKeptFiles(keptFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="w-4/5 flex flex-col gap-4 text-color">
      <h2 className="text-lg font-semibold text-color">Anexar Documentos</h2>

      {/* Input de arquivos */}
      <input
        type="file"
        multiple
        className="hidden"
        id="multi-file"
        onChange={handleFileChange}
        disabled={newFiles.length + keptFiles.length >= 3}
      />
      <label
        htmlFor="multi-file"
        className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg 
          text-white font-medium py-3 px-6 rounded-2xl flex items-center gap-2 justify-center 
          hover:bg-white/20 transition duration-300
          ${newFiles.length + keptFiles.length < 3 ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
      >
        <FilePlus size={20} />
        {newFiles.length + keptFiles.length >= 3
          ? "Limite de Arquivos"
          : "Escolher Arquivos"}
      </label>

      {/* Arquivos salvos */}
      {keptFiles.map((url, index) => (
        <div
          key={`saved-${index}`}
          className="flex items-center justify-between px-4 py-2 rounded-2xl 
            bg-white/10 backdrop-blur-lg border border-white/20 shadow-md"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-300 hover:text-blue-400 truncate max-w-[220px]"
          >
            Documento {index + 1}
          </a>
          <div className="flex gap-3">
            <a
              href={url}
              download
              className="text-green-300 hover:text-green-400 cursor-pointer"
              aria-label={`Baixar documento ${index + 1}`}
            >
              <Download size={18} />
            </a>
            <button
              onClick={() => removeSavedFile(index)}
              className="text-red-300 hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Arquivos novos */}
      {newFiles.map((file, index) => (
        <div
          key={`new-${index}`}
          className="flex items-center justify-between px-4 py-2 rounded-2xl 
            bg-white/10 backdrop-blur-lg border border-white/20 shadow-md hover:bg-white/20 transition"
        >
          <span className="text-sm truncate max-w-[220px]">{file.name}</span>
          <div className="flex gap-3">
            <a
              href={URL.createObjectURL(file)}
              download={file.name}
              className="text-green-300 hover:text-green-400 cursor-pointer"
              aria-label={`Baixar ${file.name}`}
            >
              <Download size={18} />
            </a>
            <button
              onClick={() => removeNewFile(index)}
              className="text-red-300 hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
