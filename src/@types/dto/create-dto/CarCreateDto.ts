import { CarType, EngineType, GearType, Status } from "../../Enum";

export interface CarCreateDto {
  id: number;

  sellerId: number;
  brandId: number;

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