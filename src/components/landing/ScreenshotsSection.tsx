
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ScreenshotsSection: React.FC = () => {
  return (
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
  );
};

export default ScreenshotsSection;
