
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection: React.FC = () => {
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
    <section className="py-16 lg:py-24 px-4 bg-gradient-to-br from-lawfirm-purple/30 to-white/90">
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
            <Card key={index} className="border border-lawfirm-purple/20 shadow-md h-full">
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
  );
};

export default TestimonialsSection;
