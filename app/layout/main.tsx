import { Link, Outlet } from "react-router";

export default function MainLayoutRoute() {
  return (
    <div>
      <nav className="bg-background text-foreground border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-primary hover:text-accent"
          >
            Clacie Cookies
          </Link>
          <div className="space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <Link to="/products" className="hover:text-accent">
              Products
            </Link>
            <Link to="/about" className="hover:text-accent">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-accent">
              Contact
            </Link>
          </div>
        </div>
      </nav>
      <div>
        <Outlet />
      </div>
      <footer className="bg-card text-card-foreground border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm leading-relaxed">
          <p className="mb-1">Soft-baked with premium ingredients.</p>
          <p className="mb-1">
            Lovingly crafted in Minahasa, delivered with care to your door 🍪
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Clacie Cookies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
