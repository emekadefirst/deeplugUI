import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Mission from '../components/Mission';
import Partners from '../components/Partners';
import SupportedCountries from '../components/SupportedCountries';
import Footer from '../components/Footer';
// import AdSense from '../components/AdSense';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-secondary selection:bg-primary/30">
            <Navbar />
            <Hero />
            <Features />
            <Mission />
            <Partners />
            <SupportedCountries />
            {/* <AdSense /> */}
            <Footer />
        </div>
    );
}

