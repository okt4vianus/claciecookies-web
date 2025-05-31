import { Form, Link, Outlet } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";

export default function MainLayoutRoute() {
  return (
    <div>
      <nav className="bg-background text-foreground border-b border-border shadow-sm">
        <div className="font-[Sunday] max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-primary hover:text-accent"
          >
            Clacie
          </Link>

          <Form
            // action="/search"
            method="get"
            className="relative w-full max-w-md"
          >
            <Input
              name="q"
              type="search"
              placeholder="Search cookies..."
              className="rounded-full bg-white/90 backdrop-blur-md placeholder:text-muted-foreground text-sm px-5 py-2 pr-10 shadow-inner focus:ring-2 focus:ring-primary transition"
            />
            <Button
              type="submit"
              size="icon"
              variant="secondary"
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              <Search className="w-4 h-4" />
            </Button>
          </Form>

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
      <div>
        <Outlet />
      </div>
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
