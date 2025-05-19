import { z } from "zod";
import { createdAt, id, name, slug, updatedAt } from "../common/schema";

export const ProductImageSchema = z.object({
  id,
  name,
  url: z.string().url("URL is required"),
  productId: id,
  createdAt,
  updatedAt,
});

export const UpsertProductImageSchema = ProductImageSchema.pick({
  name: true,
  url: true,
});

export const CreateProductImageSchema = UpsertProductImageSchema.extend({
  // productSlug: z.string().optional(),
  productSlug: slug.optional(),
});

export const ParamProductImageIdSchema = z.object({
  id: id.min(3, "Product Image ID is required"),
});

export const ParamProductImageIdentifierSchema = z.object({
  identifier: id.min(3, "Identifier is required"), // Product Image ID or name
});

export const ProductImageResponseSchema = ProductImageSchema;

export const ProductImagesResponseSchema = z.array(ProductImageSchema);
