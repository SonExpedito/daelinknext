'use client'
import Navbar from "@/src/components/elements/navbar/navbar";
import { useUserStore } from "@/src/components/store/userstore";
import PerfillEmpresa from "@/src/pages/Companies/perfil/page";
import PerfilPCD from "@/src/pages/PCDs/Perfil/page";


export default function Perfil() {

    const userType = useUserStore((state) => state.userType);

    let paginaatual;

    if (userType === "PCD") {
        paginaatual = <PerfilPCD />;
    } else if (userType === "Empresa") {

        paginaatual = <PerfillEmpresa />;
    } 
    return (
        <>
            <Navbar />
            {paginaatual}
        </>

    )
}