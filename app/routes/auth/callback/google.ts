import { redirect } from "react-router";
import { getSession } from "@/sessions.server";
import type { Route } from "./+types/google";

/**
 * After Google sign in success,
 * it will GET /auth/callback/google
 */
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const cookieHeader = request.headers.get("Cookie");
  const token = extractTokenFromCookie(cookieHeader);

  console.log({ request, cookieHeader, token });

  if (token) {
    console.log({ token });

    session.set("token", token);
    //   session.set("userId", data.user.id);
    // session.set("toastMessage", `Welcome back, ${data.user.name}`);

    return redirect("/");
  }

  return null;
}

function extractTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = new Map();
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies.set(name, decodeURIComponent(value));
    }
  });

  return cookies.get("better-auth.session_token") || null;
}
