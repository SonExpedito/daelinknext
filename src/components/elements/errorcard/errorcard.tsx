interface ErrorCardProps {
    label: string;
}


export default function ErrorCard({ label }: ErrorCardProps) {
    return (
        <div
            className="w-72 h-40 p-4 rounded-3xl flex items-center justify-center cursor-pointer 
                            border border-white/30 shadow-inner hover:scale-105 transition-transform duration-300
                            bg-white/10 backdrop-blur-[20px] saturate-150"
        >
            <p className="text-color font-bold">{label}</p>
        </div>
    );
}