// constants/defaultSearchParams.ts
import { BrandSearchParams } from "@/@types/RequestHelpers/BrandSearchParams";

export const defaultBrandSearchParams: BrandSearchParams = {
  searchTerm: "",
  isUsed: undefined,
  sortBy: "id",

  pageNumber: 1,
  pageSize: 5,
};
