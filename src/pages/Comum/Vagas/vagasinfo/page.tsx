'use client'

import { Search, AlignJustify, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/src/components/store/userstore";

export default function Navbar() {
    const router = useRouter();
    const userProfile = useUserStore((state) => state.userProfile);
    const userType = useUserStore((state) => state.userType);
    const logout = useUserStore((state) => state.logout);

    const [menuOpen, setMenuOpen] = useState(false);

    async function LogoutProfile() {
        await logout();
        router.refresh();
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
            { href: "/analytics", label: "Analytics" },
            { href: "/candidatos", label: "Candidatos" },
            { href: "/sobre", label: "Sobre" },
        ],
    };

    const logoLink = userType === "Empresa" ? "/dashboard" : "/";

    const dropdownLinks = [
        { href: "/perfil", label: "Perfil" },
        { href: "/configuracoes", label: "Configurações" },
    ];

    let currentLinks;
    if (userType === "PCD") {
        currentLinks = navLinks.PCD;
    } else if (userType === "Empresa") {
        currentLinks = navLinks.Empresa;
    } else {
        currentLinks = navLinks.generic;
    }

    return (
        <div className="w-full h-20 background-primary px-6 md:px-12 sticky top-0 z-50">
            <div className="h-full w-full flex relative items-center text-color">

                {/* Logo (esquerda absoluta) */}
                <Link href={logoLink} className="absolute left-0 flex h-full items-center">
                    <img src="/logo.png" alt="Logo" className="flex object-contain h-2/4" />
                </Link>

                {/* Links centralizados */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full items-center justify-center gap-6 text-background text-color">
                    {currentLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-color text-hover">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Perfil + Search (direita absoluta) */}
                <div className="absolute right-0 flex gap-4 h-full w-auto justify-center items-center">
                    <button className="cursor-pointer">
                        <Search className="text-color text-hover" />
                    </button>

                    {userProfile ? (
                        <div className="relative group hidden md:block">
                            <button
                                className="flex items-center justify-center rounded-full p-1 border border-blue-400/70 backdrop-blur-md 
                                bg-blue-400/60 hover:bg-blue-400/80 transition duration-300"
                            >
                                <img
                                    src={
                                        userProfile?.imageUrl ||
                                        "https://images2.minutemediacdn.com/image/upload/c_crop,w_4000,h_2250,x_0,y_9/c_fill,w_1200,ar_4:3,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_en_international_web/01jczr9sq67ky36mtztb.jpg"
                                    }
                                    alt="User"
                                    className="rounded-full cursor-pointer object-cover h-10 w-10"
                                />
                            </button>

                            <div
                                className="absolute top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center gap-2
                                rounded-2xl p-4 shadow-lg border border-white/20
                                bg-white/10 backdrop-blur-xl backdrop-saturate-150
                                hover:bg-white/20 transition duration-300"
                            >
                                {dropdownLinks.map((link) => (
                                    <Link key={link.href} href={link.href} className="text-color text-hover">
                                        {link.label}
                                    </Link>
                                ))}

                                <button
                                    className="text-color text-hover cursor-pointer"
                                    onClick={LogoutProfile}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden md:block primary-color text-hover font-bold text-lg">
                            Login
                        </Link>
                    )}

                    {/* Botão Menu Mobile */}
                    <button
                        className="md:hidden cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="text-color" /> : <AlignJustify className="text-color" />}
                    </button>
                </div>

                {/* Menu Mobile Dropdown */}
                {menuOpen && (
                    <div className="absolute top-20 left-0 w-full flex flex-col items-center gap-4 py-6 
                    bg-background text-color shadow-md border-t border-white/20 md:hidden animate-fade-in">
                        {currentLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-color text-hover"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {userProfile ? (
                            <>
                                {dropdownLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-color text-hover"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <button
                                    className="text-color text-hover cursor-pointer"
                                    onClick={() => { LogoutProfile(); setMenuOpen(false); }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="primary-color text-hover font-bold text-lg"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
