import Footer from "@/src/components/elements/footer/footer";
import Navbar from "@/src/components/elements/navbar/navbar";
import DocumentoPage from "@/src/pages/PCDs/Documento/page";

export default async function Documento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 👈 necessário no Next 15

  return (
    <>
      <Navbar />
      <DocumentoPage processoid={id} />
      <Footer />
    </>
  );
}
