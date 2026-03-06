import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Categories />
      <Footer />
    </>
  );
}
