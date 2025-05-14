import type { OneProductResponse } from "~/modules/product/schema";
import type { Route } from "./+types/products-slug";

export function meta({ data }: Route.MetaArgs) {
  const { product } = data;
  return [
    { title: `${product.name} - Clacie Cookies` },
    { name: "description", content: product.description },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/products/${params.slug}`
  );
  const product: OneProductResponse = await response.json();
  return { product };
}

export default function ProductsSlugRoute({
  loaderData,
}: Route.ComponentProps) {
  const { product } = loaderData;

  return (
    <div>
      <h1>Product Details</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}
