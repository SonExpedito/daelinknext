import Navbar from "@/src/components/elements/navbar/navbar";
import ProcessosPanelPage from "@/src/pages/Companies/processospanel/page";

export default async function ProcessosPanel({ params }: { readonly params: Promise<{ readonly id: string }> }){
     const { id } = await params;

    return (
        <>
            <Navbar />
            <ProcessosPanelPage vagaid={id} />
        </>
    );
}