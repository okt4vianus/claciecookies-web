import type { Route } from "./+types/cart";

export function meta() {
  return [
    { title: "Keranjang Belanja - Clacie Cookies" },
    {
      name: "description",
      content: "Lihat dan kelola produk dalam keranjang belanja Anda",
    },
  ];
}

export async function loader() {
  return {
    items: [],
  };
}

export default function CartRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Keranjang Belanja</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
