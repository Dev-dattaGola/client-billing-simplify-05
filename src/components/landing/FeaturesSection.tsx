
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Gavel, Laptop, MessageCircle, ShieldCheck, FileText } from 'lucide-react';

const FeaturesSection: React.FC = () => {
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

  return (
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
  );
};

export default FeaturesSection;
