import { LogOut } from "lucide-react";
import { Form, Link, redirect } from "react-router";
import { destroyAppSession, getAppSession } from "@/app-session.server";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  const session = await getAppSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroyAppSession(session),
    },
  });
}

export default function LogoutRoute() {
  return (
    <div className="bg-card border-2 rounded-2xl max-w-md mx-auto mt-24 px-4 text-center space-y-6 p-7">
      <h1 className="text-2xl font-semibold text-foreground">Log out</h1>
      <p className="text-sm text-muted-foreground">
        Are you sure you want to log out from your account?
      </p>

      <Form method="post" className="flex justify-center gap-4">
        <Button variant="destructive" type="submit">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Cancel</Link>
        </Button>
      </Form>
    </div>
  );
}
