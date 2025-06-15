import { Heart, Package, Settings, User } from "lucide-react";
import { useState } from "react";
import { Orders } from "~/components/dashboard/orders";
import Overview from "~/components/dashboard/overview";
import { Profile } from "~/components/dashboard/profile";
import { Wishlist } from "~/components/dashboard/wishlist";
import type { Route } from "./+types/dashboard";
import { getSession } from "~/sessions.server";
import { apiClient } from "~/lib/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Clacie Cookies" },
    {
      name: "description",
      content:
        "Your personal dashboard to manage orders, wishlist, and profile at Clacie Cookies.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("userId");

  const token = session.get("token");

  if (!token) return { isAuthenticated: false, user: null };

  const { data: user } = await apiClient.GET("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data: cart } = await apiClient.GET("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { isAuthenticated, user, cart };
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { isAuthenticated, user, cart } = loaderData;
  const userInfo = {
    name: user?.fullName,
    email: user?.email,
    phone: "+62 812 3456 7890",
    joinDate: user?.createdAt,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: true,
    totalOrders: cart?.items.length,
    totalSpent: cart?.totalPrice,
  };

  const orders = cart?.items.map((item) => ({
    id: item.id,
    date: item.updatedAt ?? item.createdAt ?? "",
    shop: "Clacie Shop",
    status: "delivered",
    total: item.subTotalPrice,
    products: [
      {
        name: item.product.name,
        image:
          item.product.images?.[0]?.url ?? "https://via.placeholder.com/100",
        quantity: item.quantity,
        price: item.product.price,
      },
    ],
  }));

  const wishlistItems = [
    {
      name: "Matcha Soft Cookies",
      image: "https://ucarecdn.com/ba783126-112d-4ed2-ac77-97cfdfce22da/",
      price: 20000,
      originalPrice: 20000,
    },
    {
      name: "Red Velvet With Melting Chocolate",
      image: "https://ucarecdn.com/ea02b0d5-44d9-4f51-aea6-1ca31bc3e6fe/",
      price: 22000,
      originalPrice: 22000,
    },
    {
      name: "Double Coconut Cookies",
      image: "https://ucarecdn.com/66d8a272-1c03-4bc7-84f8-82a7636b4538/",
      price: 18000,
      originalPrice: 18000,
    },
    {
      name: "Brownies",
      image: "https://ucarecdn.com/06ce6ab2-f08d-43a2-9852-497a148b678a/",
      price: 22000,
      originalPrice: 22000,
    },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  type StatusKey = "delivered" | "shipped" | "processing" | "cancelled";
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      StatusKey,
      { bg: string; text: string; label: string }
    > = {
      delivered: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Delivered",
      },
      shipped: { bg: "bg-blue-100", text: "text-blue-700", label: "Shipped" },
      processing: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Processing",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    };
    const config = statusConfig[status as StatusKey] || statusConfig.processing;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            userInfo={userInfo}
            orders={orders ?? []}
            wishlistItems={wishlistItems}
            getStatusBadge={getStatusBadge}
            setActiveTab={setActiveTab}
          />
        );
      case "orders":
        return <Orders orders={orders ?? []} getStatusBadge={getStatusBadge} />;
      case "wishlist":
        return <Wishlist wishlistItems={wishlistItems} />;
      case "profile":
        return <Profile userInfo={userInfo} />;
      default:
        return null;
    }
  };

  return (
    <section
      className="relative min-h-[40vh] sm:min-h-[50vh] w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-10 py-12 sm:py-16"
      style={{ backgroundImage: 'url("/home-cover.jpg")' }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-1/4 border-r border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={userInfo.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{userInfo.name}</p>
                <p className="text-sm text-gray-500">Edit Profile</p>
              </div>
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                  activeTab === item.id
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
      </div>
    </section>
  );
}
