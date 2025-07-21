import { href, redirect } from "react-router";
import { DebugCode } from "@/components/common/debug-code";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/sessions.server";
import type { Route } from "./+types/orders-id";

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
  const { id } = params;
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) return redirect(href("/login"));

  const { data: order, error } = await apiClient.GET("/orders/{id}", {
    params: { path: { id } },
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error) throw new Response(`Order by id ${id} not found`, { status: 404 });

  return { isAuthenticated: true, order };
}

export default function OrderRoute({ loaderData }: Route.ComponentProps) {
  const { order } = loaderData;

  return (
    <div>
      <h1>Order Detail Route</h1>
      <DebugCode>{order}</DebugCode>
    </div>
  );
}
