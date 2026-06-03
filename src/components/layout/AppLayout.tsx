import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/transactions", label: "Transactions" },
  { to: "/reports", label: "Reports" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `border-2 px-3 py-2 text-sm font-bold uppercase tracking-tight transition-all ${
    isActive
      ? "border-border bg-blue-600 text-main-foreground shadow-shadow-sm"
      : "border-transparent text-foreground hover:border-border"
  }`;
}

export function AppLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r-2 border-border bg-secondary-background p-5 lg:block">
        <div className="mb-6 border-2 border-border bg-blue-600 p-3 text-center shadow-shadow-sm">
          <p className="text-xl font-extrabold uppercase tracking-tight text-main-foreground">
            Fintrack
          </p>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-200">
            Finance Tracker
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2">
          <button
            className="border-2 border-border px-3 py-2 text-left text-sm font-bold uppercase tracking-tight text-foreground shadow-shadow-sm hover:bg-blue-100"
            onClick={toggle}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            className="border-2 border-border px-3 py-2 text-left text-sm font-bold uppercase tracking-tight text-red-600 shadow-shadow-sm hover:bg-red-50"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b-2 border-border bg-secondary-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-tight">Fintrack</p>
            <p className="text-xs font-bold uppercase text-foreground/60">
              Finance Tracker
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="border-2 border-border px-2 py-1 text-xs font-bold uppercase shadow-shadow-sm"
              onClick={toggle}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              className="text-xs font-bold uppercase text-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="pb-20 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t-2 border-border bg-secondary-background lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `border-r-2 border-border py-3 text-center text-xs font-bold uppercase tracking-tight last:border-r-0 ${
                isActive
                  ? "bg-blue-600 text-main-foreground"
                  : "text-foreground"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
