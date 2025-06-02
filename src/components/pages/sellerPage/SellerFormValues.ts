/* eslint-disable @typescript-eslint/no-empty-object-type */ 

interface BaseSellerFormValues {
  userId: string;
  identityNumber: string;
  address: string;
}

export interface SellerCreateFormValues extends BaseSellerFormValues {}

export interface SellerUpdateFormValues extends BaseSellerFormValues {
  isVerified: boolean;
}