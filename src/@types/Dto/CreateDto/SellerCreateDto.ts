export interface SellerCreateDto {
  id?: number;
  userId: string;
  identityNumber: string;
  address: string;
  isVerified: boolean;
}
