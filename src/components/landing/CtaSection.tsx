
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CtaSection: React.FC = () => {
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
    <section className="py-16 lg:py-24 px-4 bg-lawfirm-blue">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gradient-to-br from-lawfirm-purple to-lawfirm-purple-dark rounded-lg shadow-lg p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your law practice?
            </h2>
            <p className="text-white/90 text-lg">
              Join thousands of law firms that have improved their efficiency and client satisfaction with our desktop-optimized platform.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>30-Day Free Trial</span>
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>No Credit Card Required</span>
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Free Data Migration</span>
              </li>
            </ul>
          </div>
          <Button 
            onClick={handleGetStarted} 
            size="lg"
            className="bg-white hover:bg-white/90 text-lawfirm-purple whitespace-nowrap text-lg py-8 px-12 font-semibold"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
