import {
  Bell,
  CreditCard,
  Download,
  Eye,
  Heart,
  Package,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";

const ClacieUserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userInfo = {
    name: "John Doe",
    email: "john.doe@email.com",
    memberSince: "March 2023",
    totalOrders: 24,
    totalSpent: 1847.5,
  };

  const recentOrders = [
    {
      id: "#ORD-001",
      date: "2025-06-08",
      status: "delivered",
      total: 89.99,
      items: 3,
      product: "Chocolate Chip Cookies (24 pack)",
      image:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100&h=100&fit=crop",
    },
    {
      id: "#ORD-002",
      date: "2025-06-05",
      status: "shipped",
      total: 129.5,
      items: 2,
      product: "Premium Cookie Gift Box",
      image:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop",
    },
    {
      id: "#ORD-003",
      date: "2025-06-02",
      status: "processing",
      total: 45.0,
      items: 1,
      product: "Oatmeal Raisin Cookies (12 pack)",
      image:
        "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=100&h=100&fit=crop",
    },
  ];

  const wishlistItems = [
    {
      name: "Double Chocolate Brownies",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop",
      inStock: true,
    },
    {
      name: "Artisan Cookie Collection",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=100&h=100&fit=crop",
      inStock: false,
    },
    {
      name: "Sugar Cookie Decorating Kit",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=100&h=100&fit=crop",
      inStock: true,
    },
  ];

  const stats = [
    {
      label: "Total Orders",
      value: userInfo.totalOrders,
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
    {
      label: "Total Spent",
      value: `$${userInfo.totalSpent}`,
      icon: CreditCard,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    {
      label: "Wishlist Items",
      value: wishlistItems.length,
      icon: Heart,
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      textColor: "text-pink-800",
    },
    {
      label: "Reward Points",
      value: "1,240",
      icon: Star,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome back, {userInfo.name}!
        </h2>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} border border-border rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.iconColor}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className={`${stat.textColor} text-lg font-semibold`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Orders
          </h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-primary hover:text-accent text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentOrders.slice(0, 3).map((order, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow"
            >
              <img
                src={order.image}
                alt={order.product}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-medium">{order.id}</p>
                    <p className="text-muted-foreground text-sm">
                      {order.product}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-semibold">
                      ${order.total}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Order History
      </h3>
      <div className="space-y-4">
        {recentOrders.map((order, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-4">
                <img
                  src={order.image}
                  alt={order.product}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-foreground font-medium">{order.id}</p>
                  <p className="text-foreground">{order.product}</p>
                  <p className="text-muted-foreground text-sm">
                    {order.items} item{order.items > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-foreground font-bold text-lg">
                  ${order.total}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Ordered on {order.date}
              </p>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                  <Eye size={14} />
                  <span className="text-sm">View</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Download size={14} />
                  <span className="text-sm">Invoice</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        My Wishlist
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h4 className="text-foreground font-medium mb-2">{item.name}</h4>
            <p className="text-foreground text-lg font-bold mb-3">
              ${item.price}
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <button
                disabled={!item.inStock}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.inStock
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-muted-foreground text-sm mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={userInfo.name}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label className="block text-muted-foreground text-sm mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={userInfo.email}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label className="block text-muted-foreground text-sm mb-2 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label className="block text-muted-foreground text-sm mb-2 font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              defaultValue="1990-05-15"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>
        <button className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Update Profile
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Shipping Address
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-muted-foreground text-sm mb-2 font-medium">
              Street Address
            </label>
            <input
              type="text"
              defaultValue="123 Main Street, Apt 4B"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-muted-foreground text-sm mb-2 font-medium">
                City
              </label>
              <input
                type="text"
                defaultValue="Manado"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="block text-muted-foreground text-sm mb-2 font-medium">
                Province
              </label>
              <input
                type="text"
                defaultValue="North Sulawesi"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="block text-muted-foreground text-sm mb-2 font-medium">
                Postal Code
              </label>
              <input
                type="text"
                defaultValue="95111"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>
        </div>
        <button className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Update Address
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - matching main layout */}

      <main className="flex-auto bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                My Account
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your orders, profile, and preferences
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors rounded-lg">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <tab.icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {activeTab === "overview" && renderOverview()}
              {activeTab === "orders" && renderOrders()}
              {activeTab === "wishlist" && renderWishlist()}
              {activeTab === "profile" && renderProfile()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClacieUserDashboard;
