import type { OneProductResponse } from "~/modules/product/schema";
import type { Route } from "./+types/products-slug";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function meta({ data }: Route.MetaArgs) {
  const { product } = data;
  return [
    { title: `${product.name} - Clacie Cookies` },
    {
      name: "description",
      content: product.description,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/products/${params.slug}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const product: OneProductResponse = await response.json();
    return { product };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Response("Failed to fetch product", {
      status: 500,
    });

    // return [];
  }
}

export default function ProductSlugRoute({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  return (
    // <div>
    //   <h1> Product Details </h1>
    //   <pre>{JSON.stringify(product, null, 2)}</pre>
    // </div>

    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-card text-card-foreground shadow-lg rounded-xl">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          {/* Gambar Produk */}
          <div className="bg-muted rounded-lg flex items-center justify-center p-4">
            <img
              src={product.images?.[0]?.url ?? "/placeholder.png"}
              alt={product.name}
              className="rounded-lg object-cover max-h-96"
            />
          </div>

          {/* Detail Produk */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-6 border-b border-primary pb-1">
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-10">
                {product.description}
              </p>

              <div className="text-lg font-medium mb-2">
                <span className="text-primary font-semibold">
                  Rp {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Jumlah & Tombol Add to Cart */}
            <div className="flex items-center gap-4 mt-4">
              <div>
                <Label htmlFor="quantity"></Label>
                <Input type="number" defaultValue={1} className="w-20" />
              </div>
              <Button>Add to Cart</Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Stock: {product.stockQuantity}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
