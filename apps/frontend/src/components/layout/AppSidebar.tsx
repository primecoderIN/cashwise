import { Link, useLocation } from "react-router-dom";
import { Wallet, LayoutDashboard, Receipt, Tags, FolderGit2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const navItems = [
  { name: "Dashboard", href: "/",           icon: LayoutDashboard },
  { name: "Groups",    href: "/groups",      icon: FolderGit2      },
  { name: "Categories",href: "/categories",  icon: Tags            },
  { name: "Expenses",  href: "/expenses",    icon: Receipt         },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card min-h-screen">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">CashWise</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={name}
              to={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                active 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
