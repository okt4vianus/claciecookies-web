import z from "zod";
import { phoneNumber } from "~/modules/common/schema";

export const UserProfileSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber,
});

export const UserAddressSchema = z.object({
  label: z.string().optional(),
  recipientName: z
    .string()
    .min(3, "Recipient name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  province: z.string().default("Sulawesi Utara"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().default("Indonesia"),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().default(false),
});

export const CreateAddressSchema = UserAddressSchema.extend({
  userId: z.string(),
  label: z.string(),
  province: z.string().optional(),
  country: z.string().optional(),
  landmark: z.string().nullable().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// const CreateAddressSchema = z.object({
//   label: z.string().min(1),
//   recipientName: z.string().min(1),
//   phone: z.string().min(10),
//   street: z.string().min(1),
//   city: z.string().min(1),
//   province: z.string().optional().default("Sulawesi Utara"),
//   country: z.string().optional().default("Indonesia"),
//   postalCode: z.string().min(5),
//   landmark: z.string().optional(),
//   notes: z.string().optional(),
//   latitude: z.number().optional(),
//   longitude: z.number().optional(),
//   isDefault: z.boolean().optional(),
// });
