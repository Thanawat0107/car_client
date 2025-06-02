/* eslint-disable @typescript-eslint/no-empty-object-type */

interface BaseCarFormValues {
  brandId: string;
  sellerId: number;

  carRegistrationNumber: string;
  carIdentificationNumber?: string;
  engineNumber?: string;
  model: string;
  year: number;
  price: number;
  reservationPrice: number;
  mileage: number;
  color: string;

  engineType: number;
  gearType: number;
  carType: number;
  status: number;

  description?: string;
  imageFile: File | null;
}

export interface CarCreateFormValues extends BaseCarFormValues {}

export interface CarUpdateFormValues extends BaseCarFormValues {
  isUsed: boolean;
  isDeleted: boolean;
}