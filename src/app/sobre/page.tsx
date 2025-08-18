import Navbar from "@/src/components/elements/navbar/navbar";
import SobrePage from "@/src/pages/Comum/Sobre/page";
import Footer from "@/src/components/elements/footer/footer";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Informações sobre a plataforma Daelink.',
};

export default function Sobre() {
    return (
        <>
            <Navbar />
            <SobrePage />
            <Footer />
        </>
    );
}