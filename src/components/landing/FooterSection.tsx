
import React from 'react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-lawfirm-purple-dark via-lawfirm-purple to-lawfirm-purple-dark text-white py-12 px-4 mt-auto">
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
            <a href="#" className="text-white hover:text-white/80 transition-colors">Twitter</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">LinkedIn</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">Facebook</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
