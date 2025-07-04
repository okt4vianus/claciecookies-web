import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CreditCardIcon, MapPinIcon, TruckIcon, UserIcon, ShoppingCartIcon } from "lucide-react";
import { href, Link, redirect, useFetcher, useNavigation } from "react-router";
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
import { CheckoutSchema, CheckoutAddressSchema } from "~/modules/checkout/schema";
import { UserProfileSchema } from "~/modules/user/schema";
import { useState } from "react";

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
  if (!token) return redirect(href("/login"));

  const [profileResponse, cartResponse, addressResponse, shippingMethodsResponse] = await Promise.all([
    // TODO: Later
    // GET /checkout combines user, profile, cart, address
    apiClient.GET("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiClient.GET("/cart", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiClient.GET("/address", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiClient.GET("/shipping-methods"),
  ]);

  if (cartResponse.error || !cartResponse.data || cartResponse.data.items.length === 0) {
    return redirect(href("/cart"));
  }

  if (profileResponse.error || !profileResponse.data) {
    return redirect(href("/login"));
  }

  console.log("addressResponse.data:", addressResponse.data);

  // if (addressResponse.error || !addressResponse.data) {
  //   return redirect(href("/dashboard"));
  // }
  if (shippingMethodsResponse.error || !shippingMethodsResponse.data) {
    return redirect(href("/"));
  }

  return {
    cart: cartResponse.data,
    profile: profileResponse.data,
    address: addressResponse.data,
    shippingMethods: shippingMethodsResponse.data,
  };
}

// TODO: Later
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CheckoutSchema });
  if (submission.status !== "success") return submission.reply();

  try {
    // TODO: Change endpoint
    // POST /checkout combines user, profile, cart, address
    // @ts-ignore
    const { data: order, error } = await apiClient.POST("/checkout", {
      body: submission.value,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      return submission.reply({
        formErrors: ["Failed to create order. Please try again."],
      });
    }

    // @ts-ignore
    return redirect(href(`/orders/${order.id}`));
  } catch {
    return submission.reply({
      formErrors: ["An error occurred. Please try again."],
    });
  }
}

export default function CheckoutRoute({ loaderData, actionData }: Route.ComponentProps) {
  const { cart, profile, address, shippingMethods } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const fetcherUserProfile = useFetcher();
  const fetcherUserAddress = useFetcher();
  // const fetcherShippingMethod = useFetcher();

  const isUserProfileSubmitting = fetcherUserProfile.state === "submitting";
  const isUserAddressSubmitting = fetcherUserAddress.state === "submitting";
  // const isShippingMethodSubmitting = fetcherShippingMethod.state === "submitting";

  // State for shipping method
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    "regular" // default value
  );

  const [formUser, fieldsUser] = useForm({
    defaultValue: profile,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserProfileSchema });
    },
  });

  const [formAddress, fieldsAddress] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CheckoutAddressSchema });
    },
    defaultValue: address
      ? {
          ...address,
        }
      : {},
  });

  const [formCheckout, fieldsCheckout] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CheckoutSchema });
    },
    defaultValue: {
      paymentMethod: "bank_transfer",
      shippingMethod: "regular",
      notes: "",
    },
  });

  // TODO: Later to just do this in the backend API
  const shippingCost = shippingMethods.find((method) => method.value === selectedShippingMethod)?.price || 15000;
  const totalWithShipping = cart.totalPrice + shippingCost;

  // console.log("PROFILE DATA:", profile);
  // console.log("ADDRESS DATA:", address);
  // console.log("SHIPPING OPTIONS:", selectedShippingMethod, shippingCost);
  // console.log("PAYMENT OPTIONS:", PAYMENT_OPTIONS);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">Complete your information to finish your purchase</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <CheckoutCardSection icon={UserIcon} title="Customer Information">
            <fetcherUserProfile.Form
              method="post"
              action="/action/user/profile"
              className="space-y-4"
              {...getFormProps(formUser)}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsUser.fullName.id}>Full Name *</Label>
                  <Input
                    {...getInputProps(fieldsUser.fullName, {
                      type: "text",
                    })}
                    placeholder="Enter your full name"
                  />
                  {fieldsUser.fullName.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsUser.fullName.errors}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={fieldsUser.email.id}>Email *</Label>
                  <Input
                    {...getInputProps(fieldsUser.email, {
                      type: "email",
                    })}
                    placeholder="email@example.com"
                  />
                  {fieldsUser.email.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsUser.email.errors}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor={fieldsUser.phoneNumber.id}>Phone Number *</Label>
                  <Input
                    {...getInputProps(fieldsUser.phoneNumber, {
                      type: "tel",
                    })}
                    placeholder="08xxxxxxxxxx"
                  />
                  {fieldsUser.phoneNumber.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsUser.phoneNumber.errors}</p>
                  )}
                </div>
              </div>
              <Button type="submit" size="sm" disabled={isUserProfileSubmitting}>
                {isUserProfileSubmitting && "Saving..."}
                {!isUserProfileSubmitting && "Save"}
              </Button>
            </fetcherUserProfile.Form>
          </CheckoutCardSection>

          {/* Shipping Address */}
          <CheckoutCardSection icon={MapPinIcon} title="Shipping Address">
            <fetcherUserAddress.Form
              method="post"
              action="/action/user/address"
              className="space-y-4"
              {...getFormProps(formAddress)}
            >
              <input {...getInputProps(fieldsAddress.id, { type: "hidden" })} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsAddress.recipientName.id}>Recipient Name *</Label>
                  <Input
                    {...getInputProps(fieldsAddress.recipientName, {
                      type: "text",
                    })}
                    placeholder="Receiver name"
                  />
                  {fieldsAddress.recipientName.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.recipientName.errors}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={fieldsAddress.phone.id}>Phone *</Label>
                  <Input
                    {...getInputProps(fieldsAddress.phone, {
                      type: "tel",
                    })}
                    placeholder="08xxxxxxxxxx"
                  />
                  {fieldsAddress.phone.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.phone.errors}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor={fieldsAddress.street.id}>Complete Address - {fieldsAddress.label.initialValue} *</Label>
                <Textarea
                  {...getInputProps(fieldsAddress.street, { type: "text" })}
                  rows={3}
                  placeholder="Street, house no, unit"
                />
                {fieldsAddress.street.errors && (
                  <p className="text-sm text-destructive mt-1">{fieldsAddress.street.errors}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsAddress.city.id}>City *</Label>
                  <Input {...getInputProps(fieldsAddress.city, { type: "text" })} />
                  {fieldsAddress.city.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.city.errors}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={fieldsAddress.province.id}>Province *</Label>
                  <Input
                    {...getInputProps(fieldsAddress.province, {
                      type: "text",
                    })}
                  />
                  {fieldsAddress.province.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.province.errors}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsAddress.postalCode.id}>Postal Code *</Label>
                  <Input
                    {...getInputProps(fieldsAddress.postalCode, {
                      type: "text",
                    })}
                  />
                  {fieldsAddress.postalCode.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.postalCode.errors}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={fieldsAddress.country.id}>Country</Label>
                  <Input
                    {...getInputProps(fieldsAddress.country, {
                      type: "text",
                    })}
                  />
                  {fieldsAddress.country.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.country.errors}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={fieldsAddress.latitude.id}>Latitude</Label>
                  <Input
                    {...getInputProps(fieldsAddress.latitude, {
                      type: "text",
                    })}
                  />
                  {fieldsAddress.latitude.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.latitude.errors}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={fieldsAddress.longitude.id}>Longitude</Label>
                  <Input
                    {...getInputProps(fieldsAddress.longitude, {
                      type: "text",
                    })}
                  />
                  {fieldsAddress.longitude.errors && (
                    <p className="text-sm text-destructive mt-1">{fieldsAddress.longitude.errors}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <CheckoutCardSection icon={ShoppingCartIcon} title="Additional Notes">
                <Textarea
                  {...getInputProps(fieldsAddress.notes, { type: "text" })}
                  placeholder="Notes for seller (optional)"
                  rows={3}
                />
                {fieldsAddress.notes.errors && (
                  <p className="text-sm text-destructive mt-1">{fieldsAddress.notes.errors}</p>
                )}
              </CheckoutCardSection>

              <Button type="submit" size="sm" disabled={isUserAddressSubmitting}>
                {isUserAddressSubmitting ? "Saving..." : "Save"}
              </Button>
            </fetcherUserAddress.Form>
          </CheckoutCardSection>

          {/* Shipping Method */}
          <CheckoutCardSection icon={TruckIcon} title="Shipping Method">
            <div className="space-y-4">
              <RadioGroup
                value={selectedShippingMethod}
                onValueChange={(value) => {
                  setSelectedShippingMethod(value);
                }}
              >
                {shippingMethods.map((method) => (
                  <RadioOption
                    key={method.value}
                    value={method.value}
                    label={method.name}
                    description={method.description}
                    price={method.price}
                    name={fieldsCheckout.shippingMethod.name}
                  />
                ))}
              </RadioGroup>

              {/* <input
                type="hidden"
                name={fieldsCheckout.shippingMethod.name}
                value={selectedShippingMethod}
              />

              {fieldsCheckout.shippingMethod.errors && (
                <p className="text-sm text-destructive">
                  {fieldsCheckout.shippingMethod.errors}
                </p>
              )} */}
            </div>
          </CheckoutCardSection>

          {/* Payment Method */}
          <CheckoutCardSection icon={CreditCardIcon} title="Payment Method">
            <RadioGroup defaultValue="bank_transfer" name={fieldsCheckout.paymentMethod.name}>
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
              <p className="text-sm text-destructive">{fieldsCheckout.paymentMethod.errors}</p>
            )}
          </CheckoutCardSection>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="space-y-6">
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
                    <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x Rp
                      {item.product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="font-semibold text-sm">Rp {item.subTotalPrice.toLocaleString("id-ID")}</div>
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
                <span className="text-primary">Rp {totalWithShipping.toLocaleString("id-ID")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Processing..." : "Pay Now"}
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full">
              <Link to="/cart">Back to Cart</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>🔒 Your information is secure and encrypted</p>
          </div>
        </aside>
      </div>

      {/* Form Errors */}
      {formCheckout.errors && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">{formCheckout.errors}</p>
        </div>
      )}
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

// TODO: Replaced by /payment-methods
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

function CheckoutCardSection({
  icon: Icon,
  title,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
} & React.ComponentProps<"div">) {
  return (
    <Card className={className}>
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
