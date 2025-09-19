import Navbar from "@/src/components/elements/navbar/navbar";
import CandidatoInfoPage from "@/src/pages/Companies/Candidatos/CandidatosInfo/page";


export default async function CandidatoInfo({ params }: { readonly params: Promise<{ readonly id: string }> }){
     const { id } = await params;

    return (
        <>
            <Navbar />
            <CandidatoInfoPage pcdId={id} />
        </>
    );
}