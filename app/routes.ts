import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/layout-main.tsx", [
    index("routes/home.tsx"),
    route("products", "routes/products.tsx"),
    route("products/:slug", "routes/products-slug.tsx"),
  ]),

  //   layout("layout/admin.tsx", [
  //     index("routes/admin/dashboard.tsx"),
  //     route("admin/products ", "routes/admin/products.tsx"),
  //   ]),
] satisfies RouteConfig;
