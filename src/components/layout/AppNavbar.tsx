"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Wallet, LayoutDashboard, Receipt, Tags, FolderGit2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function AppNavbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Categories", href: "/categories", icon: Tags },
    { name: "Groups", href: "/groups", icon: FolderGit2 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">CashWise</span>
          </Link>

          {isSignedIn && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? "bg-surface text-foreground shadow-sm ring-1 ring-border" 
                        : "text-foreground/60 hover:text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-surface-hover transition-colors text-foreground/60 hover:text-foreground"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          )}

          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          ) : (
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-md shadow-primary/20">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
