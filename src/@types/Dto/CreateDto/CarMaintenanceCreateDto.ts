export interface CarMaintenanceCreateDto {
  id?: number;
  carId?: number;
  title?: string;
  description?: string;
  serviceDate: string;
  tentativelyCost?: number;
  isUsed: boolean;
  isDeleted: boolean;
}
