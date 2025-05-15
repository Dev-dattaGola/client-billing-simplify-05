
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ScreenshotsSection from '@/components/landing/ScreenshotsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import LawFirmTypesSection from '@/components/landing/LawFirmTypesSection';
import CtaSection from '@/components/landing/CtaSection';
import FooterSection from '@/components/landing/FooterSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <TestimonialsSection />
      <LawFirmTypesSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
