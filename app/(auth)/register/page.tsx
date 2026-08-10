import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account | RentNest",
  description: "Register a new tenant or landlord account on RentNest.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
