import { href, redirect } from "react-router";
import { commitAppSession, getAppSession } from "@/app-session.server";
import { betterAuthApiClient } from "@/lib/api-client";
import type { Route } from "./+types/google";

/**
 * After Google sign in success,
 * it will GET /auth/callback/google
 */
export async function loader({ request }: Route.LoaderArgs) {
  console.log("Google sign in successful");

  const session = await getAppSession(request.headers.get("Cookie"));

  const { data, error } = await betterAuthApiClient.GET("/get-session");

  console.log({ data });

  if (!data || !data.user.id || error) {
    return redirect(href("/login"));
  }

  session.set("userId", data.user.id);
  session.set("user", data.user);
  session.set("toastMessage", `Welcome back, ${data.user.name}`);

  return redirect(href("/"), {
    headers: { "Set-Cookie": await commitAppSession(session) },
  });
}
