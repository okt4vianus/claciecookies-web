import { z } from "zod";
import { phoneNumber } from "../common/schema";

export const UpdateAddressSchema = z.object({
  id: z.string(),
  label: z.string().optional().or(z.literal("")),
  recipientName: z.string().min(1, "Recipient name is required"),
  phoneNumber,
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required").default("Sulawesi Utara"),
  postalCode: z.string(),
  country: z.string().default("Indonesia"),
  landmark: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  isDefault: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional(),
  // TODO: Fix this later to be required
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});
