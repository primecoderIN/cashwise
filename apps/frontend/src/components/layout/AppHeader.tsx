import { useTheme } from "next-themes";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  if (!isSignedIn) return null;

  return (
    <header className="h-16 w-full border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input 
            type="search" 
            placeholder="Search transactions, categories..." 
            className="pl-9 bg-surface border-none shadow-none focus-visible:ring-1 bg-muted/50 w-full rounded-full h-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.41-1.41l.7-.71zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.95-1.05a1 1 0 011.41 0l.71.71a1 1 0 01-1.42 1.42l-.7-.71a1 1 0 010-1.42zm10.6.71a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 011.42-1.41l.7.71zM2 9a1 1 0 110 2H1a1 1 0 110-2h1zm1.78-5.22a1 1 0 011.42 0l.7.71A1 1 0 014.49 5.9l-.71-.7a1 1 0 010-1.42zM10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            )}
          </button>
        )}

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>

        {/* User */}
        <div className="pl-2 border-l border-border flex items-center">
          <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-border" } }} />
        </div>
      </div>
    </header>
  );
}
