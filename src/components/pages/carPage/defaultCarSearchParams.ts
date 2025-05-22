// constants/defaultSearchParams.ts
import { CarSearchParams } from "@/@types/RequestHelpers/CarSearchParams";

export const defaultCarSearchParams: CarSearchParams = {
  searchTerm: "",
  minPrice: undefined,
  maxPrice: undefined,
  minYear: undefined,
  maxYear: undefined,
  minMileage: undefined,
  maxMileage: undefined,
  color: "",
  engineType: undefined,
  gearType: undefined,
  carType: undefined,
  isUsed: undefined,
  isApproved: undefined,
  status: undefined,
  sellerId: undefined,
  brandId: undefined,
  carRegistrationNumber: "",
  carIdentificationNumber: "",
  engineNumber: "",
  sortBy: "id",
  pageNumber: 1,
  pageSize: 10,
};
