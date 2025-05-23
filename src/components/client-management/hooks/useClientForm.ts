
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Client } from "@/types/client";
import { getClientFormSchema, ClientFormValues } from "../form-schema";
import { toast } from "sonner";

export const useClientForm = (
  initialData: Client | null,
  onSubmit: (data: any) => void,
) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(getClientFormSchema(!!initialData)),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      companyName: initialData?.companyName || "",
      address: initialData?.address || "",
      notes: initialData?.notes || "",
      password: "",
      assignedAttorneyId: initialData?.assignedAttorneyId || "",
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("ClientForm: Setting initial data", initialData);
      form.reset({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        companyName: initialData.companyName || "",
        address: initialData.address || "",
        notes: initialData.notes || "",
        password: "", // Always start with empty password on edit
        assignedAttorneyId: initialData.assignedAttorneyId || "",
      });
      setTags(initialData.tags || []);
    }
  }, [initialData, form]);

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitForm = async (values: ClientFormValues) => {
    console.log("ClientForm: Submitting form", values);
    try {
      setIsSubmitting(true);
      
      if (initialData) {
        // If updating existing client, only include password if it was provided
        const dataToSubmit = {
          ...initialData,
          ...values,
          tags,
        };
        
        // Only include password if it's not empty
        if (!values.password) {
          delete dataToSubmit.password;
        }
        
        console.log("ClientForm: Updating existing client");
        await onSubmit(dataToSubmit);
      } else {
        // For new client, always include the password
        console.log("ClientForm: Creating new client");
        await onSubmit({
          ...values,
          tags,
        });
      }

      toast.success(`Client ${initialData ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'create'} client. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
