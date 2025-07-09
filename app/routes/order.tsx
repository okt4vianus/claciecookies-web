import {
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import { href, redirect } from "react-router";
import { apiClient } from "~/lib/api-client";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/order.$orderId";

export function meta({ data }: Route.MetaArgs) {
  const order = data?.order;
  return [
    {
      title: order
        ? `Pesanan ${order.orderNumber} - Clacie Cookies`
        : "Pesanan - Clacie Cookies",
    },
    {
      name: "description",
      content: order
        ? `Detail pesanan ${order.orderNumber}`
        : "Detail pesanan Clacie Cookies",
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  const { orderId } = params;

  if (!token) {
    return redirect(href("/login"));
  }

  const { data: order, error } = await apiClient.GET("/orders/{id}", {
    params: { path: { id: orderId } },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Response("Order not found", { status: 404 });
  }

  return { isAuthenticated: true, order };
}

// Helper function to get status info
function getStatusInfo(status: string) {
  switch (status) {
    case "pending":
      return {
        icon: ClockIcon,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Menunggu Konfirmasi",
        description: "Pesanan sedang menunggu konfirmasi dari penjual",
      };
    case "confirmed":
      return {
        icon: CheckCircleIcon,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Dikonfirmasi",
        description: "Pesanan telah dikonfirmasi dan sedang diproses",
      };
    case "processing":
      return {
        icon: PackageIcon,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Diproses",
        description: "Pesanan sedang disiapkan untuk pengiriman",
      };
    case "shipped":
      return {
        icon: TruckIcon,
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        label: "Dikirim",
        description: "Pesanan sedang dalam perjalanan",
      };
    case "delivered":
      return {
        icon: CheckCircleIcon,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Diterima",
        description: "Pesanan telah berhasil diterima",
      };
    case "cancelled":
      return {
        icon: XCircleIcon,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Dibatalkan",
        description: "Pesanan telah dibatalkan",
      };
    default:
      return {
        icon: ClockIcon,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Unknown",
        description: "Status pesanan tidak dikenal",
      };
  }
}

// Helper function to get payment status info
function getPaymentStatusInfo(status: string) {
  switch (status) {
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Menunggu Pembayaran",
      };
    case "paid":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Lunas",
      };
    case "failed":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Gagal",
      };
    case "cancelled":
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Dibatalkan",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Unknown",
      };
  }
}

// Helper function to format shipping method
function formatShippingMethod(method: string) {
  switch (method) {
    case "regular":
      return "Reguler (3-5 hari kerja)";
    case "express":
      return "Express (1-2 hari kerja)";
    case "same_day":
      return "Same Day (Hari ini)";
    default:
      return method;
  }
}

// Helper function to format payment method
function formatPaymentMethod(method: string) {
  switch (method) {
    case "bank_transfer":
      return "Transfer Bank";
    case "e_wallet":
      return "E-Wallet";
    case "cod":
      return "Bayar di Tempat (COD)";
    default:
      return method;
  }
}

export default function OrderDetailRoute({ loaderData }: Route.ComponentProps) {
  const { order } = loaderData;
  const statusInfo = getStatusInfo(order.status);
  const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
  const StatusIcon = statusInfo.icon;

  return;
}
