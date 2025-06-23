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
