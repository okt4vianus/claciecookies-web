import { isRouteErrorResponse, useRouteError } from "react-router";
import { ProductItems } from "~/components/product/product-items";
import { Separator } from "~/components/ui/separator";
import { apiClient } from "~/lib/api-client";
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
  const { data: products, error } = await apiClient.GET("/products");
  if (error) throw new Response(`Failed to fetch products`, { status: 500 });
  return { products };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <>
      <section
        className="relative h-[90vh] w-full bg-contain bg-center"
        style={{ backgroundImage: 'url("/home-cover.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 flex justify-between items-center h-full px-10">
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-4">Clacie Cookies</h1>
            <p className="text-xl">Rasa yang menghangatkan.</p>
          </div>

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

      <section>
        <div className="px-4 py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Cookies
          </h2>

          <ProductItems products={products} />
        </div>
      </section>
    </>
  );
}
