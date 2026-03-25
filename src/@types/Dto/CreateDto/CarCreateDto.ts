export interface CarCreateDto {
  sellerId?: number;
  brandId?: number;

  carRegistrationNumber?: string;
  carIdentificationNumber?: string;
  engineNumber?: string;
  model?: string;
  year?: number;
  price?: number;
  bookingPrice?: number;
  mileage?: number;
  color?: string;

  engineType: string;
  gearType: string;
  carType: string;

  description?: string;

  isCollisionHistory: boolean;
  insurance?: string;
  act?: string;

  newImages?: File[];
  createdAt?: string;
  carStatus: string;
}
