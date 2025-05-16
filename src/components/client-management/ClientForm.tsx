
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types/client";
import { supabase } from '@/integrations/supabase/client';

interface ClientFormProps {
  initialData: Client | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isAdmin?: boolean;
}

interface Attorney {
  id: string;
  full_name: string;
  specialization?: string;
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

const ClientForm = ({ initialData, onSubmit, onCancel, isAdmin = false }: ClientFormProps) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [isLoadingAttorneys, setIsLoadingAttorneys] = useState(false);

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

  useEffect(() => {
    if (isAdmin) {
      fetchAttorneys();
    }
  }, [isAdmin]);

  const fetchAttorneys = async () => {
    setIsLoadingAttorneys(true);
    try {
      // Try to fetch from Supabase first
      let { data: attorneysData, error } = await supabase
        .from('attorneys')
        .select('id, full_name, specialization');

      if (error) {
        throw error;
      }

      if (attorneysData && attorneysData.length > 0) {
        setAttorneys(attorneysData);
        return;
      }

      // Fallback to mock data
      console.warn('No attorneys found in Supabase, using mock data');
      setAttorneys([
        { id: 'attorney1', full_name: 'Jane Doe', specialization: 'Personal Injury' },
        { id: 'attorney2', full_name: 'John Smith', specialization: 'Medical Malpractice' },
        { id: 'attorney3', full_name: 'Alice Johnson', specialization: 'Slip and Fall' }
      ]);
    } catch (error) {
      console.error('Error fetching attorneys:', error);
      // Fallback to mock data
      setAttorneys([
        { id: 'attorney1', full_name: 'Jane Doe', specialization: 'Personal Injury' },
        { id: 'attorney2', full_name: 'John Smith', specialization: 'Medical Malpractice' },
        { id: 'attorney3', full_name: 'Alice Johnson', specialization: 'Slip and Fall' }
      ]);
    } finally {
      setIsLoadingAttorneys(false);
    }
  };

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
                      {attorneys.map((attorney) => (
                        <SelectItem key={attorney.id} value={attorney.id}>
                          {attorney.full_name} {attorney.specialization ? `(${attorney.specialization})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign a primary attorney to this client</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className={isAdmin ? "md:col-span-1" : "md:col-span-2"}>
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
