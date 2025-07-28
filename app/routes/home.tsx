import { useEffect } from "react";
import { data } from "react-router";
import { toast } from "sonner";
import { ProductItems } from "@/components/product/product-items";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api-client";
import { commitSession, getSession } from "@/sessions.server";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "Clacie Cookies" },
    {
      name: "description",
      content:
        "Selling soft cookies with premium ingredients. Crafted with Purpose in Minahasa, Delivered in Care",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const toastMessage = session.get("toastMessage");

  session.unset("toastMessage");

  const { data: products, error } = await apiClient.GET("/products");
  if (error) throw new Response(`Failed to fetch products`, { status: 500 });

  // return { products };

  return data(
    { products, toastMessage },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products, toastMessage } = loaderData;

  useEffect(() => {
    if (toastMessage) {
      toast.success(toastMessage);
    }
  }, [toastMessage]);

  const shuffled = [...products].sort(() => 0.5 - Math.random());

  return (
    <>
      <section
        className="relative h-[90vh] w-full bg-contain bg-center flex flex-col justify-between px-10 py-6"
        style={{ backgroundImage: 'url("/home-cover.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h1 className="text-5xl font-bold mb-4 font-brand">Clacie</h1>

          <p className="text-xl" style={{ fontFamily: "sans-serif" }}>
            Cookies you'll fall in love with
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-white text-lg font-semibold justify-center">
          <span>Contact us in</span>
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
      </section>

      <Separator />

      <section>
        <div className="p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Cookies
          </h2>

          <ProductItems products={shuffled.slice(0, 3)} />
        </div>
      </section>
    </>
  );
}
