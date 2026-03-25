import { Booking } from "./Booking";

export interface Payment {
  id: number;
  bookingId: number;
  booking?: Booking;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
  slipCarImages?: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionRef?: string;
}
