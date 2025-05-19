import { z } from "zod";
import {
  createdAt,
  description,
  id,
  name,
  price,
  slug,
  stockQuantity,
  updatedAt,
} from "../common/schema";
import {
  ProductImageSchema,
  UpsertProductImageSchema,
} from "../product-image/schema";

export const ProductSchema = z.object({
  //id: id
  id,
  name,
  slug,
  description,
  price,
  stockQuantity,
  images: z.array(ProductImageSchema).optional(),
  createdAt,
  updatedAt,
});

export const ProductsSchema = z.array(ProductSchema);

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  slug: z.string().optional(),
  images: z.array(UpsertProductImageSchema).optional(),
});

export const UpsertProductSchema = CreateProductSchema.partial();

export const ParamProductIdSchema = z.object({
  id: z.string().min(3, "Product ID is required"),
});

export const ParamProductSlugSchema = z.object({
  slug: z.string().min(3, "Product slug is required"),
});

export const ParamProductIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), //Product ID or slug"
});

export const QuerySearchProductSchema = z.object({
  q: z.string().min(3, "Search query is required"),
});
