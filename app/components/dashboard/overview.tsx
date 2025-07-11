/** biome-ignore-all lint/suspicious/noExplicitAny: "Temporary" */
import { CreditCard, Package } from "lucide-react";
import type { JSX } from "react";
import { StatCard } from "@/components/dashboard/statcard";

export default function Overview({
  userInfo,
  orders,
  getStatusBadge,
  setActiveTab,
}: {
  userInfo: any;
  orders: any[];
  getStatusBadge: (status: string) => JSX.Element;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<Package className="text-white" />}
          label="Total Orders"
          value={userInfo.totalOrders}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<CreditCard className="text-white" />}
          label="Total Spent"
          value={`Rp ${Number(userInfo.totalSpent).toLocaleString("id-ID")}`}
          color="from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="border border-border rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Recent Orders
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
          >
            View All Orders
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start shopping to see your orders here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center space-x-4 border border-border rounded-xl p-3"
              >
                <img
                  src={order.products[0].image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover border border-border"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.products[0].name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-foreground font-bold mb-2">
                    Rp {order.total.toLocaleString("id-ID")}
                  </p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
