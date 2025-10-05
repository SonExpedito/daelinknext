interface ErrorCardProps {
    readonly label: string;
}


export default function ErrorCard({ label }: ErrorCardProps) {
    return (
        <div
            className="w-72 h-32 p-4 rounded-3xl flex items-center justify-center cursor-pointer background-secondary"
        >
            <p className="text-background font-bold">{label}</p>
        </div>
    );
}