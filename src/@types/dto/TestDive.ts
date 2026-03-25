import { StatusTestDrive } from "../Status";
import { Car } from "./Car";
import { User } from "./User";

export interface TestDrive {
  id: number;
  userId: string;
  user?: User;
  carId: number;
  car?: Car;
  appointmentDate: string;
  createdAt: string;
  statusTestDrive: string;
}