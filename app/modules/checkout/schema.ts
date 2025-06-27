import { z } from "zod";

export const CheckoutSchema = z.object({
  cartId: z.string(),
  shippingMethod: z.enum(["regular", "express", "same_day"]),
  paymentMethod: z.enum(["bank_transfer", "e_wallet", "cod"]),
  notes: z.string().optional(),
  // Get the rest from the database
  // User Profile
  // Phone
  // Address
});

// Address schema
export const CheckoutAddressSchema = z.object({
  street: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(5, "Postal code must be at least 5 digits"),
  province: z.string().optional(),
  country: z.string().default("Indonesia"),
});
