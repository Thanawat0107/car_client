import { Car } from "./Car";

export interface CarMaintenance {
  id: number;
  carId: number;
  car?: Car;
  title: string;
  description: string;
  serviceDate: string;
  tentativelyCost: number;
  isUsed: boolean;
  isDeleted: boolean;
}
