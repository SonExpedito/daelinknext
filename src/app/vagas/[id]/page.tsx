import Navbar from "@/src/components/elements/navbar/navbar";
import Footer from "@/src/components/elements/footer/footer";
import VagasinfoPage from "@/src/pages/Comum/Vagas/vagasinfo/page";


export default function VagaInfo({ params }: { params: { id: string } }) {
    return (
        <>
            <Navbar />
            <VagasinfoPage vagaId={params.id} />
            <Footer />
        </>
    );
}