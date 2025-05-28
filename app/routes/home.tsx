import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

import type { Route } from "./+types/home";
import { Separator } from "~/components/ui/separator";
import { apiClient } from "~/lib/api-client";

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
  const {
    data: products, // only present if the request was successful 2xx
    error, // only present if the request failed 4xx or 5xx
  } = await apiClient.GET("/products");

  if (error) {
    throw new Response(`Failed to fetch products`, { status: 500 });
  }

  return { products };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <>
      <section
        className="relative h-[90vh] w-full bg-cover bg-center"
        style={{ backgroundImage: 'url("/background.png")' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 flex justify-between items-center h-full px-10">
          {/* Left Text */}
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-4">Clacie Cookies</h1>
            <p className="text-xl">Rasa yang menghangatkan.</p>
          </div>

          {/* Right Social Media Icons */}
          <div className="flex flex-col items-end gap-4">
            <a
              href="https://www.instagram.com/clacie.cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                alt="Instagram"
                className="w-8 h-8 hover:opacity-80"
              />
            </a>
            <a
              href="https://wa.me/628115912343?text=Halo%20Clacie!%20Saya%20tertarik%20dengan%20cookies-nya.%20Bisa%20info%20lebih%20lanjut%3F%20%F0%9F%98%8A"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                alt="WhatsApp"
                className="w-8 h-8 hover:opacity-80"
              />
            </a>
          </div>
        </div>
      </section>

      <Separator />

      {/* Featured Products Section */}
      <section>
        <div className="px-4 py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Cookies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const image = product.images?.[0];
              if (!image) return null;

              return (
                <Card key={product.id}>
                  <CardHeader>
                    <img
                      src={image.url}
                      alt={image.name || product.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="font-medium mb-3">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button variant={"destructive"} asChild>
                      <Link to={`/products/${product.slug}`}>View Product</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
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
