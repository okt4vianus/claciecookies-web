import type { Route } from "./+types/cart";

export function meta() {
  return [{ title: "User Dashboard - Clacie Cookies" }];
}

export async function loader() {
  return {
    user: {},
    cart: {},
  };
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>User Dashboard</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
