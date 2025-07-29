import { getAppSession } from "@/app-session.server";
import type { Route } from "./+types/shipping-method";

export async function action({ request }: Route.ActionArgs) {
  const session = await getAppSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) return { status: 401, message: "Unauthorized" };

  return null;

  //   const formData = await request.formData();
  //   const submission = parseWithZod(formData, {
  //     schema: CheckoutSchema.pick({ shippingMethod: true }),
  //   });

  //   if (submission.status !== "success") {
  //     return submission.reply();
  //   }

  // Optional: Save to session/database if needed
  //   return submission.reply();
}
