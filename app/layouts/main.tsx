import { Outlet } from "react-router";

export default function MainLayoutRoute() {
  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-stone-700 text-white p-4">Navbar</nav>

      <div className="p-4 max-w-7xl mx-auto flex-grow">
        <Outlet />
      </div>

      <footer className="bg-stone-900 text-white p-4">
        <p>Copyright</p>
      </footer>
    </div>
  );
}
