import Footer from "@/src/components/elements/footer/footer";
import Navbar from "@/src/components/elements/navbar/navbar";
import ProcessosInfoPage from "@/src/pages/PCDs/Processos/processosinfo/page";

export default async function ProcessoInfo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <>
            <Navbar />
            <ProcessosInfoPage processoid={id} />
            <Footer />
        </>
    );
}