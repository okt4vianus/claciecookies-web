import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  /**
   * Routes with JSX/TSX
   */

  layout("layout/layout-main.tsx", [
    index("routes/home.tsx"),
    route("products", "routes/products.tsx"),
    route("products/:slug", "routes/products-slug.tsx"),
    route("search", "routes/search.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("register", "routes/register.tsx"),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("user/address", "routes/user/address.tsx"),
    route("orders/:id", "routes/orders-id.tsx"),
  ]),

  // route("/order", "routes/order.tsx"),

  //   layout("layout/admin.tsx", [
  //     index("routes/admin/dashboard.tsx"),
  //     route("admin/products ", "routes/admin/products.tsx"),
  //   ]),

  /**
   * Actions
   */

  // User Data
  route("/action/user/profile", "routes/action/user/profile.ts"),

  // Address
  route("/action/user/create-address", "routes/action/user/create-address.ts"),
  route("/action/user/update-address", "routes/action/user/update-address.ts"),

  // Checkout
  route(
    "/action/user/shipping-method",
    "routes/action/user/shipping-method.ts",
  ),
  route("/action/user/payment-method", "routes/action/user/payment-method.ts"),
] satisfies RouteConfig;
