import { Brand } from "./Brand";
import { CarType, EngineType, GearType, Status } from "../Enum";
import { Seller } from "./Seller";

export interface Car {
  id: number;

  sellerId: number;
  seller: Seller;
  brandId: number;
  brand: Brand;

  carRegistrationNumber?: string;
  carIdentificationNumber?: string;
  engineNumber?: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;

  engineType: EngineType;
  gearType: GearType;
  carType: CarType;

  description: string;
  imageUrl?: string;
  createdAt: string; 
  updatedAt: string;
  status: Status;
  isUsed: boolean;
  isApproved: boolean;
  isDeleted: boolean;
}