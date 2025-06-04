import React from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Client } from "@/types/client";
import { useAuth } from "@/contexts/AuthContext";
import { useClientForm } from "./hooks/useClientForm";
import PasswordField from "./form-components/PasswordField";
import TagsField from "./form-components/TagsField";
import AttorneySelect from "./form-components/AttorneySelect";

interface ClientFormProps {
  initialData: Client | null;
  onSubmit: (data: any) => Promise<Client | null>;
  onCancel: () => void;
}

const ClientForm = ({ initialData, onSubmit, onCancel }: ClientFormProps) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  // Mock attorneys data (in a real app, this would come from an API)
  const attorneys = [
    { id: 'attorney1', name: 'Jane Doelawyer' },
    { id: 'attorney2', name: 'John Smith' },
    { id: 'attorney3', name: 'Sarah Johnson' },
  ];

  const { 
    form,
    tags,
    currentTag,
    setCurrentTag,
    showPassword,
    isSubmitting,
    handleAddTag,
    handleRemoveTag,
    handleKeyPress,
    toggleShowPassword,
    handleSubmitForm
  } = useClientForm(initialData, onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6 text-white">
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
                <FormDescription className="text-white/70">This will be used as the login username</FormDescription>
              </FormItem>
            )}
          />
          
          <PasswordField 
            form={form} 
            showPassword={showPassword} 
            toggleShowPassword={toggleShowPassword}
            isEditing={!!initialData}
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
            <AttorneySelect form={form} attorneys={attorneys} />
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
          
          <TagsField 
            tags={tags}
            currentTag={currentTag}
            setCurrentTag={setCurrentTag}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            handleKeyPress={handleKeyPress}
          />
          
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⌛</span>
                {initialData ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {initialData ? "Update Client" : "Save Client"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
