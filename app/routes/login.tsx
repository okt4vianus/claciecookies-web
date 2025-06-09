import { Form, href, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/login";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { AlertError, AlertErrorSimple } from "~/components/common/alert-error";
import { apiClient } from "~/lib/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Clacie Cookies" },
    {
      name: "description",
      content: "Login to your Clacie Cookies account",
    },
  ];
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });
  if (submission.status !== "success") return submission.reply();

  const { data: user, error } = await apiClient.POST("/auth/login", {
    body: submission.value,
  });

  if (error || !user) {
    const errorField = error.field as any;
    const fields = ["email", "password"];
    const target = (error as any).details?.meta?.target?.[0]; // Prisma error, not Zod

    if (!target) {
      return submission.reply({
        formErrors: [error.message],
        fieldErrors: { [errorField]: [error.message] },
      });
    }

    return submission.reply({
      formErrors: [error.message],
      fieldErrors: fields.includes(target)
        ? { [target]: [error.message] }
        : undefined,
    });
  }

  // TODO: Prepare /dashboard
  return redirect(href("/"));
}

export default function LoginRoute({ actionData }: Route.ComponentProps) {
  const lastResult = actionData;

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
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
            Welcome Back
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90">
            Login to your Clacie account
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
              <Label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </Label>
              <Input
                id="email"
                name={fields.email.name}
                type="email"
                required
                className="border-gray-300 "
                placeholder="Enter your email"
              />
              {fields.email.errors && (
                <AlertErrorSimple errors={fields.email.errors} />
              )}
            </div>

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
                  className="border-gray-300 "
                  placeholder="Enter your password"
                />
                {/* <button type="button">Show/Hide</button> */}
              </div>
              {fields.password.errors && (
                <AlertErrorSimple errors={fields.password.errors} />
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 sm:py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm touch-manipulation"
            >
              Login
            </Button>

            <div className="text-center space-y-3 sm:space-y-2">
              {/* <a
                href="/forgot-password"
                className="block text-sm text-amber-600 hover:text-amber-700 underline"
              >
                Forgot your password?
              </a> */}
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-amber-600 hover:text-amber-700 font-medium underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </Form>

          <Separator className="my-6 sm:my-8" />

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3 sm:mb-4">
              Or continue with
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
