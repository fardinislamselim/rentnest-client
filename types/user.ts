export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

/** Mirrors the backend `UserStatus` enum (prisma/schema/enum.prisma). */
export type UserStatus = "ACTIVE" | "BANNED";



export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
