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
import { Separator } from "~/components/ui/separator";

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

            <a
              href="https://shopee.co.id/clacie"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/831/831276.png"
                alt="Shopee"
                className="w-8 h-8 hover:opacity-80"
              />
            </a>
          </div>
        </div>
      </section>

      <Separator />

      {/* Featured Products Section */}
      <section>
        <div
          style={{
            padding: "3rem 1rem",
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Featured Cookies
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {products.map((product) => {
              const image = product.images?.[0];
              if (!image) return null;

              return (
                <Card key={product.id}>
                  <CardHeader>
                    <img
                      src={image.url}
                      alt={image.name || product.name}
                      style={{
                        width: "100%",
                        height: "12rem",
                        objectFit: "cover",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </CardHeader>
                  <CardContent>
                    <h3>{product.name}</h3>
                    <p>Rp {product.price.toLocaleString("id-ID")}</p>
                  </CardContent>
                  <CardFooter style={{ justifyContent: "center" }}>
                    <Button asChild>
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
    // <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
    //   {products.map((product) => {
    //     const image = product.images?.[0];

    //     if (!image) return null; // Skip rendering if no image is available

    //     return (
    //       <Card key={product.id}>
    //         <CardHeader>
    //           <picture className=" block overflow-hidden">
    //             <img
    //               className="hover:scale-110 transition duration-500 ease-in-out h-70 w-full object-cover"
    //               src={image.url}
    //               alt={image.name || "Product image"}
    //             />
    //           </picture>
    //         </CardHeader>

    //         <CardContent>
    //           <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
    //           <p className="font-medium mb-3">
    //             Rp {product.price.toLocaleString("id-ID")}
    //           </p>
    //         </CardContent>
    //         <CardFooter className="mt-auto justify-center">
    //           <div>
    //             <Button variant={"destructive"} asChild>
    //               <Link to={`/products/${product.slug}`}>View Product</Link>
    //             </Button>
    //           </div>
    //         </CardFooter>
    //       </Card>
    //     );
    //   })}
    // </div>
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
