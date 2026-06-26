import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, UserPlus, Search, TableProperties, ShieldCheck,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/register', icon: UserPlus, label: 'Register Pensioner' },
  { to: '/search', icon: Search, label: 'Search & Profile' },
  { to: '/bulk-credit', icon: TableProperties, label: 'Bulk Credit Entry' },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">PensionMS</p>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-slate-200">
          <p className="text-xs text-slate-400">v1.0 · Ministry of Finance</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Outlet />
        </div>
      </main>
    </div>
  );
}