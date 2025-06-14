import AuthProvider from "@/06-providers/auth/auth-provider";
import { ThemeProvider } from "@/06-providers/theme/theme-provider";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center">
          <Outlet />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};
export default AuthLayout;