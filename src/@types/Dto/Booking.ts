import { Car } from "./Car";
import { User } from "./User";

export interface Booking {
  id: number;
  carId: number;
  car?: Car;
  userId: string;
  user?: User;
  reservedAt: string;
  expiryAt: string;
  expiredAt?: string;
  canceledAt?: string;
  updatedAt: string;
  bookingStatus: string;
}
