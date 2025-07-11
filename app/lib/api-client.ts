import createClient from "openapi-fetch";
import type { paths } from "@/schema";

export const apiClient = createClient<paths>({
  baseUrl: process.env.BACKEND_API_URL || "http://localhost:3000",
});
