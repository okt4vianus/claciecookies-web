import { z } from "zod";

export const id = z.string();
export const name = z.string().min(3, "Name is required");
export const slug = z.string();
export const description = z.string().optional();
export const price = z
  .number()
  .int()
  .positive("Price must be a positive number");
export const stockQuantity = z
  .number()
  .int()
  .nonnegative("Stock quantity must be more than or equal to 0");
export const createdAt = z.string(); //z.date()
export const updatedAt = z.string(); //z.date()
