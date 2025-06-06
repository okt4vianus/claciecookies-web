import { apiClient } from "~/lib/api-client";
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
  return {};
}

export default function CartRoute() {
  return <h1>Keranjang Belanja</h1>;
}
