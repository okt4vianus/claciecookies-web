import { z } from "zod";

export const CreateNewOrderSchema = z.object({
  addressId: z.string(),
  shippingMethodSlug: z.string(),
  paymentMethodSlug: z.string(),
  // User Profile and Latest Cart from database
});
