import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SeasonalOverlay from '@/components/SeasonalOverlay';

export default function Index() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <SeasonalOverlay />
      <HeroSection />
      <AboutSection />
      <FeaturedProjects />
      <TestimonialsMarquee />
      <Footer />
    </div>
  );
}
