
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Firm } from '@/types/firm';

// This would be replaced with an actual API call in a real app
const mockFirms: Firm[] = [
  {
    id: 'firm1',
    name: 'LYZ Law Firm',
    adminId: 'admin1',
    address: '123 Legal St, Lawtown, CA 90210',
    contactNumber: '(555) 123-4567',
    email: 'contact@lyzlawfirm.com',
    website: 'www.lyzlawfirm.com',
    createdAt: new Date().toISOString(),
    createdBy: 'superadmin1'
  }
];

const FirmManagement: React.FC = () => {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    website: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchFirms = async () => {
      setIsLoading(true);
      try {
        // In a real app this would be an API call
        // const response = await apiClient.get('/firms');
        // const data = response.data;
        setFirms(mockFirms);
      } catch (error) {
        console.error('Error fetching firms:', error);
        toast({
          title: "Error",
          description: "Failed to load firms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirms();
  }, [toast]);

  const handleCreateFirm = async () => {
    try {
      // In a real app this would be an API call
      const newFirm: Firm = {
        id: `firm${firms.length + 1}`,
        name: formData.name,
        adminId: '', // This would be set when an admin is assigned
        address: formData.address,
        contactNumber: formData.contactNumber,
        email: formData.email,
        website: formData.website,
        createdAt: new Date().toISOString(),
        createdBy: 'superadmin1' // This would be the current user's ID
      };
      
      // In a real app: await apiClient.post('/firms', newFirm);
      
      setFirms(prev => [...prev, newFirm]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Firm created successfully.",
      });
    } catch (error) {
      console.error('Error creating firm:', error);
      toast({
        title: "Error",
        description: "Failed to create firm. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditFirm = async () => {
    if (!selectedFirm) return;
    
    try {
      // In a real app this would be an API call
      const updatedFirm: Firm = {
        ...selectedFirm,
        name: formData.name,
        address: formData.address,
        contactNumber: formData.contactNumber,
        email: formData.email,
        website: formData.website
      };
      
      // In a real app: await apiClient.put(`/firms/${selectedFirm.id}`, updatedFirm);
      
      setFirms(prev => prev.map(firm => firm.id === updatedFirm.id ? updatedFirm : firm));
      setIsEditDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Firm updated successfully.",
      });
    } catch (error) {
      console.error('Error updating firm:', error);
      toast({
        title: "Error",
        description: "Failed to update firm. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFirm = async (id: string) => {
    if (!confirm("Are you sure you want to delete this firm? This action cannot be undone.")) return;
    
    try {
      // In a real app this would be an API call
      // await apiClient.delete(`/firms/${id}`);
      
      setFirms(prev => prev.filter(firm => firm.id !== id));
      
      toast({
        title: "Success",
        description: "Firm deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting firm:', error);
      toast({
        title: "Error",
        description: "Failed to delete firm. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (firm: Firm) => {
    setSelectedFirm(firm);
    setFormData({
      name: firm.name,
      address: firm.address || '',
      contactNumber: firm.contactNumber || '',
      email: firm.email || '',
      website: firm.website || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contactNumber: '',
      email: '',
      website: ''
    });
    setSelectedFirm(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Firm Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Firm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Firm</DialogTitle>
              <DialogDescription>
                Add a new law firm to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Firm Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter firm name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter firm address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Enter website URL"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}>Cancel</Button>
              <Button 
                onClick={handleCreateFirm}
                disabled={!formData.name}
              >
                Create Firm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firm Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No firms found. Add a new firm to get started.
                  </TableCell>
                </TableRow>
              ) : (
                firms.map(firm => (
                  <TableRow key={firm.id}>
                    <TableCell className="font-medium">{firm.name}</TableCell>
                    <TableCell>{firm.address || 'N/A'}</TableCell>
                    <TableCell>{firm.contactNumber || 'N/A'}</TableCell>
                    <TableCell>{firm.email || 'N/A'}</TableCell>
                    <TableCell>
                      {firm.adminId ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Admin Assigned
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          No Admin
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" title="Edit Firm" onClick={() => openEditDialog(firm)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Manage Users" onClick={() => {/* Navigate to user management for this firm */}}>
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete Firm" onClick={() => handleDeleteFirm(firm.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Firm Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Firm</DialogTitle>
            <DialogDescription>
              Update firm information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Firm Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter firm name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter firm address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Contact Number</Label>
              <Input
                id="edit-contact"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="Enter contact number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Enter website URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>Cancel</Button>
            <Button 
              onClick={handleEditFirm}
              disabled={!formData.name}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirmManagement;
