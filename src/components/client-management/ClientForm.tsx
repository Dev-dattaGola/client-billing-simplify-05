
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Save, Plus } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface ClientFormProps {
  initialData: Client | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
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
  assignedAttorneyId: z.string().optional(),
});

const ClientForm = ({ initialData, onSubmit, onCancel }: ClientFormProps) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  // Mock attorneys data (in a real app, this would come from an API)
  const attorneys = [
    { id: 'attorney1', name: 'Jane Doelawyer' },
    { id: 'attorney2', name: 'John Smith' },
    { id: 'attorney3', name: 'Sarah Johnson' },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      companyName: initialData?.companyName || "",
      address: initialData?.address || "",
      notes: initialData?.notes || "",
      assignedAttorneyId: initialData?.assignedAttorneyId || "",
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
    if (initialData) {
      onSubmit({
        ...initialData,
        ...values,
        tags,
      });
    } else {
      onSubmit({
        ...values,
        tags,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="bg-white/10 text-white border-white/20" />
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
                <FormLabel className="text-white">Email *</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" type="email" {...field} className="bg-white/10 text-white border-white/20" />
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
                <FormLabel className="text-white">Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} className="bg-white/10 text-white border-white/20" />
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
                <FormLabel className="text-white">Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} className="bg-white/10 text-white border-white/20" />
                </FormControl>
                <FormDescription className="text-white/70">Optional</FormDescription>
              </FormItem>
            )}
          />
          
          {isAdmin && (
            <FormField
              control={form.control}
              name="assignedAttorneyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Assigned Attorney</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/10 text-white border-white/20">
                        <SelectValue placeholder="Select an attorney" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/90 backdrop-blur-lg text-black">
                      {attorneys.map(attorney => (
                        <SelectItem key={attorney.id} value={attorney.id}>
                          {attorney.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-white/70">
                    Attorney responsible for this client's cases
                  </FormDescription>
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className={isAdmin ? "" : "md:col-span-2"}>
                <FormLabel className="text-white">Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Anytown, USA" {...field} className="bg-white/10 text-white border-white/20" />
                </FormControl>
                <FormDescription className="text-white/70">Optional</FormDescription>
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormLabel className="text-white">Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 bg-white/20 text-white">
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
                className="bg-white/10 text-white border-white/20"
              />
              <Button 
                type="button" 
                size="icon" 
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-2">
              Press Enter or click + to add a tag
            </p>
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-white">Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any additional notes or information about the client..."
                    className="min-h-[120px] bg-white/10 text-white border-white/20"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white/70">Optional</FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
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
      </form>
    </Form>
  );
};

export default ClientForm;
