import type { ProductsResponse } from "~/modules/product/schema";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clacie Cookies" },
    { name: "description", content: "Delicious cookies" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch("http://localhost:3000/products");
  const products: ProductsResponse = await response.json();
  return products;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const products = loaderData;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          return (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-gray-700">Price: Rp {product.price}</p>
              <p className="text-gray-700">Stock: {product.stockQuantity}</p>
              {product.images && product.images.length > 0 && (
                <div className="flex flex-wrap">
                  {product.images.map((image) => (
                    <img
                      src={`${image.url}-/scale_crop/320x320/smart/`}
                      alt={image.name}
                      className="w-1/2 h-auto object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
