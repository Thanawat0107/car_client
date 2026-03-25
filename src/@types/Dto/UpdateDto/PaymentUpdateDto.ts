export interface PaymentUpdateDto {
  totalPrice: number;
  paidAt?: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionRef?: string;
  slipImage?: File;
}
