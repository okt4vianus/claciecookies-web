import { parseWithZod } from "@conform-to/zod";
import type { Route } from "./+types/profile";
import { CheckoutUserProfileSchema } from "~/modules/checkout/schema";
import { apiClient } from "~/lib/api-client";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  // TODO: Refactor to have a function which can:
  // get token and submission value at the same time

  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CheckoutUserProfileSchema });
  if (submission.status !== "success") return submission.reply();

  const { data } = await apiClient.PATCH("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
    body: submission.value,
  });

  return data;
}
