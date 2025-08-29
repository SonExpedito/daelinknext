interface ErrorCardProps {
    label: string;
}


export default function ErrorCard({ label }: ErrorCardProps) {
    return (
        <div
            className="w-72 h-40 p-4 rounded-2xl flex items-center justify-center cursor-pointer
            border border-black/80 dark:border-white/30 shadow-inner hover:scale-105 transition-transform duration-300
            bg-gradient-to-br from-black/80 via-black/15 to-black/80 dark:from-white/20 dark:via-white/15 dark:to-white/20
            backdrop-blur-[22px] saturate-150"
        >
            <p className="text-color font-bold">{label}</p>
        </div>
    );
}