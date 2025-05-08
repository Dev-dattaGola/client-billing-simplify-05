
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, PlusCircle, UserCog } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Firm } from "@/types/firm";
import { User } from "@/types/user";

// Mock API for firms
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
      createdAt: new Date(),
      createdBy: 'superadmin1'
    }
  ];
};

// Mock API for admins
const fetchAdmins = async (): Promise<User[]> => {
  return [
    {
      id: 'admin1',
      name: 'Administrator',
      email: 'admin@lawerp.com',
      role: 'admin',
      firmId: 'firm1',
      permissions: ['all']
    }
  ];
};

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firmId: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [adminsData, firmsData] = await Promise.all([
          fetchAdmins(),
          fetchFirms()
        ]);
        setAdmins(adminsData);
        setFirms(firmsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load administrators. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, firmId: value }));
  };

  const handleCreateAdmin = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.firmId || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // This would be replaced with an actual API call to MongoDB
      const newAdmin: User = {
        id: `admin-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'admin',
        firmId: formData.firmId,
        permissions: ['all']
      };

      setAdmins(prev => [...prev, newAdmin]);
      setIsDialogOpen(false);
      resetForm();

      toast({
        title: 'Success',
        description: 'Administrator has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to create administrator. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAdmin = async () => {
    if (!currentAdmin) return;

    // Validate form
    if (!formData.name || !formData.email || !formData.firmId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // If password is provided, confirm it matches
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // This would be replaced with an actual API call to MongoDB
      const updatedAdmins = admins.map(admin => 
        admin.id === currentAdmin.id 
          ? { 
              ...admin, 
              name: formData.name, 
              email: formData.email,
              firmId: formData.firmId
            } 
          : admin
      );

      setAdmins(updatedAdmins);
      setIsDialogOpen(false);
      setCurrentAdmin(null);
      resetForm();

      toast({
        title: 'Success',
        description: 'Administrator has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to update administrator. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      // This would be replaced with an actual API call to MongoDB
      setAdmins(prev => prev.filter(admin => admin.id !== id));

      toast({
        title: 'Success',
        description: 'Administrator has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete administrator. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (admin: User) => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      firmId: admin.firmId || '',
      password: '',
      confirmPassword: ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      firmId: '',
      password: '',
      confirmPassword: ''
    });
  };

  const openCreateDialog = () => {
    setCurrentAdmin(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Helper function to get firm name by ID
  const getFirmNameById = (id: string): string => {
    const firm = firms.find(f => f.id === id);
    return firm ? firm.name : 'Unknown Firm';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Law Firm Administrators</h3>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Administrator
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-8">
          <UserCog className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No administrators</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new administrator.</p>
          <div className="mt-6">
            <Button onClick={openCreateDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Administrator
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
                <TableHead>Law Firm</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.firmId ? getFirmNameById(admin.firmId) : 'Unassigned'}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
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
                              This will permanently delete the administrator account.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAdmin(admin.id)}
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
              {currentAdmin ? 'Edit Administrator' : 'Add New Administrator'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
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
              <Label htmlFor="firmId">Law Firm</Label>
              <Select
                value={formData.firmId}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="firmId">
                  <SelectValue placeholder="Select a law firm" />
                </SelectTrigger>
                <SelectContent>
                  {firms.map(firm => (
                    <SelectItem key={firm.id} value={firm.id}>
                      {firm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {currentAdmin ? 'New Password (leave blank to keep current)' : 'Password'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={currentAdmin ? 'Enter new password (optional)' : 'Enter password'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={currentAdmin ? handleUpdateAdmin : handleCreateAdmin}>
              {currentAdmin ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
