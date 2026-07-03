"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Wallet, LayoutDashboard, Receipt, Tags, FolderGit2, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Dashboard", href: "/",           icon: LayoutDashboard },
  { name: "Expenses",  href: "/expenses",    icon: Receipt         },
  { name: "Categories",href: "/categories",  icon: Tags            },
  { name: "Groups",    href: "/groups",      icon: FolderGit2      },
];

export default function AppNavbar() {
  const pathname   = usePathname();
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">CashWise</span>
          </Link>

          {/* Desktop nav */}
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navItems.map(({ name, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.41-1.41l.7-.71zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.95-1.05a1 1 0 011.41 0l.71.71a1 1 0 01-1.42 1.42l-.7-.71a1 1 0 010-1.42zm10.6.71a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 011.42-1.41l.7.71zM2 9a1 1 0 110 2H1a1 1 0 110-2h1zm1.78-5.22a1 1 0 011.42 0l.7.71A1 1 0 014.49 5.9l-.71-.7a1 1 0 010-1.42zM10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                )}
              </button>
            )}

            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-md shadow-primary/20">
                  Sign In
                </button>
              </SignInButton>
            )}

            {/* Mobile hamburger */}
            {isSignedIn && (
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden p-2 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && isSignedIn && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm fade-in-fast">
          <div className="flex flex-col gap-1 p-4">
            {navItems.map(({ name, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
