import { href, redirect } from "react-router";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/sessions.server";
import type { Route } from "./+types/order";

// export function meta({ data }: Route.MetaArgs) {
//   const order = data?.order;
//   return [
//     {
//       title: order
//         ? `Pesanan ${order.orderNumber} - Clacie Cookies`
//         : "Pesanan - Clacie Cookies",
//     },
//     {
//       name: "description",
//       content: order
//         ? `Detail pesanan ${order.orderNumber}`
//         : "Detail pesanan Clacie Cookies",
//     },
//   ];
// }

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  const { orderId } = params;

  if (!token) {
    return redirect(href("/login"));
  }

  // @ts-ignore
  const { data: order, error } = await apiClient.GET("/orders/{id}", {
    params: { path: { id: orderId } },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Response("Order not found", { status: 404 });
  }

  return { isAuthenticated: true, order };
}

export default function OrderDetailRoute(_: Route.ComponentProps) {
  return (
    <div>
      <h1>Order Detail Route</h1>
    </div>
  );
}
