import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  CreditCardIcon,
  MapPinIcon,
  TruckIcon,
  UserIcon,
  ShoppingCartIcon,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
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

  const [cartResponse, profileResponse] = await Promise.all([
    apiClient.GET("/cart", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiClient.GET("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (
    cartResponse.error ||
    !cartResponse.data ||
    cartResponse.data.items.length === 0
  ) {
    return redirect(href("/cart"));
  }

  return {
    cart: cartResponse.data,
    profile: profileResponse.error ? null : profileResponse.data,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CheckoutSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const { data: order, error } = await apiClient.POST("/auth/checkout", {
      body: submission.value,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      return submission.reply({
        formErrors: ["Gagal membuat pesanan. Silakan coba lagi."],
      });
    }

    return redirect(href(`/orders/${order.id}`));
  } catch {
    return submission.reply({
      formErrors: ["Terjadi kesalahan. Silakan coba lagi."],
    });
  }
}

const SHIPPING_OPTIONS = [
  {
    value: "regular",
    label: "Reguler (3-5 hari kerja)",
    description: "Pengiriman standar",
    price: 15000,
  },
  {
    value: "express",
    label: "Express (1-2 hari kerja)",
    description: "Pengiriman cepat",
    price: 25000,
  },
  {
    value: "same_day",
    label: "Same Day (Hari ini)",
    description: "Khusus area Manado",
    price: 50000,
  },
];

const PAYMENT_OPTIONS = [
  {
    value: "bank_transfer",
    label: "Transfer Bank",
    description: "BCA, Mandiri, BNI, BRI",
  },
  {
    value: "e_wallet",
    label: "E-Wallet",
    description: "GoPay, OVO, Dana, ShopeePay",
  },
  {
    value: "cod",
    label: "Bayar di Tempat (COD)",
    description: "Bayar saat barang diterima",
  },
];

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function RadioOption({
  value,
  label,
  description,
  price,
  name,
}: {
  value: string;
  label: string;
  description: string;
  price?: number;
  name: string;
}) {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors">
      <RadioGroupItem value={value} id={value} />
      <Label htmlFor={value} className="flex-1 cursor-pointer">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {price && (
            <Badge variant="outline" className="font-semibold">
              Rp {price.toLocaleString("id-ID")}
            </Badge>
          )}
        </div>
      </Label>
    </div>
  );
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

  const shippingCost =
    SHIPPING_OPTIONS.find(
      (option) => option.value === (fields.shippingMethod.value || "regular")
    )?.price || 15000;

  const totalWithShipping = cart.totalPrice + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Lengkapi informasi untuk menyelesaikan pembelian
        </p>
      </div>

      <Form method="post" {...getFormProps(form)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <FormSection icon={UserIcon} title="Informasi Pembeli">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fields.fullName.id}>Nama Lengkap *</Label>
                  <Input
                    {...getInputProps(fields.fullName, { type: "text" })}
                    placeholder="Masukkan nama lengkap"
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
                  />
                  {fields.phone.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fields.phone.errors}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Shipping Address */}
            <FormSection icon={MapPinIcon} title="Alamat Pengiriman">
              <div>
                <Label htmlFor={fields.address.id}>Alamat Lengkap *</Label>
                <Textarea
                  {...getInputProps(fields.address, { type: "text" })}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
                {fields.address.errors && (
                  <p className="text-sm text-destructive mt-1">
                    {fields.address.errors}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fields.city.id}>Kota *</Label>
                  <Input
                    {...getInputProps(fields.city, { type: "text" })}
                    placeholder="Nama kota"
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
                  />
                  {fields.postalCode.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fields.postalCode.errors}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Shipping Method */}
            <FormSection icon={TruckIcon} title="Metode Pengiriman">
              <RadioGroup
                defaultValue="regular"
                name={fields.shippingMethod.name}
              >
                {SHIPPING_OPTIONS.map((option) => (
                  <RadioOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    price={option.price}
                    name={fields.shippingMethod.name}
                  />
                ))}
              </RadioGroup>
              <input
                {...getInputProps(fields.shippingMethod, { type: "hidden" })}
              />
              {fields.shippingMethod.errors && (
                <p className="text-sm text-destructive">
                  {fields.shippingMethod.errors}
                </p>
              )}
            </FormSection>

            {/* Payment Method */}
            <FormSection icon={CreditCardIcon} title="Metode Pembayaran">
              <RadioGroup
                defaultValue="bank_transfer"
                name={fields.paymentMethod.name}
              >
                {PAYMENT_OPTIONS.map((option) => (
                  <RadioOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    name={fields.paymentMethod.name}
                  />
                ))}
              </RadioGroup>
              <input
                {...getInputProps(fields.paymentMethod, { type: "hidden" })}
              />
              {fields.paymentMethod.errors && (
                <p className="text-sm text-destructive">
                  {fields.paymentMethod.errors}
                </p>
              )}
            </FormSection>

            {/* Notes */}
            <FormSection icon={ShoppingCartIcon} title="Catatan Tambahan">
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
            </FormSection>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images?.[0]?.url ?? "/placeholder.jpg"}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x Rp{" "}
                        {item.product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="font-semibold text-sm">
                      Rp {item.subTotalPrice.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Total */}
            <Card>
              <CardHeader>
                <CardTitle>Total Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full">
                <Link to="/cart">Kembali ke Keranjang</Link>
              </Button>
            </div>

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
  );
}
