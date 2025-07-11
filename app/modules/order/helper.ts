import {
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";

export function getStatusInfo(status: string) {
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

export function getPaymentStatusInfo(status: string) {
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
