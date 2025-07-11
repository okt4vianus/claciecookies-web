export function formatShippingMethod(method: string) {
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
