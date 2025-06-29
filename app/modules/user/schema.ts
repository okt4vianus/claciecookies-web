import z from "zod";
import { phoneNumber } from "~/modules/common/schema";

export const UserProfileSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber,
});
