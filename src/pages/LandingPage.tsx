
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, ChevronRight, Gavel, Laptop, MessageCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  const features = [
    {
      icon: <Gavel className="h-6 w-6 text-primary" />,
      title: "Case Management",
      description: "Streamline all your legal cases with our powerful case management system"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "Client Communication",
      description: "Keep in touch with clients through secure messaging and document sharing"
    },
    {
      icon: <Bot className="h-6 w-6 text-primary" />,
      title: "AI Assistant",
      description: "Get help with any feature using our smart AI assistant available 24/7"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Secure & Compliant",
      description: "HIPAA compliant and secure infrastructure to protect sensitive data"
    },
    {
      icon: <Laptop className="h-6 w-6 text-primary" />,
      title: "Desktop Optimized",
      description: "Powerful desktop experience for legal professionals optimized for productivity"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Optimized for desktop */}
      <section className="bg-gradient-to-br from-lawfirm-blue via-white to-lawfirm-gray pt-16 lg:pt-24 pb-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-lawfirm-dark-purple mb-6 leading-tight">
                LAWerp500 Firm Management System
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
                Streamline your law practice with our comprehensive case management system.
                Handle clients, cases, billing, and more in one integrated platform designed for desktop efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-lg py-6"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10 text-lg py-6"
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
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2342&auto=format&fit=crop"
                    alt="Law Firm Management"
                    className="rounded-md w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full w-3 h-3"></div>
                    <p className="font-medium">Optimized for Desktop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Desktop grid layout */}
      <section className="py-16 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
              Powerful Features for Modern Law Firms
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform helps law firms streamline operations, improve client communication, and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-lawfirm-gray inline-flex p-2 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mt-auto">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Desktop Screenshots Section */}
      <section className="py-16 lg:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
              Optimized for Your Workflow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Experience our powerful desktop interface designed for legal professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-800 text-white p-2 flex items-center">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm">Dashboard View</div>
              </div>
              <div className="bg-white p-4">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"
                  alt="Dashboard View"
                  className="rounded-md w-full h-auto"
                />
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-800 text-white p-2 flex items-center">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm">Case Management</div>
              </div>
              <div className="bg-white p-4">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2340&auto=format&fit=crop"
                  alt="Case Management"
                  className="rounded-md w-full h-auto"
                />
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-800 text-white p-2 flex items-center">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm">Document Management</div>
              </div>
              <div className="bg-white p-4">
                <img 
                  src="https://images.unsplash.com/photo-1554178286-db408c69256a?q=80&w=2340&auto=format&fit=crop"
                  alt="Document Management"
                  className="rounded-md w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced for desktop */}
      <section className="py-16 lg:py-24 px-4 bg-lawfirm-blue">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
                Ready to transform your law practice?
              </h2>
              <p className="text-gray-700 text-lg">
                Join thousands of law firms that have improved their efficiency and client satisfaction with our desktop-optimized platform.
              </p>
            </div>
            <Button 
              onClick={handleGetStarted} 
              size="lg"
              className="bg-primary hover:bg-primary/90 whitespace-nowrap text-lg py-8 px-12"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer - Expanded for desktop */}
      <footer className="bg-lawfirm-dark-purple text-white py-12 px-4 mt-auto">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">LYZ Law Firm</h3>
              <p className="text-white/70">
                Advanced law firm management system designed for desktop performance.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Case Management</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Client Portal</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Document Management</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Billing & Invoices</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} LYZ Law Firm. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">Twitter</a>
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">LinkedIn</a>
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">Facebook</a>
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
