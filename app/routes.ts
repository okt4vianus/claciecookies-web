import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/main.tsx", [
    index("routes/home.tsx"),
    route("products/:slug", "routes/products-slug.tsx"),
  ]),

  //   layout("layout/admin.tsx", [
  //     index("routes/admin/dashboard.tsx"),
  //     route("admin/products ", "routes/admin/products.tsx"),
  //   ]),
] satisfies RouteConfig;
