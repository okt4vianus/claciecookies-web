import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { data, Form, href, redirect } from "react-router";
import { z } from "zod";
import { commitAppSession, getAppSession } from "@/app-session.server";
import { FormGoogle } from "@/components/auth/form-google";
import { AlertError, AlertErrorSimple } from "@/components/common/alert-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { createBetterAuthClient } from "@/lib/api-client";
import type { Route } from "./+types/login";

export function meta() {
  return [
    { title: "Login - Clacie Cookies" },
    {
      name: "description",
      content: "Login to your Clacie Cookies account",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getAppSession(request.headers.get("Cookie"));
  const toastMessage = session.get("toastMessage");
  session.unset("toastMessage");

  return data(
    { error: session.get("error"), toastMessage },
    { headers: { "Set-Cookie": await commitAppSession(session) } },
  );
}

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function action({ request }: Route.ActionArgs) {
  const session = await getAppSession(request.headers.get("Cookie"));

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: loginSchema });
  if (submission.status !== "success") return submission.reply();

  const api = createBetterAuthClient(request);
  const { data, error, response } = await api.POST("/sign-in/email", {
    body: submission.value,
  });

  if (!data || error || !response.ok) {
    return submission.reply({
      formErrors: ["Failed to login. Invalid email or password"],
    });
  }

  session.set("toastMessage", `Welcome back, ${data.user.name}`);

  const appCookie = await commitAppSession(session);
  const authCookie = response.headers.get("Set-Cookie") || "";

  const headers = new Headers();
  headers.append("Set-Cookie", appCookie);
  headers.append("Set-Cookie", authCookie);

  return redirect(href("/"), { headers });
}

export default function LoginRoute({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);

  const lastResult = actionData;
  const { toastMessage } = loaderData;

  useToast(toastMessage);

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });

  return (
    <div className="min-h-screen flex relative">
      {/* Hero Image Section - Left Side */}
      <section
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center px-6 py-12"
        style={{ backgroundImage: 'url("/home-cover.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/40 lg:w-1/2"></div>
        {/* Removed text content from left side */}
      </section>

      {/* Form Section - Right Side */}
      <section className="w-full bg-background lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Desktop Title - Show only on desktop */}
          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4 text-gray-400 font-brand">
              Welcome Back
            </h1>
            <p className="text-lg xl:text-xl text-gray-400">
              Login to your Clacie account
            </p>
          </div>

          {/* Mobile Hero - Show only on mobile/tablet */}
          <div className="lg:hidden w-full mb-8">
            <div
              className="relative min-h-[30vh] w-full bg-cover bg-center flex items-center justify-center px-4 py-8 rounded-lg"
              style={{ backgroundImage: 'url("/home-cover.jpg")' }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
              <div className="relative z-10 text-center text-white">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 font-brand">
                  Welcome Back
                </h1>
                <p className="text-base sm:text-lg opacity-90">
                  Login to your Clacie account
                </p>
              </div>
            </div>
          </div>
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
              <LogIn />
              <span>Login</span>
            </Button>

            {/* Continue with Google - Right below Login button */}
            <FormGoogle />

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
    </div>
  );
}
