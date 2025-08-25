import { href, redirect } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApiClient } from "@/lib/api-client";
import type { Route } from "./+types/orders-id";

export function meta({ data }: Route.MetaArgs) {
  const order = data?.order;
  return [
    {
      title: order
        ? `Pesanan ${order.orderNumber} - By Clacie`
        : "Pesanan - By Clacie",
    },
    {
      name: "description",
      content: order
        ? `Detail pesanan ${order.orderNumber}`
        : "Detail pesanan By Clacie",
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;

  const api = createApiClient(request);
  const { data: order } = await api.GET("/orders/{id}", {
    params: { path: { id } },
  });

  if (!order) {
    return redirect(href("/cart"));
  }

  return {
    isAuthenticated: true,
    order,
  };
}

export default function OrdersIdRoute({ loaderData }: Route.ComponentProps) {
  const { order } = loaderData;
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    orderNumber,
    status,
    createdAt,
  } = order;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Order #{orderNumber} <Badge>{status}</Badge>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {new Date(createdAt).toLocaleString()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div>
                <div>{shippingAddress.recipientName}</div>
                <div>{shippingAddress.street}</div>
                <div>
                  {shippingAddress?.city}, {shippingAddress?.province}{" "}
                  {shippingAddress?.postalCode}
                </div>
                <div>{shippingAddress.phoneNumber}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <div>
                <div>{paymentMethod.name}</div>
                <div>{paymentMethod.description}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2">Product</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2">{item.product.name}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {item.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="text-right py-2">
                    {(item.price * item.quantity).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
