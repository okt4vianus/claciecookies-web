import { Form, href, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/register";
import { apiClient } from "~/lib/api-client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { AlertError, AlertErrorSimple } from "~/components/common/alert-error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register - Clacie Cookies" },
    {
      name: "description",
      content: "Create your Clacie Cookies account",
    },
  ];
}

const registerSchema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: registerSchema });
  if (submission.status !== "success") return submission.reply();

  const { data: user, error } = await apiClient.POST("/auth/register", {
    body: submission.value,
  });

  if (error || !user) {
    // Prisma error, not Zod
    const fields = ["username", "email"];
    const target = (error as any).details?.meta?.target?.[0];
    return submission.reply({
      formErrors: [error.message],
      fieldErrors: fields.includes(target)
        ? { [target]: [`${target} already exist`] }
        : undefined,
    });
  }

  return redirect(href("/login"));
}

export default function Register({ actionData }: Route.ComponentProps) {
  const lastResult = actionData;

  const [form, fields] = useForm({
    // shouldValidate: "onBlur",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
  });

  return (
    <>
      <section
        className="relative min-h-[20vh] sm:min-h-[25vh] w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-10 py-12 sm:py-16"
        style={{ backgroundImage: 'url("/home-cover.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-lg mx-auto px-4">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: "Dancing Script" }}
          >
            Register New Account
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90">
            Join Clacie with your new account, and start ordering delicious
            cookies
          </p>
        </div>
      </section>

      <Separator />

      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-md mx-auto w-full">
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            className="space-y-4 sm:space-y-6"
          >
            {form.errors && <AlertError errors={form.errors} />}

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium block">
                Full Name
              </Label>
              <Input
                id="fullName"
                name={fields.fullName.name}
                type="text"
                required
                className="border-gray-300"
                placeholder="John Doe"
              />
              {fields.fullName.errors && (
                <AlertErrorSimple errors={fields.fullName.errors} />
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="username" className="text-sm font-medium block">
                Username
              </Label>
              <Input
                id="username"
                name={fields.username.name}
                type="text"
                required
                className="border-gray-300"
                placeholder="johndoe"
              />
              {fields.username.errors && (
                <AlertErrorSimple errors={fields.username.errors} />
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </Label>
              <Input
                id="email"
                name={fields.email.name}
                type="email"
                required
                className="border-gray-300"
                placeholder="john.doe@example.com"
              />
              {fields.email.errors && (
                <AlertErrorSimple errors={fields.email.errors} />
              )}
            </div>

            {/* <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium block">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                className="border-gray-300"
                placeholder="+62 812 3456 7890"
              />
            </div> */}

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm font-medium block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name={fields.password.name}
                  type="password"
                  required
                  minLength={6}
                  className="border-gray-300"
                  placeholder="Create a strong password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
              {fields.password.errors && (
                <AlertErrorSimple errors={fields.password.errors} />
              )}
            </div>

            {/* <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium block"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="border-gray-300"
                  placeholder="Confirm your password"
                />
              </div>
            </div> */}

            {/* <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="address" className="text-sm font-medium block">
                Delivery Address
              </Label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="border-gray-300"
                placeholder="Enter your full delivery address"
              />
            </div> */}

            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-amber-600 hover:text-amber-700 font-medium underline"
                >
                  Login here
                </a>
              </p>
            </div>
          </Form>

          <Separator className="my-6 sm:my-8" />

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3 sm:mb-4">
              Or follow us for updates
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.instagram.com/clacie.cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors touch-manipulation py-2 px-3 rounded-md"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="Instagram"
                  className="w-5 h-5"
                />
                <span className="text-sm">Follow us on Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
