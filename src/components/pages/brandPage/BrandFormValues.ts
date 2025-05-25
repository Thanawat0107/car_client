export interface BrandCreateFormValues {
  name: string;
  imageFile: File | null;
  isUsed: boolean; 
}

export interface BrandUpdateFormValues {
  name: string;
  imageFile: File | null;
  isUsed: boolean; 
  isDelete: boolean;
}