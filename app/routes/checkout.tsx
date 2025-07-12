import { getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CreditCardIcon, TruckIcon } from "lucide-react";
import { useState } from "react";
import { href, Link, redirect, useFetcher, useNavigation } from "react-router";
import OrderSummary from "@/components/checkout/checkoutsidebar";
import CustomerInformation from "@/components/checkout/customerinformation";
import ShippingAddress from "@/components/checkout/shippingaddress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiClient } from "@/lib/api-client";
import { UpdateAddressSchema } from "@/modules/address/schema";
import { CreateNewOrderSchema } from "@/modules/checkout/schema";
import { UserProfileSchema } from "@/modules/user/schema";

import { getSession } from "@/sessions.server";
import type { Route } from "./+types/checkout";

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

  const [
    profileResponse,
    cartResponse,
    addressResponse,
    shippingMethodsResponse,
    paymentMethodsResponse,
  ] = await Promise.all([
    // TODO: Later
    // GET /checkout for auth/profile, cart, address, shipping-methods, payment-methods
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
    apiClient.GET("/payment-methods"),
  ]);

  if (
    cartResponse.error ||
    !cartResponse.data ||
    cartResponse.data.items.length === 0
  ) {
    return redirect(href("/cart"));
  }

  if (profileResponse.error || !profileResponse.data) {
    return redirect(href("/login"));
  }

  if (addressResponse.error || !addressResponse.data) {
    return redirect(href("/user/address"));
  }

  if (shippingMethodsResponse.error || !shippingMethodsResponse.data) {
    return redirect(href("/"));
  }

  if (paymentMethodsResponse.error || !paymentMethodsResponse.data) {
    return redirect(href("/"));
  }

  return {
    cart: cartResponse.data,
    profile: profileResponse.data,
    address: addressResponse.data,
    shippingMethods: shippingMethodsResponse.data,
    paymentMethods: paymentMethodsResponse.data,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CreateNewOrderSchema });
  if (submission.status !== "success") return submission.reply();

  try {
    // TODO: Change endpoint
    // @ts-ignore
    // Post /checkout endpoint combine profile, cart, address, shipping-method, payment-method
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

export default function CheckoutRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { cart, profile, address, shippingMethods, paymentMethods } =
    loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const fetcherUserProfile = useFetcher(); // React Router
  const fetcherUserAddress = useFetcher(); // React Router

  const isUserProfileSubmitting = fetcherUserProfile.state === "submitting";
  const isUserAddressSubmitting = fetcherUserAddress.state === "submitting";

  const [formUser, fieldsUser] = useForm({
    defaultValue: profile,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserProfileSchema });
    },
  });

  const [formAddress, fieldsAddress] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateAddressSchema });
    },
    defaultValue: address
      ? {
          ...address,
        }
      : {},
  });

  const defaultCheckoutValues = {
    paymentMethod: "qris",
    shippingMethod: "regular",
    notes: "",
  };

  const [formCheckout, fieldsCheckout] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateNewOrderSchema });
    },
    defaultValue: defaultCheckoutValues,
  });

  // useState for selected shipping method
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    defaultCheckoutValues.shippingMethod,
  );

  // useState for selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultCheckoutValues.paymentMethod,
  );

  const shippingCost =
    shippingMethods.find((method) => method.slug === selectedShippingMethod)
      ?.price ?? 15000;
  const totalWithShipping = cart.totalPrice + shippingCost;

  console.log("PROFILE DATA:", profile);
  console.log("ADDRESS DATA:", address);
  console.log("SHIPPING METHOD:", selectedShippingMethod, shippingCost);
  console.log("PAYMENT METHOD:", selectedPaymentMethod);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your information to finish your purchase
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Information */}
          <CustomerInformation
            fetcherUserProfile={fetcherUserProfile}
            formUser={formUser}
            fieldsUser={fieldsUser}
            isSubmitting={isUserProfileSubmitting}
          />
          {/* Shipping Address */}
          <ShippingAddress
            fetcherUserAddress={fetcherUserAddress}
            formAddress={formAddress}
            fieldsAddress={fieldsAddress}
            isSubmitting={isUserAddressSubmitting}
          />

          {/* Shipping Method */}
          <CheckoutCardSection icon={TruckIcon} title="Shipping Method">
            <div>
              <RadioGroup
                name={fieldsCheckout.shippingMethod.name}
                defaultValue={selectedShippingMethod}
                onValueChange={setSelectedShippingMethod}
              >
                {shippingMethods.map((method) => (
                  <RadioOption
                    key={method.slug}
                    value={method.slug}
                    label={method.name}
                    description={method.description}
                    price={method.price}
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
            </div>
          </CheckoutCardSection>

          {/* Payment Method */}
          <CheckoutCardSection icon={CreditCardIcon} title="Payment Method">
            <RadioGroup
              name={fieldsCheckout.paymentMethod.name}
              defaultValue={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
            >
              {paymentMethods.map((method) => (
                <RadioOption
                  key={method.slug}
                  value={method.slug}
                  label={method.name}
                  description={method.description}
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
          </CheckoutCardSection>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="space-y-6 sticky top-16 self-start">
          <OrderSummary
            cartItems={cart.items}
            totalPrice={cart.totalPrice}
            shippingCost={shippingCost}
            totalWithShipping={totalWithShipping}
          />

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
        </aside>
      </div>

      {/* Form Errors */}
      {formCheckout.errors && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">
            {formCheckout.errors}
          </p>
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
