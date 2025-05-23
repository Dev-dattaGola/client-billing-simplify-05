
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "../form-schema";

interface PasswordFieldProps {
  form: UseFormReturn<ClientFormValues>;
  showPassword: boolean;
  toggleShowPassword: () => void;
  isEditing: boolean;
}

const PasswordField = ({ form, showPassword, toggleShowPassword, isEditing }: PasswordFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">
            {isEditing ? "New Password (optional)" : "Password *"}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder={isEditing ? "Leave blank to keep current" : "Set client account password"} 
                {...field} 
                className="bg-white/10 text-white border-white/20 pr-10" 
              />
              <button 
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormControl>
          <FormDescription className="text-white/70">
            {isEditing 
              ? "Enter a new password only if you want to change it" 
              : "Minimum 8 characters required"
            }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
