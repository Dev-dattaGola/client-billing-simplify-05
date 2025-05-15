
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Clock, BarChart3, Users } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  const benefitCards = [
    {
      icon: <Scale className="h-10 w-10 text-lawfirm-purple" />,
      title: "Legal Practice Management",
      description: "Comprehensive tools specially designed for law firms to handle every aspect of case management, from intake to resolution."
    },
    {
      icon: <Clock className="h-10 w-10 text-lawfirm-purple" />,
      title: "Save 15+ Hours Weekly",
      description: "Automation of routine tasks, document generation, and client communication saves attorneys and staff valuable time."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-lawfirm-purple" />,
      title: "Increase Revenue by 30%",
      description: "Streamlined billing, reduced administrative overhead, and improved case throughput lead to significant revenue growth."
    },
    {
      icon: <Users className="h-10 w-10 text-lawfirm-purple" />,
      title: "Enhanced Client Experience",
      description: "Self-service portal, automated updates, and transparent case management result in higher client satisfaction."
    }
  ];
  
  return (
    <section className="py-16 lg:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
            Transform Your Legal Practice
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            LAWerp500 delivers comprehensive practice management tools that increase efficiency, 
            profitability, and client satisfaction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitCards.map((card, index) => (
            <Card key={index} className="border border-gray-100 shadow-lg hover:shadow-xl transition-all h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="bg-lawfirm-gray inline-flex p-3 rounded-lg mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-lawfirm-dark-purple">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            onClick={handleGetStarted} 
            size="lg"
            className="bg-lawfirm-purple hover:bg-lawfirm-purple-dark text-white text-lg py-6 px-12"
          >
            See How LAWerp500 Can Help Your Firm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
