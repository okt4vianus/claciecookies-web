import { href, redirect } from "react-router";
import { commitAppSession, getAppSession } from "@/app-session.server";
import { betterAuthApiClient } from "@/lib/api-client";
import { includeCookie } from "@/lib/include-cookie";
import type { Route } from "./+types/google";

/**
 * After Google sign in success,
 * it will GET /auth/callback/google
 */
export async function loader({ request }: Route.LoaderArgs) {
  const appSession = await getAppSession(request.headers.get("Cookie"));

  const { data, error } = await betterAuthApiClient.GET(
    "/get-session",
    includeCookie(request),
  );

  if (!data || !data.user.id || error) {
    return redirect(href("/login"));
  }

  console.log({ data });

  appSession.set("userId", data.user.id);
  appSession.set("user", data.user);
  appSession.set("toastMessage", `Welcome back, ${data.user.name}`);

  return redirect(href("/"), {
    headers: { "Set-Cookie": await commitAppSession(appSession) },
  });
}
