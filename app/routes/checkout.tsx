import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CreditCardIcon, MapPinIcon, TruckIcon, UserIcon } from "lucide-react";
import {
  Form,
  href,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { apiClient } from "~/lib/api-client";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/checkout";
import { CheckoutSchema } from "~/modules/checkout/schema";

export function meta() {
  return [
    { title: "Checkout - Clacie Cookies" },
    {
      name: "description",
      content: "Selesaikan pembelian produk Clacie Cookies",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return redirect(href("/login"));
  }

  // Get cart data
  const { data: cart, error: cartError } = await apiClient.GET("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (cartError || !cart || cart.items.length === 0) {
    return redirect(href("/cart"));
  }

  // Get user profile for pre-filling form
  const { data: profile, error: profileError } = await apiClient.GET(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    isAuthenticated: true,
    cart,
    profile: profileError ? null : profile,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: CheckoutSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const checkoutData = submission.value;

  try {
    const { data: order, error } = await apiClient.POST("/auth/checkout", {
      body: checkoutData,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      return submission.reply({
        formErrors: ["Gagal membuat pesanan. Silakan coba lagi."],
      });
    }

    // Redirect to order confirmation page
    return redirect(href(`/orders/${order.id}`));
  } catch (error) {
    return submission.reply({
      formErrors: ["Terjadi kesalahan. Silakan coba lagi."],
    });
  }
}

export default function CheckoutRoute({ loaderData }: Route.ComponentProps) {
  const { cart, profile } = loaderData;
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CheckoutSchema });
    },
    defaultValue: {
      // Pre-fill with profile data if available
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || "",
      postalCode: profile?.postalCode || "",
      paymentMethod: "bank_transfer",
      shippingMethod: "regular",
      notes: "",
    },
  });

  // Calculate shipping cost based on method
  const getShippingCost = (method: string) => {
    switch (method) {
      case "express":
        return 25000;
      case "same_day":
        return 50000;
      default:
        return 15000;
    }
  };

  const shippingCost = getShippingCost(
    fields.shippingMethod.value || "regular"
  );
  const totalWithShipping = cart.totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-2 sm:p-6 py-2.5">
        <div className="text-left py-3">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Lengkapi informasi untuk menyelesaikan pembelian
          </p>
        </div>

        <Form method="post" {...getFormProps(form)}>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
            {/* Left: Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="rounded-2xl border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <UserIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Informasi Pembeli</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={fields.fullName.id}>Nama Lengkap *</Label>
                    <Input
                      {...getInputProps(fields.fullName, { type: "text" })}
                      placeholder="Masukkan nama lengkap"
                      className="mt-1"
                    />
                    {fields.fullName.errors && (
                      <p className="text-sm text-destructive mt-1">
                        {fields.fullName.errors}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={fields.email.id}>Email *</Label>
                    <Input
                      {...getInputProps(fields.email, { type: "email" })}
                      placeholder="email@example.com"
                      className="mt-1"
                    />
                    {fields.email.errors && (
                      <p className="text-sm text-destructive mt-1">
                        {fields.email.errors}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={fields.phone.id}>Nomor Telepon *</Label>
                    <Input
                      {...getInputProps(fields.phone, { type: "tel" })}
                      placeholder="08xxxxxxxxxx"
                      className="mt-1"
                    />
                    {fields.phone.errors && (
                      <p className="text-sm text-destructive mt-1">
                        {fields.phone.errors}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Alamat Pengiriman</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={fields.address.id}>Alamat Lengkap *</Label>
                    <Textarea
                      {...getInputProps(fields.address, { type: "text" })}
                      placeholder="Masukkan alamat lengkap"
                      className="mt-1"
                      rows={3}
                    />
                    {fields.address.errors && (
                      <p className="text-sm text-destructive mt-1">
                        {fields.address.errors}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={fields.city.id}>Kota *</Label>
                      <Input
                        {...getInputProps(fields.city, { type: "text" })}
                        placeholder="Nama kota"
                        className="mt-1"
                      />
                      {fields.city.errors && (
                        <p className="text-sm text-destructive mt-1">
                          {fields.city.errors}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={fields.postalCode.id}>Kode Pos *</Label>
                      <Input
                        {...getInputProps(fields.postalCode, { type: "text" })}
                        placeholder="12345"
                        className="mt-1"
                      />
                      {fields.postalCode.errors && (
                        <p className="text-sm text-destructive mt-1">
                          {fields.postalCode.errors}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="rounded-2xl border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TruckIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Metode Pengiriman</h2>
                </div>

                <RadioGroup
                  value={fields.shippingMethod.value}
                  onValueChange={(value) => {
                    const input = document.querySelector(
                      `input[name="${fields.shippingMethod.name}"]`
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = value;
                      input.dispatchEvent(
                        new Event("change", { bubbles: true })
                      );
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Reguler (3-5 hari kerja)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pengiriman standar
                          </p>
                        </div>
                        <p className="font-semibold">Rp 15.000</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Express (1-2 hari kerja)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pengiriman cepat
                          </p>
                        </div>
                        <p className="font-semibold">Rp 25.000</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="same_day" id="same_day" />
                    <Label htmlFor="same_day" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Same Day (Hari ini)</p>
                          <p className="text-sm text-muted-foreground">
                            Khusus area Jakarta
                          </p>
                        </div>
                        <p className="font-semibold">Rp 50.000</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <input
                  {...getInputProps(fields.shippingMethod, { type: "hidden" })}
                />
                {fields.shippingMethod.errors && (
                  <p className="text-sm text-destructive mt-2">
                    {fields.shippingMethod.errors}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCardIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Metode Pembayaran</h2>
                </div>

                <RadioGroup
                  value={fields.paymentMethod.value}
                  onValueChange={(value) => {
                    const input = document.querySelector(
                      `input[name="${fields.paymentMethod.name}"]`
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = value;
                      input.dispatchEvent(
                        new Event("change", { bubbles: true })
                      );
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label
                      htmlFor="bank_transfer"
                      className="flex-1 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">
                          BCA, Mandiri, BNI, BRI
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="e_wallet" id="e_wallet" />
                    <Label htmlFor="e_wallet" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">E-Wallet</p>
                        <p className="text-sm text-muted-foreground">
                          GoPay, OVO, Dana, ShopeePay
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Bayar di Tempat (COD)</p>
                        <p className="text-sm text-muted-foreground">
                          Bayar saat barang diterima
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <input
                  {...getInputProps(fields.paymentMethod, { type: "hidden" })}
                />
                {fields.paymentMethod.errors && (
                  <p className="text-sm text-destructive mt-2">
                    {fields.paymentMethod.errors}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Catatan Tambahan</h2>
                <Textarea
                  {...getInputProps(fields.notes, { type: "text" })}
                  placeholder="Catatan untuk penjual (opsional)"
                  rows={3}
                />
                {fields.notes.errors && (
                  <p className="text-sm text-destructive mt-1">
                    {fields.notes.errors}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12">
                        <img
                          src={
                            item.product.images?.[0]?.url ?? "/placeholder.jpg"
                          }
                          alt={item.product.name}
                          className="rounded-lg object-cover w-12 h-12"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x Rp{" "}
                          {item.product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        Rp {item.subTotalPrice.toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Total Pembayaran</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>Rp {cart.totalPrice.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      Rp {totalWithShipping.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full"
                >
                  <Link to="/cart">Kembali ke Keranjang</Link>
                </Button>
              </div>

              {/* Security Note */}
              <div className="text-center text-sm text-muted-foreground">
                <p>🔒 Informasi Anda aman dan terenkripsi</p>
              </div>
            </div>
          </div>

          {/* Form Errors */}
          {form.errors && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                {form.errors}
              </p>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
