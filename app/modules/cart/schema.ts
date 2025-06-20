import z from "zod";

export const UpdateCartItemQuantitySchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(0),
});
