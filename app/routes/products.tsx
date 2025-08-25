import { ProductItems } from "@/components/product/product-items";
import { createApiClient } from "@/lib/api-client";
import type { Route } from "./+types/products";

export function meta() {
  return [
    { title: "Product of By Clacie" },
    {
      name: "description",
      content: "All Products by By Clacie",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const api = createApiClient(request);
  const { data: products, error } = await api.GET("/products");
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
