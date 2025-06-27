import { parseWithZod } from "@conform-to/zod";
import type { Route } from "./+types/profile";
import { CheckoutUserProfileSchema } from "~/modules/checkout/schema";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CheckoutUserProfileSchema });
  if (submission.status !== "success") return submission.reply();

  console.log(submission.value);

  return submission.reply();
}
