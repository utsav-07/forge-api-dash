import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, RootState } from "@/store/store";
import { initializeAuth } from "@/store/authSlice";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import APIServices from "./pages/APIServices";
import APIKeys from "./pages/APIKeys";
import Documentation from "./pages/Documentation";
import Settings from "./pages/Settings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// Wrapper component to initialize auth state
const AppWrapper = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return <App />;
};

const App = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // User is authenticated if both user and token exist
  const isAuthenticated = !!user && !!token;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="services" element={<APIServices />} />
                  <Route path="keys" element={<APIKeys />} />
                  <Route path="docs" element={<Documentation />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Main App component with Redux Provider
const MainApp = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};

export default MainApp;
