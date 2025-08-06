import { BadgeCheck, Cloud, PersonStanding, BrainCog } from 'lucide-react';

export default function Beneficios() {
    const cards = [
        {
            title: "Confiável", icon: <BadgeCheck size={55} />, color: "background-blue",
            description: 'Validação segura das integrações e das empresas cadastradas, assegurando processos confiáveis e protegidos em toda a plataforma.'
        },
        {
            title: "Versátil", icon: <Cloud size={55} />, color: " bg-[#EA580C]",
            description: 'Integração com o Firebase CloudStore, permitindo o uso em diferentes plataformas e oferecendo flexibilidade para diversas soluções.'
        },
        {
            title: "Acessível", icon: <PersonStanding size={55} />, color: "bg-[#5B21B6]",
            description: 'Pensado para todos os usuários, com práticas que promovem inclusão e navegação intuitiva, seguindo diretrizes de acessibilidade.'
        },
        {
            title: "Inteligente", icon: <BrainCog size={55} />, color: "background-green",
            description: 'Sistema de recomendação avançado que otimiza os resultados de busca, tornando a experiência mais rápida, eficiente e personalizada.'
        },
    ]

    return (
        <div className="w-full beneficiosheight grid grid-cols-4 justify-items-center place-items-center">

            {cards.map((card, index) => (
                <div key={index} className="w-auto h-auto flex flex-col items-center justify-center gap-4 p-4">
                    <div className={`flex items-center justify-center text-background text-3xl ${card.color} p-4 rounded-full`}>
                        {card.icon}
                    </div>
                    <h1 className='font-bold text-2xl'>{card.title}</h1>
                    <p className='text-base '>{card.description}</p>

                </div>
            ))}


        </div>
    );
}
