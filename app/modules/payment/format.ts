export function formatPaymentMethod(method: string) {
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
