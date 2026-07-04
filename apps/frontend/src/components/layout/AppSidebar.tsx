import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderGit2, Tags, Receipt, Settings, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard",  href: "/",           icon: LayoutDashboard },
  { name: "Groups",     href: "/groups",      icon: FolderGit2 },
  { name: "Categories", href: "/categories",  icon: Tags },
  { name: "Expenses",   href: "/expenses",    icon: Receipt },
];

export default function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            CashWise
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={name}
              to={href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                active
                  ? "bg-emerald-50 text-primary shadow-sm ring-1 ring-emerald-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 mt-auto">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" strokeWidth={2} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
