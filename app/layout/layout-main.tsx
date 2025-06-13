import { Form, Link, Outlet } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { ThemeToggle } from "~/components/ui/toggle";
import { useState } from "react";
import type { Route } from "./+types/layout-main";
import { getSession } from "~/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("userId");
  if (!isAuthenticated) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Extract search query from URL

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  return { q, isAuthenticated };
}

export default function MainLayoutRoute({ loaderData }: Route.ComponentProps) {
  const { q, isAuthenticated } = loaderData;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-background text-foreground border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main nav bar */}
          <div className="py-3 flex items-center gap-2 sm:gap-4 md:justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <span
                className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-primary hover:text-accent"
                style={{ fontFamily: "Dancing Script" }}
              >
                Clacie
              </span>
            </Link>

            {/* Search form - mobile: flex-1, desktop: centered */}
            <Form
              action="/search"
              method="get"
              className="flex gap-1 sm:gap-2 flex-1 max-w-xs sm:max-w-md md:max-w-lg md:mx-auto"
            >
              <Input
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search cookies..."
                className="rounded-full bg-white/90 backdrop-blur-md placeholder:text-muted-foreground text-xs sm:text-sm px-3 sm:px-5 py-2 shadow-inner focus:ring-2 focus:ring-primary transition"
              />
              <Button
                type="submit"
                variant="secondary"
                className="rounded-full px-2 sm:px-3"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden lg:inline text-sm ml-1">Search</span>
              </Button>
            </Form>

            {/* Desktop navigation - hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <ThemeToggle />
              <div className="flex items-center gap-4 text-sm font-medium">
                <Link to="/" className="hover:text-accent whitespace-nowrap">
                  Home
                </Link>
                <Link
                  to="/products"
                  className="hover:text-accent whitespace-nowrap"
                >
                  Products
                </Link>
                {isAuthenticated && (
                  <div className="flex gap-4">
                    <Button asChild variant="secondary" size="sm">
                      <Link to="/cart">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Cart</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="px-2 sm:px-3"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button and cart */}
            <div className="flex md:hidden items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="px-2 sm:px-3"
                  >
                    <Link to="/cart">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="px-2 sm:px-3"
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 sm:p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu - collapsible */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border py-3 space-y-3">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="hover:text-accent text-sm font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="hover:text-accent text-sm font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <div className="pt-2 border-t border-border">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-auto">
        <Outlet />
      </main>

      <footer className="bg-card text-card-foreground border-t border-border">
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
