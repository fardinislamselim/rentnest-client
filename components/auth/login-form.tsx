"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { loginAction } from "@/app/(auth)/_action/authAction";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      router.push(state.redirectTo ?? "/dashboard");
    } else {
      toast.error(state.message);
    }
  }, [router, state]);

  return (
    <Card className="w-full border-border/60 shadow-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>

        <CardDescription>Login to your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-5">
          {/* Email */}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </div>

          {/* Password */}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-500" />
                Password
              </Label>

              <button
                type="button"
                onClick={() => toast.info("Password reset is disabled.")}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="flex w-full items-center gap-2 bg-blue-600 py-5 hover:bg-blue-700"
          >
            <LogIn className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />

            {pending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {`Don't have an account?`}{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
