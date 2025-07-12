import { z } from "zod";

export const CreateNewOrderSchema = z.object({
  addressId: z.string(),
  shippingMethodSlug: z.enum(["regular", "express", "same_day"]),
  paymentMethodSlug: z.enum(["bank_transfer", "e_wallet", "cod"]),
  // User Profile and Latest Cart from database
});
