"use client";

import {
  Eye,
  EyeOff,
  Home,
  Key,
  KeyRound,
  Lock,
  Mail,
  User,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
  const [role, setRole] = useState<DemoRole>("TENANT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info("Dummy registration form only. Auth has been removed.");
  };

  return (
    <Card className="w-full border-border/60 shadow-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          This is a demo registration form. No account will be created.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  className={`rounded-lg p-2 ${role === "TENANT" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
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
                  className={`rounded-lg p-2 ${role === "LANDLORD" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}
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
              placeholder="John Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="pr-11"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className="pr-11"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
            className="mt-2 w-full cursor-pointer rounded-xl bg-blue-600 py-5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            Create Account
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
