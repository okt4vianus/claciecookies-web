import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Form, href, redirect } from "react-router";
import { z } from "zod";
import { commitAppSession, getAppSession } from "@/app-session.server";
import { FormGoogle } from "@/components/auth/form-google";
import { AlertError, AlertErrorSimple } from "@/components/common/alert-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createBetterAuthClient } from "@/lib/api-client";
import type { Route } from "./+types/register";

export function meta() {
  return [
    { title: "Register - Clacie Cookies" },
    {
      name: "description",
      content: "Create your Clacie Cookies account",
    },
  ];
}

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  name: z.string().min(3, "Full name cannot be empty"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function action({ request }: Route.ActionArgs) {
  const session = await getAppSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: registerSchema });
  if (submission.status !== "success") return submission.reply();

  const api = createBetterAuthClient(request);
  const { data: registerResponse, error } = await api.POST("/sign-up/email", {
    body: submission.value,
  });

  if (error || !registerResponse) {
    const hasErrorCode = error && "code" in error;
    const isUsernameTaken =
      hasErrorCode &&
      error.code === "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER";
    const isEmailExist = hasErrorCode && error.code === "USER_ALREADY_EXISTS";

    if (isUsernameTaken) {
      return submission.reply({
        fieldErrors: {
          username: [`Username ${submission.value.username} already taken`],
        },
      });
    }

    if (isEmailExist) {
      return submission.reply({
        fieldErrors: {
          email: [`Email ${submission.value.email} already exists`],
        },
      });
    }

    return submission.reply({
      formErrors: ["Failed to register"],
    });
  }

  session.set(
    "toastMessage",
    `Account created successfully! Welcome, ${submission.value.name}.`,
  );

  // return redirect(href("/login"));

  return redirect(href("/login"), {
    headers: { "Set-Cookie": await commitAppSession(session) },
  });
}

export default function RegisterRoute({ actionData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);

  const lastResult = actionData;

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 font-brand">
            Register New Account
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90">
            Join Clacie with your new account and start ordering delicious
            cookies
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-md mx-auto w-full space-y-10">
          <FormGoogle />

          <Separator />

          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            className="space-y-4 sm:space-y-6"
          >
            {form.errors && <AlertError errors={form.errors} />}
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm font-medium block">
                Full Name
              </Label>
              <Input
                id="name"
                name={fields.name.name}
                type="text"
                required
                className="border-gray-300"
                placeholder="Create your display name"
              />
              {fields.name.errors && (
                <AlertErrorSimple errors={fields.name.errors} />
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="username" className="text-sm font-medium block">
                User Name
              </Label>
              <Input
                id="username"
                name={fields.username.name}
                type="text"
                required
                className="border-gray-300"
                placeholder="Choose a unique username"
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
                placeholder="Enter your email address"
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
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="border-gray-300"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {fields.password.errors && (
                  <AlertErrorSimple errors={fields.password.errors} />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
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
