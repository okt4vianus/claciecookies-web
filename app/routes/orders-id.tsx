import { DebugCode } from "@/components/common/debug-code";
import { createApiClient } from "@/lib/api-client";
import type { Route } from "./+types/orders-id";

export function meta({ data }: Route.MetaArgs) {
  const order = data?.order;
  return [
    {
      title: order
        ? `Pesanan ${order.orderNumber} - Clacie Cookies`
        : "Pesanan - Clacie Cookies",
    },
    {
      name: "description",
      content: order
        ? `Detail pesanan ${order.orderNumber}`
        : "Detail pesanan Clacie Cookies",
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;

  const api = createApiClient(request);
  const { data: order, error } = await api.GET("/orders/{id}", {
    params: { path: { id } },
  });

  if (error) throw new Response(`Order by id ${id} not found`, { status: 404 });

  return {
    isAuthenticated: true,
    order,
  };
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
