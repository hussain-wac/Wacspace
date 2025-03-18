import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { globalState } from "../jotai/globalState";
import useAuth from "../hooks/useAuth";
import { Loader2,Moon,Sun } from "lucide-react";
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "../components/theme-provider"

const Login = () => {
  const { loading, handleGoogleLoginSuccess } = useAuth();
  const user = useAtomValue(globalState);
  const { setTheme } = useTheme()
  if (user) {
    return <Navigate to="/home" />;
  }

  return (
<div >
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        <div className="min-h-screen flex items-center justify-center p-4">
      <div className=" rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold ">WACSpace</h1>
          <p className="text-sm  mt-1">Internal Scheduling Tool</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => console.log("Login Failed")}
                size="medium"
                shape="rectangular"
                theme="outline"
                text="signin_with"
              />
            </div>
            <p className="text-center text-xs text-gray-400">
              Secure login via Google
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} WACSpace
        </div>
      </div>
    </div>
</div>
  );
};

export default Login;