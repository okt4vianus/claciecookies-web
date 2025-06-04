import { Form, Link, Outlet } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "~/components/ui/toggle";
import type { Route } from "./+types/layout-main";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  return { q: q };
}

export default function MainLayoutRoute({ loaderData }: Route.ComponentProps) {
  const { q } = loaderData;

  return (
    <div className="flex flex-col min-h-screen ">
      <nav className="bg-background text-foreground border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/clacie.png" alt="Clacie Logo" className="h-8 w-auto" />
            <span
              className="text-2xl font-semibold tracking-tight text-primary hover:text-accent"
              style={{ fontFamily: "Dancing Script" }}
            >
              Clacie
            </span>
          </Link>
          <Form
            action="/search"
            method="get"
            className="flex gap-2 w-full max-w-md"
          >
            <Input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search cookies..."
              className="rounded-full bg-white/90 backdrop-blur-md placeholder:text-muted-foreground text-sm px-5 py-2 shadow-inner focus:ring-2 focus:ring-primary transition"
            />

            <Button type="submit" variant="secondary" className="rounded-full">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </Button>
          </Form>

          <ThemeToggle />
          <div className="space-x-6 text-sm font-medium font-[Sunday]">
            <Link to="/" className="hover:text-accent ">
              Home
            </Link>
            <Link to="/products" className="hover:text-accent ">
              Products
            </Link>
            {/* <Link to="/about" className="hover:text-accent ">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-accent ">
              Contact
            </Link> */}
          </div>
        </div>
      </nav>
      <main className="flex-auto">
        <Outlet />
      </main>
      <footer className="bg-card text-card-foreground border-t border-border font-[Sunday]">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm leading-relaxed">
          <p className="mb-1">Soft-baked with premium ingredients.</p>
          <p className="mb-1">
            Lovingly crafted in Minahasa Utara, delivered with care to your door
            🍪
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Clacie. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
