import { parseWithZod } from "@conform-to/zod";
import { href, redirect } from "react-router";
import { apiClient } from "@/lib/api-client";
import { CreateAddressSchema } from "@/modules/user/schema";
import { getSession } from "@/sessions.server";
import type { Route } from "./+types/create-address";

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

  // atau redirect
  return redirect(href("/checkout"));

  // return data;
};
