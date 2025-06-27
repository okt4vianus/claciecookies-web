import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
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
  ]),

  route("/action/user/profile", "routes/action/user/profile.ts"),
  route("/action/user/address", "routes/action/user/address.ts"),
  route("/action/user/shipping-method", "routes/action/user/shipping-method.ts"),
  route("/action/user/payment-method", "routes/action/user/payment-method.ts"),
  route("/action/user/notes", "routes/action/user/notes.ts"),

  //   layout("layout/admin.tsx", [
  //     index("routes/admin/dashboard.tsx"),
  //     route("admin/products ", "routes/admin/products.tsx"),
  //   ]),
] satisfies RouteConfig;
