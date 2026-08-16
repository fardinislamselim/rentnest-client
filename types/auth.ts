export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: "TENANT" | "LANDLORD";
}

export type AuthActionState = {
  success: boolean;
  message: string;
  redirectTo?: string;
};
