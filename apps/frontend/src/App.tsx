import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import AppSidebar from './components/layout/AppSidebar';
import AppHeader from './components/layout/AppHeader';
import LandingPage from './pages/LandingPage';
import CategoryClient from './components/categories/CategoryClient';
import ExpenseClient from './components/expenses/ExpenseClient';
import GroupClient from './components/groups/GroupClient';
import DashboardClient from './pages/DashboardClient';
import { Toaster } from 'react-hot-toast';
import { setTokenGetter } from './lib/api';

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  // Wire Clerk's getToken into the Axios interceptor as soon as auth loads
  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <LandingPage />
        <Toaster position="bottom-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white border border-border/50 shadow-lg' }} />
      </>
    );
  }

  return (
    <AuthenticatedLayout>
      <Routes>
        <Route path="/" element={<DashboardClient />} />
        <Route path="/categories" element={<CategoryClient />} />
        <Route path="/expenses" element={<ExpenseClient />} />
        <Route path="/groups" element={<GroupClient />} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white border border-border/50 shadow-lg' }} />
    </AuthenticatedLayout>
  );
}

export default App;
