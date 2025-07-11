import { Package, Settings, User } from "lucide-react";
import { useState } from "react";
import { href, redirect } from "react-router";
import { Orders } from "@/components/dashboard/orders";
import Overview from "@/components/dashboard/overview";
import { Profile } from "@/components/dashboard/profile";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/sessions.server";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Clacie Cookies" },
    {
      name: "description",
      content:
        "Your personal dashboard to manage orders and profile at Clacie Cookies.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("userId");
  const token = session.get("token");

  // if (!token) return { isAuthenticated: false, user: null };
  if (!token) {
    return redirect(href("/login"));
  }

  const { data: user, error: userError } = await apiClient.GET("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (userError || !user) {
    return redirect("/login");
  }

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
    name: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    joinDate: user.createdAt,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: true,
    totalOrders: cart?.items.length || 0,
    totalSpent: cart?.totalPrice || 0,
  };

  const orders =
    cart?.items.map((item) => ({
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
    })) || [];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
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
            orders={orders}
            getStatusBadge={getStatusBadge}
            setActiveTab={setActiveTab}
          />
        );
      case "orders":
        return <Orders orders={orders} getStatusBadge={getStatusBadge} />;
      case "profile":
        return <Profile userInfo={userInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 py-8">
        <div className="text-left mb-6">
          <p className="text-muted-foreground">
            Manage your orders and profile
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="border border-border rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={userInfo.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-border"
                />
                <div>
                  <p className="font-medium text-foreground">{userInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {userInfo.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
