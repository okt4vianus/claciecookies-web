import { CreditCard, Heart, Package, Star } from "lucide-react";
import type { JSX } from "react";
import { StatCard } from "~/components/dashboard/statcard";

// type Users =
//   paths["/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];

export default function Overview({
  userInfo,
  orders,
  wishlistItems,
  getStatusBadge,
  setActiveTab,
}: {
  userInfo: any;
  orders: any[];
  wishlistItems: any[];
  getStatusBadge: (status: string) => JSX.Element;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-500 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <img
            src={userInfo.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold">{userInfo.name}</h2>
            <p className="opacity-90">{userInfo.email}</p>
            <p className="text-sm opacity-75">
              Member since {userInfo.joinDate}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="text-white" />}
          label="Total Orders"
          value={userInfo.totalOrders}
          color="from-orange-400 to-orange-500"
        />
        <StatCard
          icon={<CreditCard className="text-white" />}
          label="Total Spent"
          value={`Rp ${Number(userInfo.totalSpent).toLocaleString("id-ID")}`}
          color="from-emerald-400 to-teal-500"
        />
        <StatCard
          icon={<Heart className="text-white" />}
          label="Wishlist"
          value={wishlistItems.length}
          color="from-pink-400 to-rose-500"
        />
        <StatCard
          icon={<Star className="text-white" />}
          label="Reviews"
          value={12}
          color="from-yellow-400 to-amber-500"
        />
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-sm text-orange-500 font-medium hover:text-orange-600"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border"
            >
              <img
                src={order.products[0].image}
                alt=""
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.products[0].name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-bold">
                  Rp {order.total.toLocaleString("id-ID")}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
