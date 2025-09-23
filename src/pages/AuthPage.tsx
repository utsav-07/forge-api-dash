import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <div className="text-2xl font-bold text-primary-foreground">F</div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Forge API Platform</h2>
          <p className="text-muted-foreground">
            Professional API services for modern developers
          </p>
        </div>

        {/* Auth forms */}
        <div className="animate-fade-in">
          {isLoginMode ? (
            <LoginForm
              onToggleMode={() => setIsLoginMode(false)}
            />
          ) : (
            <RegisterForm
              onToggleMode={() => setIsLoginMode(true)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Forge API Platform. Built for developers.</p>
        </div>
      </div>
    </div>
  );
}