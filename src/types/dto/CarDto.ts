import { BrandDto } from "./BrandDto";
import { CarType, EngineType, GearType, Status } from "./Enum";
import { SellerDto } from "./SellerDto";

export interface CarDto {
  id: number;

  sellerId: number;
  seller: SellerDto;
  brandId: number;
  brand: BrandDto;

  carRegistrationNumber?: string;
  carIdentificationNumber?: string;
  engineNumber?: string;
  model?: string;
  year?: number;
  price: number;
  mileage: number;
  color?: string;

  engineType: EngineType;
  gearType: GearType;
  carType: CarType;

  description?: string;
  imageUrl?: string;
  createdAt: string; 
  updatedAt?: string;
  status: Status;
  isUsed: boolean;
  isApproved: boolean;
  isDeleted: boolean;
}