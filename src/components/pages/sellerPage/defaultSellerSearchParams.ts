// constants/defaultSearchParams.ts
import { SellerSearchParams } from "@/@types/RequestHelpers/SellerSearchParams";

export const defaultSellerSearchParams: SellerSearchParams = {
  userSearchTerm: "",
  identityNumber: "",
  address: "",
  isVerified: true,

  sortBy: "id",
  pageNumber: 1,
  pageSize: 5,
};
