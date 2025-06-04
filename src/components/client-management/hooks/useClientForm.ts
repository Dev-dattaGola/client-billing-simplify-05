
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Client } from "@/types/client";
import { getClientFormSchema, ClientFormValues } from "../form-schema";
import { toast } from "sonner";
import { CreateClientData, UpdateClientData } from "@/services/clientService";

export const useClientForm = (
  initialData: Client | null,
  onSubmit: (data: CreateClientData | UpdateClientData) => Promise<Client | null>,
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
      console.log("useClientForm: Setting initial data", initialData);
      form.reset({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        companyName: initialData.companyName || "",
        address: initialData.address || "",
        notes: initialData.notes || "",
        password: "",
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
    console.log("useClientForm: Submitting form with values:", values);
    
    if (isSubmitting) {
      console.log("useClientForm: Already submitting, ignoring");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let dataToSubmit: CreateClientData | UpdateClientData;
      
      if (initialData) {
        // Updating existing client
        dataToSubmit = {
          id: initialData.id,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          companyName: values.companyName,
          address: values.address,
          notes: values.notes,
          assignedAttorneyId: values.assignedAttorneyId,
          tags,
        };
        
        // Only include password if provided
        if (values.password) {
          dataToSubmit.password = values.password;
        }
        
        console.log("useClientForm: Updating existing client with data:", dataToSubmit);
      } else {
        // Creating new client
        dataToSubmit = {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          companyName: values.companyName,
          address: values.address,
          notes: values.notes,
          assignedAttorneyId: values.assignedAttorneyId,
          password: values.password,
          tags,
        };
        console.log("useClientForm: Creating new client with data:", dataToSubmit);
      }

      console.log("useClientForm: Calling onSubmit with data:", dataToSubmit);
      const result = await onSubmit(dataToSubmit);
      
      console.log("useClientForm: onSubmit returned:", result);

      if (result) {
        console.log("useClientForm: Client saved successfully:", result);
        toast.success(`Client ${initialData ? 'updated' : 'created'} successfully`);
        return result;
      } else {
        console.error("useClientForm: onSubmit returned null/undefined result");
        toast.error(`Failed to ${initialData ? 'update' : 'create'} client. Please try again.`);
        return null;
      }
    } catch (error) {
      console.error("useClientForm: Error in form submission:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'create'} client. Please try again.`);
      return null;
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
