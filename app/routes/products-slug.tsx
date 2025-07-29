import {
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { LoaderIcon, Minus, Plus, ShoppingCartIcon } from "lucide-react";
import { useEffect } from "react";
import { Form, href, redirect, useNavigate, useNavigation } from "react-router";
import { toast } from "sonner";
import { getAppSession } from "@/app-session.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { AddProductToCartSchema } from "@/modules/product/schema";
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

export async function loader({ params }: Route.LoaderArgs) {
  const { data: product, error } = await apiClient.GET(
    "/products/{identifier}",
    {
      params: { path: { identifier: params.slug } },
    },
  );

  if (error) throw new Response(`Failed to fetch one product ${error.message}`);
  if (!product) throw new Response("Product not found", { status: 404 });
  return { product };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getAppSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) return redirect(href("/login"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: AddProductToCartSchema });
  if (submission.status !== "success") return submission.reply();

  const { error } = await apiClient.PUT("/cart/items", {
    body: { intent: "add", ...submission.value },
  });

  if (error) {
    return submission.reply({
      formErrors: [error.message ?? "Unknown error"],
      fieldErrors: {},
    });
  }

  // TODO: Either still redirect or show data/cartItem on alert dialog
  return redirect("/cart");
}

export default function ProductSlugRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { product } = loaderData;
  const navigate = useNavigate(); // redirect
  const navigation = useNavigation(); // loading state
  const isSubmitting = navigation.state === "submitting";

  // Can be refactored as custom useToastMessage hook
  const message = actionData?.error?.[""];

  useEffect(() => {
    if (message) {
      toast.warning(message, {
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart"),
        },
      });
    }
  }, [message, navigate]);

  const [form, fields] = useForm({
    id: `product-slug-quantity-form-${product.id}`,
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AddProductToCartSchema });
    },
    defaultValue: {
      productId: product.id,
      quantity: 1,
    },
  });

  // Use useInputControl for both fields
  const productIdControl = useInputControl(fields.productId);
  const quantityControl = useInputControl(fields.quantity);

  // Transform string to number for business logic
  const quantity: number = quantityControl.value
    ? Number(quantityControl.value)
    : 1;

  const handleIncrease = () => {
    if (quantity < product.stockQuantity) {
      quantityControl.change((quantity + 1).toString());
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      quantityControl.change((quantity - 1).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= product.stockQuantity) {
      quantityControl.change(value.toString());
    } else if (value > product.stockQuantity) {
      quantityControl.change(product.stockQuantity.toString());
    } else {
      quantityControl.change("1");
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

            <Form method="post" {...getFormProps(form)}>
              <div className="flex items-end gap-4 mt-4">
                {/* Hidden productId field - controlled by useInputControl */}
                <input
                  {...getInputProps(fields.productId, { type: "hidden" })}
                  value={productIdControl.value || product.id}
                  onChange={(e) => productIdControl.change(e.target.value)}
                />

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
                      {...getInputProps(fields.quantity, { type: "number" })}
                      id="quantity"
                      value={quantityControl.value || "1"}
                      onChange={handleInputChange}
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
                      disabled={
                        isSubmitting || quantity >= product.stockQuantity
                      }
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
              </div>
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
