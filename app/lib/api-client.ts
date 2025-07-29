import createClient from "openapi-fetch";
import type { paths as appPaths } from "@/schema";
import type { paths as authPaths } from "@/schema-auth";

export const createApiClient = (request?: Request) =>
  createClient<appPaths>({
    baseUrl: process.env.BACKEND_API_URL || "http://localhost:3000",
    credentials: "include",
    headers: request ? { Cookie: request.headers.get("Cookie") || "" } : {},
  });

export const createBetterAuthClient = (request?: Request) =>
  createClient<authPaths>({
    baseUrl:
      `${process.env.BACKEND_API_URL}/api/auth` ||
      "http://localhost:3000/api/auth",
    credentials: "include",
    headers: request ? { Cookie: request.headers.get("Cookie") || "" } : {},
  });
