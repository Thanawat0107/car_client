import { User } from "./User";

export interface Review {
  id: number;
  userId?: string;
  user?: User;
  sellerId?: number;
  rating: number;
  comment: string;
  createdAt: string;
}
