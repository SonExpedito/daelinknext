import { Sparkles } from 'lucide-react'; 

type MagicButtonProps = {
  readonly onToggle: () => void;
  readonly active: boolean;
};

export function MagicButton({ onToggle, active }: MagicButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        px-4 py-2 flex items-center justify-center rounded-full text-white text-lg
        cursor-pointer hover-size border border-white/30 shadow-md
        backdrop-blur-xl backdrop-saturate-150
        transition-colors duration-300 ease-in-out
        ${active ? 'background-green' : 'background-blue'}
      `}
    >
      <Sparkles className="w-5 h-5 mr-2" />
      {active ? 'Recomendações Ativas' : 'Recomendações Mágicas'}
    </button>
  );
}
