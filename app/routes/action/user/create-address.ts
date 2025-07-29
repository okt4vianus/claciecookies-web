import { parseWithZod } from "@conform-to/zod";
import { href, redirect } from "react-router";
import { createApiClient } from "@/lib/api-client";
import { CreateAddressSchema } from "@/modules/user/schema";
import type { Route } from "./+types/create-address";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CreateAddressSchema });
  if (submission.status !== "success") return submission.reply();

  const api = createApiClient(request);
  const { data } = await api.POST("/address", {
    body: submission.value,
  });

  console.log({ data });

  // return submission.reply();

  // atau redirect
  return redirect(href("/checkout"));

  // return data;
};
