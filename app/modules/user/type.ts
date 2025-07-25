import type { components } from "@/schema-auth";

export type User = components["schemas"]["User"];

export type UserComplete = User & {
  totalOrders: number;
  totalSpent: number;
};
