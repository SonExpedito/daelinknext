import Footer from "@/src/components/elements/footer/footer";
import Navbar from "@/src/components/elements/navbar/navbar";
import EmpresasInfoPage from "@/src/pages/Comum/Empresas/Empresasinfo/page";

export default async function EmpresasInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 

  return (
    <>
      <Navbar />
      <EmpresasInfoPage empresaId={id} />
      <Footer />
    </>
  );
}
