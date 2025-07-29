import { redirect } from "react-router";
// import { betterAuthApiClient } from "@/lib/api-client";
import type { Route } from "./+types/google";

export async function loader(_: Route.LoaderArgs) {
  return redirect("/register");
}

export async function action(_: Route.ActionArgs) {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3000";

  try {
    // ✅ Include callbackURL in the POST body
    const response = await fetch(`${backendUrl}/api/auth/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: "http://localhost:5173/products", // ✅ Direct redirect to frontend
      }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log("Better-Auth response:", data);

      if (data?.url) {
        return redirect(data.url);
      }
    }

    const responseText = await response.text();
    console.error("Unexpected response:", responseText);

    return redirect("/register?error=no_redirect_url");
  } catch (error) {
    console.error("Auth error:", error);
    return redirect("/register?error=auth_failed");
  }

  // const { data, error } = await betterAuthApiClient.POST("/sign-in/social", {
  //   body: {
  //     provider: "google",
  //     callbackURL: `${process.env.FRONTEND_WEB_URL}/auth/callback/google`,
  //   },
  // });

  // const hasRedirectUrl = data && "url" in data;

  // if (error) {
  //   console.error(error);
  //   return redirect("/register");
  // }

  // if (hasRedirectUrl) {
  //   return redirect(data.url as string);
  // }

  // return null;
}
