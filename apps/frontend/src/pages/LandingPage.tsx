import { SignInButton } from "@clerk/clerk-react";
import { Wallet, PieChart, FolderGit2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Information */}
      <div className="hidden lg:flex flex-1 flex-col justify-center bg-[#f0fdf4] relative overflow-hidden px-16 xl:px-24">
        {/* Soft decorative blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">CashWise</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Track. Understand.<br />
            <span className="text-primary">Save Smarter.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-md">
            Track your expenses, organize by categories and groups, and build better financial habits every day.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <PieChart className="w-7 h-7 text-primary" strokeWidth={2.5} />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Track Expenses</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Add and track expenses in seconds with clear insights.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <FolderGit2 className="w-7 h-7 text-[#3b82f6]" strokeWidth={2.5} />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Organize Easily</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Create your own groups and categories that make sense to you.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <ShieldCheck className="w-7 h-7 text-[#8b5cf6]" strokeWidth={2.5} />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Secure & Private</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Your data is encrypted and always protected.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative subtle dots pattern on bottom left */}
        <div className="absolute bottom-12 left-12 grid grid-cols-4 gap-3 opacity-20 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary" />
          ))}
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-[400px] flex flex-col items-center text-center">
          
          {/* Custom Wallet Illustration */}
          <div className="relative mb-8 mt-[-40px]">
            {/* Sparkles */}
            <Sparkles className="absolute -top-4 -left-4 w-5 h-5 text-yellow-400" />
            <Sparkles className="absolute top-0 -right-6 w-4 h-4 text-yellow-400 opacity-70" />
            
            {/* Wallet Graphic */}
            <div className="w-28 h-28 bg-[#f0fdf4] rounded-full flex items-center justify-center shadow-inner relative z-10">
              <div className="w-16 h-12 bg-primary rounded-xl rotate-[-10deg] shadow-lg relative border-b-4 border-emerald-700">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-emerald-50 rounded-l-md border-y border-l border-emerald-200" />
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute bottom-2 -left-2 w-3 h-3 rounded-full bg-emerald-200" />
            <div className="absolute -bottom-4 right-4 w-4 h-4 rounded-full bg-blue-100" />
          </div>
          
          <h2 className="text-[28px] font-bold text-slate-900 mb-2 tracking-tight">Welcome to CashWise</h2>
          <p className="text-slate-500 mb-8 font-medium">Sign in to continue to your account</p>

          <SignInButton mode="modal">
            <Button className="w-full h-14 text-[15px] font-semibold rounded-2xl shadow-sm gap-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all hover:shadow-md" variant="outline">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.07H2.13V16.92C3.95 20.53 7.67 23 12 23Z" fill="#34A853"/>
                <path d="M5.82 14.07C5.6 13.41 5.47 12.72 5.47 12C5.47 11.28 5.6 10.59 5.82 9.93V7.08H2.13C1.38 8.57 0.95 10.23 0.95 12C0.95 13.77 1.38 15.43 2.13 16.92L5.82 14.07Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.67 1 3.95 3.47 2.13 7.08L5.82 9.93C6.7 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          </SignInButton>

          <div className="flex items-center justify-center gap-2 mt-12 text-sm text-slate-400 font-medium w-full relative">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-100 -z-10" />
            <span className="bg-white px-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Secure, private and encrypted
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 text-[13px] text-slate-400 font-medium">
          © {new Date().getFullYear()} CashWise. All rights reserved.
        </div>
      </div>
    </div>
  );
}
