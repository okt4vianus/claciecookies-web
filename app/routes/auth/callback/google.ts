import { redirect } from "react-router";
import type { Route } from "./+types/google";

/**
 * After Google sign in success,
 * it will GET /auth/callback/google
 */
export async function loader(_: Route.LoaderArgs) {
  console.log("Google sign in successful");

  return redirect("/");
}
