import type { z } from "zod";
import type {
  ManyProductsResponseSchema,
  OneProductResponseSchema,
} from "./schema";

export type OneProductResponse = z.infer<typeof OneProductResponseSchema>;

export type ManyProductsResponse = z.infer<typeof ManyProductsResponseSchema>;
