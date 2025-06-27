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
import {
  CheckoutSchema,
  CheckoutUserSchema,
  CheckoutAddressSchema,
} from "~/modules/checkout/schema";

export function meta() {
  return [
    { title: "Checkout - Clacie Cookies" },
    {
      name: "description",
      content: "Complete your Clacie Cookies purchase",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    return redirect(href("/login"));
  }

  const [profileResponse, cartResponse, addressesResponse] = await Promise.all([
    apiClient.GET("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiClient.GET("/cart", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiClient.GET("/auth/addresses", {
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
    addresses: addressesResponse.error ? [] : addressesResponse.data,
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
    // TODO: Change endpoint
    const { data: order, error } = await apiClient.POST("/auth/checkout", {
      body: submission.value,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      return submission.reply({
        formErrors: ["Failed to create order. Please try again."],
      });
    }

    // TODO
    return redirect(href(`/orders/${order.id}`));
  } catch {
    return submission.reply({
      formErrors: ["An error occurred. Please try again."],
    });
  }
}

const SHIPPING_OPTIONS = [
  {
    value: "regular",
    label: "Regular (3-5 business days)",
    description: "Standard shipping",
    price: 15000,
  },
  {
    value: "express",
    label: "Express (1-2 business days)",
    description: "Fast shipping",
    price: 25000,
  },
  {
    value: "same_day",
    label: "Same Day (Today)",
    description: "Manado area only",
    price: 50000,
  },
];

const PAYMENT_OPTIONS = [
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "BCA, Mandiri, BNI, BRI",
  },
  {
    value: "e_wallet",
    label: "E-Wallet",
    description: "GoPay, OVO, Dana, ShopeePay",
  },
  {
    value: "cod",
    label: "Cash on Delivery (COD)",
    description: "Pay when order is delivered",
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

export default function CheckoutRoute({ loaderData }: Route.ComponentProps) {
  const { cart, profile, addresses } = loaderData;
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  console.log("PROFILE DATA:", profile);
  console.log("ADDRESSES DATA:", addresses);

  // Get the primary address (first address or marked as primary)
  const primaryAddress =
    addresses.find((addr: any) => addr.isPrimary) || addresses[0];

  const [formUser, fieldsUser] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CheckoutUserSchema });
    },
    defaultValue: {
      fullName: profile?.fullName ?? "",
      email: profile?.email ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
    },
  });

  const [formAddress, fieldsAddress] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CheckoutAddressSchema });
    },
    defaultValue: {
      street: primaryAddress?.street ?? "",
      city: primaryAddress?.city ?? "",
      postalCode: primaryAddress?.postalCode ?? "",
      province: primaryAddress?.province ?? "",
      country: primaryAddress?.country ?? "Indonesia",
    },
  });

  const [formCheckout, fieldsCheckout] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CheckoutSchema });
    },
    defaultValue: {
      paymentMethod: "bank_transfer",
      shippingMethod: "regular",
      notes: "",
    },
  });

  const shippingCost =
    SHIPPING_OPTIONS.find(
      (option) =>
        option.value === (fieldsCheckout.shippingMethod.value || "regular")
    )?.price || 15000;

  const totalWithShipping = cart.totalPrice + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your information to finish your purchase
        </p>
      </div>

      <Form method="post" {...getFormProps(formCheckout)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <FormSection icon={UserIcon} title="Customer Information">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsUser.fullName.id}>Full Name *</Label>
                  <Input
                    {...getInputProps(fieldsUser.fullName, { type: "text" })}
                    placeholder="Enter your full name"
                  />
                  {fieldsUser.fullName.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsUser.fullName.errors}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={fieldsUser.email.id}>Email *</Label>
                  <Input
                    {...getInputProps(fieldsUser.email, { type: "email" })}
                    placeholder="email@example.com"
                  />
                  {fieldsUser.email.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsUser.email.errors}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor={fieldsUser.phoneNumber.id}>
                    Phone Number *
                  </Label>
                  <Input
                    {...getInputProps(fieldsUser.phoneNumber, {
                      type: "tel",
                    })}
                    placeholder="08xxxxxxxxxx"
                  />
                  {fieldsUser.phoneNumber.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsUser.phoneNumber.errors}
                    </p>
                  )}
                </div>
              </div>
              {!profile && (
                <div className="flex justify-start pt-2">
                  <Button type="submit" size="sm">
                    Save Customer Info
                  </Button>
                </div>
              )}
            </FormSection>

            {/* Shipping Address */}
            <FormSection icon={MapPinIcon} title="Shipping Address">
              {addresses.length > 1 && (
                <div className="mb-4">
                  <Label>Saved Addresses</Label>
                  <div className="space-y-2 mt-2">
                    {addresses.map((address: any, index: number) => (
                      <div
                        key={address.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                        onClick={() => {
                          // Update form with selected address
                          formAddress.update({
                            name: fieldsAddress.street.name,
                            value: address.street,
                          });
                          formAddress.update({
                            name: fieldsAddress.city.name,
                            value: address.city,
                          });
                          formAddress.update({
                            name: fieldsAddress.postalCode.name,
                            value: address.postalCode,
                          });
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{address.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.street}, {address.city}{" "}
                              {address.postalCode}
                            </p>
                          </div>
                          {address.isPrimary && (
                            <Badge variant="secondary" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              )}

              <div>
                <Label htmlFor={fieldsAddress.street.id}>Full Address *</Label>
                <Textarea
                  {...getInputProps(fieldsAddress.street, { type: "text" })}
                  placeholder="Enter your complete address"
                  rows={3}
                />
                {fieldsAddress.street.errors && (
                  <p className="text-sm text-destructive mt-1">
                    {fieldsAddress.street.errors}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsAddress.city.id}>City *</Label>
                  <Input
                    {...getInputProps(fieldsAddress.city, { type: "text" })}
                    placeholder="City name"
                  />
                  {fieldsAddress.city.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsAddress.city.errors}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={fieldsAddress.postalCode.id}>
                    Postal Code *
                  </Label>
                  <Input
                    {...getInputProps(fieldsAddress.postalCode, {
                      type: "text",
                    })}
                    placeholder="12345"
                  />
                  {fieldsAddress.postalCode.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsAddress.postalCode.errors}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsAddress.province.id}>Province</Label>
                  <Input
                    {...getInputProps(fieldsAddress.province, { type: "text" })}
                    placeholder="Province"
                  />
                  {fieldsAddress.province.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsAddress.province.errors}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={fieldsAddress.country.id}>Country</Label>
                  <Input
                    {...getInputProps(fieldsAddress.country, { type: "text" })}
                    placeholder="Country"
                  />
                  {fieldsAddress.country.errors && (
                    <p className="text-sm text-destructive mt-1">
                      {fieldsAddress.country.errors}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Shipping Method */}
            <FormSection icon={TruckIcon} title="Shipping Method">
              <RadioGroup
                defaultValue="regular"
                name={fieldsCheckout.shippingMethod.name}
              >
                {SHIPPING_OPTIONS.map((option) => (
                  <RadioOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    price={option.price}
                    name={fieldsCheckout.shippingMethod.name}
                  />
                ))}
              </RadioGroup>
              <input
                {...getInputProps(fieldsCheckout.shippingMethod, {
                  type: "hidden",
                })}
              />
              {fieldsCheckout.shippingMethod.errors && (
                <p className="text-sm text-destructive">
                  {fieldsCheckout.shippingMethod.errors}
                </p>
              )}
            </FormSection>

            {/* Payment Method */}
            <FormSection icon={CreditCardIcon} title="Payment Method">
              <RadioGroup
                defaultValue="bank_transfer"
                name={fieldsCheckout.paymentMethod.name}
              >
                {PAYMENT_OPTIONS.map((option) => (
                  <RadioOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    name={fieldsCheckout.paymentMethod.name}
                  />
                ))}
              </RadioGroup>
              <input
                {...getInputProps(fieldsCheckout.paymentMethod, {
                  type: "hidden",
                })}
              />
              {fieldsCheckout.paymentMethod.errors && (
                <p className="text-sm text-destructive">
                  {fieldsCheckout.paymentMethod.errors}
                </p>
              )}
            </FormSection>

            {/* Notes */}
            <FormSection icon={ShoppingCartIcon} title="Additional Notes">
              <Textarea
                {...getInputProps(fieldsCheckout.notes, { type: "text" })}
                placeholder="Notes for seller (optional)"
                rows={3}
              />
              {fieldsCheckout.notes.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsCheckout.notes.errors}
                </p>
              )}
            </FormSection>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
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
                        {item.quantity} x Rp
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
                <CardTitle>Payment Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>Rp {cart.totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
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
                {isSubmitting ? "Processing..." : "Pay Now"}
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full">
                <Link to="/cart">Back to Cart</Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Your information is secure and encrypted</p>
            </div>
          </div>
        </div>

        {/* Form Errors */}
        {formCheckout.errors && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              {formCheckout.errors}
            </p>
          </div>
        )}
      </Form>
    </div>
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
