
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, ChevronRight, Gavel, Laptop, MessageCircle, ShieldCheck, FileText, Scale, Clock, BarChart3, Users, Building2, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
      icon: <Gavel className="h-6 w-6 text-white" />,
      title: "Case Management",
      description: "Streamline all your legal cases with our powerful case management system"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      title: "Client Communication",
      description: "Keep in touch with clients through secure messaging and document sharing"
    },
    {
      icon: <Bot className="h-6 w-6 text-white" />,
      title: "AI Assistant",
      description: "Get help with any feature using our smart AI assistant available 24/7"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Secure & Compliant",
      description: "HIPAA compliant and secure infrastructure to protect sensitive data"
    },
    {
      icon: <Laptop className="h-6 w-6 text-white" />,
      title: "Desktop Optimized",
      description: "Powerful desktop experience for legal professionals optimized for productivity"
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Document Management",
      description: "Organize, track and easily access all client and case documents"
    }
  ];

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

  const testimonials = [
    {
      quote: "LAWerp500 transformed our practice by automating routine tasks and providing clear visibility into our case management. We've increased our caseload by 40% without adding staff.",
      author: "Jennifer B.",
      position: "Managing Partner, Davis & Associates"
    },
    {
      quote: "The document management system is exceptional. Being able to access everything from anywhere has been crucial to our firm's flexibility and growth during challenging times.",
      author: "Michael T.",
      position: "Litigation Attorney, Peterson Law Group"
    },
    {
      quote: "Client communication has never been easier. The automated updates and secure messaging have dramatically reduced the time we spend on routine client inquiries.",
      author: "Sarah L.",
      position: "Office Manager, Williams Legal"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Enhanced with gradient */}
      <section className="bg-gradient-to-br from-lawfirm-purple-dark via-lawfirm-purple to-lawfirm-purple-light pt-16 lg:pt-24 pb-24 px-4 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-left">
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/f821edb6-2ada-465d-a812-7f4c9e81f81d.png" 
                  alt="LAWerp500 Logo" 
                  className="h-24 mb-4"
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
      
      {/* Benefits Section */}
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
      
      {/* Features Section with improved layout */}
      <section className="py-16 lg:py-24 px-4 bg-gradient-to-br from-lawfirm-dark-purple via-lawfirm-purple to-lawfirm-purple-light text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful Features for Modern Law Firms
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Our comprehensive platform helps law firms streamline operations, improve client communication, and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur border-white/20 border hover:bg-white/20 transition-all h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-lawfirm-purple-dark inline-flex p-3 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Desktop Screenshots Section - Enhanced */}
      <section className="py-16 lg:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
              Optimized for Your Legal Workflow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Experience our powerful desktop interface designed specifically for legal professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-lawfirm-dark-purple text-white p-2 flex items-center">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm">Dashboard View</div>
              </div>
              <div className="bg-white p-0">
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?q=80&w=3270&auto=format&fit=crop"
                    alt="Dashboard View"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-lawfirm-dark-purple text-white p-2 flex items-center">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm">Case Management</div>
              </div>
              <div className="bg-white p-0">
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=3271&auto=format&fit=crop"
                    alt="Case Management"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-lawfirm-dark-purple text-white p-2 flex items-center">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm">Document Management</div>
              </div>
              <div className="bg-white p-0">
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=3270&auto=format&fit=crop"
                    alt="Document Management"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-16 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See what law firms across the country are saying about LAWerp500
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 shadow-md h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="mb-6 text-lawfirm-purple">
                    <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 18H9C9 12.3 11.34 9.03 16.02 8.1C16.5 8.04 16.74 7.62 16.5 7.2C16.02 6.3 15.3 5.52 14.58 4.8C13.86 4.08 13.14 3.66 12.42 3.36C11.94 3.18 11.4 3.3 11.1 3.78C6.9 9.6 4.5 15 4.5 18V28.5C4.5 31.53 6.96 34.02 9.96 34.02H13.5C16.5 34.02 18.96 31.56 18.96 28.56V23.46C18.96 20.46 16.5 18 13.5 18ZM40.5 18H36C36 12.3 38.34 9.03 43.02 8.1C43.5 8.04 43.74 7.62 43.5 7.2C43.02 6.3 42.3 5.52 41.58 4.8C40.86 4.08 40.14 3.66 39.42 3.36C38.94 3.18 38.4 3.3 38.1 3.78C33.9 9.6 31.5 15 31.5 18V28.5C31.5 31.53 33.96 34.02 36.96 34.02H40.5C43.5 34.02 45.96 31.56 45.96 28.56V23.46C45.96 20.46 43.5 18 40.5 18Z" fill="#8A2BE2"/>
                    </svg>
                  </div>
                  <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                  <div className="mt-auto">
                    <p className="font-semibold text-lawfirm-dark-purple">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Law Firm Types Section - New */}
      <section className="py-16 lg:py-24 px-4 bg-lawfirm-gray">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-lawfirm-dark-purple mb-4">
              Tailored for Every Legal Practice
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              LAWerp500 adapts to the unique needs of different types of law firms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-lawfirm-purple" />
                <h3 className="text-xl font-semibold mb-2">Solo Practitioners</h3>
                <p className="text-gray-600">Affordable solutions for independent attorneys to manage their practice efficiently</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-lawfirm-purple" />
                <h3 className="text-xl font-semibold mb-2">Small Firms</h3>
                <p className="text-gray-600">Collaborative tools designed for small teams to work together seamlessly</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-lawfirm-purple" />
                <h3 className="text-xl font-semibold mb-2">Mid-Size Practices</h3>
                <p className="text-gray-600">Robust workflows and reporting to handle complex case management needs</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-lawfirm-purple" />
                <h3 className="text-xl font-semibold mb-2">Specialty Firms</h3>
                <p className="text-gray-600">Customizable features for specialized practice areas and requirements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced */}
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
      
      {/* Footer - Expanded */}
      <footer className="bg-lawfirm-dark-purple text-white py-12 px-4 mt-auto">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/lovable-uploads/f821edb6-2ada-465d-a812-7f4c9e81f81d.png" 
                alt="LAWerp500 Logo" 
                className="h-16 mb-4"
              />
              <p className="text-white/70">
                Advanced law firm management system designed for legal professionals.
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
              <a href="#" className="text-white hover:text-lawfirm-light-blue transition-colors">Twitter</a>
              <a href="#" className="text-white hover:text-lawfirm-light-blue transition-colors">LinkedIn</a>
              <a href="#" className="text-white hover:text-lawfirm-light-blue transition-colors">Facebook</a>
              <a href="#" className="text-white hover:text-lawfirm-light-blue transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
