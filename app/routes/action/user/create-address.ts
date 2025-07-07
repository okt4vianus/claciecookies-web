import { parseWithZod } from "@conform-to/zod";
import type { Route } from "./+types/address";
import { CreateAddressSchema } from "~/modules/user/schema";
import { apiClient } from "~/lib/api-client";
import { getSession } from "~/sessions.server";

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CreateAddressSchema });
  if (submission.status !== "success") return submission.reply();

  const { data } = await apiClient.POST("/address", {
    headers: { Authorization: `Bearer ${token}` },
    body: submission.value,
  });

  console.log({ data });

  // return submission.reply();
  return data;
};
