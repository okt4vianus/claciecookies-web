import type { Route } from "./+types/shipping-method";

export async function action(_: Route.ActionArgs) {
  return null;

  //   const formData = await request.formData();
  //   const submission = parseWithZod(formData, {
  //     schema: CheckoutSchema.pick({ shippingMethod: true }),
  //   });

  //   if (submission.status !== "success") {
  //     return submission.reply();
  //   }

  // Optional: Save to session/database if needed
  //   return submission.reply();
}
