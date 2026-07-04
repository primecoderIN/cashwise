import { UserButton } from "@clerk/clerk-react";
import { Bell } from "lucide-react";

/**
 * AppHeader — slim top bar with notifications and user avatar.
 * Per-page actions (date picker, Add Expense) live inside each page component
 * to match the design where the header area is contextual to each screen.
 */
export default function AppHeader() {
  return (
    <header className="h-16 w-full border-b border-border bg-white flex items-center justify-end px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
      </div>
    </header>
  );
}
