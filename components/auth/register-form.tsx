"use client";

import {
  Eye,
  EyeOff,
  Home,
  Key,
  KeyRound,
  Lock,
  Mail,
  Phone,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { registerAction } from "@/app/(auth)/_action/authAction";
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

type DemoRole = "TENANT" | "LANDLORD";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("TENANT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, action, pending] = useActionState(registerAction, {
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
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Join RentNest to find or list rental properties easily.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="role" value={role} />

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-blue-500" />
              I Want To
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("TENANT")}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  role === "TENANT"
                    ? "border-blue-500 bg-blue-500/10 font-bold text-blue-600 ring-2 ring-blue-500/20 dark:text-blue-400"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <div
                  className={`rounded-lg p-2 ${
                    role === "TENANT"
                      ? "bg-blue-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Home className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    Rent a Home
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    As Tenant
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("LANDLORD")}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  role === "LANDLORD"
                    ? "border-blue-500 bg-blue-500/10 font-bold text-blue-600 ring-2 ring-blue-500/20 dark:text-blue-400"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <div
                  className={`rounded-lg p-2 ${
                    role === "LANDLORD"
                      ? "bg-blue-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Key className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    List Properties
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    As Landlord
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="register-name"
              className="flex items-center gap-1.5"
            >
              <User className="h-3.5 w-3.5 text-blue-500" />
              Full Name
            </Label>
            <Input
              id="register-name"
              name="name"
              required
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="register-email"
              className="flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-blue-500" />
              Email Address
            </Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="register-phone"
              className="flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5 text-blue-500" />
              Phone Number (Optional)
            </Label>
            <Input
              id="register-phone"
              name="phone"
              type="tel"
              placeholder="+8801712345678"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="register-password"
              className="flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-blue-500" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="register-password"
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="register-confirm-password"
              className="flex items-center gap-1.5"
            >
              <KeyRound className="h-3.5 w-3.5 text-blue-500" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="register-confirm-password"
                name="confirmPassword"
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="mt-2 flex w-full items-center justify-center gap-2 cursor-pointer rounded-xl bg-blue-600 py-5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            <UserPlus className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
            {pending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="border-t border-border/40 pt-1 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
