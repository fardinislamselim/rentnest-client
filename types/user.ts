export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

export interface User {
  id: string;

  name: string;

  email: string;

  role: UserRole;

  avatar?: string;
}
