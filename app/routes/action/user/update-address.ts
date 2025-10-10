import { parseWithZod } from "@conform-to/zod";
import { createApiClient } from "@/lib/api-client";
import { UpdateShippingAddressSchema } from "@/modules/address/schema";
import type { Route } from "./+types/update-address";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UpdateShippingAddressSchema,
  });
  if (submission.status !== "success") return submission.reply();

  const api = createApiClient(request);
  const { data, error } = await api.PATCH("/address", {
    body: submission.value,
  });
  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
