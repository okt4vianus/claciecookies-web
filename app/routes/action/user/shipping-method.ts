import { parseWithZod } from "@conform-to/zod";
import { getSession } from "~/sessions.server";
import { CheckoutSchema } from "~/modules/checkout/schema";
import { apiClient } from "~/lib/api-client";
import type { Route } from "./+types/shipping-method";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  //   if (!token) return { status: 401, message: "Unauthorized" };

  //   const formData = await request.formData();
  //   const submission = parseWithZod(formData, {
  //     schema: CheckoutSchema.pick({ shippingMethod: true }),
  //   });

  //   if (submission.status !== "success") {
  //     return submission.reply();
  //   }

  console.log();

  //   // Optional: Save to session/database if needed
  //   return submission.reply();
}
