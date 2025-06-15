import { Badge } from "~/components/ui/badge";
import { apiClient } from "~/lib/api-client";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/cart";

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
    return { isAuthenticated: false, cart: null };
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

export default function CartRoute({ loaderData }: Route.ComponentProps) {
  const { cart } = loaderData;

  if (!cart || cart.items.length === 0) {
    return <p className="p-4">Keranjang Anda kosong.</p>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Keranjang Belanja</h1>

      {cart.items.map((item) => (
        <div
          key={item.id}
          className="flex items-center space-x-4 border-b pb-4"
        >
          <img
            src={item.product.images?.[0]?.url ?? "/placeholder.jpg"}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-semibold text-lg">{item.product.name}</p>
            <p className="text-sm text-gray-500">
              Harga per item: Rp {item.product.price.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            <p className="text-sm text-gray-700 font-medium">
              Subtotal: Rp {item.subTotalPrice.toLocaleString("id-ID")}
            </p>
          </div>
          <Badge className="bg-gray-100 text-gray-700">delivered</Badge>
        </div>
      ))}

      <div className="text-right font-bold text-xl">
        Total: Rp {cart.totalPrice.toLocaleString("id-ID")}
      </div>
    </div>
  );
}
