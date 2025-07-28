import { redirect } from "react-router";
import { betterAuthApiClient } from "@/lib/api-client";
import type { Route } from "./+types/google";

export async function loader(_: Route.LoaderArgs) {
  return redirect("/register");
}

export async function action(_: Route.ActionArgs) {
  const { data, error } = await betterAuthApiClient.POST("/sign-in/social", {
    body: { provider: "google" },
  });

  const hasRedirectUrl = data && "url" in data;

  if (error) {
    console.error(error);

    return null;
  }

  if (hasRedirectUrl) {
    return redirect(data.url as string);
  }

  return null;
}
