import { Helmet } from 'react-helmet';
import Navigation from '@/components/layout/Navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Collection from '@/components/home/Collection';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Fordive Scen Finder - Find Your Perfect Fragrance</title>
        <meta name="description" content="Discover your signature scent with Fordive. Take our personality quiz to find the perfect fragrance that matches your personality, mood, and zodiac sign." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navigation transparent={true} />
        <Hero />
        <Features />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}
