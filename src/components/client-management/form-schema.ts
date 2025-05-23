
import * as z from "zod";

export const getClientFormSchema = (isEditing: boolean) => z.object({
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
  password: isEditing
    ? z.string().min(8, { message: "Password must be at least 8 characters" }).optional().or(z.literal(''))
    : z.string().min(8, { message: "Password must be at least 8 characters" }),
  assignedAttorneyId: z.string().optional(),
});

export type ClientFormValues = z.infer<ReturnType<typeof getClientFormSchema>>;
