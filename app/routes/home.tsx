import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import type { ManyProductsResponse } from "~/modules/product/schema";

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
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products: ManyProductsResponse = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const products = loaderData as ManyProductsResponse;

  return (
    <div className="p-4 max-w-7xl mx-auto ">
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
                {/* <p className="text-sm mb-1 flex-grow">{product.description}</p> */}
                {/* <p className="font-medium mb-4">Stock: {product.stockQuantity}</p> */}
              </CardContent>
              <CardFooter className="mt-auto justify-center">
                <Button>
                  {/* className="rounded-full hover:bg-red-600 hover:text-white transition-colors"> */}
                  Buy now
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
