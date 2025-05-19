import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

import { $fetch } from "~/lib/fetch";
import { ProductsSchema } from "~/modules/product/schema";
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

export async function loader({}: Route.LoaderArgs) {
  const { data, error } = await $fetch("/products", {
    output: ProductsSchema,
  });

  if (error) {
    throw new Response(`Failed to fetch products: ${error.message}`, {
      status: 500,
    });
  }

  return { products: data };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
                <Button variant={"destructive"} asChild>
                  <Link to={`/products/${product.slug}`}>View Product</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Terjadi kesalahan yang tidak terduga.";

  if (isRouteErrorResponse(error)) {
    if (typeof error.data === "object" && error.data?.message) {
      message = error.data.message;
    } else if (typeof error.data === "string") {
      message = error.data;
    }
  }

  return (
    <div>
      <h1>Oops 😢</h1>
      <p>{message}</p>
    </div>
  );
}
