import Footer from "@/src/components/elements/footer/footer";
import Navbar from "@/src/components/elements/navbar/navbar";
import ChatPage from "@/src/pages/Chat/page";

export default async function Chat({ params }: { readonly params: Promise<{ readonly id: string }> }) {
    const { id } = await params;

    return (
        <>
            <Navbar />
            <ChatPage chatId={id} />
            <Footer />
        </>
    );
}