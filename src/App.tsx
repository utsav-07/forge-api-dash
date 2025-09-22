import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import APIServices from "./pages/APIServices";
import APIKeys from "./pages/APIKeys";
import Documentation from "./pages/Documentation";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const handleLogin = (email: string) => {
    // Extract name from email or use email as name
    const name = email.includes('@') ? email.split('@')[0] : email;
    setUser({ email, name: name.charAt(0).toUpperCase() + name.slice(1) });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!user ? (
              <>
                <Route path="/auth" element={<AuthPage onAuthenticated={handleLogin} />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            ) : (
              <>
                <Route 
                  path="/dashboard" 
                  element={<DashboardLayout userName={user.name} onLogout={handleLogout} />}
                >
                  <Route index element={<Dashboard userName={user.name} />} />
                  <Route path="services" element={<APIServices />} />
                  <Route path="keys" element={<APIKeys />} />
                  <Route path="docs" element={<Documentation />} />
                  <Route 
                    path="settings" 
                    element={<Settings userName={user.name} userEmail={user.email} />} 
                  />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
