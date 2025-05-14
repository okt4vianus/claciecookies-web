import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/main.tsx", [
    index("routes/home.tsx"),
    route("products/:slug", "routes/products-slug.tsx"),
  ]),

  // LATER
  // layout("layouts/admin.tsx", [
  //   index("routes/admin/dashboard.tsx"),
  //   route("admin/products", "routes/admin/products.tsx"),
  // ]),
] satisfies RouteConfig;
