'use client'

import Link from "next/link";
import ToggleColor from "../../elements/toggletheme/toggleColor";

export default function Footer() {

    
    return (
        <div className="w-full h-20 background-secondary px-12 ">
            <div className="h-full w-full flex relative justify-center items-center  text-background ">

                <div className="absolute left-0 flex h-full items-center gap-2 ">
                    <img src="/link.png" alt="Logo" className="flex object-contain h-2/5" />
                    <p className="text-xl"><span className="font-bold">DAE</span>, Inc.</p>
                </div>

                <div className="h-full items-center flex  justify-center gap-4 text-background">
                    <Link href="/sobre" className="text-hover">Sobre</Link>
                    <Link href="/suporte" className="text-hover">Suporte</Link>
                    <Link href="https://github.com/Endrigogustavo/DaeLink-Projeto" className="text-hover">Github</Link>
                </div>

                <div className="absolute right-0 flex h-full items-center gap-2 ">
                    <p className="text-base">Brasil, São Paulo</p>

                    <ToggleColor />
                </div>

            </div>
        </div>

    );
}
