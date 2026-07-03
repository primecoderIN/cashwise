import { SignInButton } from "@clerk/clerk-react";
import { Wallet, PieChart, FolderGit2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/20 border-r border-border p-12 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary mb-16">
            <Wallet className="w-8 h-8" />
            <span className="font-bold text-2xl tracking-tight text-foreground">CashWise</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
            Track. Understand.<br />
            <span className="text-primary">Save Smarter.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mb-12 leading-relaxed">
            Track your expenses, organize by categories and groups, and build better financial habits every day.
          </p>

          <div className="space-y-8 max-w-md">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Track Expenses</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Add and track expenses in seconds with clear insights.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                <FolderGit2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Organize Easily</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Create your own groups and categories that make sense to you.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Secure & Private</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Your data is encrypted and always protected.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} CashWise. All rights reserved.
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-primary">
          <Wallet className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight text-foreground">CashWise</span>
        </div>

        <Card className="w-full max-w-md p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl shadow-primary/5 border-border/50 bg-card/50 backdrop-blur-xl">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Welcome to CashWise</h2>
          <p className="text-muted-foreground mb-8">Sign in to continue to your account</p>

          <SignInButton mode="modal">
            <Button className="w-full h-12 text-base font-semibold rounded-xl shadow-md gap-3 bg-white text-slate-900 hover:bg-slate-50 border border-slate-200" variant="outline">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.07H2.13V16.92C3.95 20.53 7.67 23 12 23Z" fill="#34A853"/>
                <path d="M5.82 14.07C5.6 13.41 5.47 12.72 5.47 12C5.47 11.28 5.6 10.59 5.82 9.93V7.08H2.13C1.38 8.57 0.95 10.23 0.95 12C0.95 13.77 1.38 15.43 2.13 16.92L5.82 14.07Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.67 1 3.95 3.47 2.13 7.08L5.82 9.93C6.7 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          </SignInButton>

          <div className="flex items-center gap-2 mt-8 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            Secure, private and encrypted
          </div>
        </Card>
      </div>
    </div>
  );
}
