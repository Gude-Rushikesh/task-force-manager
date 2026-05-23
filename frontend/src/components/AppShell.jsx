import { BarChart3, ClipboardList, LogOut, Plus, ShieldCheck, Users } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/tasks", label: "Command Center", icon: BarChart3 },
  { to: "/create", label: "New Task", icon: ClipboardList, manageOnly: true },
  { to: "/add-employee", label: "New Employee", icon: Users, manageOnly: true },
];

export default function AppShell() {
  const { user, logout, canManage } = useAuth();

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-6">
            <Link to="/tasks" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded bg-slate-950 text-white">
                <ShieldCheck size={21} />
              </span>
              <span>
                <span className="block text-base font-bold">TaskForce Pro</span>
                <span className="block text-xs text-slate-500">Operations OS</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {navItems
              .filter((item) => !item.manageOnly || canManage)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-slate-950 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workforce task management
              </p>
              <h1 className="text-xl font-bold text-slate-950">TaskForce Pro</h1>
            </div>
            {canManage && (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={16} />
                Task
              </Link>
            )}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
