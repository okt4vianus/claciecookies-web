import { ProductItems } from "@/components/product/product-items";
import { apiClient } from "@/lib/api-client";
import type { Route } from "./+types/products";

export function meta() {
  return [
    { title: "Product of Clacie Cookies" },
    {
      name: "description",
      content: "All Products by Clacie Cookies",
    },
  ];
}

export async function loader() {
  const { data: products, error } = await apiClient.GET("/products");
  if (error) throw new Response(`Failed to fetch products`, { status: 500 });
  return { products };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <div className="p-10">
      <ProductItems products={products} />
    </div>
  );
}
