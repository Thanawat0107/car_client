import { User } from "./User";

export interface Seller {
  id: number;
  userId: string;
  user: User
  identityNumber: string;
  address: string;
  isVerified: boolean;
}