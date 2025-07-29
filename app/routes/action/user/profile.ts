import { parseWithZod } from "@conform-to/zod";
import { apiClient } from "@/lib/api-client";
import { UserProfileSchema } from "@/modules/user/schema";
import type { Route } from "./+types/profile";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UserProfileSchema });
  if (submission.status !== "success") return submission.reply();

  const { data } = await apiClient.PATCH("/auth/profile", {
    body: submission.value,
  });

  console.log({ data });

  return data;
}
