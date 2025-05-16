import { Link } from "react-router";
import { betterFetch } from "@better-fetch/fetch";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import type { Route } from "./+types/home";
import { ManyProductsResponseSchema } from "~/modules/product/schema";

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

export async function loader({}: Route.LoaderArgs) {
  const { data: products, error } = await betterFetch(
    `${process.env.BACKEND_API_URL}/products`,
    { output: ManyProductsResponseSchema }
  );
  if (error) throw new Response(error.message, { status: 500 });
  return { products };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Clacie Cookies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {products.map((product) => {
          const image = product.images?.[0];

          if (!image) return null; // Skip rendering if no image is available

          return (
            <Card key={product.id}>
              <CardHeader>
                <picture className="rounded-lg block overflow-hidden">
                  <img
                    className="hover:scale-110 transition duration-500 ease-in-out h-70 w-full object-cover"
                    src={image.url}
                    alt={image.name || "Product image"}
                  />
                </picture>
              </CardHeader>

              <CardContent>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="font-medium mb-3">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
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
