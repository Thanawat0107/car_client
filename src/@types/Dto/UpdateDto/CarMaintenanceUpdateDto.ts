export interface CarMaintenanceUpdateDto {
  title?: string;
  carId?: number;
  description?: string;
  serviceDate: string;
  tentativelyCost?: number;
}
