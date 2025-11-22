import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/sections/Contact";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <div className="flex-grow pt-32">
                <ContactSection />
            </div>
            <Footer />
        </main>
    );
}
