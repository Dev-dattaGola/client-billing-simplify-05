
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <section className="bg-gradient-to-br from-lawfirm-purple-dark via-lawfirm-purple to-lawfirm-purple-light pt-16 lg:pt-24 pb-24 px-4 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-left">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/f821edb6-2ada-465d-a812-7f4c9e81f81d.png" 
                alt="LAWerp500 Logo" 
                className="h-24 mb-4"
                width="400px"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              The Complete Legal Practice Management System
            </h1>
            <p className="text-xl mb-8 leading-relaxed max-w-2xl text-white/90">
              Streamline your law practice with our comprehensive case management system.
              Designed by attorneys for attorneys, LAWerp500 handles clients, cases, billing, 
              and documents in one integrated platform optimized for legal professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGetStarted} 
                size="lg"
                className="bg-white text-lawfirm-purple hover:bg-white/90 text-lg py-6"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 text-lg py-6"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-2 md:p-4 transform rotate-1 transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop"
                  alt="Law Firm Management Dashboard"
                  className="rounded-md w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full w-3 h-3"></div>
                  <p className="font-medium text-lawfirm-purple">Made for Legal Professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
