
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Save, Plus, Eye, EyeOff, UserX, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Client } from "@/types/client";
import { Attorney } from "@/types/attorney";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ClientFormProps {
  initialData: Client | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onDropClient?: (clientId: string, reason: string) => void;
  onTransferClient?: (clientId: string, newAttorneyId: string) => void;
  attorneys?: Attorney[];
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(7, {
    message: "Please enter a valid phone number.",
  }),
  companyName: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ClientForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  onDropClient, 
  onTransferClient,
  attorneys = []
}: ClientFormProps) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dropReason, setDropReason] = useState("");
  const [selectedAttorney, setSelectedAttorney] = useState("");
  const [showDropDialog, setShowDropDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      companyName: initialData?.companyName || "",
      address: initialData?.address || "",
      notes: initialData?.notes || "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      tags,
    };

    if (initialData) {
      onSubmit({
        ...initialData,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleDropClient = () => {
    if (!initialData) return;
    if (!dropReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for dropping the client.",
        variant: "destructive",
      });
      return;
    }
    
    onDropClient?.(initialData.id, dropReason);
    setShowDropDialog(false);
  };

  const handleTransferClient = () => {
    if (!initialData || !selectedAttorney) return;
    
    onTransferClient?.(initialData.id, selectedAttorney);
    setShowTransferDialog(false);
  };

  // Filter out the current attorney from the list
  const availableAttorneys = attorneys.filter(attorney => 
    attorney.id !== initialData?.assignedAttorneyId
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" type="email" {...field} />
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
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
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
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
              </FormItem>
            )}
          />

          {!initialData && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Enter password" 
                          type={showPassword ? "text" : "password"} 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormDescription>Set a password for client account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Confirm password" 
                          type={showConfirmPassword ? "text" : "password"} 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Anytown, USA" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormLabel>Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags (e.g., commercial, personal injury)"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button 
                type="button" 
                size="icon" 
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Press Enter or click + to add a tag
            </p>
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any additional notes or information about the client..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between gap-2">
          {/* Client management actions - only show for existing clients */}
          {initialData && onDropClient && onTransferClient && (
            <div className="flex gap-2">
              {/* Drop Client Dialog */}
              <Dialog open={showDropDialog} onOpenChange={setShowDropDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600">
                    <UserX className="h-4 w-4 mr-1" /> Drop Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Drop Client</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to drop {initialData.fullName} as a client? 
                      This action will remove them from your active client list.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <FormLabel htmlFor="drop-reason">Reason for dropping client</FormLabel>
                    <Textarea
                      id="drop-reason"
                      placeholder="Please provide a reason for dropping this client..."
                      value={dropReason}
                      onChange={(e) => setDropReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDropDialog(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDropClient}>
                      Confirm Drop
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Transfer Client Dialog */}
              <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <UserPlus className="h-4 w-4 mr-1" /> Transfer Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Client</DialogTitle>
                    <DialogDescription>
                      Transfer {initialData.fullName} to another attorney in your firm.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    {availableAttorneys.length > 0 ? (
                      <>
                        <FormLabel htmlFor="attorney-select">Select Attorney</FormLabel>
                        <Select value={selectedAttorney} onValueChange={setSelectedAttorney}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select an attorney" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAttorneys.map((attorney) => (
                              <SelectItem key={attorney.id} value={attorney.id}>
                                {attorney.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <p className="text-center py-2 text-muted-foreground">
                        No other attorneys available for transfer.
                      </p>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
                    <Button 
                      onClick={handleTransferClient} 
                      disabled={!selectedAttorney || availableAttorneys.length === 0}
                    >
                      Transfer Client
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Form submission/cancel actions */}
          <div className="flex gap-2 ml-auto">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {initialData ? "Update Client" : "Save Client"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
