import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Mission from '../components/Mission';
import Footer from '../components/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-navy selection:bg-primary/30">
            <Navbar />

            <Hero />


            <Features />

            <Mission />

            <Footer />
        </div>
    );
}
