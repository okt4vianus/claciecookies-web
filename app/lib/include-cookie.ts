export function includeCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const sessionToken =
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("better-auth.session_token="))
      ?.split("=")[1] || "";

  return {
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  };
}
