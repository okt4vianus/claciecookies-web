import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Form, href, Link, redirect, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { apiClient } from "~/lib/api-client";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/cart";
import { UpdateCartItemQuantitySchema } from "~/modules/cart/schema";

export function meta() {
  return [
    { title: "Keranjang Belanja - Clacie Cookies" },
    {
      name: "description",
      content: "Lihat dan kelola produk dalam keranjang belanja Anda",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    // Redirect to login if not authenticated
    return redirect(href("/login"));
  }

  const { data: cart, error } = await apiClient.GET("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    console.error("Cart fetch error:", error);
    return { isAuthenticated: true, cart: null };
  }

  return { isAuthenticated: true, cart };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UpdateCartItemQuantitySchema,
  });

  // use submission.reply() for error handling
  if (submission.status !== "success") {
    return submission.reply();
  }

  const { itemId, quantity } = submission.value;

  try {
    if (quantity === 0) {
      await apiClient.DELETE("/cart/items/{id}", {
        params: { path: { id: itemId } },
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await apiClient.PATCH("/cart/items/{id}", {
        params: { path: { id: itemId } },
        body: { quantity },
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    return redirect("/cart");
  } catch (error) {
    // Return error dengan submission.reply()
    return submission.reply({
      formErrors: ["Gagal mengupdate keranjang. Silakan coba lagi."],
    });
  }
}

export default function CartRoute({ loaderData }: Route.ComponentProps) {
  const { cart } = loaderData;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-2 sm:p-6 py-2.5">
          <div className="text-left py-3">
            <h1 className="text-xl sm:text-xl font-bold text-foreground mb-2">Keranjang Belanja</h1>
            <p>0 items</p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            {/* Left: Empty Items */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">Keranjang Kosong</h3>
                <p className="text-muted-foreground mb-6">Belum ada produk dalam keranjang</p>
                <Button asChild>
                  <Link to="/products">Mulai Belanja</Link>
                </Button>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="rounded-2xl border p-6">
              <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
              <div className="flex justify-between mb-4">
                <span>Total Belanja:</span>
                <span className="font-bold">Rp 0</span>
              </div>
              <Button size="lg" disabled className="w-full">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sort items based on createdAt
  const sortedItems = [...cart.items].sort((a, b) => {
    // Handle null values - items with null createdAt go to the end
    if (!a.createdAt && !b.createdAt) return 0;
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;

    // Reverse the order - newest first (descending)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-2 sm:p-6 py-2.5">
        <div className="text-left py-3">
          <h1 className="text-xl sm:text-xl font-bold text-foreground mb-2">Keranjang Belanja</h1>
          <p>{cart.items.length} items</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Left: Cart Items Table */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border overflow-hidden">
              {/* Header */}
              <div className="hidden sm:grid border p-6 grid-cols-12 gap-4 items-center font-semibold">
                <div className="col-span-4 text-center">Product</div>
                <div className="col-span-1 text-center">Price</div>
                <div className="col-span-3 text-center">Action</div>
                <div className="text-center">Quantity</div>
                <div className="col-span-3 text-center">Subtotal</div>
              </div>

              {/* Items - Menggunakan sortedItems instead of cart.items */}
              <div className="divide-y divide-border/50">
                {sortedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center hover:bg-secondary/30 transition-colors duration-300"
                  >
                    {/* Product Info */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16">
                        <Link to={`/products/${item.product.slug}`}>
                          <img
                            src={item.product.images?.[0]?.url ?? "/placeholder.jpg"}
                            alt={item.product.name}
                            className="rounded-lg object-cover w-18 h-18 hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.slug}`}>
                          <h3 className="text-base hover:text-primary transition-colors duration-300">
                            {item.product.name}
                          </h3>
                        </Link>
                        {/* Show stock info */}
                        <p className="text-xs text-muted-foreground">Stok: {item.product.stockQuantity}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-2 text-center sm:text-left">
                      <p>Rp {item.product.price.toLocaleString("id-ID")}</p>
                    </div>

                    {/* Delete Button */}
                    <div className="sm:col-span-1 flex justify-center sm:justify-start order-2 sm:order-none">
                      <DeleteItemForm item={item} />
                    </div>

                    {/* Quantity Input */}
                    <div className="sm:col-span-3 flex flex-col sm:flex-row justify-center sm:justify-start gap-2 order-1 sm:order-none">
                      <QuantityForm item={item} />
                    </div>

                    {/* Subtotal */}
                    <div className="sm:col-span-2 text-center sm:text-left order-3 sm:order-none">
                      <p className="text-foreground mt-4 sm:mt-0">Rp {item.subTotalPrice.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Total Summary */}
          <div className="shadow-xl rounded-2xl p-6 h-fit border-2 border-border flex flex-col justify-between overflow-hidden relative">
            <div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-4">Ringkasan Belanja</h2>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total Belanja:</span>
                  <span className="text-xl font-bold text-foreground">
                    Rp {cart.totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/cart/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantityForm({ item }: { item: any }) {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";
  const isOne = item.quantity === 1;

  // Get stock quantity from product
  const stockQuantity = item.product.stockQuantity;

  const [form, fields] = useForm({
    id: `quantity-form-${item.id}`,
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateCartItemQuantitySchema });
    },
    defaultValue: {
      itemId: item.id,
      quantity: item.quantity,
    },
  });

  // Submit form with new quantity
  const submitWithQuantity = (newQuantity: number) => {
    // Ensure quantity doesn't exceed stock
    const finalQuantity = Math.min(Math.max(1, newQuantity), stockQuantity);

    const formElement = document.getElementById(form.id) as HTMLFormElement;
    if (formElement) {
      const quantityInput = formElement.querySelector('[name="quantity"]') as HTMLInputElement;
      if (quantityInput) {
        quantityInput.value = finalQuantity.toString();
        formElement.requestSubmit();
      }
    }
  };

  // 📝 TODO: Toast / Sonner
  // Show stock warning if quantity is at maximum
  // item.quantity >= stockQuantity

  return (
    <div>
      <Form method="post" {...getFormProps(form)} className="flex items-center gap-3 justify-center">
        <input {...getInputProps(fields.itemId, { type: "hidden" })} />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isOne || isSubmitting}
          onClick={() => submitWithQuantity(Math.max(0, item.quantity - 1))}
          className="border-2 border-border bg-secondary hover:bg-secondary/80 rounded-full w-10 h-10 p-0 hover:scale-110 transition-all duration-300 shadow-md"
        >
          <MinusIcon className="h-4 w-4 text-foreground" />
        </Button>

        <div className="flex flex-col items-center">
          <Input
            {...getInputProps(fields.quantity, { type: "number" })}
            min="1"
            max={stockQuantity}
            className="w-20 text-center border-2 border-border rounded-xl bg-secondary/50 font-semibold text-foreground shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              if (value >= 0) {
                setTimeout(() => submitWithQuantity(value), 500);
              }
            }}
          />
          {fields.quantity.errors && (
            <div id={fields.quantity.errorId} className="text-sm text-destructive mt-1">
              {fields.quantity.errors}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isSubmitting || item.quantity >= stockQuantity}
          onClick={() => submitWithQuantity(item.quantity + 1)}
          className="border-2 border-border bg-secondary hover:bg-secondary/80 rounded-full w-10 h-10 p-0 hover:scale-110 transition-all duration-300 shadow-md disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4 text-foreground" />
        </Button>
      </Form>

      {form.errors && (
        <p id={form.errorId} className="text-sm text-destructive mt-2 text-center">
          {form.errors}
        </p>
      )}
    </div>
  );
}

function DeleteItemForm({ item }: { item: any }) {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  const [form, fields] = useForm({
    id: `delete-form-${item.id}`,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateCartItemQuantitySchema });
    },
    defaultValue: {
      itemId: item.id,
      quantity: 0,
    },
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <input {...getInputProps(fields.itemId, { type: "hidden" })} />
      <input {...getInputProps(fields.quantity, { type: "hidden" })} />

      <Button
        type="submit"
        variant="destructive"
        size="icon"
        // disabled={isSubmitting}
        className="w-10 h-10 p-0 hover:scale-110 transition-transform duration-300 shadow-md"
      >
        <Trash2Icon className="h-5 w-5" />
      </Button>

      {/* Display errors if any */}
      {form.errors && (
        <div id={form.errorId} className="text-xs text-destructive mt-1">
          {form.errors}
        </div>
      )}
    </Form>
  );
}
