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
      ? "border-black bg-blue-600 text-white shadow-brutal-sm"
      : "border-transparent text-black hover:border-black dark:text-brutal-dark-text"
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
    <div className="min-h-screen bg-brutal-bg text-black dark:bg-brutal-dark-bg dark:text-brutal-dark-text">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r-2 border-black bg-white p-5 dark:border-brutal-dark-border dark:bg-brutal-dark-surface lg:block">
        <div className="mb-6 border-2 border-black bg-blue-600 p-3 text-center shadow-brutal-sm">
          <p className="text-xl font-extrabold uppercase tracking-tight text-white">
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
            className="border-2 border-black px-3 py-2 text-left text-sm font-bold uppercase tracking-tight shadow-brutal-sm hover:bg-slate-100 dark:border-brutal-dark-border dark:text-brutal-dark-text"
            onClick={toggle}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            className="border-2 border-black px-3 py-2 text-left text-sm font-bold uppercase tracking-tight text-red-600 shadow-brutal-sm hover:bg-red-50 dark:border-brutal-dark-border"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b-2 border-black bg-white/90 px-4 py-3 backdrop-blur dark:border-brutal-dark-border dark:bg-brutal-dark-surface lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-tight">Fintrack</p>
            <p className="text-xs font-bold uppercase text-black/60 dark:text-brutal-dark-muted">
              Finance Tracker
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="border-2 border-black px-2 py-1 text-xs font-bold uppercase shadow-brutal-sm"
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

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t-2 border-black bg-white dark:border-brutal-dark-border dark:bg-brutal-dark-surface lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `border-r-2 border-black py-3 text-center text-xs font-bold uppercase tracking-tight last:border-r-0 dark:border-brutal-dark-border ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-black dark:text-brutal-dark-text"
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
