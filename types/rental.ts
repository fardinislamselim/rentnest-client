export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";

export interface RentalProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

export interface RentalLandlord {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface RentalPayment {
  id: string;
  amount: number;
  provider: string;
  transactionId: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt: string | null;
}

export interface RentalRequest {
  id: string;
  status: RentalStatus;
  startDate: string;
  endDate: string | null;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  property: RentalProperty;
  landlord?: RentalLandlord;
  payment?: RentalPayment | null;
}