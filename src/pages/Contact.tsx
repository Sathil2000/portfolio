import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import SeasonalOverlay from '@/components/SeasonalOverlay';

export default function Contact() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <SeasonalOverlay />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}
