
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "../form-schema";

interface Attorney {
  id: string;
  name: string;
}

interface AttorneySelectProps {
  form: UseFormReturn<ClientFormValues>;
  attorneys: Attorney[];
}

const AttorneySelect = ({ form, attorneys }: AttorneySelectProps) => {
  return (
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
  );
};

export default AttorneySelect;
