import { ProductItems } from "@/components/product/product-items";
import { createApiClient } from "@/lib/api-client";
import type { Route } from "./+types/search";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Products found on search results - By Clacie" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) return { products: [], count: 0 };

  const api = createApiClient(request);
  const { data: products, error } = await api.GET("/search", {
    params: { query: { q } },
  });
  if (error) throw new Response(`Failed to search products`, { status: 500 });

  return { products, count: products.length };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products, count } = loaderData;

  return (
    <div className="p-10">
      {count <= 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">No Products Found</h2>
          <p className="text-muted-foreground">
            Try searching for something else.
          </p>
        </div>
      )}

      {count > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Found {count} products </h2>
          <ProductItems products={products} />
        </div>
      )}
    </div>
  );
}
