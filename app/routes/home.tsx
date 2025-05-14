import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import type { ManyProductsResponse } from "~/modules/product/schema";
import { motion } from "framer-motion";

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

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch("http://localhost:3000/products");
  const products: ManyProductsResponse = await response.json();
  return products;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const products = loaderData as ManyProductsResponse;

  return (
    <div className="p-4 max-w-7xl mx-auto bg-[#5C4033] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#5C4033] text-white rounded-2xl overflow-hidden flex flex-col h-120 shadow-md transition-shadow border border-white"
          >
            {product.images?.[0].url && (
              <motion.img
                src={product.images[0].url}
                alt={product.images[0].name || "Product image"}
                className="w-full h-70 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            )}

            <div className="p-4 flex flex-col flex-grow">
              <p className="font-medium mb-3">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              {/* <p className="text-sm mb-1 flex-grow">{product.description}</p> */}
              {/* <p className="font-medium mb-4">Stock: {product.stockQuantity}</p> */}

              <div className="mt-auto flex justify-center">
                <button className="w-1/2 bg-[#FFF5E1] text-[#5C4033] border border-[#5C4033] py-2 px-4 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                  Buy now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
