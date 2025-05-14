import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import type { ManyProductsResponse } from "~/modules/product/schema";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clacie Cookies" },
    {
      name: "description",
      content:
        "Selling soft cookies with premium ingredients. Crafted with Purpose in Minahasa, Delivered in Care",
    },
  ];
}

// Server-Side
export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(`${process.env.BACKEND_API_URL}/products`);
  const products: ManyProductsResponse = await response.json();
  return products;
}

// Client-Side
export default function Home({ loaderData }: Route.ComponentProps) {
  const products = loaderData as ManyProductsResponse;

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Clacie Cookies</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {products.map((product) => {
          const image = product.images?.[0];
          if (!image) return null;

          return (
            <Card key={product.id}>
              <CardHeader>
                <picture className="rounded-lg block overflow-hidden">
                  <img
                    className="hover:scale-110 transition duration-500 ease-in-out h-60 w-full object-cover"
                    src={image.url}
                    alt={image.name || "Product image"}
                  />
                </picture>
              </CardHeader>

              <CardContent>
                <p className="font-medium text-xl mb-3">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                {/* <p className="text-sm mb-1 flex-grow">{product.description}</p> */}
                {/* <p className="font-medium mb-4">Stock: {product.stockQuantity}</p> */}
              </CardContent>

              <CardFooter className="mt-auto justify-center">
                <div>
                  <Button asChild>
                    <Link to={`/products/${product.slug}`}>View Product</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
