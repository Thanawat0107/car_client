export interface PaymentCreateDto {
  bookingId: number;
  totalPrice: number;
  paymentMethod: string;
  transactionRef?: string;
  slipImage?: File;
}
