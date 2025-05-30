export interface SellerSearchParams {
  userSearchTerm?: string;
  identityNumber?: string;
  address?: string;
  isVerified: boolean;

  sortBy?: string;
  pageNumber: number;
  pageSize: number;
}
