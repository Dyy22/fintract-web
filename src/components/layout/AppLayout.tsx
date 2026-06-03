import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/reports', label: 'Reports' },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;
}

export function AppLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="mb-8">
          <p className="text-xl font-bold text-slate-950">Fintrack</p>
          <p className="text-sm text-slate-500">Private finance tracker</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="absolute bottom-5 left-5 right-5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Fintrack</p>
            <p className="text-xs text-slate-500">Personal finance</p>
          </div>
          <button className="text-sm font-medium text-slate-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="pb-20 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `py-3 text-center text-xs font-medium ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
