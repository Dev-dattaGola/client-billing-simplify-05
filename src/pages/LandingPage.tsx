
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import LawFirmTypesSection from '../components/landing/LawFirmTypesSection';
import ScreenshotsSection from '../components/landing/ScreenshotsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CtaSection from '../components/landing/CtaSection';
import FooterSection from '../components/landing/FooterSection';

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>LAWerp500 - Law Firm Management System</title>
        <meta name="description" content="Complete Law Firm Management System for modern legal practices" />
      </Helmet>
      <div className="bg-gradient-to-b from-gray-900 to-black text-white">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <LawFirmTypesSection />
        <ScreenshotsSection />
        <TestimonialsSection />
        <CtaSection />
        <FooterSection />
      </div>
    </>
  );
};

export default LandingPage;
