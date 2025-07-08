import z from "zod";
import { phoneNumber } from "~/modules/common/schema";

export const UserProfileSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber,
});

export const AddressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  label: z.string(),
  recipientName: z
    .string()
    .min(3, "Recipient name must be at least 3 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  province: z.string().default("Sulawesi Utara"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().default("Indonesia"),
  landmark: z.string().nullable(),
  notes: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateAddressSchema = AddressSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  isDefault: z.boolean().default(true),
  isActive: z.boolean().default(true),
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
