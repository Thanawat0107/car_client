import { CarType, EngineType, GearType, Status } from "../dto/Enum";

export interface CarSearchParams {
  searchTerm?: string;

  minPrice?: number | undefined;
  maxPrice?: number | undefined;

  minYear?: number | undefined;
  maxYear?: number | undefined;

  minMileage?: number | undefined;
  maxMileage?: number | undefined;

  color?: string;

  engineType?: EngineType | undefined;
  gearType?: GearType | undefined;
  carType?: CarType | undefined;

  isUsed?: boolean;
  isApproved?: boolean;
  status?: Status | undefined;

  sellerId?: number | undefined;
  brandId?: number | undefined;

  carRegistrationNumber?: string;
  carIdentificationNumber?: string;
  engineNumber?: string;

  sortBy?: string;
  
  pageNumber: number;
  pageSize: number;
}