import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VoltarIcon() {
  const router = useRouter();

  const handleVoltar = () => {
    router.back();
  };

  return (
    <div className="h-auto w-full flex items-center py-4 px-12 absolute">
      <div
        onClick={handleVoltar}
        className="flex items-center gap-2 cursor-pointer 
          font-bold text-white background-green pr-4 py-1 rounded-full 
          border border-white/30 shadow-md backdrop-blur-xl backdrop-saturate-150
          hover:scale-105 hover:opacity-90 transition-all"
      >
        <ChevronLeft size={28} />
        <p className="text-lg">Voltar</p>
      </div>
    </div>
  );
}
