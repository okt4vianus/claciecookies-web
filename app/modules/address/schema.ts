import { z } from "zod";
import { phoneNumber } from "../common/schema";

export const UpdateAddressSchema = z.object({
  id: z.string(),
  label: z.string().optional().or(z.literal("")),
  recipientName: z.string().min(3, "Recipient name is required min 3"),
  phoneNumber,
  street: z.string().min(10, "Street address is required min 10 character"),
  city: z.string().min(3, "City is required"),
  province: z.string().min(5, "Province is required").default("Sulawesi Utara"),
  postalCode: z.string().min(5, "Postal code must be at least 5 digits").max(5),
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
