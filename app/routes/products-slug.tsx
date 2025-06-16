import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { apiClient } from "~/lib/api-client";
import type { Route } from "./+types/products-slug";

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.product) {
    return [
      { title: "Produk tidak ditemukan - Clacie Cookies" },
      {
        name: "description",
        content: "Produk yang Anda cari tidak tersedia atau terjadi kesalahan.",
      },
    ];
  }

  const { product } = data;
  return [
    { title: `${product.name} - Clacie Cookies` },
    {
      name: "description",
      content: product.description,
    },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { data: product, error } = await apiClient.GET(
    "/products/{identifier}",
    {
      params: { path: { identifier: params.slug } },
    }
  );

  if (error) throw new Response(`Failed to fetch one product ${error.message}`);
  if (!product) throw new Response("Product not found", { status: 404 });
  return { product };
}

export default function ProductSlugRoute({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;

  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= product.stockQuantity) {
      setQuantity(value);
    } else if (value > product.stockQuantity) {
      setQuantity(product.stockQuantity);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    const { data: cart, error } = await apiClient.PUT("/cart/items", {
      body: {
        productId: product.id,
        quantity: quantity,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-card text-card-foreground shadow-lg rounded-xl">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg flex items-center justify-center p-4">
            <img
              src={product.images?.[0]?.url ?? "/placeholder.png"}
              alt={product.name}
              className="rounded-lg object-cover max-h-96"
            />
          </div>

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

            <div className="flex items-end gap-4 mt-4">
              <div>
                <Label htmlFor="quantity" className="mb-2 block">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="border border-gray-300 rounded-full w-8 h-8 p-0 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    // type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    min="1"
                    max={product.stockQuantity}
                    className="w-15 text-center border border-gray-300 rounded-md focus:ring-0 focus:border-gray-300"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stockQuantity}
                    className="border-1 border-gray-300 rounded-full w-8 h-8 p-0 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleAddToCart}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
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
