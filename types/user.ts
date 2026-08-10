export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";



// id: '75bed809-c85a-47c0-a4fb-b0d00829cdfd',
//     name: 'Fardin selim',
//     email: 'fardinislam.pr@gmail.com',
//     phone: null,
//     avatar: null,
//     bio: null,
//     role: 'LANDLORD',
//     status: 'ACTIVE',
//     createdAt: '2026-07-30T18:57:03.844Z',
//     updatedAt: '2026-07-30T18:57:03.844Z'
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}
