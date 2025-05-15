
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Plus, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useClient } from "@/contexts/ClientContext";
import { useAuth } from "@/contexts/AuthContext";

const clientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  accountNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  caseStatus: z.string().optional(),
  assignedAttorneyId: z.string().optional(),
  accidentDate: z.string().optional(),
  accidentLocation: z.string().optional(),
  injuryType: z.string().optional(),
  caseDescription: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceAdjusterName: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  initialData?: Client | null;
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
  onDropClient?: (client: Client, reason: string) => Promise<void>;
}

const ClientForm = ({ initialData, onSubmit, onCancel, onDropClient }: ClientFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [newTag, setNewTag] = useState("");
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false);
  const [dropReason, setDropReason] = useState("");
  const { getAttorneyOptions } = useClient();
  const { currentUser } = useAuth();
  
  const attorneyOptions = getAttorneyOptions();
  const isAdmin = currentUser && ['admin', 'superadmin'].includes(currentUser.role);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData 
      ? { 
          ...initialData,
          tags: initialData.tags || []
        } 
      : {
          fullName: "",
          email: "",
          phone: "",
          companyName: "",
          address: "",
          caseStatus: "Initial Consultation",
          tags: []
        }
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        tags: initialData.tags || []
      });
    }
  }, [initialData, form]);
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(newTag)) {
      form.setValue("tags", [...currentTags, newTag]);
    }
    
    setNewTag("");
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags", 
      currentTags.filter(tag => tag !== tagToRemove)
    );
  };
  
  const handleSubmit = async (data: ClientFormData) => {
    await onSubmit({
      ...data,
      id: initialData?.id || "",
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDropClient = async () => {
    if (initialData && onDropClient && dropReason) {
      await onDropClient(initialData, dropReason);
      setIsDropDialogOpen(false);
    }
  };
  
  const status_options = [
    { value: "Initial Consultation", label: "Initial Consultation" },
    { value: "Active Treatment", label: "Active Treatment" },
    { value: "Case Review", label: "Case Review" },
    { value: "Settlement Negotiation", label: "Settlement Negotiation" },
    { value: "Closed", label: "Closed" }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Client" : "Add New Client"}</CardTitle>
          <CardDescription>
            {initialData 
              ? "Update client information and settings" 
              : "Enter client details to add them to your system"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="case">Case Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Tags</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="A001" {...field} />
                          </FormControl>
                          <FormDescription>
                            Auto-generated if left blank
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main St, Anytown, CA 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="case" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="caseStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {status_options.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isAdmin && (
                      <FormField
                        control={form.control}
                        name="assignedAttorneyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned Attorney</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an attorney" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Available Attorneys</SelectLabel>
                                  {attorneyOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="accidentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accident Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accidentLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accident Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Intersection of 5th & Main" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="injuryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Injury Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Back and Neck Injury" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="insuranceCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Company</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Insurance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="insurancePolicyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Number</FormLabel>
                          <FormControl>
                            <Input placeholder="PO123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="insuranceAdjusterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adjuster Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="caseDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a brief description of the case..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any additional notes about the client..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch("tags")?.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button 
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tag} tag</span>
                          </button>
                        </Badge>
                      ))}
                      {!form.watch("tags")?.length && (
                        <div className="text-sm text-muted-foreground">No tags added</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleAddTag}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <CardFooter className="flex justify-between px-0">
                <div>
                  {initialData && isAdmin && (
                    <Dialog open={isDropDialogOpen} onOpenChange={setIsDropDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="bg-red-50 hover:bg-red-100 border-red-200 text-red-800"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Drop Client
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Drop Client</DialogTitle>
                          <DialogDescription>
                            This will mark the client as dropped but keep their records in the system.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <FormLabel>Reason for dropping client</FormLabel>
                            <Textarea
                              placeholder="Please provide a reason..."
                              value={dropReason}
                              onChange={(e) => setDropReason(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDropDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleDropClient}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={!dropReason.trim()}
                          >
                            Confirm Drop
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {initialData ? "Save Changes" : "Add Client"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;
