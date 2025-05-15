
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Building2, Phone, Mail, Globe, MapPin, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Firm } from '@/types/firm';

const FirmManagement: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  
  // Mock firm data - in a real app this would come from an API
  const [firmData, setFirmData] = useState<Firm>({
    id: "firm-1",
    name: "Lawerp500",
    address: "123 Legal Avenue, Suite 500, New York, NY 10001",
    contactNumber: "(555) 123-4567",
    email: "info@lawerp500.com",
    website: "https://lawerp500.com",
    status: "active",
    createdAt: new Date(),
    createdBy: "admin-user",
  });
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Firm details updated",
      description: "Your changes have been successfully saved.",
    });
  };
  
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <PageLayout>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center h-48">
              <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
              <p className="text-gray-500 mt-2">You don't have permission to view firm management settings.</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Firm Management - Lawerp500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Firm Management</h1>
          <p className="text-muted-foreground">
            Manage your firm details, branding, and settings
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Firm Details</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> Firm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firmName" className="block text-sm font-medium">
                        Firm Name
                      </label>
                      <Input 
                        id="firmName" 
                        value={firmData.name}
                        onChange={(e) => setFirmData({...firmData, name: e.target.value})}
                        placeholder="Enter firm name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email Address
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Mail className="h-4 w-4" />
                        </span>
                        <Input 
                          id="email" 
                          value={firmData.email}
                          onChange={(e) => setFirmData({...firmData, email: e.target.value})}
                          className="rounded-l-none" 
                          placeholder="info@yourfirm.com" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Phone className="h-4 w-4" />
                        </span>
                        <Input 
                          id="phone" 
                          value={firmData.contactNumber}
                          onChange={(e) => setFirmData({...firmData, contactNumber: e.target.value})}
                          className="rounded-l-none" 
                          placeholder="(555) 123-4567" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="website" className="block text-sm font-medium">
                        Website URL
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Globe className="h-4 w-4" />
                        </span>
                        <Input 
                          id="website" 
                          value={firmData.website}
                          onChange={(e) => setFirmData({...firmData, website: e.target.value})}
                          className="rounded-l-none" 
                          placeholder="https://yourfirm.com" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium">
                        Office Address
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <Textarea 
                          id="address" 
                          value={firmData.address}
                          onChange={(e) => setFirmData({...firmData, address: e.target.value})}
                          className="rounded-l-none min-h-[80px]" 
                          placeholder="Enter your complete office address" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Firm Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Branding settings will be implemented in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Billing settings will be implemented in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Integrations will be implemented in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default FirmManagement;
