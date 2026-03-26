export interface ReviewCreateDto {
  userId?: string;
  sellerId?: number;
  rating: number;
  comment?: string;
}
