import createClient from "openapi-fetch";
import type { paths as honoPaths } from "@/schema";
import type { paths as authPaths } from "@/schema-auth";

export const apiClient = createClient<honoPaths>({
  baseUrl: process.env.BACKEND_API_URL || "http://localhost:3000",
});

export const betterAuthApiClient = createClient<authPaths>({
  baseUrl:
    `${process.env.BACKEND_API_URL}/api/auth` ||
    "http://localhost:3000/api/auth",
});
