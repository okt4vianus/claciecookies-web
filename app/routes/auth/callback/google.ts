import { href, redirect } from "react-router";
import { commitAppSession, getAppSession } from "@/app-session.server";
import { createBetterAuthClient } from "@/lib/api-client";
import type { Route } from "./+types/google";

/**
 * After Google sign in success,
 * it will GET /auth/callback/google
 */
export async function loader({ request }: Route.LoaderArgs) {
  const appSession = await getAppSession(request.headers.get("Cookie"));

  const api = createBetterAuthClient(request);
  const { data, error } = await api.GET("/get-session");

  if (!data || !data.user.id || error) {
    return redirect(href("/login"));
  }

  appSession.set("toastMessage", `Welcome back, ${data.user.name}`);

  return redirect(href("/"), {
    headers: { "Set-Cookie": await commitAppSession(appSession) },
  });
}
