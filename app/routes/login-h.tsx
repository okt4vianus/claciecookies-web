import { data, Form, href, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/login-h";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useState } from "react";
import { z } from "zod";
import { AlertError, AlertErrorSimple } from "~/components/common/alert-error";
import { apiClient } from "~/lib/api-client";

import { Eye, EyeOff } from "lucide-react";
import { commitSession, getSession } from "~/sessions.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Clacie Cookies" },
    {
      name: "description",
      content: "Login to your Clacie Cookies account",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect(href("/dashboard"));
  }

  return data(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== "success") return submission.reply();

  const { data: loginResponse, error } = await apiClient.POST("/auth/login", {
    body: submission.value,
  });

  if (error || !loginResponse) {
    const fields = [error.field];
    const target = (error as any).details?.meta?.target?.[0]; // prisma error format

    if (!target) {
      return submission.reply({
        formErrors: [error.message],
        fieldErrors:
          typeof error.field === "string" && fields.includes(error.field)
            ? { [error.field]: [`invalid ${error.field}`] }
            : undefined,
      });
    }

    return submission.reply({
      formErrors: [error.message],
      fieldErrors: fields.includes(target)
        ? { [target]: [`${target} does not exist`] }
        : undefined,
    });
  }

  session.set("userId", loginResponse.user.id);
  session.set("token", loginResponse.token);

  return redirect(href("/dashboard"), {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function LoginRoute({ actionData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);

  const lastResult = actionData;

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });

  return (
    <>
      <section
        className="relative min-h-[40vh] sm:min-h-[50vh] w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-10 py-12 sm:py-16"
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
                className="border-gray-300"
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
                  type={showPassword ? "text" : "password"}
                  required
                  className="border-gray-300 pr-10"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {fields.password.errors && (
                <AlertErrorSimple errors={fields.password.errors} />
              )}
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="text-center space-y-3 sm:space-y-2">
              <a
                href="/forgot-password"
                className="block text-sm text-amber-600 hover:text-amber-700 underline"
              >
                Forgot your password?
              </a>
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
