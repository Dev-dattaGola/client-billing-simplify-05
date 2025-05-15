
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Award } from 'lucide-react';

const LawFirmTypesSection: React.FC = () => {
  return (
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
  );
};

export default LawFirmTypesSection;
