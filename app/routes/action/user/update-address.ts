import { parseWithZod } from "@conform-to/zod";
import { apiClient } from "@/lib/api-client";
import { UpdateAddressSchema } from "@/modules/address/schema";
import type { Route } from "./+types/update-address";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UpdateAddressSchema });
  if (submission.status !== "success") return submission.reply();

  const { data } = await apiClient.PATCH("/address", {
    body: submission.value,
  });

  console.log({ data });

  // return submission.reply();
  return data;
}
