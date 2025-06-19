import { LoaderIcon, Minus, Plus, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { apiClient } from "~/lib/api-client";
import type { Route } from "./+types/products-slug";
import { Form, href, redirect, useNavigation } from "react-router";
import { getSession } from "~/sessions.server";

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
    { params: { path: { identifier: params.slug } } }
  );

  if (error) throw new Response(`Failed to fetch one product ${error.message}`);
  if (!product) throw new Response("Product not found", { status: 404 });
  return { product };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  // if (!token) return new Response("Unauthorized", { status: 400 });

  if (!token) {
    // Redirect langsung ke login jika tidak authenticated
    return redirect(href("/login"));
  }

  const formData = await request.formData();
  const productId = formData.get("productId");
  const quantity = Number(formData.get("quantity"));

  if (!productId || !quantity || quantity < 1) {
    return new Response("Invalid product or quantity", { status: 400 });
  }

  const { data: cartItem, error } = await apiClient.PUT("/cart/items", {
    body: {
      intent: "add",
      productId: String(productId),
      quantity,
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log({ cartItem, error });

  if (error) {
    return new Response(error.message || "Failed to add to cart", {
      status: 500,
    });
  }

  return redirect("/cart", 303);
}

export default function ProductSlugRoute({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;

  const [quantity, setQuantity] = useState(1);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

            <Form method="post" className="flex items-end gap-4 mt-4">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="quantity" value={quantity} />
              <div>
                <Label htmlFor="quantity" className="mb-2 block">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrease}
                    disabled={isSubmitting || quantity <= 1}
                    className="border border-gray-300 rounded-full w-8 h-8 p-0 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    value={quantity}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    disabled={isSubmitting}
                    className="w-15 text-center border border-gray-300 rounded-md focus:ring-0 focus:border-gray-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrease}
                    disabled={isSubmitting || quantity >= product.stockQuantity}
                    className="border-1 border-gray-300 rounded-full w-8 h-8 p-0 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </Button>
            </Form>

            <p className="text-sm text-muted-foreground mb-4">
              Stock: {product.stockQuantity}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
