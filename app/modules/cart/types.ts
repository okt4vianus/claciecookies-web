import type { Product } from "@/modules/product/types";

export type CartItem = {
  id: string;
  quantity: number;
  subTotalPrice: number;
  product: Product;
};
