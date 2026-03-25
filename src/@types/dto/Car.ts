import { Brand } from "./Brand";
import { Seller } from "./Seller";

export interface Car {
  id: number;

  sellerId?: number;
  seller?: Seller;
  brandId?: number;
  brand?: Brand;

  carRegistrationNumber?: string;
  carIdentificationNumber?: string;
  engineNumber?: string;
  model: string;
  year: number;
  price: number;
  bookingPrice: number;
  mileage: number;
  color: string;

  engineType: string;
  gearType: string;
  carType: string;

  description: string;

  // merged from CarHistory
  isCollisionHistory: boolean;
  insurance?: string;
  act?: string;

  // merged from Approval
  approvalRemark?: string;
  approvedAt?: string;

  carImages: string[];
  createdAt: string;
  updatedAt: string;
  carStatus: string;
  isUsed: boolean;
  isApproved: boolean;
  isDeleted: boolean;
}