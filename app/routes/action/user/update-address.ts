import { parseWithZod } from "@conform-to/zod";
import { apiClient } from "@/lib/api-client";
import { CheckoutAddressSchema } from "@/modules/checkout/schema";
import { getSession } from "@/sessions.server";
import type { Route } from "./+types/update-address";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CheckoutAddressSchema });
  if (submission.status !== "success") return submission.reply();

  const { data } = await apiClient.PATCH("/address", {
    headers: { Authorization: `Bearer ${token}` },
    body: submission.value,
  });

  console.log({ data });

  // return submission.reply();
  return data;
}
