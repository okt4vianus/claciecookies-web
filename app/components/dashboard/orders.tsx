import type { JSX } from "react";

export function Orders({
  orders,
  getStatusBadge,
}: {
  orders: {
    id: string;
    date: string;
    shop: string;
    status: string;
    total: number;
    products: {
      name: string;
      image: string;
      quantity: number;
      price: number;
    }[];
  }[];
  getStatusBadge: (status: string) => JSX.Element;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">My Orders</h3>
      {orders.map((order) => (
        <div
          key={order.id}
          className="p-4 border rounded-lg space-y-4 bg-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Order #{order.id}
              </p>
              <p className="text-xs text-gray-500">
                {order.date} • {order.shop}
              </p>
            </div>
            <div className="text-right">
              {getStatusBadge(order.status)}
              <p className="font-bold text-gray-900">
                Rp {order.total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Product list */}
          <div className="space-y-2">
            {order.products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-gray-500">
                      Rp {product.price.toLocaleString("id-ID")} x{" "}
                      {product.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
