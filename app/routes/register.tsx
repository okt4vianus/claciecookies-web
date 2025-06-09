import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/register";
import { apiClient } from "~/lib/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register - Clacie Cookies" },
    {
      name: "description",
      content: "Create your Clacie Cookies account",
    },
  ];
}

export async function action() {
  const { data: products, error } = await apiClient.POST("/auth/register", {
    body: {
      username: "",
      email: "",
      fullName: "",
      password: "",
    },
  });
  if (error) throw new Response(`Failed to register`, { status: 500 });
  return { products };
}

export default function Register() {
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
            Join Clacie
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90">
            Create your account and start ordering delicious cookies
          </p>
        </div>
      </section>

      <Separator />

      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-md mx-auto w-full">
          <Form method="post" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium block"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="border-gray-300"
                  placeholder="John"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium block">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="border-gray-300"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="border-gray-300"
                placeholder="john.doe@example.com"
              />
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
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 sm:py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base sm:text-sm"
                  placeholder="Create a strong password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-1 sm:space-y-2">
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
                  className="w-full px-3 py-2.5 sm:py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="address" className="text-sm font-medium block">
                Delivery Address
              </Label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base sm:text-sm resize-none"
                placeholder="Enter your full delivery address"
              />
            </div> */}

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 sm:py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm touch-manipulation"
            >
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
