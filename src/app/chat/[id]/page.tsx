import Footer from "@/src/components/elements/footer/footer";
import Navbar from "@/src/components/elements/navbar/navbar";
import ChatPage from "@/src/pages/Chat/page";

export default async function Chat({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <>
            <Navbar />
            <ChatPage processoid={id} />
            <Footer />
        </>
    );
}