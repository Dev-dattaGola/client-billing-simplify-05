
import React, { useState, useEffect } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Firm } from "@/types/firm";
import { Building2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock API call for firms - this would be replaced with actual MongoDB API calls
const fetchFirms = async (): Promise<Firm[]> => {
  return [
    {
      id: 'firm1',
      name: 'LYZ Law Firm',
      address: '123 Legal St, Lawtown, CA 90210',
      contactNumber: '(555) 123-4567',
      email: 'contact@lyzlawfirm.com',
      website: 'www.lyzlawfirm.com',
      adminId: 'admin1',
      status: 'active',
      subscriptionPlan: 'Premium',
      subscriptionStatus: 'active',
      createdAt: new Date(),
      createdBy: 'superadmin1'
    }
  ];
};

const FirmManagement: React.FC = () => {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentFirm, setCurrentFirm] = useState<Firm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    website: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadFirms = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFirms();
        setFirms(data);
      } catch (error) {
        console.error('Error loading firms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load firms. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFirms();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateFirm = async () => {
    try {
      // This would be replaced with an actual API call to MongoDB
      const newFirm: Firm = {
        id: `firm-${Date.now()}`,
        name: formData.name,
        address: formData.address,
        contactNumber: formData.contactNumber,
        email: formData.email,
        website: formData.website,
        status: 'active',
        createdAt: new Date(),
        createdBy: 'superadmin1'
      };

      setFirms(prev => [...prev, newFirm]);
      setIsDialogOpen(false);
      resetForm();

      toast({
        title: 'Success',
        description: 'Law firm has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating firm:', error);
      toast({
        title: 'Error',
        description: 'Failed to create law firm. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateFirm = async () => {
    if (!currentFirm) return;

    try {
      // This would be replaced with an actual API call to MongoDB
      const updatedFirms = firms.map(firm => 
        firm.id === currentFirm.id 
          ? { 
              ...firm, 
              name: formData.name, 
              address: formData.address, 
              contactNumber: formData.contactNumber, 
              email: formData.email, 
              website: formData.website,
              updatedAt: new Date()
            } 
          : firm
      );

      setFirms(updatedFirms);
      setIsDialogOpen(false);
      setCurrentFirm(null);
      resetForm();

      toast({
        title: 'Success',
        description: 'Law firm has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating firm:', error);
      toast({
        title: 'Error',
        description: 'Failed to update law firm. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFirm = async (id: string) => {
    try {
      // This would be replaced with an actual API call to MongoDB
      setFirms(prev => prev.filter(firm => firm.id !== id));

      toast({
        title: 'Success',
        description: 'Law firm has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting firm:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete law firm. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (firm: Firm) => {
    setCurrentFirm(firm);
    setFormData({
      name: firm.name,
      address: firm.address,
      contactNumber: firm.contactNumber,
      email: firm.email,
      website: firm.website || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contactNumber: '',
      email: '',
      website: ''
    });
  };

  const openCreateDialog = () => {
    setCurrentFirm(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Law Firms</h3>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Law Firm
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : firms.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No law firms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new law firm.</p>
          <div className="mt-6">
            <Button onClick={openCreateDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Law Firm
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firms.map((firm) => (
                <TableRow key={firm.id}>
                  <TableCell className="font-medium">{firm.name}</TableCell>
                  <TableCell>{firm.email}</TableCell>
                  <TableCell>{firm.contactNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        firm.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : firm.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {firm.status.charAt(0).toUpperCase() + firm.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(firm)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the law firm and all associated data.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteFirm(firm.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentFirm ? 'Edit Law Firm' : 'Add New Law Firm'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Firm Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter firm name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter firm address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter website URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={currentFirm ? handleUpdateFirm : handleCreateFirm}>
              {currentFirm ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirmManagement;
