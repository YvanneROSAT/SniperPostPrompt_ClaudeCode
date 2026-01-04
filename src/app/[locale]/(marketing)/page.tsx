import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';
import { AdBanner } from '@/components/ads/AdBanner';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      {/* AdSense Banner between Features and Pricing */}
      <AdBanner
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
        format="auto"
        className="max-w-4xl mx-auto my-8 px-4"
      />
      <Pricing />
      <Footer />
    </main>
  );
}
