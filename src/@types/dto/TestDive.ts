import { StatusTestDrive } from "../Enum";
import { Car } from "./Car";
import { User } from "./User";

export interface TestDive {
  id: number;
  userId: string;
  user: User;
  carId: string;
  car: Car;
  appointmentDate: string;
  statusTestDrive: StatusTestDrive;
}