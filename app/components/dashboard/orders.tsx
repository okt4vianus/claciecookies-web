import { Package } from "lucide-react";
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
    <div className="space-y-6">
      <div className="border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-semibold text-foreground mb-6">
          My Orders
        </h3>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              No Orders Yet
            </h4>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="max-w-lvh space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-2xl p-6"
              >
                {/* Order Header */}
                {/* <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      • {order.shop}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="mb-2">{getStatusBadge(order.status)}</div>
                    <p className="text-xl font-bold text-foreground">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div> */}

                {/* Product List */}
                <div className="space-y-3">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-background/50 rounded-xl border border-border"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover border border-border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rp {product.price.toLocaleString("id-ID")} x{" "}
                          {product.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          Rp{" "}
                          {(product.price * product.quantity).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
