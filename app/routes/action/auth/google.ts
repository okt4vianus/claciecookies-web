import { redirect } from "react-router";
import { createBetterAuthClient } from "@/lib/api-client";
import type { Route } from "./+types/google";

export async function loader(_: Route.LoaderArgs) {
  return redirect("/register");
}

export async function action({ request }: Route.ActionArgs) {
  const api = createBetterAuthClient(request);
  const { data, error } = await api.POST("/sign-in/social", {
    body: {
      provider: "google",
      callbackURL: `${process.env.FRONTEND_WEB_URL}/auth/callback/google`,
    },
  });

  const hasRedirectUrl = data && "url" in data;

  if (error) {
    console.error(error);
    return redirect("/register");
  }

  if (hasRedirectUrl) {
    return redirect(data.url as string);
  }

  return null;
}
