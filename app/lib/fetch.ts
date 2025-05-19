import { createFetch } from "@better-fetch/fetch";

export const $fetch = createFetch({
  baseURL: process.env.BACKEND_API_URL,
  retry: {
    type: "linear",
    attempts: 2,
    delay: 100, //
  },
});
