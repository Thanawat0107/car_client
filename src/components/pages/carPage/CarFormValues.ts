export interface CarCreateFormValues {
  brandId: number;
  sellerId: number;

  carRegistrationNumber: string;
  carIdentificationNumber?: string;
  engineNumber?: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;

  engineType: number;
  gearType: number;
  carType: number;
  status: number;
  
  description?: string;
  imageFile: File | null;
}

export interface CarUpdateFormValues extends CarCreateFormValues {
  isUsed: boolean;
  isDelete: boolean;
}