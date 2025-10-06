import {useState } from "react";
import type { Empresa} from "@/src/components/types/bdtypes";


type Props = {
    readonly empresa: Empresa;
};

export default function ComapanyTabs({ empresa }: Props) {
    const [activeTab, setActiveTab] = useState(1);

    const tabs = [
        { id: 1, nome: "Posts" },
        { id: 2, nome: "Sobre" },
    ];

    return (
        <div className="w-full h-fit flex flex-col">
            <div className="w-full h-16 flex justify-center gap-8" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        role="tab"
                        aria-selected={activeTab === tab.id ? "true" : "false"}
                        aria-controls={`tabpanel-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        onClick={() => setActiveTab(tab.id)}
                        className={
                            "h-full w-[12%] flex items-center justify-center cursor-pointer transition-all duration-200 rounded-3xl outline-none " +
                            (activeTab === tab.id
                                ? " border-b-4 border-[#2469F5] font-bold text-[#2469F5] bg-blue-500/10"
                                : " border-b-4 border-[#A0A0A0] font-normal text-color hover:text-blue-300 hover:border-blue-300")
                        }
                    >
                        {tab.nome}
                    </button>
                ))}
            </div>

            {/* Conteúdo das tabs com efeito liquid glass */}
            <div className="mt-4 p-6 rounded-2xl transition-all duration-500">
                {activeTab === 1 && (
                    <div className="w-full h-auto min-h-[24rem] px-6">
                        <p className="text-color">Aqui vão os posts da empresa.</p>
                    </div>
                )}
                {activeTab === 2 && (
                    <div className="w-full min-h-[24rem] h-auto px-6">
                        <div className="w-full h-full flex items-center justify-center gap-40">
                            <div className="h-full w-1/2 flex items-center justify-center">
                                <img src={empresa.sobreimg || "/errors/sobreimgpadrao.jpg"} alt={empresa.name} className="h-full object-cover rounded-3xl" />
                            </div>

                            <div className="h-full w-1/2 flex flex-col  justify-center gap-2">
                                <p className="text-color text-lg">Email: {empresa.email}</p>
                                <p className="text-color text-lg">CEP: {empresa.cep}</p>
                                <p className="text-color text-lg">CNPJ: {empresa.cnpj}</p>
                                <p className="text-color text-lg">{empresa.descricao || "Sem descrição disponível."}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
