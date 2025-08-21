'use client'

import { Search, AlignJustify } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "@/src/api/Auth";
import { useRouter } from "next/navigation";



export default function Navbar() {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('tipo');
        if (stored) setUserType(stored);

        // escuta mudanças vindas de outras abas
        function handleStorage(e: StorageEvent) {
            if (e.key === 'tipo') {
                setUserType(e.newValue);
            }
        }
        window.addEventListener('storage', handleStorage);

        const getUser = async () => {
            try {
                // 1️⃣ Tenta buscar empresa
                const companyRes = await axios.get('/get-company', { withCredentials: true });
                if (companyRes.data) {
                    console.log("Empresa encontrada:", companyRes.data);
                    setUserProfile(companyRes.data);
                    return; // para aqui se achou empresa
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    console.log("Empresa não encontrada.");
                } else {
                    console.error('Erro ao buscar empresa:', err.response?.data || err.message);
                    return; // se for outro erro, para a execução
                }
            }

            try {
                // 2️⃣ Tenta buscar PCD
                const pcdRes = await axios.get('/get-pcd', { withCredentials: true });
                if (pcdRes.data) {
                    console.log("PCD encontrado:", pcdRes.data);
                    setUserProfile(pcdRes.data);
                    return; // para aqui se achou PCD
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    console.log("PCD não encontrado.");
                } else {
                    console.error('Erro ao buscar PCD:', err.response?.data || err.message);
                    return;
                }
            }

            // 3️⃣ Se chegou aqui, nenhum dos dois foi encontrado
            console.error("Nenhum usuário encontrado (Empresa ou PCD).");
        };

        getUser();
    }, []);


    async function LogoutProfile() {
        logout();
        localStorage.removeItem('userId');
        localStorage.removeItem('tipo');
        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
        router.push('/login');
    }

    const navLinks = {
        generic: [
            { href: "/empresas", label: "Empresas" },
            { href: "/vagas", label: "Vagas" },
            { href: "/sobre", label: "Sobre" },
        ],
        PCD: [
            { href: "/vagas", label: "Vagas" },
            { href: "/empresas", label: "Empresas" },
            { href: "/processos", label: "Processos" },
        ],
        Empresa: [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/minhas-vagas", label: "Candidatos" },
            { href: "/sobre", label: "Sobre" },
        ],
    };

    const currentLinks =
        userType === "PCD"
            ? navLinks.PCD
            : userType === "Empresa"
                ? navLinks.Empresa
                : navLinks.generic;



    return (
        <div className="w-full h-20 background-primary px-12 sticky top-0 z-50">
            <div className="h-full w-full flex relative justify-center items-center text-color ">

                <Link href="/" className="absolute left-0 flex h-full items-center">
                    <img src="./logo.png" alt="Logo" className="flex object-contain h-2/4" />
                </Link>

                {/* Links */}
                <div className="h-full items-center flex justify-center gap-4 text-background text-color">
                    {currentLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-color text-hover">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Perfil */}
                <div className="flex gap-4 h-full w-auto justify-center items-center absolute right-0">
                    <button className="cursor-pointer">
                        <Search className="text-color text-hover" />
                    </button>

                    {userProfile ? (
                        <button onClick={LogoutProfile}>
                            <img
                                src={
                                    userProfile?.imageUrl ||
                                    "https://images2.minutemediacdn.com/image/upload/c_crop,w_4000,h_2250,x_0,y_9/c_fill,w_1200,ar_4:3,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_en_international_web/01jczr9sq67ky36mtztb.jpg"
                                }
                                alt="User"
                                className="rounded-full cursor-pointer object-cover h-10 w-10 border-blue-400 border-4"
                            />
                        </button>
                    ) : (
                        <Link href="/login" className="text-color text-hover">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
