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
    <div className="p-4 max-w-7xl mx-auto bg-[#5C4033] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
        {products.map((product) => {
          const image = product.images?.[0];
          if (!image) return null;

          return (
            <div
              key={product.id}
              className="p-4 m-8 w-80 bg-amber-950 shadow-md rounded-xl"
            >
              <picture className="rounded-lg block overflow-hidden">
                <img
                  className="hover:scale-125 transition duration-500 ease-in-out h-52 w-full object-cover"
                  src={image.url}
                  alt={image.name || "Product image"}
                />
              </picture>

              <div className="p-4 flex flex-col flex-grow">
                <p className="font-medium mb-3">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                {/* <p className="text-sm mb-1 flex-grow">{product.description}</p> */}
                {/* <p className="font-medium mb-4">Stock: {product.stockQuantity}</p> */}
              </div>

              <div className="mt-auto">
                <button className="w-1/2 bg-[#FFF5E1] text-[#5C4033] border border-[#5C4033] py-2 px-4 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                  Buy now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
