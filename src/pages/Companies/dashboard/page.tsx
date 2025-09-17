"use client"
import ToggleTheme from "@/src/components/elements/toggletheme/toggleColor"
import { useUserStore } from "@/src/components/store/userstore";
import Link from "next/link";


export default function DashboardPage() {
    const UserProfile = useUserStore(state => state.userProfile);

    const leftLinks = [
        { name: "Processos Ativos", href: "/processospanel", img: "/dashboard/processos.png", textcolor: "primary-color" },
        { name: "Candidatos", href: "/candidatos", img: "/dashboard/candidatos.png", textcolor: "secondary-color" },
    ];
    const rightLinks = [
        { name: "Vagas", href: "/vagaspanel", img: "/dashboard/vagas.png" },
        { name: "Analytics", href: "/analytics", img: "/dashboard/analytics.png" },
    ];

    return (
        <div className="h-[calc(100vh-5rem)] w-full flex items-center justify-center gap-6 relative">
            <h1 className="text-5xl text-color font-bold absolute text-center top-10">{UserProfile?.name} como iremos evoluir?</h1>
            <ToggleTheme />
            <div className="h-[80%] w-[48%] flex flex-col  items-center justify-center gap-8 ">
                {leftLinks.map(link => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="h-[35%] w-full flex hover-size cursor-pointer 
             rounded-3xl overflow-hidden
             border border-gray-300 dark:border-white/50
             bg-white/10 backdrop-blur-xl shadow-lg
             hover:bg-white/20 transition duration-300">

                        <div className="h-full w-1/3 flex flex-col items-center justify-center gap-2">
                            <h1 className={"text-3xl font-bold text-center " + link.textcolor + " uppercase "}>{link.name}</h1>
                        </div>
                        <div className="h-full w-2/3 flex items-center justify-center gap-2">
                            <img src={link.img} alt="" className="object-contain" />
                        </div>
                    </Link>
                ))}

            </div>

            <div className="h-[80%] w-[34%] flex flex-col items-center justify-center gap-8">

                {rightLinks.map(link => (
                    <Link key={link.name} href={link.href} className="h-[35%] w-full flex
                    hover-size cursor-pointer rounded-3xl overflow-hidden
                    border border-white/50 
                     bg-white/10 backdrop-blur-xl shadow-lg
                     hover:bg-white/20 transition duration-300">

                        <div className="h-full w-[45%] flex flex-col items-center justify-center gap-2">
                            <h1 className={"text-3xl font-bold text-center uppercase text-color "}>{link.name}</h1>
                        </div>
                        <div className="h-full w-[55%] flex items-center justify-center gap-2">
                            <img src={link.img} alt="" className="object-contain" />

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}