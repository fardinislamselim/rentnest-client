import type { RentalStatus } from "./rental";
import type { UserRole, UserStatus } from "./user";

export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";


export interface AdminDashboardStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  totalRentals: number;
  completedRentals: number;
  totalRevenue: number;
}

/** Per-status rental totals, derived from `/admin/rentals?status=…` meta. */
export type AdminRentalCounts = Record<RentalStatus, number>;

/** Shape of one row from `GET /admin/users` (password omitted server-side). */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Shape of one row from `GET /admin/properties` (landlord and category omitted server-side). */
export interface AdminProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  status: PropertyStatus;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

// Shape of one row from `GET /admin/rentals` (tenant and property omitted server-side). */
export interface AdminRental {
  id: string;
  status: RentalStatus;
  startDate: string;
  endDate: string | null;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    location: string;
  };
  tenant: {
    id: string;
    name: string;
    email: string;
  };
}

// Query parameters for `/admin/properties` and `/admin/rentals`.
export interface AdminPropertyQuery {
  page?: number;
  limit?: number;
  status?: PropertyStatus;
  location?: string;
  categoryId?: string;
  search?: string;
  sortBy?: "price" | "createdAt" | "title" | "location";
  sortOrder?: "asc" | "desc";
}

// Query parameters for `/admin/rentals`.
export interface AdminRentalQuery {
  page?: number;
  limit?: number;
  status?: RentalStatus;
  search?: string;
  sortBy?: "createdAt" | "startDate" | "endDate" | "status";
  sortOrder?: "asc" | "desc";
}
